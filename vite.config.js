import {defineConfig} from 'vite';

export default defineConfig({
  // 1. 배포 경로 설정
  // GitHub Pages 주소가 https://<username>.github.io/<repository>/ 형태라면 
  // base를 '/<repository>/'로 설정해야 합니다.
  base: '/', 

  build: {
    // 2. 빌드 결과물이 저장될 폴더 (기본값은 dist)
    outDir: 'dist',
  },
  server: {
    // 3. 로컬 개발 시 API 프록시 설정 (선택 사항)
    // 로컬에서 Vercel 함수를 테스트할 때 유용합니다.
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // vercel dev 실행 시 주소
        changeOrigin: true,
      },
    },
  },
});