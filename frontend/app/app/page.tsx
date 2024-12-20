import { ImageEditor } from "@/components/image-editor";
import Header from "@/components/Header";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function EditorPage() {
  return (
    <>
      <Header />
      <div className="container mx-auto py-8 relative">
        <SignedOut>
          <div className="absolute inset-0 backdrop-blur-[2px] bg-background/80 z-10 flex flex-col items-center justify-center gap-4">
            <div className="text-center space-y-4 max-w-lg mx-auto px-4">
              <h2 className="text-2xl font-bold text-foreground">
                Sign in to start editing
              </h2>
              <p className="text-muted-foreground">
                Create an account or sign in to access the image editor and
                start creating beautiful outlined pictures.
              </p>
              <SignInButton mode="modal">
                <Button size="lg" className="font-semibold">
                  Sign in to continue
                </Button>
              </SignInButton>
            </div>
          </div>
        </SignedOut>

        <ImageEditor />
      </div>
    </>
  );
}
