"use client";

import { createContext, useContext, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/auth/auth-config';
import { useAuth } from '@/lib/auth/hooks';

interface AuthContextProps {
  session: Session | null;
  initialSession: Session | null;
}

const AuthContext = createContext<AuthContextProps>({
  session: null,
  initialSession: null
});

export function AuthProvider({ 
  children,
  initialSession 
}: { 
  children: React.ReactNode;
  initialSession: Session | null;
}) {
  const { setUser, setProfile, setLoading, setInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function initializeAuth() {
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          
          // Fetch profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          setProfile(profile);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    }

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          setProfile(profile);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        router.push('/');
      }
      
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setProfile, setLoading, setInitialized, router]);

  return (
    <AuthContext.Provider value={{ session: initialSession, initialSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};