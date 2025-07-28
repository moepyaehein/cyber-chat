
"use client";

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { type User, onAuthStateChanged, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, type AuthError, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import type { z } from 'zod';
import type { loginSchema, signupSchema } from '@/app/(auth)/schemas';


interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (values: z.infer<typeof signupSchema>) => Promise<{ success: boolean; error?: string }>;
  signIn: (values: z.infer<typeof loginSchema>) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string; }>;
  signOut: () => Promise<void>;
  setUser: Dispatch<SetStateAction<User | null>>; // Expose setUser if direct manipulation is needed elsewhere
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        // Only redirect if email is verified or if they used a provider that guarantees it (like Google)
        if (currentUser.emailVerified || currentUser.providerData.some(p => p.providerId !== 'password')) {
            router.push('/home');
        }
      }
    });
    return () => unsubscribe();
  }, [router]);

  const signUp = async (values: z.infer<typeof signupSchema>) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      await sendEmailVerification(userCredential.user);
      await firebaseSignOut(auth);
      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      console.error("Error during sign up:", authError);
      return { success: false, error: authError.message };
    }
  };

  const signIn = async (values: z.infer<typeof loginSchema>) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);

      if (!userCredential.user.emailVerified) {
        // Log them out and tell them to verify
        await firebaseSignOut(auth);
        return { success: false, error: "Please verify your email before signing in. Check your inbox for a verification link." };
      }

      // On success, the onAuthStateChanged listener will handle the redirect.
      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      // Handle cases like wrong password, user not found, etc.
      return { success: false, error: authError.message };
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // User will be set by onAuthStateChanged, and effect will redirect
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
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, signInWithGoogle, setUser }}>
      {!loading && children}
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
