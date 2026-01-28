import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Check, Move } from "lucide-react";

interface ImagePositionEditorProps {
  imageUrl: string;
  altText: string;
  currentPosition: string;
  onSave: (position: string) => void;
  onCancel: () => void;
}

const parsePosition = (position: string): { x: number; y: number } => {
  // Parse CSS object-position values to percentages
  const positionMap: Record<string, { x: number; y: number }> = {
    "top": { x: 50, y: 0 },
    "center": { x: 50, y: 50 },
    "bottom": { x: 50, y: 100 },
    "left top": { x: 0, y: 0 },
    "right top": { x: 100, y: 0 },
    "left center": { x: 0, y: 50 },
    "right center": { x: 100, y: 50 },
  };

  if (positionMap[position]) {
    return positionMap[position];
  }

  // Try to parse percentage values like "25% 75%"
  const match = position.match(/(\d+)%?\s*(\d+)%?/);
  if (match) {
    return { x: parseInt(match[1]), y: parseInt(match[2]) };
  }

  return { x: 50, y: 0 }; // Default to top center
};

const ImagePositionEditor = ({
  imageUrl,
  altText,
  currentPosition,
  onSave,
  onCancel,
}: ImagePositionEditorProps) => {
  const [position, setPosition] = useState(() => parsePosition(currentPosition));
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));

    setPosition({ x: Math.round(x), y: Math.round(y) });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updatePosition(e.clientX, e.clientY);
  }, [updatePosition]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX, e.clientY);
  }, [isDragging, updatePosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    updatePosition(touch.clientX, touch.clientY);
  }, [updatePosition]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    updatePosition(touch.clientX, touch.clientY);
  }, [isDragging, updatePosition]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  const handleSave = () => {
    onSave(`${position.x}% ${position.y}%`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Adjust Image Position</h3>
            <p className="text-sm text-muted-foreground">
              Click or drag to set the focal point. This determines what stays visible when the image is cropped.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* Preview container showing how the image will be cropped */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Full image with focal point selector */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Set Focal Point</p>
              <div
                ref={containerRef}
                className="relative aspect-video bg-muted rounded-lg overflow-hidden cursor-crosshair select-none"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              >
                <img
                  src={imageUrl}
                  alt={altText}
                  className="w-full h-full object-contain pointer-events-none"
                  draggable={false}
                />
                {/* Focal point indicator */}
                <div
                  className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ left: `${position.x}%`, top: `${position.y}%` }}
                >
                  <div className="absolute inset-0 rounded-full border-2 border-white shadow-lg" />
                  <div className="absolute inset-2 rounded-full bg-primary/80" />
                  <Move className="absolute inset-0 m-auto h-3 w-3 text-white" />
                </div>
                {/* Crosshair lines */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-white/50 pointer-events-none"
                  style={{ left: `${position.x}%` }}
                />
                <div
                  className="absolute left-0 right-0 h-px bg-white/50 pointer-events-none"
                  style={{ top: `${position.y}%` }}
                />
              </div>
            </div>

            {/* Preview of how it will look cropped */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Preview (Desktop View)</p>
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt={altText}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: `${position.x}% ${position.y}%` }}
                />
              </div>
            </div>
          </div>

          {/* Position display */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Position: <span className="font-mono text-foreground">{position.x}% {position.y}%</span>
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setPosition({ x: 50, y: 0 })}>
                Top
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPosition({ x: 50, y: 50 })}>
                Center
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPosition({ x: 50, y: 100 })}>
                Bottom
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Check className="h-4 w-4 mr-2" />
            Save Position
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImagePositionEditor;
