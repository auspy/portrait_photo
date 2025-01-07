"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { HeroImages } from "@/components/hero-images";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { AdditionalInfo } from "@/components/additional-info";
import Link from "next/link";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { HeroParallaxImages } from "@/components/hero-parallax-images";
import SiteFooter from "../components/SiteFooter";

const page = () => {
  return (
    <div className="flex flex-col min-h-screen items-center w-full">
      <HeroHighlight>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [20, -5, 0] }}
          transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
          className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-bold text-foreground"
        >
          Create{" "}
          <Highlight className="text-background">outlined pictures</Highlight>{" "}
          in seconds
        </motion.h1>
      </HeroHighlight>

      <div className="text-lg text-center font-semibold mb-4 text-foreground/80">
        Make your images stand out with automatic outline generation
      </div>

      <SignedIn>
        <Link href="/app" className="mb-10">
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="bg-background text-foreground flex items-center space-x-2"
          >
            Outline your picture <ArrowRightIcon className="w-4 h-4 ml-2" />
          </HoverBorderGradient>
        </Link>
      </SignedIn>

      <SignedOut>
        <SignInButton mode="modal">
          <HoverBorderGradient
            containerClassName="rounded-full mb-10"
            as="button"
            className="bg-background text-foreground flex items-center space-x-2"
          >
            Get Started <ArrowRightIcon className="w-4 h-4 ml-2" />
          </HoverBorderGradient>
        </SignInButton>
      </SignedOut>

      <div className="w-full h-full mt-2">
        <HeroImages />
      </div>
      <div className="w-full h-full">
        <HeroParallaxImages />
      </div>
      <div className="flex flex-col items-center justify-center my-10">
        <AdditionalInfo />
        <div className="text-2xl mt-10 text-foreground">
          2024 @{" "}
          <Link
            href={"https://www.kshetezvinayak.com/projects"}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:font-bold"
          >
            kshetezvinayak.com
          </Link>{" "}
          - All Rights Reserved - Created by Kshetez Vinayak
        </div>
        <div className="text-center text-muted-foreground text-xs mt-2">
          Follow me on{" "}
          <Link
            href={"https://twitter.com/kshetezvinayak"}
            target="_blank"
            className="hover:text-foreground underline"
            rel="noopener noreferrer"
          >
            Twitter
          </Link>
          {" • "}
          Landing page forked from{" "}
          <Link
            href={"https://github.com/RexanWONG/text-behind-image"}
            target="_blank"
            className="hover:text-foreground underline"
            rel="noopener noreferrer"
          >
            here
          </Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
};

export default page;
