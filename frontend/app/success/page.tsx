"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("image");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-2xl w-full space-y-6">
        <h1 className="text-3xl font-bold text-center">
          Yay! Image Processing Complete! 🪄
        </h1>

        {imageUrl && (
          <div className="rounded-lg overflow-hidden bg-background/50 ring-1 ring-muted">
            <img
              src={imageUrl}
              alt="Processed image"
              className="max-w-full h-auto mx-auto"
            />
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground text-center">
            Your image has been successfully processed and is ready to use.
          </p>

          {imageUrl && (
            <Button
              onClick={() => {
                // Create a download link for the blob URL
                fetch(imageUrl)
                  .then((res) => res.blob())
                  .then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "processed-image.png";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                  });
              }}
              variant="outline"
            >
              Download Image
            </Button>
          )}

          <Link href="/app">
            <Button variant="default">Process Another Image</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
