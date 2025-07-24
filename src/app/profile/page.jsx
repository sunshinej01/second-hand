'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/auth-context';
import { productAPI } from '../../lib/api';
import ProfileAuthForm from './ProfileAuthForm';

export default function ProfilePage() {
  const router = useRouter();
  const { user, userProfile, loading, signIn, signUp, signOut } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: '',
    fullName: ''
  });
  const [userStats, setUserStats] = useState({
    myProducts: [],
    likedProducts: [],
    myComments: [],
    totalSales: 0
  });
  const [authError, setAuthError] = useState('');

  // 더미 데이터 useMemo로 캐싱
  const dummyMyProducts = useMemo(() => [
    {
      id: 1,
      title: '아이폰 14 Pro 128GB',
      price: 850000,
      status: 'available',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      view_count: 23,
      chat_count: 5
    },
    {
      id: 2,
      title: '에어팟 프로 2세대',
      price: 180000,
      status: 'sold',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      view_count: 45,
      chat_count: 12
    }
  ], []);
  const dummyLikedProducts = useMemo(() => [
    {
      id: 3,
      title: '맥북 프로 M2 13인치',
      price: 1450000,
      status: 'available',
      seller: '노트북매니아'
    },
    {
      id: 4,
      title: '닌텐도 스위치 OLED',
      price: 280000,
      status: 'reserved',
      seller: '게임러'
    }
  ], []);
  const dummyMyComments = useMemo(() => [
    {
      id: 1,
      content: '저랑 같이 연남동 맛집 찾아다녀요!',
      post_title: '2030 동네친구 구해요',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      content: '스타벅스 홍대점이 넓어서 좋아요!',
      post_title: '홍대 근처 좋은 카페 추천해주세요',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }
  ], []);
  const dummyTotalSales = useMemo(() => dummyMyProducts.filter(p => p.status === 'sold').reduce((sum, p) => sum + p.price, 0), [dummyMyProducts]);

  // user가 바뀔 때만 userStats 로드
  useEffect(() => {
    if (user) {
      setUserStats({
        myProducts: dummyMyProducts,
        likedProducts: dummyLikedProducts,
        myComments: dummyMyComments,
        totalSales: dummyTotalSales
      });
    } else {
      setUserStats({ myProducts: [], likedProducts: [], myComments: [], totalSales: 0 });
    }
  }, [user, dummyMyProducts, dummyLikedProducts, dummyMyComments, dummyTotalSales]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authMode === 'login') {
        const { data, error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        alert('로그인 성공!');
        setFormData({ email: '', password: '', nickname: '', fullName: '' });
      } else {
        const { data, error } = await signUp(formData.email, formData.password, {
          nickname: formData.nickname,
          full_name: formData.fullName
        });
        if (error) throw error;
        alert('회원가입 성공! 이메일을 확인해주세요.');
        setAuthMode('login');
        setFormData({ email: formData.email, password: '', nickname: '', fullName: '' });
      }
    } catch (error) {
      setAuthError(error.message || '인증 중 오류가 발생했습니다.');
    }
  };

  const handleLogout = useCallback(async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      setUserStats({ myProducts: [], likedProducts: [], myComments: [], totalSales: 0 });
      setFormData({ email: '', password: '', nickname: '', fullName: '' });
      setAuthMode('login');
      setAuthError('');
      alert('로그아웃되었습니다.');
    } catch (error) {
      alert('로그아웃 중 오류가 발생했습니다.');
    }
  }, [signOut]);

  // 시간 포맷팅
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;
    
    return time.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
  };

  // 로그인/회원가입 모달 부분만 교체
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 safe-area-top">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">나의당근</h1>
            {user && (
              <button 
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                로그아웃
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
        {!user ? (
          <div className="bg-white shadow-sm">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
                {authMode === 'login' ? '로그인' : '회원가입'}
              </h2>
              <ProfileAuthForm
                authMode={authMode}
                formData={formData}
                setFormData={setFormData}
                loading={loading}
                handleAuth={handleAuth}
                authError={authError}
                setAuthMode={setAuthMode}
                setAuthError={setAuthError}
                setShowAuthModal={() => {}}
              />
            </div>
          </div>
        ) : (
          // 로그인 후 대시보드
          <div className="space-y-4">
            {/* 프로필 섹션 */}
            <div className="bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-orange-500">
                    {userProfile?.nickname
                      ? userProfile.nickname.charAt(0)
                      : userProfile && !userProfile.nickname
                        ? '닉'
                        : user?.email?.charAt(0) || '👤'}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {userProfile?.nickname
                      ? userProfile.nickname
                      : userProfile && !userProfile.nickname
                        ? '닉네임 미설정'
                        : user?.email || '사용자'}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-blue-500 font-medium">
                      {userProfile?.manner_temperature || 36.5}°C
                    </span>
                    <span className="text-sm text-gray-500">매너온도</span>
                  </div>
                </div>
              </div>
              
              {/* 활동 통계 */}
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{userStats.myProducts.length}</div>
                  <div className="text-xs text-gray-500">판매상품</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{userStats.likedProducts.length}</div>
                  <div className="text-xs text-gray-500">관심상품</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{userStats.myComments.length}</div>
                  <div className="text-xs text-gray-500">댓글</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-500">
                    {Math.floor(userStats.totalSales / 10000)}만
                  </div>
                  <div className="text-xs text-gray-500">판매금액</div>
                </div>
              </div>
            </div>

            {/* 나의 판매 상품 */}
            <div className="bg-white shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">나의 판매 상품</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {userStats.myProducts.map(product => (
                  <div key={product.id} className="p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">{product.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{product.price.toLocaleString()}원</span>
                        <span>•</span>
                        <span className={product.status === 'sold' ? 'text-gray-500' : 'text-green-500'}>
                          {product.status === 'sold' ? '거래완료' : '판매중'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                        <span>조회 {product.view_count}</span>
                        <span>채팅 {product.chat_count}</span>
                        <span>{getRelativeTime(product.created_at)}</span>
                      </div>
                    </div>
                    <button className="text-orange-500 text-sm hover:text-orange-600">
                      관리
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 관심 상품 */}
            <div className="bg-white shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">관심 상품</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {userStats.likedProducts.map(product => (
                  <div key={product.id} className="p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">{product.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{product.price.toLocaleString()}원</span>
                        <span>•</span>
                        <span>{product.seller}</span>
                        <span>•</span>
                        <span className={product.status === 'available' ? 'text-green-500' : 'text-yellow-500'}>
                          {product.status === 'available' ? '판매중' : '예약중'}
                        </span>
                      </div>
                    </div>
                    <button className="text-red-500 text-sm hover:text-red-600">
                      관심해제
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 나의 댓글 */}
            <div className="bg-white shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">나의 댓글</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {userStats.myComments.map(comment => (
                  <div key={comment.id} className="p-4">
                    <div className="text-sm text-gray-600 mb-1">{comment.post_title}</div>
                    <div className="text-gray-900">{comment.content}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {getRelativeTime(comment.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 하단 로그아웃 버튼 */}
            <div className="flex justify-center py-6">
              <button
                onClick={handleLogout}
                className="w-full max-w-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg shadow-sm transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 하단 네비게이션 바 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-2 sm:px-4 py-2">
          <div className="flex justify-around">
            <button 
              onClick={() => router.push('/products')}
              className="flex flex-col items-center py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6h-8V5z" />
              </svg>
              <span className="text-xs text-gray-400 mt-1">중고거래</span>
            </button>
            <button 
              onClick={() => router.push('/community')}
              className="flex flex-col items-center py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs text-gray-400 mt-1">동네생활</span>
            </button>
            <button 
              onClick={() => router.push('/chat')}
              className="flex flex-col items-center py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-xs text-gray-400 mt-1">채팅</span>
            </button>
            <button className="flex flex-col items-center py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-orange-500 font-medium mt-1">나의당근</span>
            </button>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 바 높이만큼 여백 추가 */}
      <div className="h-20 sm:h-24"></div>
    </div>
  );
} 