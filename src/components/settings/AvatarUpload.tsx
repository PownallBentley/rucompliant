import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import AppIcon from "@/components/ui/AppIcon";

interface AvatarUploadProps {
  currentUrl?: string | null;
  initials: string;
  onUpload: (file: File) => Promise<void>;
  className?: string;
}

export default function AvatarUpload({
  currentUrl,
  initials,
  onUpload,
  className,
}: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showEditor, setShowEditor] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const displayUrl = preview || currentUrl;

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setSelectedFile(file);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setShowEditor(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      await onUpload(selectedFile);
      setShowEditor(false);
    } catch {
      // Error handled by parent
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setShowEditor(false);
    setPreview(null);
    setSelectedFile(null);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  }, [position]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {showEditor ? (
        <div className="flex flex-col items-center gap-4">
          {/* Preview with crop */}
          <div
            className="w-32 h-32 rounded-full overflow-hidden border-2 border-border cursor-move relative"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={preview || ""}
              alt="Preview"
              className="w-full h-full object-cover select-none pointer-events-none"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              }}
              draggable={false}
            />
          </div>

          {/* Zoom slider */}
          <div className="flex items-center gap-3 w-48">
            <AppIcon name="minimize" className="w-3 h-3 text-muted-foreground" />
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-primary"
            />
            <AppIcon name="maximize" className="w-3 h-3 text-muted-foreground" />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-surface transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={uploading}
              className="px-4 py-2 text-sm font-bold text-white bg-magenta rounded-lg hover:bg-magenta-600 transition-colors disabled:opacity-50"
            >
              {uploading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Avatar display */}
          <div
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center border-2 transition-colors cursor-pointer overflow-hidden",
              dragOver ? "border-primary bg-primary/5" : "border-border",
            )}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {displayUrl ? (
              <img src={displayUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-primary uppercase">{initials}</span>
            )}
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-sm font-semibold text-primary hover:underline"
          >
            {displayUrl ? "Change photo" : "Upload photo"}
          </button>
        </>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}
