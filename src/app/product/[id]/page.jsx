'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // 상품별 상세 정보 생성
  const generateProductDetails = (product) => {
    if (!product) return null;

    const details = {
      1: { // 아이폰 14 Pro
        modelName: '아이폰 14 Pro',
        capacity: '128GB',
        color: '딥 퍼플',
        purchaseDate: '2022년 9월',
        accessories: '박스, 충전케이블, 매뉴얼',
        condition: '액정/외관 스크래치 거의 없음\n모든 기능 정상\n배터리 성능 88%'
      },
      2: { // 갤럭시 S23 Ultra
        modelName: '갤럭시 S23 Ultra',
        capacity: '256GB',
        color: '팬텀 블랙',
        purchaseDate: '2023년 3월',
        accessories: '박스, 충전케이블, S펜, 케이스',
        condition: 'S펜 정상 작동\n카메라 렌즈 무흠\n배터리 상태 매우 좋음'
      },
      3: { // 맥북 프로
        modelName: '맥북 프로 M2',
        capacity: '512GB SSD',
        color: '스페이스 그레이',
        purchaseDate: '2023년 1월',
        accessories: '박스, 충전 어댑터, 매뉴얼',
        condition: '키보드/트랙패드 정상\n화면 무결점\n배터리 사이클 50회 미만'
      },
      4: { // 에어팟 프로
        modelName: '에어팟 프로 2세대',
        capacity: '라이트닝 케이스',
        color: '화이트',
        purchaseDate: '2023년 5월',
        accessories: '충전케이스, 이어팁 3종, 박스',
        condition: '노이즈 캔슬링 정상\n케이스 약간 기스\n배터리 지속시간 정상'
      },
      5: { // 닌텐도 스위치
        modelName: '닌텐도 스위치 OLED',
        capacity: '64GB 내장 메모리',
        color: '네온 블루/레드',
        purchaseDate: '2022년 12월',
        accessories: '독, 조이콘, 충전기, 젤다 게임',
        condition: '조이콘 드리프트 없음\n화면 스크래치 없음\n모든 기능 정상'
      },
      6: { // 아이패드
        modelName: '아이패드 에어 5세대',
        capacity: '64GB',
        color: '스타라이트',
        purchaseDate: '2022년 8월',
        accessories: '박스, 충전케이블, 애플펜슬 호환',
        condition: '액정 완벽\n후면 약간 기스\n배터리 성능 좋음'
      }
    };

    // 사용자가 추가한 상품의 경우 기본 정보 생성
    if (!details[product.id]) {
      return {
        modelName: product.name,
        capacity: '용량 정보 없음',
        color: '색상 정보 없음', 
        purchaseDate: '구매시기 정보 없음',
        accessories: '구성품 정보 없음',
        condition: '기기 상태 정보 없음'
      };
    }

    return details[product.id];
  };

  // 상품별 작성자 정보 생성
  const generateAuthorInfo = (product) => {
    if (!product) return null;

    // 상품 ID를 기반으로 다양한 작성자 정보 생성
    const authorNames = [
      '당근이', '감자킴', '고구마팜', '배추맘', '무지개', 
      '사과동', '바나나킹', '포도주', '딸기야', '수박이'
    ];
    
    const profileColors = [
      '#16A34A', '#DC2626', '#7C3AED', '#EA580C', 
      '#0891B2', '#DB2777', '#059669', '#4338CA'
    ];

    const profileIcons = ['👤', '🙂', '😊', '🤗', '😁', '🥰', '😎', '🤓'];

    // 상품 ID를 기반으로 일관된 작성자 정보 생성
    const nameIndex = (product.id - 1) % authorNames.length;
    const colorIndex = (product.id - 1) % profileColors.length;
    const iconIndex = (product.id - 1) % profileIcons.length;
    
    // 매너온도도 상품별로 다르게 (32.0 ~ 42.0 범위)
    const mannerTemp = 32.0 + ((product.id * 3.7) % 10.0);
    const roundedTemp = Math.round(mannerTemp * 10) / 10;

    // 위치 인증 여부도 랜덤하게 (상품 ID 기반)
    const isLocationVerified = product.id % 3 !== 0; // 3의 배수가 아닌 경우 인증

    return {
      name: authorNames[nameIndex],
      mannerTemperature: roundedTemp,
      location: product.location, // 상품의 location 사용
      isLocationVerified: isLocationVerified,
      profileImage: { 
        color: profileColors[colorIndex], 
        icon: profileIcons[iconIndex] 
      }
    };
  };

  // 댓글 관련 함수들
  const loadComments = () => {
    try {
      const savedComments = JSON.parse(localStorage.getItem(`comments_${params.id}`) || '[]');
      setComments(savedComments);
    } catch (error) {
      console.error('댓글 로드 실패:', error);
      setComments([]);
    }
  };

  const addComment = () => {
    if (newComment.trim().length < 1) return;

    const comment = {
      id: Date.now(),
      text: newComment.trim(),
      author: `사용자${Math.floor(Math.random() * 100)}`,
      timestamp: new Date().toISOString(),
      profileColor: ['#4338CA', '#059669', '#DC2626', '#7C3AED', '#EA580C'][Math.floor(Math.random() * 5)]
    };

    const updatedComments = [comment, ...comments];
    setComments(updatedComments);
    
    try {
      localStorage.setItem(`comments_${params.id}`, JSON.stringify(updatedComments));
    } catch (error) {
      console.error('댓글 저장 실패:', error);
    }

    setNewComment('');
  };

  const formatCommentTime = (timestamp) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - commentTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}일 전`;
  };

  // 상품 데이터 로드
  useEffect(() => {
    const loadProduct = () => {
      try {
        // 로컬 스토리지에서 사용자 추가 상품 불러오기
        const savedProducts = JSON.parse(localStorage.getItem('products') || '[]');
        
        // 기본 더미 데이터
        const defaultProducts = [
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
        ];

        // 모든 상품을 합쳐서 해당 ID 찾기
        const allProducts = [...savedProducts, ...defaultProducts];
        const foundProduct = allProducts.find(p => p.id === parseInt(params.id));
        
        if (foundProduct) {
          // uploadTime이 문자열이면 Date 객체로 변환
          if (typeof foundProduct.uploadTime === 'string') {
            foundProduct.uploadTime = new Date(foundProduct.uploadTime);
          }
          setProduct(foundProduct);
        }
      } catch (error) {
        console.error('상품 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
    loadComments();
  }, [params.id]);

  // 관심상품 토글
  const toggleLike = () => {
    setIsLiked(!isLiked);
    // 여기에 로컬 스토리지 저장 로직 추가 가능
  };

  // 채팅 시작
  const handleSendMessage = () => {
    if (chatMessage.trim().length >= 2) {
      alert(`"${chatMessage}" 메시지로 채팅이 시작됩니다!`);
      setChatMessage('');
      // 실제 앱에서는 여기서 채팅 페이지로 이동하거나 채팅 API 호출
    }
  };

  // 가격 포맷팅
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-500">상품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">상품을 찾을 수 없습니다.</p>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 현재 상품의 작성자 정보 및 상세 정보 생성
  const authorInfo = generateAuthorInfo(product);
  const productDetails = generateProductDetails(product);

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 safe-area-top">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
        {/* 상품 이미지 */}
        <div className="w-full h-80 sm:h-96 bg-gray-100 flex items-center justify-center">
          <div 
            className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl flex items-center justify-center text-4xl sm:text-5xl shadow-lg"
            style={{ backgroundColor: product.image.color }}
          >
            <span className="text-white font-bold">
              {product.image.icon}
            </span>
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="p-4 sm:p-6">
          {/* 제목과 시간 */}
          <div className="mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-sm text-gray-500">
              {getRelativeTime(product.uploadTime)}
            </p>
          </div>

          {/* 가격 */}
          <div className="mb-6">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </p>
          </div>

          {/* 상품 설명 */}
          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* 상품 상세 정보 */}
          {productDetails && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">상품 상세정보</h2>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">모델명</span>
                    <span className="text-gray-900">{productDetails.modelName}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">용량</span>
                    <span className="text-gray-900">{productDetails.capacity}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">색상</span>
                    <span className="text-gray-900">{productDetails.color}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">구매시기</span>
                    <span className="text-gray-900">{productDetails.purchaseDate}</span>
                  </div>
                  
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">구성품</span>
                    <span className="text-gray-900 text-right">{productDetails.accessories}</span>
                  </div>
                  
                  <div className="pt-2">
                    <span className="text-gray-600 font-medium">기기 상태</span>
                    <div className="mt-2 text-gray-900 whitespace-pre-line">
                      {productDetails.condition}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 작성자 정보 */}
          {authorInfo && (
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">판매자 정보</h2>
              
              <div className="flex items-center gap-4">
                {/* 프로필 이미지 */}
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-lg"
                  style={{ backgroundColor: authorInfo.profileImage.color }}
                >
                  <span className="text-white font-bold">
                    {authorInfo.profileImage.icon}
                  </span>
                </div>

                {/* 사용자 정보 */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">{authorInfo.name}</h3>
                    {authorInfo.isLocationVerified && (
                      <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                        위치인증
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-1">{authorInfo.location}</p>
                  
                  {/* 매너온도 */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">매너온도</span>
                    <span className={`text-sm font-semibold ${getTemperatureColor(authorInfo.mannerTemperature)}`}>
                      {authorInfo.mannerTemperature}°C
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-20">
                      <div 
                        className={`h-2 rounded-full ${authorInfo.mannerTemperature >= 36.5 ? 'bg-blue-500' : 'bg-orange-500'}`}
                        style={{ width: `${Math.min((authorInfo.mannerTemperature / 50) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 댓글 섹션 */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              댓글 ({comments.length})
            </h2>
            
            {/* 댓글 작성 */}
            <div className="mb-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm">👤</span>
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 작성해보세요..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={addComment}
                      disabled={newComment.trim().length < 1}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        newComment.trim().length >= 1
                          ? 'bg-orange-500 text-white hover:bg-orange-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      댓글 작성
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 댓글 목록 */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>아직 댓글이 없습니다.</p>
                  <p className="text-sm">첫 번째 댓글을 작성해보세요!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                      style={{ backgroundColor: comment.profileColor }}
                    >
                      <span className="text-white font-bold">👤</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{comment.author}</span>
                        <span className="text-xs text-gray-500">
                          {formatCommentTime(comment.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 하단 고정 영역 (하트 + 채팅) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto p-4">
          <div className="flex items-center gap-3">
            {/* 하트 버튼 */}
            <button
              onClick={toggleLike}
              className="flex-shrink-0 p-3 rounded-full border border-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <svg 
                className={`w-6 h-6 ${isLiked ? 'text-orange-500 fill-current' : 'text-gray-600'}`} 
                fill={isLiked ? 'currentColor' : 'none'} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                />
              </svg>
            </button>

            {/* 채팅 입력창 */}
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="궁금한 점을 물어보세요"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={chatMessage.trim().length < 2}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  chatMessage.trim().length >= 2
                    ? 'bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                보내기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 고정 영역 높이만큼 여백 */}
      <div className="h-32 sm:h-36"></div>
    </div>
  );
} 