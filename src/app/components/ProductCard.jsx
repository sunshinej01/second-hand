'use client';

import { useRouter } from 'next/navigation';

export default function ProductCard({ product }) {
  const router = useRouter();
  const { name, price, image, description, location, uploadTime, tradeMethod } = product;

  // 가격을 한국 원화 형식으로 포맷팅
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  // 업로드 시간을 상대적 시간으로 변환
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

  // 거래방식 표시
  const getTradeMethodDisplay = (method) => {
    switch (method) {
      case 'direct': return '직거래';
      case 'delivery': return '택배';
      case 'both': return '직거래/택배';
      default: return '';
    }
  };

  // 상세페이지로 이동
  const handleClick = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200 cursor-pointer touch-manipulation"
    >
      <div className="flex p-3 sm:p-4 gap-3 sm:gap-4">
        {/* 상품 이미지 - 간단한 도형 스타일 (반응형) */}
        <div 
          className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg flex items-center justify-center text-xl sm:text-2xl shadow-sm" 
          style={{backgroundColor: image.color}}
        >
          <span className="text-white font-bold">
            {image.icon}
          </span>
        </div>
        
        {/* 상품 정보 (반응형) */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1 line-clamp-2 leading-tight sm:leading-5">
            {name}
          </h3>
          
          <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2 leading-4">
            {description}
          </p>
          
          <div className="flex items-end justify-between">
            <p className="text-base sm:text-lg font-bold text-orange-500">
              {formatPrice(price)}
            </p>
            
            <div className="flex items-center text-xs text-gray-500 gap-1 sm:gap-2 flex-shrink-0">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="truncate max-w-20 sm:max-w-none">{location}</span>
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">{getRelativeTime(uploadTime)}</span>
              {tradeMethod && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                    {getTradeMethodDisplay(tradeMethod)}
                  </span>
                </>
              )}
            </div>
          </div>
          
          {/* 모바일에서만 보이는 시간 정보 */}
          <div className="sm:hidden mt-1 flex items-center gap-2 text-xs text-gray-400">
            <span>{getRelativeTime(uploadTime)}</span>
            {tradeMethod && (
              <>
                <span>•</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                  {getTradeMethodDisplay(tradeMethod)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 