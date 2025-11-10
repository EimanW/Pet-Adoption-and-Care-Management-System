import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Calendar, FileText, Stethoscope, Bell, User, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Dashboard = () => {
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");

  // Mock data - would come from backend in real app
  const favorites = [
    { id: "1", name: "Max", breed: "Golden Retriever", image: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=400&h=400&fit=crop" },
    { id: "2", name: "Luna", breed: "Siamese", image: "https://images.unsplash.com/photo-1573865526739-10c1deaeac5e?w=400&h=400&fit=crop" }
  ];

  const applications = [
    { id: "1", petName: "Max", status: "under_review", submittedDate: "2024-10-28", petImage: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=200&h=200&fit=crop" },
    { id: "2", petName: "Bella", status: "approved", submittedDate: "2024-10-20", petImage: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=200&h=200&fit=crop" }
  ];

  const appointments = [
    { id: "1", petName: "Bella", vetName: "Dr. Sarah Johnson", date: "2024-11-10", time: "2:00 PM", reason: "Annual checkup" }
  ];

  const vaccinations = [
    { id: "1", petName: "Bella", vaccine: "Rabies", dueDate: "2024-12-15", status: "upcoming" }
  ];

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
                  {applications.map(app => (
                    <div key={app.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <img src={app.petImage} alt={app.petName} className="h-12 w-12 rounded-full object-cover" />
                      <div className="flex-1">
                        <p className="font-semibold">{app.petName}</p>
                        <p className="text-sm text-muted-foreground">Applied {app.submittedDate}</p>
                      </div>
                      <Badge variant="outline" className={`capitalize ${getStatusColor(app.status)}`}>
                        {app.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <CardDescription>Your scheduled vet visits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {appointments.map(apt => (
                    <div key={apt.id} className="p-4 rounded-lg bg-muted/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{apt.petName}</p>
                        <Badge variant="outline">{apt.date}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {apt.vetName} • {apt.time}
                      </p>
                      <p className="text-sm">{apt.reason}</p>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Schedule New Appointment
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
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map(pet => (
                    <Card key={pet.id} className="overflow-hidden">
                      <img src={pet.image} alt={pet.name} className="w-full h-48 object-cover" />
                      <CardHeader>
                        <CardTitle className="text-lg">{pet.name}</CardTitle>
                        <CardDescription>{pet.breed}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button asChild className="w-full">
                          <Link to={`/pets/${pet.id}`}>View Details</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
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
                {applications.map(app => (
                  <div key={app.id} className="flex items-center gap-4 p-4 rounded-lg border border-border">
                    <img src={app.petImage} alt={app.petName} className="h-20 w-20 rounded-lg object-cover" />
                    <div className="flex-1 space-y-1">
                      <h3 className="font-semibold text-lg">{app.petName}</h3>
                      <p className="text-sm text-muted-foreground">Submitted on {app.submittedDate}</p>
                      <Badge variant="outline" className={`capitalize ${getStatusColor(app.status)}`}>
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
                                Help future adopters by sharing your experience with {app.petName}
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
                      <Button variant="outline">View Application</Button>
                    </div>
                  </div>
                ))}
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
                  {appointments.map(apt => (
                    <div key={apt.id} className="p-4 rounded-lg bg-muted/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{apt.petName}</p>
                        <Badge variant="outline">{apt.date}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {apt.vetName} • {apt.time}
                      </p>
                      <p className="text-sm">{apt.reason}</p>
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">Reschedule</Button>
                        <Button size="sm" variant="outline" className="flex-1">Cancel</Button>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full">Book New Appointment</Button>
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
                  {vaccinations.map(vax => (
                    <div key={vax.id} className="p-4 rounded-lg bg-muted/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">{vax.petName}</p>
                        <Badge variant="outline" className="text-health border-health">
                          Upcoming
                        </Badge>
                      </div>
                      <p className="text-sm">{vax.vaccine} Vaccination</p>
                      <p className="text-sm text-muted-foreground">Due: {vax.dueDate}</p>
                    </div>
                  ))}
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
                <div className="space-y-2">
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-muted-foreground">user@example.com</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-muted-foreground">October 2024</p>
                </div>
                <Button>Edit Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
