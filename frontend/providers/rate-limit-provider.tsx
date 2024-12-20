import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
  ReactNode,
} from "react";
import { useUser } from "@clerk/nextjs";
import { urlPython } from "@/constants";

interface RateLimitState {
  remainingGenerations: number | null;
  isRateLimited: boolean;
  isPro: boolean;
}

interface RateLimitContextType extends RateLimitState {
  refresh: () => Promise<void>;
  updateFromError: (errorData: any) => void;
}

const RateLimitContext = createContext<RateLimitContextType | null>(null);

const RATE_LIMIT_CACHE_KEY = "rate_limit_data";
const CACHE_DURATION = 30 * 1000; // 30 seconds

function getRateLimitCache() {
  try {
    const cached = localStorage.getItem(RATE_LIMIT_CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
  } catch (error) {
    console.error("Failed to get rate limit cache:", error);
  }
  return null;
}

function setRateLimitCache(data: RateLimitState) {
  try {
    localStorage.setItem(
      RATE_LIMIT_CACHE_KEY,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error("Failed to set rate limit cache:", error);
  }
}

export function RateLimitProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [state, setState] = useState<RateLimitState>({
    remainingGenerations: null,
    isRateLimited: false,
    isPro: false,
  });

  const refresh = useCallback(async () => {
    if (!user) return;

    try {
      const url = `${urlPython}/rate-limit`;
      const plan = user.publicMetadata?.plan || "free";
      console.log("url", url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.id}|${plan}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const isPro = plan === "pro";

        const newState: RateLimitState = {
          remainingGenerations: isPro ? Infinity : data.remaining,
          isRateLimited: !isPro && data.remaining === 0,
          isPro,
        };

        setState(newState);
        setRateLimitCache(newState);
      }
    } catch (error) {
      console.error("Failed to refresh rate limit info:", error);
    }
  }, [user]);

  const updateFromError = useCallback(
    (errorData: any) => {
      if (errorData.metadata) {
        const newState: RateLimitState = {
          remainingGenerations: errorData.metadata.remaining,
          isRateLimited: true,
          isPro: user?.publicMetadata?.plan === "pro" || false,
        };
        setState(newState);
        setRateLimitCache(newState);
      }
    },
    [user?.publicMetadata?.plan]
  );

  useEffect(() => {
    if (user) {
      // Check cache first
      const cachedData = getRateLimitCache();
      if (cachedData) {
        setState(cachedData);
      }

      // Initial fetch
      refresh();

      // Set up polling
      const interval = setInterval(refresh, CACHE_DURATION);
      return () => clearInterval(interval);
    }
  }, [user, refresh]);

  return (
    <RateLimitContext.Provider
      value={{
        ...state,
        refresh,
        updateFromError,
      }}
    >
      {children}
    </RateLimitContext.Provider>
  );
}

export function useRateLimit() {
  const context = useContext(RateLimitContext);
  if (!context) {
    throw new Error("useRateLimit must be used within a RateLimitProvider");
  }
  return context;
}
