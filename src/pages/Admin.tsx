import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PawPrint, Users, FileText, Activity, CheckCircle, XCircle, Clock, Plus, MessageSquare, Star } from "lucide-react";
import petIcon from "@/assets/pet-icon.png";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Application {
  id: string;
  status: string;
  submitted_at: string;
  pets: { name: string; image_url: string } | null;
  profiles: { first_name: string; last_name: string; email: string } | null;
  reason?: string;
  home_type?: string;
}

interface Feedback {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  pets: { name: string; image_url: string } | null;
  profiles: { first_name: string; last_name: string; email: string } | null;
}

const Admin = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch adoption applications
  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('adoption_applications')
        .select(`
          *,
          pets (name, image_url),
          profiles (first_name, last_name, email)
        `)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setApplications((data as unknown as Application[]) || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load adoption applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const { data, error } = await supabase
        .from('pet_feedback')
        .select(`
          *,
          pets (name, image_url),
          profiles (first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedbacks((data as unknown as Feedback[]) || []);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast({
        title: "Error",
        description: "Failed to load feedbacks",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchFeedbacks();
  }, []);

  const handleApplicationAction = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('adoption_applications')
        .update({ 
          status: newStatus,
          reviewed_at: new Date().toISOString(),
          reviewed_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Application ${newStatus} successfully`,
      });
      
      fetchApplications();
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive"
      });
    }
  };

  // Mock data
  const pendingApplications = [
    { id: "1", petName: "Max", applicant: "John Doe", date: "2024-11-01", status: "pending" },
    { id: "2", petName: "Luna", applicant: "Jane Smith", date: "2024-11-02", status: "pending" },
    { id: "3", petName: "Charlie", applicant: "Bob Johnson", date: "2024-11-01", status: "pending" }
  ];

  const recentPets = [
    { id: "1", name: "Max", type: "Dog", status: "available", addedDate: "2024-10-28" },
    { id: "2", name: "Bella", type: "Cat", status: "adopted", addedDate: "2024-10-25" },
    { id: "3", name: "Rocky", type: "Dog", status: "available", addedDate: "2024-10-20" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={petIcon} alt="PawHaven" className="h-10 w-10" />
            <div>
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                PawHaven Admin
              </span>
              <p className="text-xs text-muted-foreground">Administrator Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">View Site</Link>
            </Button>
            <Button variant="ghost" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <PawPrint className="h-4 w-4 text-primary" />
                Total Pets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">32 available</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-accent" />
                Pending Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApplications.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-secondary" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+12 this week</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-health" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">Adoption completion</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="feedbacks">Feedbacks</TabsTrigger>
            <TabsTrigger value="pets">Manage Pets</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="logs">System Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Adoption Applications</CardTitle>
                    <CardDescription>Review and manage adoption requests</CardDescription>
                  </div>
                  <Badge variant="outline">
                    {applications.filter(a => a.status === 'pending').length} Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Loading applications...</p>
                ) : applications.length === 0 ? (
                  <p className="text-muted-foreground">No applications found</p>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">
                              {app.profiles?.first_name} {app.profiles?.last_name}
                            </p>
                            <Badge 
                              variant={
                                app.status === 'approved' ? 'default' :
                                app.status === 'rejected' ? 'destructive' :
                                'secondary'
                              } 
                              className="capitalize"
                            >
                              {app.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Applying for: <span className="font-medium">{app.pets?.name || 'Unknown Pet'}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Submitted: {new Date(app.submitted_at).toLocaleDateString()}
                          </p>
                          {app.reason && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Reason: {app.reason}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {app.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="gap-1"
                                onClick={() => handleApplicationAction(app.id, 'approved')}
                              >
                                <CheckCircle className="h-3 w-3" />
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="gap-1"
                                onClick={() => handleApplicationAction(app.id, 'rejected')}
                              >
                                <XCircle className="h-3 w-3" />
                                Reject
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedbacks" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Adoption Feedbacks
                    </CardTitle>
                    <CardDescription>View all feedback from adopters</CardDescription>
                  </div>
                  <Badge variant="outline">{feedbacks.length} Total</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Loading feedbacks...</p>
                ) : feedbacks.length === 0 ? (
                  <p className="text-muted-foreground">No feedbacks yet</p>
                ) : (
                  <div className="space-y-4">
                    {feedbacks.map((feedback) => (
                      <div key={feedback.id} className="p-4 rounded-lg border border-border space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">
                                {feedback.profiles?.first_name} {feedback.profiles?.last_name}
                              </p>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < feedback.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Pet: <span className="font-medium">{feedback.pets?.name || 'Unknown Pet'}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(feedback.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm">{feedback.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pets" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pet Management</CardTitle>
                    <CardDescription>Add, edit, or remove pet listings</CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Pet
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPets.map((pet) => (
                    <div key={pet.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{pet.name}</p>
                          <Badge 
                            variant={pet.status === "available" ? "default" : "secondary"}
                            className="capitalize"
                          >
                            {pet.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {pet.type} • Added {pet.addedDate}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/pets/${pet.id}`}>View</Link>
                        </Button>
                        <Button size="sm" variant="outline">Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage registered users and volunteers</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">User management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>System Activity Logs</CardTitle>
                <CardDescription>Monitor system activities and user actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: "User login", user: "john@example.com", time: "2 minutes ago" },
                    { action: "Pet added", user: "admin@pawhaven.com", time: "1 hour ago" },
                    { action: "Application approved", user: "admin@pawhaven.com", time: "3 hours ago" }
                  ].map((log, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-sm font-medium">{log.action}</p>
                        <p className="text-xs text-muted-foreground">{log.user}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{log.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
