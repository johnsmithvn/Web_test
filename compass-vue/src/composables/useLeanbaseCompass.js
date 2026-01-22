


// import { Leanbase } from '@leanbase.com/js'
// // import PostHog from 'posthog-js-lite'
// // import posthog from "posthog-js";
// const key = 'lbc_qyZZjvTGm9O4OuI7h8hGdMhunrEkz4cYZ3VOL8iLDUE';

// // Global event logger callback
// let eventLoggerCallback = null;

// export function setEventLogger(callback) {
//   eventLoggerCallback = callback;
// }

// export function usePosthog() {
//   const leanbase = new Leanbase(key, {
//     host: 'https://i.leanbase.co',  // Use 'host', not 'api_host'
//     person_profiles: 'identified_only',  // or 'always'
//     capture_pageviews: true
//   });

//   // Wrap the capture method to log events
//   const originalCapture = leanbase.capture.bind(leanbase);
//   leanbase.capture = function(eventName, properties, options) {
//     // Call the original capture
//     const result = originalCapture(eventName, properties, options);
    
//     // Log to our event logger
//     if (eventLoggerCallback) {
//       eventLoggerCallback(eventName, properties);
//     }
    
//     return result;
//   };

//   return { posthog: leanbase };
// }

// // export function usePosthog() {
// // const posthog = new PostHog(key, {
// //   /* options, e.g. for self-hosted users */
// //   host: "https://ingest-compass-25.leanflag.net"
// // });
// // return { posthog }
// // }

// // export function usePosthog() {
// //   posthog.init(key, {
// //     api_host: "https://ingest-compass-25.leanflag.net",
// //     person_profiles: "identified_only", // hoặc "always"
// //   });

// //   return { posthog };
// // }

// #########################

// Global event logger callback
let eventLoggerCallback = null;

export function setEventLogger(callback) {
  eventLoggerCallback = callback;
}

export function usePosthog() {
  // Use the global posthog from window
  const posthog = window.posthog;

  if (!posthog) {
    console.error('PostHog not initialized');
    return { posthog: null };
  }

  // Wrap the capture method to log events
  const originalCapture = posthog.capture.bind(posthog);
  posthog.capture = function(eventName, properties, options) {
    // Log to our event logger first
    if (eventLoggerCallback) {
      eventLoggerCallback(eventName, properties);
    }
    
    // Call the original capture
    return originalCapture(eventName, properties, options);
  };

  return { posthog };
}