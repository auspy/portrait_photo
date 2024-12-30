"use client";
import Logo from "@/components/Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useState } from "react";
import PayDialog from "@/components/pay-dialog";
import { useRateLimit } from "@/providers/rate-limit-provider";

const Navigation = [
  // {
  //   label: "Privacy Policy",
  //   href: "/privacy",
  // },
];

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { user, isLoaded } = useUser();
  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);
  const { remainingGenerations, isPro } = useRateLimit();

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-[10px] text-muted-foreground font-medium">
              BETA
            </span>
          </div>

          <div className="flex flex-1 items-center justify-end gap-4">
            <nav className="hidden md:flex items-center gap-5">
              {Navigation.map(({ href, label, ...props }, index) => (
                <Link
                  key={index}
                  href={href}
                  {...props}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>

            <SignedIn>
              {!isPro && remainingGenerations !== null && (
                <div className="flex items-center gap-2">
                  <div className="flex h-9 items-center gap-1.5 px-3 bg-muted rounded-md text-sm text-muted-foreground">
                    <span className="font-medium">{remainingGenerations}</span>
                    <span>generations left</span>
                  </div>
                  <Button
                    variant="default"
                    className="h-9 gap-1.5 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                    onClick={() => setIsPayDialogOpen(true)}
                  >
                    <Sparkles className="h-4 w-4" />
                    Upgrade
                  </Button>
                </div>
              )}
            </SignedIn>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 border-0"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" className="h-9">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    rootBox: "hover:opacity-80 transition-opacity",
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </header>

      {isLoaded && user && (
        <PayDialog
          userDetails={user}
          userEmail={user.emailAddresses[0]?.emailAddress || ""}
          isOpen={isPayDialogOpen}
          onClose={() => setIsPayDialogOpen(false)}
        />
      )}
    </>
  );
}
