/** @type {import('next').NextConfig} */
const nextConfig = {
  // 성능 최적화 설정
  poweredByHeader: false, // X-Powered-By 헤더 제거
  compress: true, // gzip 압축 활성화
  
  // 실험적 기능 (성능 향상)
  experimental: {
    // App Router 최적화
    optimizePackageImports: ['react', 'react-dom'],
  },
  
  // 이미지 최적화
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // 빌드 최적화
  swcMinify: true, // SWC 미니파이어 사용
  
  // 정적 최적화
  trailingSlash: false,
  
  // 보안 헤더
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
