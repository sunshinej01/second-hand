import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Supabase 클라이언트 생성 (Auth 설정 포함)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// 데이터베이스 연결 테스트 함수
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('_supabase_meta').select('*').limit(1)
    if (error) {
      console.error('Supabase 연결 오류:', error)
      return false
    }
    console.log('Supabase 연결 성공!')
    return true
  } catch (error) {
    console.error('연결 테스트 중 오류:', error)
    return false
  }
} 