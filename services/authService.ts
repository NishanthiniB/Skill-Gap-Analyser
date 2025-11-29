import { User } from '../types';

const USERS_KEY = 'career_compass_users';
const SESSION_KEY = 'career_compass_session';

interface StoredUser extends User {
  passwordHash: string; // In a real app, never store plain text. Here we simulate hash.
}

export const authService = {
  login: (email: string, password: string): User => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as StoredUser[];
    // Simple simulation of credential check
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === btoa(password));
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const sessionUser: User = { id: user.id, name: user.name, email: user.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  register: (name: string, email: string, password: string): User => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as StoredUser[];
    
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('User already exists with this email');
    }

    const newUser: StoredUser = {
      id: Date.now().toString(),
      name,
      email,
      passwordHash: btoa(password) // Simple base64 encoding for mock purposes
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const sessionUser: User = { id: newUser.id, name: newUser.name, email: newUser.email };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }
};