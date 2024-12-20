import { ImageEditor } from "@/components/image-editor";
import Header from "@/components/Header";
export default function EditorPage() {
  return (
    <>
      <Header />
      <div className="container mx-auto py-8">
        <ImageEditor />
      </div>
    </>
  );
}
