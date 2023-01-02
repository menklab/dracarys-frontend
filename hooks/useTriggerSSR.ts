import { useRouter } from "next/router";

interface UseTriggerSSRHookReturn {
  triggerSSR: () => Promise<boolean>;
}

export default function useTriggerSSR(): UseTriggerSSRHookReturn {
  const router = useRouter();

  return {
    triggerSSR: async () => await router.replace(router.asPath),
  };
}
