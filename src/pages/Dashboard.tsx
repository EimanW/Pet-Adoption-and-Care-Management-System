import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Calendar, FileText, Stethoscope, Bell, User, MessageSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [profileEditing, setProfileEditing] = useState(false);

  // Real data from Supabase
  const [favorites, setFavorites] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [vaccinations, setVaccinations] = useState<any[]>([]);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchAllData();
  }, [user, navigate]);

  const fetchAllData = async () => {
    await Promise.all([
      fetchFavorites(),
      fetchApplications(),
      fetchAppointments(),
      fetchVaccinations(),
      fetchProfile()
    ]);
    setLoading(false);
  };

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          id,
          created_at,
          pets (
            id,
            name,
            breed,
            species,
            image_url
          )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;
      setFavorites(data || []);
    } catch (error: any) {
      console.error('Failed to fetch favorites:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('adoption_applications')
        .select(`
          id,
          status,
          submitted_at,
          pets (
            id,
            name,
            image_url
          )
        `)
        .eq('user_id', user?.id)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error: any) {
      console.error('Failed to fetch applications:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('vet_appointments')
        .select(`
          id,
          appointment_date,
          reason,
          status,
          pets (
            id,
            name
          )
        `)
        .eq('user_id', user?.id)
        .gte('appointment_date', new Date().toISOString())
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error: any) {
      console.error('Failed to fetch appointments:', error);
    }
  };

  const fetchVaccinations = async () => {
    try {
      const { data, error } = await supabase
        .from('vaccination_reminders')
        .select(`
          id,
          vaccine_name,
          due_date,
          status,
          pets (
            id,
            name
          )
        `)
        .eq('user_id', user?.id)
        .eq('status', 'pending')
        .gte('due_date', new Date().toISOString())
        .order('due_date', { ascending: true });

      if (error) throw error;
      setVaccinations(data || []);
    } catch (error: any) {
      console.error('Failed to fetch vaccinations:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfileData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zip_code: data.zip_code || ''
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user?.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
      setProfileEditing(false);
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error("Failed to update profile");
    }
  };

  const handleSubmitFeedback = () => {
    if (!feedbackComment.trim()) {
      toast.error("Please provide feedback before submitting.");
      return;
    }

    toast.success("Feedback Submitted", {
      description: "Thank you for sharing your adoption experience!",
    });

    setFeedbackDialogOpen(false);
    setFeedbackComment("");
    setFeedbackRating(5);
    setSelectedApplication(null);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "approved": return "text-health bg-health/10 border-health";
      case "rejected": return "text-destructive bg-destructive/10 border-destructive";
      case "under_review": return "text-accent bg-accent/10 border-accent";
      default: return "text-muted-foreground bg-muted border-border";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Manage your pets, applications, and appointments
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Heart className="h-4 w-4 text-love" />
                    Favorites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{favorites.length}</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-accent" />
                    Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{applications.length}</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{appointments.length}</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Bell className="h-4 w-4 text-secondary" />
                    Reminders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{vaccinations.length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Recent Applications</CardTitle>
                  <CardDescription>Track your adoption requests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {applications.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No applications yet</p>
                  ) : (
                    applications.map(app => (
                      <div key={app.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                        <img 
                          src={app.pets?.image_url || 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=100&h=100&fit=crop'} 
                          alt={app.pets?.name || 'Pet'} 
                          className="h-12 w-12 rounded-full object-cover" 
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{app.pets?.name || 'Unknown Pet'}</p>
                          <p className="text-sm text-muted-foreground">
                            Applied {new Date(app.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {app.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Your scheduled vet visits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {appointments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No upcoming appointments</p>
                  ) : (
                    appointments.map(apt => (
                      <div key={apt.id} className="p-4 rounded-lg bg-muted/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{apt.pets?.name || 'Unknown Pet'}</p>
                          <Badge variant="outline">
                            {new Date(apt.appointment_date).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(apt.appointment_date).toLocaleTimeString()}
                        </p>
                        <p className="text-sm">{apt.reason}</p>
                      </div>
                    ))
                  )}
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/pets">Schedule New Appointment</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-love" />
                  My Favorite Pets
                </CardTitle>
                <CardDescription>
                  Pets you've saved for later
                </CardDescription>
              </CardHeader>
              <CardContent>
                {favorites.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No favorite pets yet</p>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map(fav => (
                      <Card key={fav.id} className="overflow-hidden">
                        <img 
                          src={fav.pets?.image_url || 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop'} 
                          alt={fav.pets?.name || 'Pet'} 
                          className="w-full h-48 object-cover" 
                        />
                        <CardHeader>
                          <CardTitle className="text-lg">{fav.pets?.name || 'Unknown Pet'}</CardTitle>
                          <CardDescription>{fav.pets?.breed || fav.pets?.species}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button asChild className="w-full">
                            <Link to={`/pets/${fav.pets?.id}`}>View Details</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Adoption Applications</CardTitle>
                <CardDescription>
                  View and track your adoption requests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {applications.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No applications yet</p>
                ) : (
                  applications.map(app => (
                    <div key={app.id} className="flex items-center gap-4 p-4 rounded-lg border border-border">
                      <img 
                        src={app.pets?.image_url || 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=100&h=100&fit=crop'} 
                        alt={app.pets?.name || 'Pet'} 
                        className="h-20 w-20 rounded-lg object-cover" 
                      />
                      <div className="flex-1 space-y-1">
                        <h3 className="font-semibold text-lg">{app.pets?.name || 'Unknown Pet'}</h3>
                        <p className="text-sm text-muted-foreground">
                          Submitted on {new Date(app.submitted_at).toLocaleDateString()}
                        </p>
                        <Badge variant="outline" className="capitalize">
                          {app.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        {app.status === "approved" && (
                          <Dialog open={feedbackDialogOpen && selectedApplication?.id === app.id} onOpenChange={(open) => {
                            setFeedbackDialogOpen(open);
                            if (open) setSelectedApplication(app);
                            else setSelectedApplication(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Add Feedback
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Share Your Adoption Experience</DialogTitle>
                                <DialogDescription>
                                  Help future adopters by sharing your experience with {app.pets?.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Rating</Label>
                                  <div className="flex gap-2 mt-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        key={star}
                                        onClick={() => setFeedbackRating(star)}
                                        className={`text-2xl ${star <= feedbackRating ? "text-yellow-500" : "text-gray-300"}`}
                                      >
                                        ★
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <Label htmlFor="feedback">Your Feedback</Label>
                                  <Textarea
                                    id="feedback"
                                    placeholder="Share your experience with this pet..."
                                    value={feedbackComment}
                                    onChange={(e) => setFeedbackComment(e.target.value)}
                                    rows={5}
                                  />
                                </div>
                                <Button onClick={handleSubmitFeedback} className="w-full">
                                  Submit Feedback
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Appointments
                  </CardTitle>
                  <CardDescription>Manage vet appointments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {appointments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No upcoming appointments</p>
                  ) : (
                    appointments.map(apt => (
                      <div key={apt.id} className="p-4 rounded-lg bg-muted/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{apt.pets?.name || 'Unknown Pet'}</p>
                          <Badge variant="outline">
                            {new Date(apt.appointment_date).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(apt.appointment_date).toLocaleTimeString()}
                        </p>
                        <p className="text-sm">{apt.reason}</p>
                      </div>
                    ))
                  )}
                  <Button className="w-full" asChild>
                    <Link to="/pets">Book New Appointment</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-health" />
                    Vaccination Reminders
                  </CardTitle>
                  <CardDescription>Keep track of important vaccinations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {vaccinations.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No upcoming vaccinations</p>
                  ) : (
                    vaccinations.map(vax => (
                      <div key={vax.id} className="p-4 rounded-lg bg-muted/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{vax.pets?.name || 'Unknown Pet'}</p>
                          <Badge variant="outline" className="text-health border-health">
                            {vax.status}
                          </Badge>
                        </div>
                        <p className="text-sm">{vax.vaccine_name} Vaccination</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(vax.due_date).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Manage your profile and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileEditing ? (
                  <>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileData.first_name}
                          onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileData.last_name}
                          onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={profileData.address}
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={profileData.city}
                          onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={profileData.state}
                          onChange={(e) => setProfileData({...profileData, state: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input
                          id="zip"
                          value={profileData.zip_code}
                          onChange={(e) => setProfileData({...profileData, zip_code: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateProfile}>Save Changes</Button>
                      <Button variant="outline" onClick={() => {
                        setProfileEditing(false);
                        fetchProfile();
                      }}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-muted-foreground">{user?.email}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Name</p>
                        <p className="text-muted-foreground">
                          {profileData.first_name} {profileData.last_name}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-muted-foreground">{profileData.phone || 'Not set'}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-muted-foreground">
                        {profileData.address || 'Not set'}
                        {profileData.city && `, ${profileData.city}`}
                        {profileData.state && `, ${profileData.state}`}
                        {profileData.zip_code && ` ${profileData.zip_code}`}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Member Since</p>
                      <p className="text-muted-foreground">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <Button onClick={() => setProfileEditing(true)}>Edit Profile</Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
