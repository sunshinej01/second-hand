'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { checkEnvironment, logAuthState } from './debug';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 환경 변수 확인
    const envOk = checkEnvironment();
    if (!envOk) {
      setLoading(false);
      return;
    }

    // 현재 세션 확인
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('세션 확인 오류:', error);
        } else if (session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.id);
        }
        
        logAuthState(session?.user, null);
      } catch (error) {
        console.error('초기 세션 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Auth 상태 변화 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth 상태 변화:', event, session?.user?.email);
        
        if (session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // 사용자 프로필 로드
  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // 데이터 없음 오류가 아닌 경우만
        console.error('프로필 로드 오류:', error);
      } else if (data) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('프로필 로드 중 오류:', error);
    }
  };

  // 회원가입
  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname: userData.nickname || '',
            full_name: userData.full_name || ''
          }
        }
      });

      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('회원가입 오류:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // 로그인
  const signIn = async (email, password) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('로그인 오류:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃
  const signOut = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      setUserProfile(null);
      
      return { error: null };
    } catch (error) {
      console.error('로그아웃 오류:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // 프로필 업데이트
  const updateProfile = async (updates) => {
    try {
      if (!user) throw new Error('로그인이 필요합니다');
      
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setUserProfile(data);
      return { data, error: null };
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
      return { data: null, error };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    loadUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 