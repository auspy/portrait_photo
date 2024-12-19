import { ImageEditor } from "@/components/image-editor";

export default function EditorPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Image Border Editor</h1>
      <ImageEditor />
    </div>
  );
}
