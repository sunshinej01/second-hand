'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { productAPI } from '../../lib/api';
import { useAuth } from '../../lib/auth-context';

export default function AddProductPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  // 폼 상태 관리
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    tradeMethod: 'direct', // 'direct', 'delivery', 'both'
    location: '서울 강남구',
    image: { color: '#4338CA', icon: '📦' }
  });

  // 에러 상태
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 색상과 아이콘 옵션
  const imageOptions = [
    { color: '#4338CA', icon: '📱', name: '전자기기' },
    { color: '#059669', icon: '👕', name: '의류' },
    { color: '#DC2626', icon: '💻', name: '컴퓨터' },
    { color: '#7C3AED', icon: '🎧', name: '오디오' },
    { color: '#EA580C', icon: '🎮', name: '게임' },
    { color: '#0891B2', icon: '📚', name: '도서' },
    { color: '#DB2777', icon: '🏠', name: '생활용품' },
    { color: '#16A34A', icon: '🚗', name: '자동차' }
  ];

  // 거래 방식 옵션
  const tradeMethods = [
    { value: 'direct', label: '직거래', desc: '직접 만나서 거래' },
    { value: 'delivery', label: '택배거래', desc: '택배를 통한 거래' },
    { value: 'both', label: '직거래/택배', desc: '둘 다 가능' }
  ];

  // 지역 옵션
  const locations = [
    '서울 강남구', '서울 강북구', '서울 홍대입구', '서울 잠실',
    '서울 마포구', '경기 분당구', '경기 수원시', '인천 부평구'
  ];

  // 입력값 변경 핸들러
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 에러 메시지 지우기
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {};

    if (formData.name.length < 5) {
      newErrors.name = '제목은 5자 이상 입력해주세요.';
    }

    if (formData.description.length < 50) {
      newErrors.description = '설명은 50자 이상 입력해주세요.';
    }

    if (!formData.price || parseInt(formData.price) <= 0) {
      newErrors.price = '올바른 가격을 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 상품 추가 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      // Supabase에 저장할 데이터 준비
      const productData = {
        title: formData.name,
        description: formData.description,
        price: parseInt(formData.price),
        location: formData.location,
        trade_method: formData.tradeMethod,
        // 이미지는 JSON 형태로 저장 (추후 실제 이미지 업로드 기능으로 확장 가능)
        image_data: JSON.stringify(formData.image),
        // 필요한 추가 필드들
        category: getIconCategory(formData.image.icon),
        status: 'available', // 판매중
        user_id: user?.id // 현재 로그인한 사용자 ID
      };

      // 1. Supabase에 저장 시도
      const { data: supabaseData, error: supabaseError } = await productAPI.createProduct(productData);
      
      let savedSuccessfully = false;
      
      if (supabaseError) {
        console.error('Supabase 저장 오류:', supabaseError);
        // Supabase 저장 실패 시 로컬 스토리지에라도 저장
      } else {
        console.log('Supabase에 성공적으로 저장:', supabaseData);
        savedSuccessfully = true;
      }

      // 2. 로컬 스토리지에도 저장 (백업 + 즉시 표시용)
      try {
        const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
        
        const newProduct = {
          id: supabaseData?.[0]?.id || Date.now(), // Supabase ID 사용 또는 타임스탬프
          name: formData.name,
          price: parseInt(formData.price),
          image: formData.image,
          description: formData.description,
          location: formData.location,
          tradeMethod: formData.tradeMethod,
          uploadTime: new Date().toISOString(),
          isFromSupabase: savedSuccessfully
        };

        const updatedProducts = [newProduct, ...existingProducts];
        localStorage.setItem('products', JSON.stringify(updatedProducts));
      } catch (localError) {
        console.error('로컬 스토리지 저장 오류:', localError);
      }

      // 성공 메시지
      if (savedSuccessfully) {
        alert('상품이 성공적으로 등록되었습니다!');
      } else {
        alert('상품이 등록되었습니다. (오프라인 모드)');
      }
      
      // products 페이지로 리다이렉트
      router.push('/products');
      
    } catch (error) {
      console.error('상품 등록 실패:', error);
      
      // 최종 에러 시 로컬 스토리지에라도 저장 시도
      try {
        const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
        const newProduct = {
          id: Date.now(),
          name: formData.name,
          price: parseInt(formData.price),
          image: formData.image,
          description: formData.description,
          location: formData.location,
          tradeMethod: formData.tradeMethod,
          uploadTime: new Date().toISOString(),
          isFromSupabase: false
        };
        
        const updatedProducts = [newProduct, ...existingProducts];
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        
        alert('상품이 등록되었습니다. (오프라인 모드)');
        router.push('/products');
      } catch (fallbackError) {
        console.error('최종 저장 실패:', fallbackError);
        alert('상품 등록에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 아이콘에서 카테고리 이름 추출하는 헬퍼 함수
  const getIconCategory = (icon) => {
    const iconMap = {
      '📱': 'electronics',
      '👕': 'clothing', 
      '💻': 'computer',
      '🎧': 'audio',
      '🎮': 'game',
      '📚': 'book',
      '🏠': 'household',
      '🚗': 'automotive'
    };
    return iconMap[icon] || 'others';
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">내 물품 팔기</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </div>

      {/* 폼 컨텐츠 */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto bg-white">
        <div className="p-4 sm:p-6 space-y-6">
          
          {/* 상품 이미지 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              카테고리 선택
            </label>
            <div className="grid grid-cols-4 gap-3">
              {imageOptions.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleInputChange('image', { color: option.color, icon: option.icon })}
                  className={`flex flex-col items-center p-3 rounded-lg border-2 transition-colors ${
                    formData.image.color === option.color && formData.image.icon === option.icon
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl mb-1"
                    style={{ backgroundColor: option.color }}
                  >
                    <span className="text-white font-bold">{option.icon}</span>
                  </div>
                  <span className="text-xs text-gray-600">{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 제목 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="상품 제목을 입력하세요 (5자 이상)"
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              <p className="text-sm text-gray-500 ml-auto">{formData.name.length}/5자 이상</p>
            </div>
          </div>

          {/* 설명 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상품 설명 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="상품 상태, 구입 시기, 사용감 등을 자세히 적어주세요 (50자 이상)"
              rows={4}
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
              <p className="text-sm text-gray-500 ml-auto">{formData.description.length}/50자 이상</p>
            </div>
          </div>

          {/* 가격 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              희망 거래 가격 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0"
                className={`w-full px-3 py-3 pr-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <span className="absolute right-3 top-3 text-gray-500">원</span>
            </div>
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          {/* 거래 방식 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              거래 방식
            </label>
            <div className="space-y-2">
              {tradeMethods.map((method) => (
                <label key={method.value} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="tradeMethod"
                    value={method.value}
                    checked={formData.tradeMethod === method.value}
                    onChange={(e) => handleInputChange('tradeMethod', e.target.value)}
                    className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{method.label}</p>
                    <p className="text-sm text-gray-500">{method.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 지역 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              거래 지역
            </label>
            <select
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {locations.map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>

        </div>

        {/* 작성 완료 버튼 */}
        <div className="p-4 sm:p-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-lg font-medium text-white transition-colors ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700'
            }`}
          >
            {isSubmitting ? '등록 중...' : '작성 완료'}
          </button>
        </div>
      </form>

      {/* 하단 여백 */}
      <div className="h-10"></div>
    </div>
  );
} 