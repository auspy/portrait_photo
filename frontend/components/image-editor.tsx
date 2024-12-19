"use client";

import { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { ColorPicker } from "./ui/color-picker";

interface ImageEditorProps {
  initialImage?: File;
}

export function ImageEditor({ initialImage }: ImageEditorProps) {
  const [image, setImage] = useState<File | null>(initialImage || null);
  const [preview, setPreview] = useState<string | null>(null);
  const [borderSize, setBorderSize] = useState(1);
  const [borderColor, setBorderColor] = useState("#FFFFFF");
  const [isProcessing, setIsProcessing] = useState(false);

  const processImage = useCallback(async () => {
    if (!image) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("border_color", borderColor);
      formData.append("border_size", borderSize.toString());

      const response = await fetch("http://localhost:8000/process", {
        method: "POST",
        body: formData,
      });

      const blob = await response.blob();
      setPreview(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Failed to process image:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [image, borderColor, borderSize]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex gap-8 p-6">
      {/* Preview Area */}
      <div className="flex-1">
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className="max-w-full h-auto rounded-lg shadow-lg"
          />
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            Upload an image to start
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="w-72 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Border Width</label>
          <Slider
            value={[borderSize]}
            onValueChange={(value) => setBorderSize(value[0])}
            min={1}
            max={100}
            step={1}
          />
          <span className="text-sm text-gray-500">{borderSize}px</span>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Border Color</label>
          <ColorPicker color={borderColor} onChange={setBorderColor} />
        </div>

        <Button
          onClick={processImage}
          disabled={!image || isProcessing}
          className="w-full"
        >
          {isProcessing ? "Processing..." : "Apply Changes"}
        </Button>
      </div>
    </div>
  );
}
