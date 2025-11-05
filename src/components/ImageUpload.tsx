import { useCallback, useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ImageUploadProps {
  // store both url & path if you can; but keeping the external API the same:
  images: string[];                       // array of public URLs you're showing
  onImagesChange: (images: string[]) => void;
}

const BUCKET_ID = "properties";           // <-- make this EXACTLY your bucket id
const MAX_MB = 8;

export const ImageUpload = ({ images, onImagesChange }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  async function uploadImage(file: File) {
    // guards
    if (!file.type.startsWith("image/")) throw new Error("Only images allowed");
    if (file.size > MAX_MB * 1024 * 1024) throw new Error(`Max ${MAX_MB}MB`);

    // must be signed in for RLS to allow write
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not signed in");

    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    // prefix with user id to satisfy policies like: name LIKE auth.uid() || '/%'
    const key = `${user.id}/${crypto.randomUUID()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from(BUCKET_ID)
      .upload(key, file, { upsert: true, contentType: file.type });
    if (upErr) throw upErr;

    const { data } = supabase.storage.from(BUCKET_ID).getPublicUrl(key);
    return { url: data.publicUrl, path: key };
  }

  async function handleFiles(files: FileList) {
    setUploading(true);
    try {
      const results = await Promise.all(Array.from(files).map(uploadImage));
      // we only keep URLs in the component’s state contract
      const urls = results.map(r => r.url);
      onImagesChange([...images, ...urls]);
      toast.success(`${urls.length} image(s) uploaded`);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to upload images");
    } finally {
      setUploading(false);
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  }, [images]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  // convert a public URL -> storage path so we can delete the object
  function urlToPath(publicUrl: string) {
    const marker = `/storage/v1/object/public/${BUCKET_ID}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return null;
    return publicUrl.slice(idx + marker.length); // e.g. "<userId>/uuid.jpg"
  }

  async function removeImage(index: number) {
    const url = images[index];
    const path = urlToPath(url);
    if (!path) {
      // fallback: just remove from UI
      onImagesChange(images.filter((_, i) => i !== index));
      return;
    }

    // delete from storage first
    const { error } = await supabase.storage.from(BUCKET_ID).remove([path]);
    if (error) {
      toast.error(error.message || "Failed to delete image");
      return;
    }

    // then update UI state
    onImagesChange(images.filter((_, i) => i !== index));
    toast.success("Image deleted");
  }

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop images here, or click to select
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
          id="file-upload"
          disabled={uploading}
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          {uploading ? "Uploading..." : "Select Images"}
        </Button>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={url} className="relative group">
              <img src={url} alt="" className="w-full h-32 object-cover rounded-lg" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
