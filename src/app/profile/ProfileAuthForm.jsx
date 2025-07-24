'use client';
import React from 'react';

export default function ProfileAuthForm({
  authMode,
  formData,
  setFormData,
  loading,
  handleAuth,
  authError,
  setAuthMode,
  setAuthError,
  setShowAuthModal
}) {
  return (
    <div>
      {authError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
          {authError}
        </div>
      )}
      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
          <input
            type="email"
            value={formData.email}
            onChange={e => setFormData(f => ({ ...f, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
          <input
            type="password"
            value={formData.password}
            onChange={e => setFormData(f => ({ ...f, password: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
            autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
          />
        </div>
        {authMode === 'signup' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
              <input
                type="text"
                value={formData.nickname}
                onChange={e => setFormData(f => ({ ...f, nickname: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
                autoComplete="nickname"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={e => setFormData(f => ({ ...f, fullName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
                autoComplete="name"
              />
            </div>
          </>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-400"
        >
          {loading ? '처리중...' : (authMode === 'login' ? '로그인' : '회원가입')}
        </button>
      </form>
      <button
        onClick={() => {
          setAuthMode(authMode === 'login' ? 'signup' : 'login');
          setAuthError('');
          setShowAuthModal(true);
        }}
        className="text-orange-500 hover:text-orange-600 text-sm mt-2"
      >
        {authMode === 'login' ? '회원가입하기' : '로그인하기'}
      </button>
    </div>
  );
} 