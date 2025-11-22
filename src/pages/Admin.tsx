import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PawPrint, Users, FileText, Activity, CheckCircle, XCircle, Clock, Plus, MessageSquare, Star, Edit, Trash2 } from "lucide-react";
import petIcon from "@/assets/pet-icon.png";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
  gender: string | null;
  size: string | null;
  color: string | null;
  description: string | null;
  health_status: string | null;
  vaccination_status: string | null;
  spayed_neutered: boolean | null;
  good_with_kids: boolean | null;
  good_with_pets: boolean | null;
  energy_level: string | null;
  image_url: string | null;
  status: string | null;
  created_at: string;
}

const Admin = () => {
  const { toast } = useToast();
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [petDialogOpen, setPetDialogOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [petFormData, setPetFormData] = useState({
    name: '',
    species: 'dog',
    breed: '',
    age: '',
    gender: 'male',
    size: 'medium',
    color: '',
    description: '',
    health_status: 'healthy',
    vaccination_status: 'up_to_date',
    spayed_neutered: false,
    good_with_kids: false,
    good_with_pets: false,
    energy_level: 'medium',
    image_url: '',
    status: 'available'
  });

  // Check if user is admin
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (userRole !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    fetchAllData();
  }, [user, userRole, navigate]);

  const fetchAllData = async () => {
    await Promise.all([
      fetchApplications(),
      fetchFeedbacks(),
      fetchPets()
    ]);
  };

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

  const fetchPets = async () => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPets((data as unknown as Pet[]) || []);
    } catch (error) {
      console.error('Error fetching pets:', error);
      toast({
        title: "Error",
        description: "Failed to load pets",
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

  const handleAddPet = () => {
    setEditingPet(null);
    setPetFormData({
      name: '',
      species: 'dog',
      breed: '',
      age: '',
      gender: 'male',
      size: 'medium',
      color: '',
      description: '',
      health_status: 'healthy',
      vaccination_status: 'up_to_date',
      spayed_neutered: false,
      good_with_kids: false,
      good_with_pets: false,
      energy_level: 'medium',
      image_url: '',
      status: 'available'
    });
    setPetDialogOpen(true);
  };

  const handleEditPet = (pet: Pet) => {
    setEditingPet(pet);
    setPetFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed || '',
      age: pet.age?.toString() || '',
      gender: pet.gender || 'male',
      size: pet.size || 'medium',
      color: pet.color || '',
      description: pet.description || '',
      health_status: pet.health_status || 'healthy',
      vaccination_status: pet.vaccination_status || 'up_to_date',
      spayed_neutered: pet.spayed_neutered || false,
      good_with_kids: pet.good_with_kids || false,
      good_with_pets: pet.good_with_pets || false,
      energy_level: pet.energy_level || 'medium',
      image_url: pet.image_url || '',
      status: pet.status || 'available'
    });
    setPetDialogOpen(true);
  };

  const handleSavePet = async () => {
    try {
      const petData = {
        name: petFormData.name,
        species: petFormData.species,
        breed: petFormData.breed || null,
        age: petFormData.age ? parseInt(petFormData.age) : null,
        gender: petFormData.gender,
        size: petFormData.size,
        color: petFormData.color || null,
        description: petFormData.description || null,
        health_status: petFormData.health_status,
        vaccination_status: petFormData.vaccination_status,
        spayed_neutered: petFormData.spayed_neutered,
        good_with_kids: petFormData.good_with_kids,
        good_with_pets: petFormData.good_with_pets,
        energy_level: petFormData.energy_level,
        image_url: petFormData.image_url || null,
        status: petFormData.status
      };

      if (editingPet) {
        // Update existing pet
        const { error } = await supabase
          .from('pets')
          .update(petData)
          .eq('id', editingPet.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Pet updated successfully"
        });
      } else {
        // Create new pet
        const { error } = await supabase
          .from('pets')
          .insert([petData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Pet added successfully"
        });
      }

      setPetDialogOpen(false);
      fetchPets();
    } catch (error: any) {
      console.error('Error saving pet:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save pet",
        variant: "destructive"
      });
    }
  };

  const handleDeletePet = async (petId: string) => {
    if (!confirm('Are you sure you want to delete this pet? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', petId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pet deleted successfully"
      });

      fetchPets();
    } catch (error: any) {
      console.error('Error deleting pet:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete pet",
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
            <Button variant="ghost" size="sm" onClick={signOut}>
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
                  <Button className="gap-2" onClick={handleAddPet}>
                    <Plus className="h-4 w-4" />
                    Add New Pet
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Loading pets...</p>
                ) : pets.length === 0 ? (
                  <p className="text-muted-foreground">No pets found. Click "Add New Pet" to get started.</p>
                ) : (
                  <div className="space-y-4">
                    {pets.map((pet) => (
                      <div key={pet.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                        <div className="flex items-center gap-4">
                          {pet.image_url && (
                            <img 
                              src={pet.image_url} 
                              alt={pet.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          )}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{pet.name}</p>
                              <Badge 
                                variant={pet.status === "available" ? "default" : pet.status === "adopted" ? "secondary" : "outline"}
                                className="capitalize"
                              >
                                {pet.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {pet.breed || pet.species} • {pet.age} {pet.age === 1 ? 'year' : 'years'} • {pet.gender}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Added {new Date(pet.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="gap-1" onClick={() => handleEditPet(pet)}>
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/pets/${pet.id}`}>View</Link>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="gap-1 text-destructive hover:text-destructive"
                            onClick={() => handleDeletePet(pet.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add/Edit Pet Dialog */}
            <Dialog open={petDialogOpen} onOpenChange={setPetDialogOpen}>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingPet ? 'Edit Pet' : 'Add New Pet'}</DialogTitle>
                  <DialogDescription>
                    {editingPet ? 'Update the pet information below' : 'Fill in the details for the new pet'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={petFormData.name}
                        onChange={(e) => setPetFormData({...petFormData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="species">Species *</Label>
                      <Select value={petFormData.species} onValueChange={(value) => setPetFormData({...petFormData, species: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dog">Dog</SelectItem>
                          <SelectItem value="cat">Cat</SelectItem>
                          <SelectItem value="bird">Bird</SelectItem>
                          <SelectItem value="rabbit">Rabbit</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="breed">Breed</Label>
                      <Input
                        id="breed"
                        value={petFormData.breed}
                        onChange={(e) => setPetFormData({...petFormData, breed: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age (years)</Label>
                      <Input
                        id="age"
                        type="number"
                        min="0"
                        value={petFormData.age}
                        onChange={(e) => setPetFormData({...petFormData, age: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={petFormData.gender} onValueChange={(value) => setPetFormData({...petFormData, gender: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="size">Size</Label>
                      <Select value={petFormData.size} onValueChange={(value) => setPetFormData({...petFormData, size: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        value={petFormData.color}
                        onChange={(e) => setPetFormData({...petFormData, color: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      value={petFormData.description}
                      onChange={(e) => setPetFormData({...petFormData, description: e.target.value})}
                      placeholder="Describe the pet's personality, behavior, and any special needs..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="health_status">Health Status</Label>
                      <Select value={petFormData.health_status} onValueChange={(value) => setPetFormData({...petFormData, health_status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="healthy">Healthy</SelectItem>
                          <SelectItem value="needs_care">Needs Care</SelectItem>
                          <SelectItem value="recovering">Recovering</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vaccination_status">Vaccination Status</Label>
                      <Select value={petFormData.vaccination_status} onValueChange={(value) => setPetFormData({...petFormData, vaccination_status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="up_to_date">Up to Date</SelectItem>
                          <SelectItem value="partial">Partial</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="energy_level">Energy Level</Label>
                      <Select value={petFormData.energy_level} onValueChange={(value) => setPetFormData({...petFormData, energy_level: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="very_high">Very High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={petFormData.status} onValueChange={(value) => setPetFormData({...petFormData, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="under_review">Under Review</SelectItem>
                          <SelectItem value="adopted">Adopted</SelectItem>
                          <SelectItem value="in_care">In Care</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="spayed_neutered"
                        checked={petFormData.spayed_neutered}
                        onCheckedChange={(checked) => setPetFormData({...petFormData, spayed_neutered: checked as boolean})}
                      />
                      <Label htmlFor="spayed_neutered" className="font-normal cursor-pointer">
                        Spayed/Neutered
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="good_with_kids"
                        checked={petFormData.good_with_kids}
                        onCheckedChange={(checked) => setPetFormData({...petFormData, good_with_kids: checked as boolean})}
                      />
                      <Label htmlFor="good_with_kids" className="font-normal cursor-pointer">
                        Good with Kids
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="good_with_pets"
                        checked={petFormData.good_with_pets}
                        onCheckedChange={(checked) => setPetFormData({...petFormData, good_with_pets: checked as boolean})}
                      />
                      <Label htmlFor="good_with_pets" className="font-normal cursor-pointer">
                        Good with Other Pets
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={petFormData.image_url}
                      onChange={(e) => setPetFormData({...petFormData, image_url: e.target.value})}
                      placeholder="https://example.com/pet-image.jpg"
                    />
                    <p className="text-xs text-muted-foreground">
                      Use an Unsplash or similar image URL
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setPetDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSavePet} disabled={!petFormData.name}>
                    {editingPet ? 'Update Pet' : 'Add Pet'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
