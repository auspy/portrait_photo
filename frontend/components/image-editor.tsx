"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { ImageIcon, UploadIcon, ChevronDown, ChevronUp } from "lucide-react";
import { ColorPicker } from "./ui/color-picker";
import { useTheme } from "next-themes";
import { urlPython } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useRateLimit } from "@/providers/rate-limit-provider";
import { useUser } from "@clerk/nextjs";

// Add the utility function for Python backend communication
async function processPythonBackend(
  image: File,
  borderColor: string,
  borderSize: number,
  user: any,
  userPlan: string
) {
  const formData = new FormData();
  formData.append("image", image);
  formData.append("border_color", borderColor);
  formData.append("border_size", borderSize.toString());

  const response = await fetch(`${urlPython}/process`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${user.id}|${userPlan}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Backend processing failed: ${error}`);
  }

  return await response.blob();
}

interface ImageEditorProps {
  initialImage?: File;
}

interface BorderPreset {
  label: string;
  value: number;
}

const BORDER_PRESETS: BorderPreset[] = [
  { label: "Small", value: 4 },
  { label: "Medium", value: 12 },
  { label: "Large", value: 24 },
];

export function ImageEditor({ initialImage }: ImageEditorProps) {
  const { theme } = useTheme();
  const { user } = useUser();
  const [image, setImage] = useState<File | null>(initialImage || null);
  const [preview, setPreview] = useState<string | null>(null);
  const [borderSize, setBorderSize] = useState(4);
  const [borderColor, setBorderColor] = useState("#FFFFFF");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { isRateLimited } = useRateLimit();

  const processImage = useCallback(async () => {
    if (!image) return;

    setIsProcessing(true);
    try {
      // get user plan from metadata
      const userPlan = user?.publicMetadata?.plan || "free";
      const blob = await processPythonBackend(
        image,
        borderColor,
        borderSize,
        user,
        userPlan as string
      );
      const imageUrl = URL.createObjectURL(blob);
      setPreview(imageUrl);
      router.push(`/success?image=${encodeURIComponent(imageUrl)}`);
    } catch (error) {
      console.error("Failed to process image:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          typeof error === "string"
            ? error
            : "Failed to process image. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [image, borderColor, borderSize, router, toast]);

  const handleImageUpload = useCallback(
    (fileOrEvent: File | React.ChangeEvent<HTMLInputElement>) => {
      let file: File | null = null;

      if (fileOrEvent instanceof File) {
        file = fileOrEvent;
      } else {
        file = fileOrEvent.target.files?.[0] || null;
      }

      if (file && file.type.startsWith("image/")) {
        setImage(file);
        setPreview(URL.createObjectURL(file));
      }
    },
    []
  );

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      handleImageUpload(file);
    },
    [handleImageUpload]
  );

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6">
      {/* Left side - Image upload and preview */}
      <div className="w-full md:w-1/2 space-y-6">
        <div
          ref={dropZoneRef}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors bg-background/50 ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
        >
          <Label htmlFor="image-upload" className="block mb-2">
            {isDragging
              ? "Drop the image here"
              : "Drag & drop an image here, or click to select"}
          </Label>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={(e) =>
              e.target.files && handleImageUpload(e.target.files[0])
            }
            ref={fileInputRef}
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="mt-2"
          >
            <UploadIcon className="mr-2 h-4 w-4" />
            Select Image
          </Button>
        </div>

        {preview ? (
          <div className="mt-4 rounded-lg overflow-hidden bg-background/50 ring-1 ring-muted">
            <img src={preview} alt="Preview" className="max-w-full h-auto" />
          </div>
        ) : (
          <div className="mt-4 rounded-lg p-8 text-center bg-background/50 ring-1 ring-muted">
            <ImageIcon className="mx-auto h-12 w-12 mb-2 text-muted-foreground/70" />
            <p className="text-muted-foreground/70">No image uploaded yet</p>
          </div>
        )}
      </div>

      {/* Right side - Settings */}
      <div className="w-full md:w-1/2 space-y-6">
        <div className="space-y-3">
          <Label>Border Width</Label>
          <div className="flex gap-2">
            {BORDER_PRESETS.map((preset) => (
              <Button
                key={preset.label}
                variant={borderSize === preset.value ? "default" : "outline"}
                onClick={() => setBorderSize(preset.value)}
                className="flex-1"
              >
                {preset.label}
              </Button>
            ))}
          </div>

          <Button
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted"
          >
            <span>Custom Size</span>
            {showAdvanced ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>

          {showAdvanced && (
            <div className="pt-2 space-y-2 px-1">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Custom Width: {borderSize}px</span>
              </div>
              <Slider
                value={[borderSize]}
                onValueChange={(value) => setBorderSize(value[0])}
                min={1}
                max={200}
                step={1}
                className="my-2"
              />
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="border-color">Border Color</Label>
          <div className="flex items-center gap-2 mt-1.5">
            <ColorPicker color={borderColor} onChange={setBorderColor} />
          </div>
        </div>

        <Button
          onClick={processImage}
          disabled={!image || isProcessing || isRateLimited}
          className="w-full"
          variant="default"
        >
          {isProcessing
            ? "Processing..."
            : isRateLimited
            ? `Rate limit exceeded, please upgrade to continue`
            : "Apply Changes"}
        </Button>
      </div>
    </div>
  );
}
