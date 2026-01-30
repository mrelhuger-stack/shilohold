import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Upload, GripVertical, User } from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  title: string | null;
  category: string;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
}

const STAFF_CATEGORIES = [
  "Ministerial Staff",
  "Trustees",
  "Deacons",
  "Ushers",
  "Praise and Worship",
  "Audio/Visual",
  "Hospitality",
];

const StaffManager = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [newMember, setNewMember] = useState({
    name: "",
    title: "",
    category: STAFF_CATEGORIES[0],
  });
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const fetchStaffMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("staff_members")
        .select("*")
        .order("category")
        .order("display_order");

      if (error) throw error;
      setStaffMembers(data || []);
    } catch (error) {
      console.error("Error fetching staff members:", error);
      toast({
        title: "Error",
        description: "Failed to load staff members",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!newMember.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name",
        variant: "destructive",
      });
      return;
    }

    try {
      const maxOrder = staffMembers
        .filter(m => m.category === newMember.category)
        .reduce((max, m) => Math.max(max, m.display_order), -1);

      const { error } = await supabase.from("staff_members").insert({
        name: newMember.name.trim(),
        title: newMember.title.trim() || null,
        category: newMember.category,
        display_order: maxOrder + 1,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Staff member added successfully",
      });

      setNewMember({ name: "", title: "", category: STAFF_CATEGORIES[0] });
      setIsDialogOpen(false);
      fetchStaffMembers();
    } catch (error) {
      console.error("Error adding staff member:", error);
      toast({
        title: "Error",
        description: "Failed to add staff member",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      const member = staffMembers.find(m => m.id === id);
      
      // Delete image from storage if exists
      if (member?.image_url) {
        const path = member.image_url.split("/").slice(-2).join("/");
        await supabase.storage.from("images").remove([path]);
      }

      const { error } = await supabase
        .from("staff_members")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Staff member removed",
      });

      fetchStaffMembers();
    } catch (error) {
      console.error("Error deleting staff member:", error);
      toast({
        title: "Error",
        description: "Failed to remove staff member",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (memberId: string, file: File) => {
    setIsUploading(memberId);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `staff/${memberId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from("staff_members")
        .update({ image_url: urlData.publicUrl })
        .eq("id", memberId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Photo uploaded successfully",
      });

      fetchStaffMembers();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload photo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(null);
    }
  };

  const handleNameUpdate = async (memberId: string, name: string) => {
    try {
      const { error } = await supabase
        .from("staff_members")
        .update({ name })
        .eq("id", memberId);

      if (error) throw error;
      
      setStaffMembers(prev =>
        prev.map(m => (m.id === memberId ? { ...m, name } : m))
      );
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  const handleTitleUpdate = async (memberId: string, title: string) => {
    try {
      const { error } = await supabase
        .from("staff_members")
        .update({ title: title || null })
        .eq("id", memberId);

      if (error) throw error;
      
      setStaffMembers(prev =>
        prev.map(m => (m.id === memberId ? { ...m, title } : m))
      );
    } catch (error) {
      console.error("Error updating title:", error);
    }
  };

  const filteredMembers = selectedCategory === "all" 
    ? staffMembers 
    : staffMembers.filter(m => m.category === selectedCategory);

  const groupedMembers = STAFF_CATEGORIES.reduce((acc, category) => {
    acc[category] = filteredMembers.filter(m => m.category === category);
    return acc;
  }, {} as Record<string, StaffMember[]>);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground text-center">Loading staff members...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Staff Members</CardTitle>
        <div className="flex items-center gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {STAFF_CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Staff Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <Label htmlFor="title">Title (optional)</Label>
                  <Input
                    id="title"
                    value={newMember.title}
                    onChange={(e) => setNewMember({ ...newMember, title: e.target.value })}
                    placeholder="e.g., Pastor, Deacon"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newMember.category} 
                    onValueChange={(val) => setNewMember({ ...newMember, category: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STAFF_CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddMember} className="w-full">
                  Add Member
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {STAFF_CATEGORIES.map(category => {
            const members = groupedMembers[category];
            if (selectedCategory !== "all" && selectedCategory !== category) return null;
            
            return (
              <div key={category}>
                <h3 className="font-semibold text-lg mb-4 text-foreground">{category}</h3>
                {members.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No members in this category</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {members.map((member) => (
                      <div 
                        key={member.id} 
                        className="bg-muted rounded-lg p-3 relative group"
                      >
                        {/* Photo Area */}
                        <div className="aspect-[3/4] bg-background rounded-md overflow-hidden mb-3 relative">
                          {member.image_url ? (
                            <img
                              src={member.image_url}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="h-12 w-12 text-muted-foreground/50" />
                            </div>
                          )}
                          
                          {/* Upload Overlay */}
                          <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleImageUpload(member.id, file);
                              }}
                              disabled={isUploading === member.id}
                            />
                            {isUploading === member.id ? (
                              <span className="text-white text-sm">Uploading...</span>
                            ) : (
                              <Upload className="h-6 w-6 text-white" />
                            )}
                          </label>
                        </div>

                        {/* Name Input */}
                        <Input
                          value={member.name}
                          onChange={(e) => handleNameUpdate(member.id, e.target.value)}
                          className="text-sm font-medium text-center mb-1 h-8"
                          placeholder="Name"
                        />
                        
                        {/* Title Input */}
                        <Input
                          value={member.title || ""}
                          onChange={(e) => handleTitleUpdate(member.id, e.target.value)}
                          className="text-xs text-center h-7 text-muted-foreground"
                          placeholder="Title (optional)"
                        />

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive/80 hover:bg-destructive text-destructive-foreground"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffManager;
