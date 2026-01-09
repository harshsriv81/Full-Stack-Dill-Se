import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GoogleGenAI, Type } from "@google/genai";
import morgan from "morgan";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(morgan("dev"))
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

// --- Mongoose Schemas ---
const transformJSON = (doc, ret) => {
  ret.id = ret._id.toString();
  delete ret._id;
  delete ret.__v;
  if (ret.password) delete ret.password; // Never send password hash
};

const UserSchema = new mongoose.Schema({
  nickname: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
});
UserSchema.set('toJSON', { transform: transformJSON });
const User = mongoose.model('User', UserSchema);

const ReplySchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});
ReplySchema.set('toJSON', { transform: (doc, ret) => { ret.id = ret._id.toString(); delete ret._id; } });


const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tag: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hearts: { type: Number, default: 0 },
  flowers: { type: Number, default: 0 },
  replies: [ReplySchema],
  createdAt: { type: Date, default: Date.now }
});
PostSchema.set('toJSON', { transform: transformJSON });
const Post = mongoose.model('Post', PostSchema);

// --- Auth Middleware ---
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token required' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// --- Auth Routes ---
app.post('/api/auth/signup', async (req, res) => {
  const { nickname, password } = req.body;
  if (!nickname || !password) {
    return res.status(400).json({ message: 'Nickname and password are required' });
  }
  try {
    const existingUser = await User.findOne({ nickname });
    if (existingUser) {
      return res.status(409).json({ message: 'Nickname already taken' });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ nickname, password: hashedPassword });
    await newUser.save();
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: newUser.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Server error during signup' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { nickname, password } = req.body;
  if (!nickname || !password) {
    return res.status(400).json({ message: 'Nickname and password are required' });
  }
  try {
    const user = await User.findOne({ nickname });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

// --- Post Routes ---
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'nickname')
      .populate('replies.author', 'nickname');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

app.post('/api/posts', authMiddleware, async (req, res) => {
  const { title, content, tag } = req.body;
  if (!title || !content || !tag) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const newPost = new Post({ title, content, tag, author: req.user.id });
  try {
    await newPost.save();
    const populatedPost = await Post.findById(newPost._id).populate('author', 'nickname');
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post' });
  }
});

// --- Reaction & Reply Routes ---
app.post('/api/posts/:id/react', authMiddleware, async (req, res) => {
    const { reaction } = req.body;
    if (!['hearts', 'flowers'].includes(reaction)) {
        return res.status(400).json({ message: 'Invalid reaction type' });
    }
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        post[reaction] += 1;
        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error updating reaction' });
    }
});

app.post('/api/posts/:id/reply', authMiddleware, async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ message: 'Reply content is required' });
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newReply = { content, author: req.user.id };
    post.replies.push(newReply);
    await post.save();
    
    const updatedPost = await Post.findById(post._id)
        .populate('author', 'nickname')
        .populate('replies.author', 'nickname');
    
    res.status(201).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding reply' });
  }
});

// --- Gemini AI Route ---
const ai = process.env.API_KEY ? new GoogleGenAI({ apiKey: process.env.API_KEY }) : null;
const validTags = ['heartbreak', 'unsent-love', 'guilt', 'dreams', 'hope', 'last-message'];

app.post('/api/suggest-tag', authMiddleware, async (req, res) => {
    const { content } = req.body;
    if (!ai) {
        return res.status(500).json({ message: "Server is not configured with an AI API key." });
    }
    if (!content) {
        return res.status(400).json({ message: "Content is required to suggest a tag." });
    }
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze the following text and determine the dominant emotion. Choose the most fitting emotion tag from this list: ${validTags.join(', ')}. Text: "${content}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { tag: { type: Type.STRING, enum: validTags } },
                    required: ["tag"]
                },
            }
        });
        res.json(JSON.parse(response.text.trim()));
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ message: "Failed to get suggestion from AI" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
