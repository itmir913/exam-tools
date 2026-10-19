/** 세 쪽(랜딩·지필평가 배점 생성기·선택지 정렬기)이 한 설정을 함께 쓴다.
 *  두 도구는 같은 양식(남색 머리글 + 흰 칸 + 얇은 괘선)이라 색 이름도 같다.
 *  CDN tailwind를 쓸 때 각 index.html에 적어 두었던 설정을 그대로 옮긴 것이다. */
export default {
  content: [
    './index.html',
    './create-points/**/*.{html,js}',
    './choice-order/**/*.{html,js}',
  ],
  // 랜딩은 html[data-theme="dark"]로 밤 하늘을 켠다
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        wash: '#F4F5F7', ink: '#1D2B3A', muted: '#5E6B73',
        rule: '#CDD6D1', 'rule-strong': '#8FA39A', seal: '#C2352B',
        head: '#2B4560', 'head-soft': '#E6EDF4',
        hi:   { fg: '#A3271F', bg: '#F7E1DE' },
        mid:  { fg: '#34488A', bg: '#E5E9F6' },
        lo:   { fg: '#2E6A4F', bg: '#E2EFE7' },
        warn: { fg: '#8A5300', bg: '#F8ECD3' },
      },
      fontFamily: {
        sans: ['"Pretendard Variable"', 'Pretendard', 'system-ui', 'sans-serif'],
      },
    },
  },
};
