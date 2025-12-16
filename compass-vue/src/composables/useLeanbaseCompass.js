import posthog from "posthog-js";

export function usePosthog() {
  posthog.init("lbc_domZKKA5YmxwkUjGLmoSPvKowxgtQzRBimT6TkFLAk5", {
    api_host: "https://ingest-compass-25.leanflag.net",
    person_profiles: "identified_only", // hoặc "always"
  });

  return { posthog };
}
