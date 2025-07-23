'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '../components/ProductCard';

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ products: [], community: [] });
  const [recentSearches, setRecentSearches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // 추천 검색 키워드
  const recommendedKeywords = [
    '아이폰', '갤럭시', '맥북', '에어팟', '닌텐도', '아이패드',
    '친구', '카페', '맛집', '러닝', '운동', '취미',
    '전자기기', '의류', '가구', '도서', '생활용품', '자동차'
  ];

  // 기본 상품 데이터 (products/page.jsx와 동일)
  const defaultProducts = [
    {
      id: 1,
      name: '아이폰 14 Pro 128GB',
      price: 850000,
      image: { color: '#4338CA', icon: '📱' },
      description: '직거래 선호합니다. 액정 깨끗하고 배터리 성능 좋아요',
      location: '서울 강남구',
      uploadTime: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 2,
      name: '갤럭시 S23 Ultra 자급제',
      price: 720000,
      image: { color: '#059669', icon: '📱' },
      description: '케이스, 보호필름 사용해서 거의 새거같아요. 충전기 포함',
      location: '서울 홍대입구',
      uploadTime: new Date(Date.now() - 5 * 60 * 60 * 1000)
    },
    {
      id: 3,
      name: '맥북 프로 M2 13인치',
      price: 1450000,
      image: { color: '#DC2626', icon: '💻' },
      description: '2023년 구입 맥북프로입니다. 사이클 50회 미만, 거의 안쓴거 같아요',
      location: '경기 분당구',
      uploadTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: 4,
      name: '에어팟 프로 2세대',
      price: 180000,
      image: { color: '#7C3AED', icon: '🎧' },
      description: '정품 에어팟 프로 2세대 팝니다. 케이스 약간 기스 있지만 기능상 문제없어요',
      location: '서울 잠실',
      uploadTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: 5,
      name: '닌텐도 스위치 OLED',
      price: 280000,
      image: { color: '#EA580C', icon: '🎮' },
      description: '닌텐도 스위치 OLED 모델이에요. 젤다 게임 포함해서 드려요',
      location: '인천 부평구',
      uploadTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    },
    {
      id: 6,
      name: '아이패드 에어 5세대 64GB',
      price: 520000,
      image: { color: '#0891B2', icon: '📱' },
      description: '아이패드 에어 5세대 와이파이 모델입니다. 애플펜슬 호환되요',
      location: '서울 마포구',
      uploadTime: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
    }
  ];

  // 동네생활 게시글 데이터 (products/page.jsx와 동일)
  const communityPosts = [
    {
      id: 1,
      title: '2030 동네친구 구해요',
      author: '마포보라돌이',
      mannerTemperature: 38.6,
      content: '이사온지 얼마 안돼서 동네 친구 만들고 싶어요.\n퇴근 후나 주말에 같이 맛집 탐방하실 분 구해요~',
      uploadTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
      profileColor: '#16A34A',
      comments: []
    },
    {
      id: 2,
      title: '홍대 근처 좋은 카페 추천해주세요',
      author: '카페러버',
      mannerTemperature: 42.3,
      content: '홍대입구역 근처에서 작업하기 좋은 카페 찾고 있어요.\n와이파이 잘 되고 조용한 곳 있나요?',
      uploadTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
      profileColor: '#059669',
      comments: []
    },
    {
      id: 3,
      title: '강남구 러닝 메이트 모집',
      author: '러닝킹',
      mannerTemperature: 39.8,
      content: '매주 토요일 아침 7시 한강공원에서 러닝하실 분 모집해요.\n초보자도 환영합니다!',
      uploadTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      profileColor: '#0891B2',
      comments: []
    }
  ];

  // 최근 검색 기록 로드
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      setRecentSearches(saved);
    } catch (error) {
      console.error('최근 검색 기록 로드 실패:', error);
    }

    // URL에서 초기 검색어 가져오기
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, []);

  // 검색 실행
  const performSearch = async (query) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setShowResults(true);

    // 검색 기록에 추가
    addToRecentSearches(query.trim());

    try {
      // 로컬 스토리지에서 사용자 추가 상품 불러오기
      const savedProducts = JSON.parse(localStorage.getItem('products') || '[]');
      const allProducts = [...savedProducts, ...defaultProducts];

      // 상품 검색 (이름, 설명에서)
      const filteredProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );

      // 동네생활 게시글 검색 (제목, 내용에서)
      const filteredCommunity = communityPosts.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults({
        products: filteredProducts,
        community: filteredCommunity
      });

    } catch (error) {
      console.error('검색 실패:', error);
      setSearchResults({ products: [], community: [] });
    } finally {
      setIsSearching(false);
    }
  };

  // 최근 검색 기록에 추가
  const addToRecentSearches = (query) => {
    try {
      const updated = [query, ...recentSearches.filter(item => item !== query)].slice(0, 10);
      setRecentSearches(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    } catch (error) {
      console.error('검색 기록 저장 실패:', error);
    }
  };

  // 검색 실행 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim());
    }
  };

  // 키워드 클릭 핸들러
  const handleKeywordClick = (keyword) => {
    setSearchQuery(keyword);
    performSearch(keyword);
  };

  // 최근 검색 삭제
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // 업로드 시간 포맷팅
  const getRelativeTime = (uploadTime) => {
    const now = new Date();
    const uploadDate = new Date(uploadTime);
    const diffInHours = Math.floor((now - uploadDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;
    
    return uploadDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
  };

  // 매너온도 색상 계산
  const getTemperatureColor = (temp) => {
    if (temp >= 40) return 'text-green-500';
    if (temp >= 36.5) return 'text-blue-500';
    return 'text-orange-500';
  };

  // 동네생활 게시글 컴포넌트
  const CommunityPost = ({ post }) => (
    <div className="bg-white border-b border-gray-100 p-4">
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
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{post.content}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 safe-area-top">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* 검색 입력창 */}
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="상품, 동네생활 검색"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                autoFocus
              />
              <button
                type="submit"
                disabled={isSearching}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isSearching 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                {isSearching ? '검색중' : '검색'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
        {!showResults ? (
          // 검색 전 화면
          <div className="p-4 space-y-6">
            {/* 추천 검색어 */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">추천 검색어</h2>
              <div className="flex flex-wrap gap-2">
                {recommendedKeywords.map((keyword, index) => (
                  <button
                    key={index}
                    onClick={() => handleKeywordClick(keyword)}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* 최근 검색 */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-900">최근 검색</h2>
                  <button
                    onClick={clearRecentSearches}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    전체 삭제
                  </button>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleKeywordClick(search)}
                      className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-gray-900">{search}</span>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          // 검색 결과 화면
          <div className="bg-white">
            {/* 검색 결과 요약 */}
            <div className="p-4 border-b border-gray-200">
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">'{searchQuery}'</span> 검색 결과
                <span className="ml-2 text-sm">
                  상품 {searchResults.products.length}개, 동네생활 {searchResults.community.length}개
                </span>
              </p>
            </div>

            {searchResults.products.length === 0 && searchResults.community.length === 0 ? (
              // 검색 결과 없음
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-gray-500 mb-2">검색 결과가 없습니다</p>
                <p className="text-sm text-gray-400">다른 검색어를 시도해보세요</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {/* 동네생활 결과 */}
                {searchResults.community.length > 0 && (
                  <div>
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <h3 className="font-medium text-gray-900">동네생활 ({searchResults.community.length})</h3>
                    </div>
                    {searchResults.community.map(post => (
                      <CommunityPost key={`community-${post.id}`} post={post} />
                    ))}
                  </div>
                )}

                {/* 중고거래 결과 */}
                {searchResults.products.length > 0 && (
                  <div>
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <h3 className="font-medium text-gray-900">중고거래 ({searchResults.products.length})</h3>
                    </div>
                    {searchResults.products.map(product => (
                      <ProductCard key={`product-${product.id}`} product={product} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 하단 여백 */}
      <div className="h-10"></div>
    </div>
  );
}

// Suspense로 감싸진 기본 SearchPage 컴포넌트
export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
} 