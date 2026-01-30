import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Edit, X, Megaphone, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Announcement {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image_url: string | null;
  category: string;
  recurring: boolean;
  is_active: boolean;
  display_order: number;
}

const defaultAnnouncement = {
  title: "",
  date: "",
  time: "",
  location: "",
  description: "",
  image_url: null as string | null,
  category: "General",
  recurring: false,
  is_active: true,
};

const categories = ["Worship", "Study", "Youth", "Fellowship", "Outreach", "General"];

const AnnouncementManager = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(defaultAnnouncement);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load announcements",
        variant: "destructive",
      });
    } else {
      setAnnouncements(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast({
        title: "Invalid file",
        description: "Please upload an image or video file",
        variant: "destructive",
      });
      return;
    }

    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024; // 50MB for video, 5MB for image
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: isVideo ? "Please upload a video under 50MB" : "Please upload an image under 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const mediaType = file.type.startsWith("video/") ? "video" : "image";
      const fileName = `announcement-${mediaType}-${Date.now()}.${fileExt}`;
      const filePath = `announcements/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, image_url: urlData.publicUrl }));

      toast({
        title: "Success",
        description: "Image uploaded",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        const { error } = await supabase
          .from("announcements")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Announcement updated",
        });
      } else {
        const maxOrder = announcements.length > 0
          ? Math.max(...announcements.map((a) => a.display_order))
          : -1;

        const { error } = await supabase.from("announcements").insert({
          ...formData,
          display_order: maxOrder + 1,
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Announcement created",
        });
      }

      setIsDialogOpen(false);
      setEditingId(null);
      setFormData(defaultAnnouncement);
      fetchAnnouncements();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save announcement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setFormData({
      title: announcement.title,
      date: announcement.date,
      time: announcement.time,
      location: announcement.location,
      description: announcement.description,
      image_url: announcement.image_url,
      category: announcement.category,
      recurring: announcement.recurring,
      is_active: announcement.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("announcements").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Announcement deleted",
      });

      fetchAnnouncements();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete announcement",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("announcements")
        .update({ is_active: !isActive })
        .eq("id", id);

      if (error) throw error;

      fetchAnnouncements();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update announcement",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Loading announcements...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add Button */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Announcements ({announcements.length})
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingId(null);
                    setFormData(defaultAnnouncement);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Announcement
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Edit Announcement" : "Add New Announcement"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, title: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, category: e.target.value }))
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        placeholder="e.g., Every Sunday or February 15, 2026"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, date: e.target.value }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        placeholder="e.g., 10:00 AM"
                        value={formData.time}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, time: e.target.value }))
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Main Sanctuary"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, location: e.target.value }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the event..."
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, description: e.target.value }))
                      }
                      required
                      rows={3}
                    />
                  </div>

                  {/* Media Upload (Image or Video) */}
                  <div className="space-y-2">
                    <Label>Announcement Media (Optional - Image or Video)</Label>
                    {formData.image_url ? (
                      <div className="relative inline-block">
                        {formData.image_url.includes("-video-") || formData.image_url.match(/\.(mp4|webm|mov|avi)$/i) ? (
                          <video
                            src={formData.image_url}
                            className="h-32 w-auto rounded border"
                            controls
                          />
                        ) : (
                          <img
                            src={formData.image_url}
                            alt="Preview"
                            className="h-32 w-auto rounded border"
                          />
                        )}
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, image_url: null }))
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleMediaUpload}
                          disabled={isUploading}
                        />
                        {isUploading && (
                          <span className="text-sm text-muted-foreground">
                            Uploading...
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="recurring"
                        checked={formData.recurring}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({ ...prev, recurring: checked }))
                        }
                      />
                      <Label htmlFor="recurring">Recurring Event</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({ ...prev, is_active: checked }))
                        }
                      />
                      <Label htmlFor="is_active">Active</Label>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : editingId ? "Update" : "Create"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {announcements.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No announcements yet. Create your first announcement above.
            </p>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${
                    announcement.is_active ? "bg-card" : "bg-muted opacity-60"
                  }`}
                >
                  {announcement.image_url ? (
                    <img
                      src={announcement.image_url}
                      alt={announcement.title}
                      className="h-20 w-32 object-cover rounded"
                    />
                  ) : (
                    <div className="h-20 w-32 bg-muted rounded flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{announcement.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {announcement.date} at {announcement.time} • {announcement.location}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {announcement.category}
                          {announcement.recurring && " • Recurring"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={announcement.is_active ? "secondary" : "outline"}
                          size="sm"
                          onClick={() =>
                            handleToggleActive(announcement.id, announcement.is_active)
                          }
                        >
                          {announcement.is_active ? "Active" : "Inactive"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(announcement)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(announcement.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnouncementManager;
