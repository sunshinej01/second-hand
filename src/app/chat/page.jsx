'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { chatAPI, userAPI } from '../../lib/api';
import { useAuth } from '../../lib/auth-context';

export default function ChatPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 더미 채팅방 데이터 (Supabase 연결 전 사용)
  const dummyChatRooms = [
    {
      id: 1,
      product: {
        id: 1,
        title: '아이폰 14 Pro 128GB',
        price: 850000,
        image_data: { color: '#4338CA', icon: '📱' },
        status: 'available'
      },
      otherUser: {
        nickname: '판매왕김철수',
        avatar_url: null,
        manner_temperature: 42.5
      },
      last_message: '네, 직거래 가능합니다!',
      last_message_at: new Date(Date.now() - 30 * 60 * 1000), // 30분 전
      unread_count: 2,
      is_buyer: true // 현재 사용자가 구매자인지
    },
    {
      id: 2,
      product: {
        id: 2,
        title: '맥북 프로 M2 13인치',
        price: 1450000,
        image_data: { color: '#DC2626', icon: '💻' },
        status: 'available'
      },
      otherUser: {
        nickname: '노트북매니아',
        avatar_url: null,
        manner_temperature: 39.8
      },
      last_message: '언제 확인 가능하신가요?',
      last_message_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
      unread_count: 0,
      is_buyer: false // 현재 사용자가 판매자
    },
    {
      id: 3,
      product: {
        id: 3,
        title: '에어팟 프로 2세대',
        price: 180000,
        image_data: { color: '#7C3AED', icon: '🎧' },
        status: 'sold'
      },
      otherUser: {
        nickname: '음향덕후',
        avatar_url: null,
        manner_temperature: 38.2
      },
      last_message: '좋은 거래였습니다! 감사합니다 😊',
      last_message_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1일 전
      unread_count: 0,
      is_buyer: true
    },
    {
      id: 4,
      product: {
        id: 4,
        title: '닌텐도 스위치 OLED',
        price: 280000,
        image_data: { color: '#EA580C', icon: '🎮' },
        status: 'reserved'
      },
      otherUser: {
        nickname: '게임러',
        avatar_url: null,
        manner_temperature: 41.0
      },
      last_message: '내일 2시에 만나요!',
      last_message_at: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3시간 전
      unread_count: 1,
      is_buyer: false
    }
  ];

  useEffect(() => {
    if (user) {
      loadChatRooms(user.id);
    } else {
      setChatRooms([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadChatRooms = async (userId) => {
    try {
      setIsLoading(true);
      
      // Supabase에서 채팅방 목록 조회 시도
      const { data: supabaseChatRooms, error } = await chatAPI.getChatRooms();
      
      if (error) {
        console.error('Supabase 채팅방 조회 오류:', error);
        // 에러 시 더미 데이터 사용
        setChatRooms(dummyChatRooms);
      } else if (supabaseChatRooms && supabaseChatRooms.length > 0) {
        // Supabase 데이터 변환
        const transformedRooms = supabaseChatRooms.map(room => ({
          id: room.id,
          product: room.product,
          otherUser: room.buyer_id === userId ? room.seller : room.buyer,
          last_message: room.last_message,
          last_message_at: new Date(room.last_message_at),
          unread_count: room.buyer_id === userId ? room.unread_count_buyer : room.unread_count_seller,
          is_buyer: room.buyer_id === userId
        }));
        setChatRooms(transformedRooms);
      } else {
        // 데이터가 없으면 더미 데이터 사용
        setChatRooms(dummyChatRooms);
      }
    } catch (error) {
      console.error('채팅방 목록 로드 실패:', error);
      setChatRooms(dummyChatRooms);
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      const { data: user, error } = await userAPI.getCurrentUser();
      if (!error && user) {
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('사용자 인증 확인 오류:', error);
    }
  };

  // 시간 포맷팅
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = Math.floor((now - messageTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
      return diffInMinutes < 1 ? '방금 전' : `${diffInMinutes}분 전`;
    }
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;
    
    return messageTime.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
  };

  // 매너온도 색상
  const getTemperatureColor = (temp) => {
    if (temp >= 40) return 'text-green-500';
    if (temp >= 36.5) return 'text-blue-500';
    return 'text-orange-500';
  };

  // 상품 상태 표시
  const getStatusBadge = (status) => {
    const statusMap = {
      available: { text: '판매중', color: 'bg-green-100 text-green-600' },
      reserved: { text: '예약중', color: 'bg-yellow-100 text-yellow-600' },
      sold: { text: '거래완료', color: 'bg-gray-100 text-gray-600' },
      hidden: { text: '숨김', color: 'bg-red-100 text-red-600' }
    };
    
    const statusInfo = statusMap[status] || statusMap.available;
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    );
  };

  // 채팅방 컴포넌트
  const ChatRoomItem = ({ room }) => (
    <div 
      className="flex items-center p-4 bg-white border-b border-gray-100 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
      onClick={() => router.push(`/chat/${room.id}`)}
    >
      {/* 상품 이미지 */}
      <div className="mr-3">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center text-lg"
          style={{ backgroundColor: room.product.image_data?.color || '#4338CA' }}
        >
          <span className="text-white font-bold">
            {room.product.image_data?.icon || '📦'}
          </span>
        </div>
      </div>

      {/* 채팅 정보 */}
      <div className="flex-1 min-w-0">
        {/* 상품명과 상태 */}
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-gray-900 truncate">{room.product.title}</h3>
          {getStatusBadge(room.product.status)}
        </div>
        
        {/* 상대방 정보 */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm text-gray-600">{room.otherUser.nickname}</span>
          <span className={`text-xs ${getTemperatureColor(room.otherUser.manner_temperature)}`}>
            {room.otherUser.manner_temperature}°C
          </span>
          <span className="text-xs text-gray-400">
            {room.is_buyer ? '판매자' : '구매자'}
          </span>
        </div>
        
        {/* 마지막 메시지 */}
        <p className="text-sm text-gray-500 truncate">{room.last_message}</p>
      </div>

      {/* 시간과 읽지 않은 메시지 */}
      <div className="ml-3 flex flex-col items-end">
        <span className="text-xs text-gray-400 mb-1">
          {getRelativeTime(room.last_message_at)}
        </span>
        {room.unread_count > 0 && (
          <div className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {room.unread_count > 9 ? '9+' : room.unread_count}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 safe-area-top">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">채팅</h1>
            <div className="flex items-center gap-2 sm:gap-3">
              <button className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 채팅방 목록 */}
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto bg-white shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : chatRooms.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {chatRooms.map(room => (
              <ChatRoomItem key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-500 mb-2">채팅 내역이 없습니다</p>
            <p className="text-sm text-gray-400">상품에 관심을 보이면 채팅을 시작할 수 있어요</p>
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
            <button className="flex flex-col items-center py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
              <span className="text-xs text-orange-500 font-medium mt-1">채팅</span>
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