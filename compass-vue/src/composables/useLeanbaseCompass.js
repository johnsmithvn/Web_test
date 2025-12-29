

import { Leanbase } from '@leanbase.com/js'
// import PostHog from 'posthog-js-lite'
// import posthog from "posthog-js";
const key = '';



export function usePosthog() {
const leanbase = new Leanbase(key, {
  host: 'https://i.leanbase.co',  // Use 'host', not 'api_host'
  person_profiles: 'identified_only',  // or 'always'
  capture_pageviews: true
});
  return { leanbase };
}

// export function usePosthog() {
// const posthog = new PostHog(key, {
//   /* options, e.g. for self-hosted users */
//   host: "https://ingest-compass-25.leanflag.net"
// });
// return { posthog }
// }

// export function usePosthog() {
//   posthog.init(key, {
//     api_host: "https://ingest-compass-25.leanflag.net",
//     person_profiles: "identified_only", // hoặc "always"
//   });

//   return { posthog };
// }