'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CommunityPage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('전체');

  // 카테고리 옵션
  const categories = ['전체', '일상', '질문', '정보', '모임'];

  // 동네생활 게시글 데이터
  const communityPosts = [
    {
      id: 1,
      category: '모임',
      title: '2030 동네친구 구해요',
      author: '마포보라돌이',
      mannerTemperature: 38.6,
      content: '이사온지 얼마 안돼서 동네 친구 만들고 싶어요.\n퇴근 후나 주말에 같이 맛집 탐방하실 분 구해요~',
      uploadTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3시간 전
      profileColor: '#16A34A',
      viewCount: 23,
      commentCount: 5,
      likeCount: 8,
      comments: [
        {
          id: 1,
          author: '당근마스터',
          content: '저랑 같이 연남동 맛집 찾아다녀요!',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          profileColor: '#DC2626'
        },
        {
          id: 2,
          author: '코코',
          content: '저랑도 친구해요!',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          profileColor: '#7C3AED'
        }
      ]
    },
    {
      id: 2,
      category: '질문',
      title: '홍대 근처 좋은 카페 추천해주세요',
      author: '카페러버',
      mannerTemperature: 42.3,
      content: '홍대입구역 근처에서 작업하기 좋은 카페 찾고 있어요.\n와이파이 잘 되고 조용한 곳 있나요?',
      uploadTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
      profileColor: '#059669',
      viewCount: 45,
      commentCount: 12,
      likeCount: 15,
      comments: [
        {
          id: 1,
          author: '홍대토박이',
          content: '스타벅스 홍대점이 넓어서 좋아요!',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          profileColor: '#EA580C'
        }
      ]
    },
    {
      id: 3,
      category: '모임',
      title: '강남구 러닝 메이트 모집',
      author: '러닝킹',
      mannerTemperature: 39.8,
      content: '매주 토요일 아침 7시 한강공원에서 러닝하실 분 모집해요.\n초보자도 환영합니다!',
      uploadTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      profileColor: '#0891B2',
      viewCount: 78,
      commentCount: 8,
      likeCount: 25,
      comments: []
    },
    {
      id: 4,
      category: '정보',
      title: '마포구 무료 와이파이 스팟 정리',
      author: '와이파이지기',
      mannerTemperature: 41.2,
      content: '마포구 내 무료 와이파이 잘 되는 곳들 정리해봤어요!\n\n1. 홍대입구역 2번 출구 앞 공원\n2. 상수역 메가박스 로비\n3. 합정역 카페거리\n\n더 아시는 분은 댓글로 공유해주세요~',
      uploadTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      profileColor: '#7C3AED',
      viewCount: 156,
      commentCount: 23,
      likeCount: 67,
      comments: []
    },
    {
      id: 5,
      category: '일상',
      title: '오늘 날씨가 너무 좋네요',
      author: '날씨덕후',
      mannerTemperature: 37.9,
      content: '산책하기 딱 좋은 날씨예요 ☀️\n근처 공원에 나들이 가시는 분 계신가요?',
      uploadTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
      profileColor: '#F59E0B',
      viewCount: 34,
      commentCount: 3,
      likeCount: 12,
      comments: []
    }
  ];

  useEffect(() => {
    // 카테고리 필터링
    if (activeCategory === '전체') {
      setPosts(communityPosts);
    } else {
      setPosts(communityPosts.filter(post => post.category === activeCategory));
    }
  }, [activeCategory]);

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
    <div className="bg-white border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors cursor-pointer">
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
            <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
              {post.category}
            </span>
          </div>
          <p className="text-sm text-gray-500">{getRelativeTime(post.uploadTime)}</p>
        </div>
      </div>

      {/* 게시글 내용 */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-line line-clamp-3">{post.content}</p>
      </div>

      {/* 게시글 통계 */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>{post.viewCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{post.commentCount}</span>
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{post.likeCount}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 safe-area-top">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">동네생활</h1>
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 카테고리 탭 */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-[9]">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeCategory === category
                    ? 'text-orange-500'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{category}</span>
                
                {/* 활성 탭 인디케이터 */}
                {activeCategory === category && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 게시글 목록 */}
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto bg-white shadow-sm">
        <div className="divide-y divide-gray-100">
          {posts.map(post => (
            <CommunityPost key={post.id} post={post} />
          ))}
          
          {posts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>해당 카테고리에 게시글이 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* 하단 네비게이션 바 - 반응형 모바일 앱 스타일 */}
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
            <button className="flex flex-col items-center py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
              <span className="text-xs text-orange-500 font-medium mt-1">동네생활</span>
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
            <button 
              onClick={() => router.push('/profile')}
              className="flex flex-col items-center py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
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