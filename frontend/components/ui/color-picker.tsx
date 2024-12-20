"use client";

import { Input } from "./input";
import { Label } from "./label";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ color, onChange, className }: ColorPickerProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative">
        <Input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-10 cursor-pointer opacity-0 absolute inset-0"
          aria-label="Choose color"
        />
        <div
          className="h-10 w-10 rounded-md ring-1 ring-input bg-center"
          style={{ backgroundColor: color }}
        >
          <div
            className="w-full h-full rounded-md"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
      <Input
        type="text"
        value={color.toUpperCase()}
        onChange={(e) => {
          const value = e.target.value;
          if (value.match(/^#[0-9A-Fa-f]{0,6}$/)) {
            onChange(value);
          }
        }}
        className="h-10 font-mono uppercase bg-background"
        placeholder="#000000"
      />
    </div>
  );
}
