import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import CarouselManager from "@/components/admin/CarouselManager";
import AnnouncementManager from "@/components/admin/AnnouncementManager";
import StaffManager from "@/components/admin/StaffManager";
import { Button } from "@/components/ui/button";
import { LogOut, Shield } from "lucide-react";

const AdminPage = () => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <Layout>
        <section className="py-20 md:py-28 bg-muted min-h-[calc(100vh-80px)]">
          <div className="container mx-auto px-4 text-center">
            <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Access Denied
            </h1>
            <p className="text-muted-foreground mb-6">
              You don't have admin privileges. Please contact an administrator.
            </p>
            <Button onClick={() => signOut()}>Sign Out</Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12 md:py-16 bg-muted min-h-[calc(100vh-80px)]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
              Manage carousel photos, announcements, and staff members
            </p>
          </div>
          <Button variant="outline" onClick={() => signOut()}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="carousel" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="carousel">Carousel</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
          </TabsList>

          <TabsContent value="carousel">
            <CarouselManager />
          </TabsContent>

          <TabsContent value="announcements">
            <AnnouncementManager />
          </TabsContent>

          <TabsContent value="staff">
            <StaffManager />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  </Layout>
);
};

export default AdminPage;
