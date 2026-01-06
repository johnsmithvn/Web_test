// 1. Import SDK
import { Leanbase } from '@leanbase.com/js'
// import PostHog from 'posthog-js-lite'

// Hàm log ra màn hình để bạn dễ nhìn
function logToScreen(msg) {
  const logDiv = document.getElementById('logs');
  const time = new Date().toLocaleTimeString();
  logDiv.innerHTML += `<div>[${time}] ${msg}</div>`;
  logDiv.scrollTop = logDiv.scrollHeight;
  console.log(`[App Log] ${msg}`);
}

// 2. Initialize (Khởi tạo)
// Import từ environment variables
const API_KEY = import.meta.env.VITE_API_KEY;
const HOST_URL = import.meta.env.VITE_HOST_URL;

logToScreen('Đang khởi tạo SDK...');

let leanbase;
try {
  leanbase = new Leanbase(API_KEY, {
    host: HOST_URL,
    person_profiles: 'identified_only', // Hoặc 'always' tùy cấu hình bạn muốn test
    // Bật debug mode nếu SDK có hỗ trợ (thường PostHog clones có flag này)
    debug: true ,
    capture_pageview: true, // Tự động ghi nhận pageview
    
  });

//  leanbase = new PostHog(API_KEY, {
// //   /* options, e.g. for self-hosted users */
//   host: HOST_URL,person_profiles: 'identified_only', debug: true
// });
  console.log('Leanbase instance:', leanbase);
  console.log('Capture method exists?', typeof leanbase.capture === 'function');
  logToScreen('SDK Initialized thành công!');
} catch (error) {
  console.error('Full error:', error);
  logToScreen('Lỗi khởi tạo SDK: ' + error.message);
}

// ---------------------------------------------------------
// 3. Xử lý logic Test
// ---------------------------------------------------------

// A. Test Identify
document.getElementById('btnIdentify').addEventListener('click', () => {
  const userId = document.getElementById('userIdInput').value;
  if (userId && leanbase) {
    // Giả lập gửi thông tin user
    leanbase.identify(userId, {
      email: `${userId}@example.com`,
      plan: 'premium',
      created_at: new Date().toISOString()
    });
    logToScreen(`Đã gọi identify('${userId}')`);
  }
});

// Reset (Thường là gọi reset để xóa user session cũ)
document.getElementById('btnReset').addEventListener('click', () => {
  if (leanbase) {
    leanbase.reset(); 
    logToScreen('Đã gọi reset() - User đăng xuất');
  }
});

// B. Test Autocapture
// SDK giống PostHog thường tự động bind click event vào body. 
// Bạn chỉ cần click, không cần code thêm gì ở đây.
// Tuy nhiên, ta log ra để biết user đã click.
document.getElementById('btnBuy').addEventListener('click', () => {
  logToScreen('User clicked "Mua Hàng" - Chờ SDK autocapture...');
});

// C. Test Custom Event
document.getElementById('btnCustomEvent').addEventListener('click', () => {
  if (leanbase) {
    leanbase.capture('test_simple_event', {
      source: 'test_page',
      status: 'success'
    });
    logToScreen('Đã bắn event: test_simple_event');
  }
});

document.getElementById('btnComplexEvent').addEventListener('click', () => {
  if (leanbase) {
    leanbase.capture('test_complex_event', {
      cart_value: 1500000,
      items: ['item1', 'item2'],
      metadata: {
        browser: navigator.userAgent,
        screen: `${window.screen.width}x${window.screen.height}`
      }
    });
    logToScreen('Đã bắn event: test_complex_event (kèm properties)');
  }
});