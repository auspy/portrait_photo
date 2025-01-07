"use client";

import { ParallaxScroll } from "./ui/parallax-scroll";

import bear from "@/public/examples/can.png";
import life from "@/public/examples/girl_in_black.png";
import wow from "@/public/examples/shoe.png";
import go from "@/public/examples/smiling_girl.png";
import cold from "@/public/examples/dog.png";
import enjoy from "@/public/parallax/enjoy.png";
import nature from "@/public/parallax/nature.png";
import vie from "@/public/parallax/vie.png";
import snap from "@/public/parallax/snap.png";

export function HeroParallaxImages() {
  return <ParallaxScroll images={images} className="w-full" />;
}

const images = [go, wow, life, enjoy, nature, snap, bear, vie, cold];
