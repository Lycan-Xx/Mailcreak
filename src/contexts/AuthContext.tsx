import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/authService';
import type { User } from '../types/mongodb';

interface AuthContextType {
	user: User | null;
	signIn: (email: string, password: string) => Promise<void>;
	signUp: (userData: any) => Promise<void>;
	signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);

	const signIn = async (email: string, password: string) => {
		try {
			const { user, token } = await AuthService.login(email, password);
			localStorage.setItem('token', token);
			setUser(user);
		} catch (error) {
			console.error('Sign in error:', error);
			throw error;
		}
	};

	const signUp = async (userData: any) => {
		try {
			await AuthService.register(userData);
		} catch (error) {
			console.error('Sign up error:', error);
			throw error;
		}
	};

	const signOut = () => {
		localStorage.removeItem('token');
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};