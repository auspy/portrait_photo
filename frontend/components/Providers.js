"use client";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { RateLimitProvider } from "@/providers/rate-limit-provider";
const Providers = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <RateLimitProvider>
        {children}
        <Toaster />
      </RateLimitProvider>
    </ThemeProvider>
  );
};

export default Providers;
