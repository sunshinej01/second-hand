// 개발 환경에서 Auth 디버깅을 위한 유틸리티 함수들

export const checkEnvironment = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('🔍 Environment Check:');
  console.log('Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
  console.log('Supabase Anon Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing');
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ 환경변수가 설정되지 않았습니다!');
    console.log('프로젝트 루트에 .env.local 파일을 생성하고 다음을 추가하세요:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
    return false;
  }
  
  return true;
};

export const logAuthState = (user, userProfile) => {
  console.log('🔐 Auth State:');
  console.log('User:', user ? '✅ Logged in' : '❌ Not logged in');
  if (user) {
    console.log('User ID:', user.id);
    console.log('Email:', user.email);
    console.log('Profile:', userProfile ? '✅ Loaded' : '❌ Missing');
  }
}; 