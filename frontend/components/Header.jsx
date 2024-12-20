"use client";
import Logo from "@/components/Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const Navigation = [
  {
    label: "Privacy Policy",
    href: "/privacy",
  },
];

export default function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b  border-border">
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="text-[10px] text-muted-foreground font-medium">
            BETA
          </span>
        </div>

        <div className="flex flex-1 items-center justify-end gap-5">
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

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
