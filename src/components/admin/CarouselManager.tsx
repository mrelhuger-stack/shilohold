import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Trash2, GripVertical, Plus, Image as ImageIcon, Move } from "lucide-react";
import ImagePositionEditor from "./ImagePositionEditor";

interface CarouselImage {
  id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_active: boolean;
  image_position: string;
}

const CarouselManager = () => {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [newAltText, setNewAltText] = useState("");
  const [editingImage, setEditingImage] = useState<CarouselImage | null>(null);
  const { toast } = useToast();

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from("carousel_images")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load carousel images",
        variant: "destructive",
      });
    } else {
      setImages(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image under 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Not authenticated",
          description: "Please sign in to upload images",
          variant: "destructive",
        });
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `carousel-${Date.now()}.${fileExt}`;
      const filePath = `carousel/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      const maxOrder = images.length > 0 
        ? Math.max(...images.map(img => img.display_order)) 
        : -1;

      const { error: insertError } = await supabase
        .from("carousel_images")
        .insert({
          image_url: urlData.publicUrl,
          alt_text: newAltText || "Carousel image",
          display_order: maxOrder + 1,
          is_active: true,
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });

      setNewAltText("");
      fetchImages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split("/images/");
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from("images").remove([filePath]);
      }

      const { error } = await supabase
        .from("carousel_images")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image deleted successfully",
      });

      fetchImages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const currentIndex = images.findIndex((img) => img.id === id);
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === images.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const currentImage = images[currentIndex];
    const swapImage = images[newIndex];

    try {
      await Promise.all([
        supabase
          .from("carousel_images")
          .update({ display_order: swapImage.display_order })
          .eq("id", currentImage.id),
        supabase
          .from("carousel_images")
          .update({ display_order: currentImage.display_order })
          .eq("id", swapImage.id),
      ]);

      fetchImages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reorder images",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("carousel_images")
        .update({ is_active: !isActive })
        .eq("id", id);

      if (error) throw error;

      fetchImages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update image",
        variant: "destructive",
      });
    }
  };

  const handlePositionChange = async (id: string, position: string) => {
    try {
      const { error } = await supabase
        .from("carousel_images")
        .update({ image_position: position })
        .eq("id", id);

      if (error) throw error;

      fetchImages();
      toast({
        title: "Success",
        description: "Image position updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update position",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Loading images...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Carousel Image
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Recommended: 1920x1080 pixels (16:9 aspect ratio), JPG or WebP format, under 500KB.
            Keep primary subjects centered-bottom.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="alt-text">Alt Text (Description)</Label>
              <Input
                id="alt-text"
                placeholder="e.g., Church family fellowship"
                value={newAltText}
                onChange={(e) => setNewAltText(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file-upload">Image File</Label>
              <div className="flex gap-2">
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
          {isUploading && (
            <p className="text-sm text-primary">Uploading image...</p>
          )}
        </CardContent>
      </Card>

      {/* Images List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Current Carousel Images ({images.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No carousel images yet. Upload your first image above.
            </p>
          ) : (
            <div className="space-y-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    image.is_active ? "bg-card" : "bg-muted opacity-60"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReorder(image.id, "up")}
                      disabled={index === 0}
                      className="h-6 w-6 p-0"
                    >
                      ▲
                    </Button>
                    <GripVertical className="h-4 w-4 text-muted-foreground mx-auto" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReorder(image.id, "down")}
                      disabled={index === images.length - 1}
                      className="h-6 w-6 p-0"
                    >
                      ▼
                    </Button>
                  </div>
                  <img
                    src={image.image_url}
                    alt={image.alt_text}
                    className="h-20 w-32 object-cover rounded"
                    style={{ objectPosition: image.image_position }}
                  />
                  <div className="flex-1 space-y-2">
                    <p className="font-medium">{image.alt_text}</p>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-muted-foreground whitespace-nowrap">Position:</Label>
                      <span className="text-xs font-mono text-muted-foreground">
                        {image.image_position}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setEditingImage(image)}
                      >
                        <Move className="h-3 w-3 mr-1" />
                        Adjust
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={image.is_active ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleToggleActive(image.id, image.is_active)}
                    >
                      {image.is_active ? "Active" : "Inactive"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(image.id, image.image_url)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Position Editor Modal */}
      {editingImage && (
        <ImagePositionEditor
          imageUrl={editingImage.image_url}
          altText={editingImage.alt_text}
          currentPosition={editingImage.image_position}
          onSave={(position) => {
            handlePositionChange(editingImage.id, position);
            setEditingImage(null);
          }}
          onCancel={() => setEditingImage(null)}
        />
      )}
    </div>
  );
};

export default CarouselManager;
