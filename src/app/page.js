'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // middleware가 작동하지 않을 경우를 대비한 클라이언트 사이드 리다이렉트
    router.replace('/products');
  }, [router]);

  // 빈 화면 대신 최소한의 로딩 UI 표시
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
    </div>
  );
}
