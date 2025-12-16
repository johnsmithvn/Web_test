import posthog from "posthog-js";

export function usePosthog() {
  posthog.init("lbc_E1YoazZKW3OWxFODdwOkAK7aQnutKpG0px3c0uE4aDW", {
    api_host: "https://ingest-compass-25.leanflag.net",
    person_profiles: "identified_only", // hoặc "always"
  });

  return { posthog };
}
