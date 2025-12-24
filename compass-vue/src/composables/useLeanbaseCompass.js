

// import posthog from "posthog-js";

// export function usePosthog() {
//   posthog.init("lbc_k91rsdLJUWyqxCsXK9gecFkK2VPWBc4ZrbBhlDilbB0", {
//     api_host: "https://ingest-compass-25.leanflag.net",
//     person_profiles: "identified_only", // hoặc "always"
//   });

//   return { posthog };
// }
import { Leanbase } from '@leanbase.com/js'
export function usePosthog() {
const leanbase = new Leanbase('lbc_k91rsdLJUWyqxCsXK9gecFkK2VPWBc4ZrbBhlDilbB0', {
  host: 'https://ingest-compass-25.leanflag.net',  // Use 'host', not 'api_host'
  person_profiles: 'identified_only'  // or 'always'
});
  return { leanbase };
}
// import PostHog from 'posthog-js-lite'
// export function usePosthog() {
// const posthog = new PostHog('lbc_k91rsdLJUWyqxCsXK9gecFkK2VPWBc4ZrbBhlDilbB0', {
//   /* options, e.g. for self-hosted users */
//   host: "https://ingest-compass-25.leanflag.net"
// });
// return { posthog }
// }