/**
 * 현재 브라우저가 인앱 브라우저(카카오톡, 인스타그램 등)인지 확인합니다.
 * 구글 로그인은 인앱 브라우저에서 차단되기 때문에 안내가 필요합니다.
 */
export const isInAppBrowser = () => {
  const ua = navigator.userAgent.toLowerCase();
  
  const inAppBrowsers = [
    'kakaotalk',
    'instagram',
    'fb_iab', // Facebook In-App Browser
    'fbav',   // Facebook App
    'line',
    'naver',  // 네이버 앱 (필요에 따라 포함)
    'everytimeapp'
  ];

  return inAppBrowsers.some(browser => ua.includes(browser));
};
