"use client";
import React from "react";
import { LayoutGrid } from "./ui/layout-grid";

import POV from "@/public/examples/sneakers.png";
import Ride from "@/public/examples/kimono_girl.png";
import SF from "@/public/examples/smartphone.png";
import Goats from "@/public/examples/waiter.png";

export function HeroImages() {
  return (
    <div className="h-screen w-full">
      <LayoutGrid cards={cards} />
    </div>
  );
}

const SkeletonOne = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Sneakers: Product Highlight
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Make your product images stand out with clean, AI-generated outlines.
        Perfect for e-commerce and marketing materials.
      </p>
    </div>
  );
};

const SkeletonTwo = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Portrait: Enhanced Details
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Create eye-catching portraits with automatic object detection and
        customizable outline effects. Perfect for profile pictures and artistic
        shots.
      </p>
    </div>
  );
};

const SkeletonThree = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Pet Photos: Sticker Effects
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Transform your pet photos into sticker-like images with clean outlines.
        AI-powered processing ensures accurate edge detection for the perfect
        result.
      </p>
    </div>
  );
};

const SkeletonFour = () => {
  return (
    <div>
      <p className="font-bold md:text-4xl text-xl text-white">
        Tech: Professional Outlines
      </p>
      <p className="font-normal text-base text-white"></p>
      <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
        Generate professional outlines for tech product shots and designs.
        Customize colors and thickness to match your brand style.
      </p>
    </div>
  );
};

const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: "md:col-span-2",
    thumbnail: POV,
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1",
    thumbnail: Ride,
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1",
    thumbnail: Goats,
  },

  {
    id: 4,
    content: <SkeletonFour />,
    className: "md:col-span-2",
    thumbnail: SF,
  },
];
