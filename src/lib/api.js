import { supabase } from './supabase'

// 제품 관련 API 함수들
export const productAPI = {
  // 모든 제품 조회
  async getAllProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('제품 조회 오류:', error)
      return { data: null, error }
    }
  },

  // 특정 제품 조회
  async getProductById(id) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('제품 상세 조회 오류:', error)
      return { data: null, error }
    }
  },

  // 새 제품 등록
  async createProduct(productData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('제품 등록 오류:', error)
      return { data: null, error }
    }
  },

  // 제품 수정
  async updateProduct(id, updates) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('제품 수정 오류:', error)
      return { data: null, error }
    }
  },

  // 제품 삭제
  async deleteProduct(id) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('제품 삭제 오류:', error)
      return { error }
    }
  },

  // 제품 검색
  async searchProducts(query) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('제품 검색 오류:', error)
      return { data: null, error }
    }
  }
}

// 사용자 관련 API 함수들
export const userAPI = {
  // 현재 사용자 정보 조회
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return { data: user, error: null }
    } catch (error) {
      console.error('사용자 정보 조회 오류:', error)
      return { data: null, error }
    }
  },

  // 로그인
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('로그인 오류:', error)
      return { data: null, error }
    }
  },

  // 회원가입
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('회원가입 오류:', error)
      return { data: null, error }
    }
  },

  // 로그아웃
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('로그아웃 오류:', error)
      return { error }
    }
  },

  // 사용자 프로필 조회
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('사용자 프로필 조회 오류:', error)
      return { data: null, error }
    }
  },

  // 사용자 프로필 업데이트
  async updateUserProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update(profileData)
        .eq('id', userId)
        .select()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('사용자 프로필 업데이트 오류:', error)
      return { data: null, error }
    }
  }
}

// 채팅 관련 API 함수들
export const chatAPI = {
  // 채팅방 목록 조회
  async getChatRooms() {
    try {
      const { data, error } = await supabase
        .from('chat_rooms')
        .select(`
          *,
          product:products(id, title, price, image_data, status),
          buyer:buyer_id(nickname, avatar_url, manner_temperature),
          seller:seller_id(nickname, avatar_url, manner_temperature)
        `)
        .eq('is_active', true)
        .order('last_message_at', { ascending: false })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('채팅방 목록 조회 오류:', error)
      return { data: null, error }
    }
  },

  // 특정 채팅방의 메시지 조회
  async getChatMessages(chatRoomId, limit = 50, offset = 0) {
    try {
      const { data: chatRoom, error: roomError } = await supabase
        .from('chat_rooms')
        .select('product_id, buyer_id, seller_id')
        .eq('id', chatRoomId)
        .single()
      
      if (roomError) throw roomError

      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          sender:sender_id(nickname, avatar_url),
          receiver:receiver_id(nickname, avatar_url)
        `)
        .eq('product_id', chatRoom.product_id)
        .or(`and(sender_id.eq.${chatRoom.buyer_id},receiver_id.eq.${chatRoom.seller_id}),and(sender_id.eq.${chatRoom.seller_id},receiver_id.eq.${chatRoom.buyer_id})`)
        .order('created_at', { ascending: true })
        .range(offset, offset + limit - 1)
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('채팅 메시지 조회 오류:', error)
      return { data: null, error }
    }
  },

  // 특정 상품의 채팅방 조회 또는 생성
  async getOrCreateChatRoom(productId, buyerId) {
    try {
      // 기존 채팅방 확인
      const { data: existingRoom, error: findError } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('product_id', productId)
        .eq('buyer_id', buyerId)
        .single()
      
      if (existingRoom && !findError) {
        return { data: existingRoom, error: null }
      }

      // 상품 정보 조회 (판매자 ID 확인)
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('user_id')
        .eq('id', productId)
        .single()
      
      if (productError) throw productError

      // 새 채팅방 생성
      const { data: newRoom, error: createError } = await supabase
        .from('chat_rooms')
        .insert([{
          product_id: productId,
          buyer_id: buyerId,
          seller_id: product.user_id
        }])
        .select()
        .single()
      
      if (createError) throw createError
      return { data: newRoom, error: null }
    } catch (error) {
      console.error('채팅방 조회/생성 오류:', error)
      return { data: null, error }
    }
  },

  // 메시지 전송
  async sendMessage(productId, receiverId, message, messageType = 'text') {
    try {
      const { data, error } = await supabase
        .from('chats')
        .insert([{
          product_id: productId,
          receiver_id: receiverId,
          message: message,
          message_type: messageType
        }])
        .select(`
          *,
          sender:sender_id(nickname, avatar_url),
          receiver:receiver_id(nickname, avatar_url)
        `)
        .single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('메시지 전송 오류:', error)
      return { data: null, error }
    }
  },

  // 메시지 읽음 처리
  async markMessagesAsRead(chatRoomId) {
    try {
      const { data: currentUser } = await supabase.auth.getUser()
      if (!currentUser.user) throw new Error('인증되지 않은 사용자')

      const { data: chatRoom, error: roomError } = await supabase
        .from('chat_rooms')
        .select('product_id, buyer_id, seller_id')
        .eq('id', chatRoomId)
        .single()
      
      if (roomError) throw roomError

      // 받은 메시지들을 읽음 처리
      const { error: updateError } = await supabase
        .from('chats')
        .update({ is_read: true })
        .eq('product_id', chatRoom.product_id)
        .eq('receiver_id', currentUser.user.id)
        .eq('is_read', false)
      
      if (updateError) throw updateError

      // 채팅방의 읽지 않은 메시지 카운트 리셋
      const isBuyer = chatRoom.buyer_id === currentUser.user.id
      const updateField = isBuyer ? 'unread_count_buyer' : 'unread_count_seller'
      
      const { error: roomUpdateError } = await supabase
        .from('chat_rooms')
        .update({ [updateField]: 0 })
        .eq('id', chatRoomId)
      
      if (roomUpdateError) throw roomUpdateError
      return { error: null }
    } catch (error) {
      console.error('메시지 읽음 처리 오류:', error)
      return { error }
    }
  },

  // 실시간 채팅 구독 (채팅방별)
  subscribeToChatRoom(chatRoomId, onMessage) {
    return supabase
      .channel(`chat_room_${chatRoomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chats',
        filter: `product_id=eq.${chatRoomId}`
      }, onMessage)
      .subscribe()
  },

  // 실시간 채팅방 목록 구독
  subscribeToChatRooms(userId, onUpdate) {
    return supabase
      .channel('chat_rooms')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'chat_rooms',
        filter: `or(buyer_id=eq.${userId},seller_id=eq.${userId})`
      }, onUpdate)
      .subscribe()
  }
} 