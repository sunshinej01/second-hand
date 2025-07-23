'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [userProducts, setUserProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('중고거래');
  const [isLoading, setIsLoading] = useState(false);

  // 탭 옵션들 (메모이제이션)
  const initialTabs = useMemo(() => [
    { id: 'all', name: '전체', count: 0 },
    { id: 'secondhand', name: '중고거래', count: 0 },
    { id: 'community', name: '동네생활', count: 0 },
    { id: 'question', name: '질문', count: 0 }
  ], []);
  
  const [tabs, setTabs] = useState(initialTabs);

  // 동네생활 게시글 데이터 (메모이제이션으로 최적화)
  const communityPosts = useMemo(() => [
    {
      id: 1,
      title: '2030 동네친구 구해요',
      author: '마포보라돌이',
      mannerTemperature: 38.6,
      content: '이사온지 얼마 안돼서 동네 친구 만들고 싶어요.\n퇴근 후나 주말에 같이 맛집 탐방하실 분 구해요~',
      uploadTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3시간 전
      profileColor: '#16A34A',
      comments: [
        {
          id: 1,
          author: '당근마스터',
          content: '저랑 같이 연남동 맛집 찾아다녀요!',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1시간 전
          profileColor: '#DC2626'
        },
        {
          id: 2,
          author: '코코',
          content: '저랑도 친구해요!',
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30분 전
          profileColor: '#7C3AED'
        }
      ]
    },
    {
      id: 2,
      title: '홍대 근처 좋은 카페 추천해주세요',
      author: '카페러버',
      mannerTemperature: 42.3,
      content: '홍대입구역 근처에서 작업하기 좋은 카페 찾고 있어요.\n와이파이 잘 되고 조용한 곳 있나요?',
      uploadTime: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5시간 전
      profileColor: '#059669',
      comments: [
        {
          id: 1,
          author: '홍대토박이',
          content: '스타벅스 홍대점이 넓어서 좋아요!',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
          profileColor: '#EA580C'
        }
      ]
    },
    {
      id: 3,
      title: '강남구 러닝 메이트 모집',
      author: '러닝킹',
      mannerTemperature: 39.8,
      content: '매주 토요일 아침 7시 한강공원에서 러닝하실 분 모집해요.\n초보자도 환영합니다!',
      uploadTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1일 전
      profileColor: '#0891B2',
      comments: []
    }
  ], []);

  // 탭별 개수 업데이트 (메모이제이션)
  const updateTabCounts = useCallback((allProducts) => {
    const secondhandCount = allProducts.length;
    const communityCount = communityPosts.length;
    const questionCount = 0; // 추후 질문 데이터 추가 시 업데이트
    
    setTabs([
      { id: 'all', name: '전체', count: secondhandCount + communityCount + questionCount },
      { id: 'secondhand', name: '중고거래', count: secondhandCount },
      { id: 'community', name: '동네생활', count: communityCount },
      { id: 'question', name: '질문', count: questionCount }
    ]);
  }, [communityPosts.length]);

  // 탭 변경 처리 (메모이제이션)
  const handleTabChange = useCallback((tabName) => {
    setActiveTab(tabName);
    // 추후 탭별 데이터 필터링 로직 추가 가능
  }, []);

  // 업로드 시간 포맷팅 (메모이제이션)
  const getRelativeTime = useCallback((uploadTime) => {
    const now = new Date();
    const uploadDate = new Date(uploadTime);
    const diffInHours = Math.floor((now - uploadDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;
    
    return uploadDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
  }, []);

  // 매너온도 색상 계산 (메모이제이션)
  const getTemperatureColor = useCallback((temp) => {
    if (temp >= 40) return 'text-green-500';
    if (temp >= 36.5) return 'text-blue-500';
    return 'text-orange-500';
  }, []);

  // 동네생활 게시글 컴포넌트 (메모이제이션으로 최적화)
  const CommunityPost = useCallback(({ post }) => (
    <div className="bg-white border-b border-gray-100 p-4">
      {/* 게시글 헤더 */}
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
          style={{ backgroundColor: post.profileColor }}
        >
          <span className="text-white font-bold">👤</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">{post.author}</h3>
            <span className={`text-sm font-medium ${getTemperatureColor(post.mannerTemperature)}`}>
              {post.mannerTemperature}°C
            </span>
          </div>
          <p className="text-sm text-gray-500">{getRelativeTime(post.uploadTime)}</p>
        </div>
      </div>

      {/* 게시글 내용 */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{post.content}</p>
      </div>

      {/* 댓글 섹션 */}
      {post.comments.length > 0 && (
        <div className="border-t border-gray-100 pt-3">
          <h4 className="text-sm font-medium text-gray-600 mb-3">댓글 {post.comments.length}개</h4>
          <div className="space-y-3">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex gap-2">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                  style={{ backgroundColor: comment.profileColor }}
                >
                  <span className="text-white font-bold">👤</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">{comment.author}</span>
                    <span className="text-xs text-gray-500">
                      {getRelativeTime(comment.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  ), [getRelativeTime, getTemperatureColor]);

  // 기본 상품 데이터 (메모이제이션으로 최적화)
  const defaultProducts = useMemo(() => [
    {
      id: 1,
      name: '아이폰 14 Pro 128GB',
      price: 850000,
      image: { color: '#4338CA', icon: '📱' },
      description: '직거래 선호합니다. 액정 깨끗하고 배터리 성능 좋아요',
      location: '서울 강남구',
      uploadTime: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2시간 전
    },
    {
      id: 2,
      name: '갤럭시 S23 Ultra 자급제',
      price: 720000,
      image: { color: '#059669', icon: '📱' },
      description: '케이스, 보호필름 사용해서 거의 새거같아요. 충전기 포함',
      location: '서울 홍대입구',
      uploadTime: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5시간 전
    },
    {
      id: 3,
      name: '맥북 프로 M2 13인치',
      price: 1450000,
      image: { color: '#DC2626', icon: '💻' },
      description: '2023년 구입 맥북프로입니다. 사이클 50회 미만, 거의 안쓴거 같아요',
      location: '경기 분당구',
      uploadTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1일 전
    },
    {
      id: 4,
      name: '에어팟 프로 2세대',
      price: 180000,
      image: { color: '#7C3AED', icon: '🎧' },
      description: '정품 에어팟 프로 2세대 팝니다. 케이스 약간 기스 있지만 기능상 문제없어요',
      location: '서울 잠실',
      uploadTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3일 전
    },
    {
      id: 5,
      name: '닌텐도 스위치 OLED',
      price: 280000,
      image: { color: '#EA580C', icon: '🎮' },
      description: '닌텐도 스위치 OLED 모델이에요. 젤다 게임 포함해서 드려요',
      location: '인천 부평구',
      uploadTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6일 전
    },
    {
      id: 6,
      name: '아이패드 에어 5세대 64GB',
      price: 520000,
      image: { color: '#0891B2', icon: '📱' },
      description: '아이패드 에어 5세대 와이파이 모델입니다. 애플펜슬 호환되요',
      location: '서울 마포구',
      uploadTime: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) // 8일 전
    }
  ], []);

  // 기본 상품을 먼저 로드하고 사용자 데이터를 나중에 병합 (성능 최적화)
  useEffect(() => {
    // 1. 먼저 기본 상품을 즉시 표시
    setProducts(defaultProducts);
    updateTabCounts(defaultProducts);
    
    // 2. 로컬 스토리지 데이터를 비동기로 로드
    const loadUserProducts = async () => {
      try {
        setIsLoading(true);
        
        // 약간의 지연을 두어 UI가 먼저 렌더링되도록 함
        await new Promise(resolve => setTimeout(resolve, 0));
        
        const savedProducts = JSON.parse(localStorage.getItem('products') || '[]');
        
        if (savedProducts.length > 0) {
          // uploadTime을 Date 객체로 변환
          const processedSavedProducts = savedProducts.map(product => ({
            ...product,
            uploadTime: new Date(product.uploadTime)
          }));

          setUserProducts(processedSavedProducts);
          
          // 사용자 추가 상품 + 기본 상품을 합쳐서 최신순으로 정렬
          const allProducts = [...processedSavedProducts, ...defaultProducts];
          allProducts.sort((a, b) => new Date(b.uploadTime) - new Date(a.uploadTime));
          
          setProducts(allProducts);
          updateTabCounts(allProducts);
        }
      } catch (error) {
        console.error('상품 목록 로드 실패:', error);
        // 에러 시에도 기본 상품은 표시
        setProducts(defaultProducts);
        updateTabCounts(defaultProducts);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProducts();
  }, [defaultProducts, updateTabCounts]);

  // 페이지가 포커스될 때마다 상품 목록 새로고침 (최적화)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !isLoading) {
        try {
          const savedProducts = JSON.parse(localStorage.getItem('products') || '[]');
          
          // 변경사항이 있는지 확인
          if (savedProducts.length !== userProducts.length) {
            const processedSavedProducts = savedProducts.map(product => ({
              ...product,
              uploadTime: new Date(product.uploadTime)
            }));
            
            setUserProducts(processedSavedProducts);
            const allProducts = [...processedSavedProducts, ...defaultProducts];
            allProducts.sort((a, b) => new Date(b.uploadTime) - new Date(a.uploadTime));
            setProducts(allProducts);
            updateTabCounts(allProducts);
          }
        } catch (error) {
          console.error('상품 목록 새로고침 실패:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isLoading, userProducts.length, defaultProducts, updateTabCounts]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 - 반응형 모바일 앱 스타일 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 safe-area-top">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">우리동네 중고거래</h1>
            <div className="flex items-center gap-2 sm:gap-3">
              <a href="/search" className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </a>
              <a href="/add-product" className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 - 당근마켓 스타일 */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-[9]">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.name)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.name
                    ? 'text-orange-500'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{tab.name}</span>
                
                {/* 활성 탭 인디케이터 */}
                {activeTab === tab.name && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 탭별 컨텐츠 */}
      {activeTab === '중고거래' && (
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto bg-white shadow-sm">
                  <div className="divide-y divide-gray-100">
          {products.map(product => (
            <ProductCard 
              key={product.id}
              product={product}
            />
          ))}
          
          {/* 사용자 데이터 로딩 중 표시 */}
          {isLoading && products.length > 0 && (
            <div className="flex items-center justify-center py-4 bg-gray-50">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"></div>
              <p className="text-sm text-gray-500">추가 상품을 불러오는 중...</p>
            </div>
          )}
        </div>
        </div>
      )}

      {/* 다른 탭들 */}
      {activeTab === '전체' && (
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto bg-white shadow-sm">
          <div className="divide-y divide-gray-100">
            {/* 동네생활 게시글 */}
            {communityPosts.map(post => (
              <CommunityPost key={`community-${post.id}`} post={post} />
            ))}
            
            {/* 중고거래 상품 */}
            {products.map(product => (
              <ProductCard 
                key={`product-${product.id}`}
                product={product}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === '동네생활' && (
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto bg-white shadow-sm">
          <div className="divide-y divide-gray-100">
            {communityPosts.map(post => (
              <CommunityPost key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}

      {activeTab === '질문' && (
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto bg-white shadow-sm">
          <div className="text-center py-12 text-gray-500">
            <p>질문 탭 기능은 준비 중입니다.</p>
          </div>
        </div>
      )}

      {/* 하단 네비게이션 바 - 반응형 모바일 앱 스타일 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-2 sm:px-4 py-2">
          <div className="flex justify-around">
            <button className="flex flex-col items-center py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 001.414 1.414L2 12.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-4.586l.293.293a1 1 0 001.414-1.414l-9-9z" />
              </svg>
              <span className="text-xs text-orange-500 font-medium mt-1">홈</span>
            </button>
            <button className="flex flex-col items-center py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs text-gray-400 mt-1">동네생활</span>
            </button>
            <button className="flex flex-col items-center py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-xs text-gray-400 mt-1">채팅</span>
            </button>
            <button className="flex flex-col items-center py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs text-gray-400 mt-1">나의당근</span>
            </button>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 바 높이만큼 여백 추가 */}
      <div className="h-20 sm:h-24"></div>
    </div>
  );
} 