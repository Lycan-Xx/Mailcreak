import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

interface AuthContextType {
	user: User | null;
	loading: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
	signUp: (email: string, password: string, metadata?: Record<string, string>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check active sessions and sets the user
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (session?.user) {
				fetchUserProfile(session.user.id);
			}
			setLoading(false);
		});

		// Listen for changes on auth state
		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
			if (session?.user) {
				fetchUserProfile(session.user.id);
			} else {
				setUser(null);
			}
			setLoading(false);
		});

		return () => subscription.unsubscribe();
	}, []);

	const fetchUserProfile = async (userId: string) => {
		const { data, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', userId)
			.single();

		if (error) {
			console.error('Error fetching user profile:', error);
			return;
		}

		if (data) {
			setUser(data as User);
		}
	};

	const signIn = async (email: string, password: string) => {
		const { error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) throw error;
	};

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) throw error;
	};

	const signUp = async (email: string, password: string, metadata?: Record<string, string>) => {
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: metadata
			}
		});
		if (error) throw error;
	};

	return (
		<AuthContext.Provider value={{ user, loading, signIn, signOut, signUp }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}