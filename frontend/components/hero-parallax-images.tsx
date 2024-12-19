"use client";

import { ParallaxScroll } from "./ui/parallax-scroll";

import bear from "@/public/parallax/bear.png";
import life from "@/public/parallax/life.png";
import wow from "@/public/parallax/wow.png";
import go from "@/public/parallax/go.png";
import cold from "@/public/parallax/cold.png";
import enjoy from "@/public/parallax/enjoy.png";
import nature from "@/public/parallax/nature.png";
import vie from "@/public/parallax/vie.png";
import snap from "@/public/parallax/snap.png";

export function HeroParallaxImages() {
  return <ParallaxScroll images={images} className="w-full" />;
}

const images = [go, wow, life, enjoy, nature, snap, bear, vie, cold];
