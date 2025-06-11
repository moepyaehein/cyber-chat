
"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { type User, onAuthStateChanged, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, type AuthError } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import type { z } from 'zod';
import type { loginSchema, signupSchema } from '@/app/(auth)/schemas'; // We'll create this


interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (values: z.infer<typeof signupSchema>) => Promise<{ success: boolean; error?: string }>;
  signIn: (values: z.infer<typeof loginSchema>) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  setUser: Dispatch<SetStateAction<User | null>>; // Expose setUser if direct manipulation is needed elsewhere
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (values: z.infer<typeof signupSchema>) => {
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      // User will be set by onAuthStateChanged
      router.push('/'); // Redirect after successful sign-up
      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      return { success: false, error: authError.message };
    }
  };

  const signIn = async (values: z.infer<typeof loginSchema>) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      // User will be set by onAuthStateChanged
      router.push('/'); // Redirect after successful sign-in
      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      return { success: false, error: authError.message };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      router.push('/signin'); // Redirect to sign-in after logout
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
