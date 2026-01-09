import { Post, AuthData, User } from '../types';

const getAuthHeaders = () => {
    const authDataString = localStorage.getItem('auth');
    if (!authDataString) return {};
    try {
        const { token } = JSON.parse(authDataString);
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    } catch (e) {
        return {};
    }
};

const handleResponse = async (response: Response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
};

export const signup = async (credentials: Omit<User, 'id'> & { password?: string }): Promise<AuthData> => {
    const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    return handleResponse(response);
};

export const login = async (credentials: Omit<User, 'id'> & { password?: string }): Promise<AuthData> => {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    return handleResponse(response);
};

export const getPosts = async (): Promise<Post[]> => {
    const response = await fetch('/api/posts', {
        headers: getAuthHeaders(),
    });
    return handleResponse(response);
};

export const createPost = async (newPostData: Omit<Post, 'id' | 'createdAt' | 'hearts' | 'flowers' | 'replies' | 'author'>): Promise<Post> => {
    const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(newPostData),
    });
    return handleResponse(response);
};


export const addReaction = async (postId: string, reaction: 'hearts' | 'flowers'): Promise<Post> => {
    const response = await fetch(`/api/posts/${postId}/react`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify({ reaction }),
    });
    return handleResponse(response);
};

export const addReply = async (postId: string, content: string): Promise<Post> => {
    const response = await fetch(`/api/posts/${postId}/reply`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify({ content }),
    });
    return handleResponse(response);
}
