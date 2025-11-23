import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Calendar, ArrowLeft, CheckCircle, AlertCircle, Stethoscope, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
}

interface MedicalRecord {
  id: string;
  record_type: string;
  description: string | null;
  date: string;
  veterinarian: string | null;
  notes: string | null;
}

interface Feedback {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
  adoption_applications: {
    submitted_at: string;
  };
}

const PetDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    homeType: '',
    hasYard: false,
    hasOtherPets: false,
    hasChildren: false,
    experience: '',
    reason: ''
  });

  // Appointment form state
  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: '',
    type: 'checkup',
    reason: ''
  });

  useEffect(() => {
    if (id) {
      fetchPetDetails();
      fetchMedicalRecords();
      fetchFeedback();
      if (user) {
        checkFavorite();
      }
    }
  }, [id, user]);

  const fetchPetDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPet(data as unknown as Pet);
    } catch (error: any) {
      toast.error("Failed to load pet details", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicalRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .select('*')
        .eq('pet_id', id)
        .order('date', { ascending: false });

      if (error) throw error;
      setMedicalRecords((data as unknown as MedicalRecord[]) || []);
    } catch (error: any) {
      console.error("Failed to load medical records:", error);
    }
  };

  const fetchFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('pet_feedback')
        .select(`
          id,
          rating,
          comment,
          created_at,
          profiles:user_id (first_name, last_name),
          adoption_applications:adoption_application_id (submitted_at)
        `)
        .eq('pet_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedback((data as unknown as Feedback[]) || []);
    } catch (error: any) {
      console.error("Failed to load feedback:", error);
    }
  };

  const checkFavorite = async () => {
    if (!user || !id) return;

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('pet_id', id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setIsFavorite(!!data);
    } catch (error: any) {
      console.error("Failed to check favorite:", error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast.error("Please log in to save favorites");
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('pet_id', id);

        if (error) throw error;
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert({ user_id: user.id, pet_id: id });

        if (error) throw error;
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (error: any) {
      toast.error("Failed to update favorites", {
        description: error.message
      });
    }
  };

  const handleAdoptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please log in to submit an adoption application");
      navigate('/login');
      return;
    }

    try {
      console.log('=== ADOPTION APPLICATION DEBUG ===');
      console.log('Current user:', user);
      console.log('Pet ID:', id);
      console.log('Form data:', formData);

      // Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session);

      if (!session) {
        throw new Error('No active session. Please log in again.');
      }

      // First ensure user has a profile
      console.log('Checking if profile exists...');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      console.log('Profile check:', { profile, profileError });

      if (!profile && !profileError) {
        // Profile doesn't exist, create it
        console.log('Creating profile for user:', user.id);
        const { data: newProfile, error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email
          })
          .select();
        
        console.log('Profile creation result:', { newProfile, createProfileError });
        
        if (createProfileError) {
          console.error('Failed to create profile:', createProfileError);
          throw new Error(`Failed to create user profile: ${createProfileError.message}`);
        }
      }

      const applicationData = {
        pet_id: id,
        user_id: user.id,
        home_type: formData.homeType,
        has_yard: formData.hasYard,
        has_other_pets: formData.hasOtherPets,
        has_children: formData.hasChildren,
        experience: formData.experience,
        reason: formData.reason,
        status: 'pending'
      };

      console.log('Submitting application with data:', applicationData);

      const { data, error } = await supabase
        .from('adoption_applications')
        .insert(applicationData)
        .select();

      console.log('Submission result:', { data, error });

      if (error) {
        console.error('Submission error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned after insert. This might be a permissions issue.');
      }

      setIsDialogOpen(false);
      toast.success("Adoption request submitted!", {
        description: "We'll review your application and get back to you soon."
      });
      
      // Reset form
      setFormData({
        homeType: '',
        hasYard: false,
        hasOtherPets: false,
        hasChildren: false,
        experience: '',
        reason: ''
      });
    } catch (error: any) {
      console.error('=== ERROR SUBMITTING APPLICATION ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      console.error('Error code:', error.code);
      
      toast.error("Failed to submit application", {
        description: error.message || 'Please ensure all required fields are filled and you are logged in.'
      });
    }
  };

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please log in to schedule an appointment");
      navigate('/login');
      return;
    }

    try {
      const appointmentDateTime = new Date(`${appointmentData.date}T${appointmentData.time}`);

      const { error } = await supabase
        .from('vet_appointments')
        .insert({
          pet_id: id,
          user_id: user.id,
          appointment_date: appointmentDateTime.toISOString(),
          appointment_type: appointmentData.type,
          reason: appointmentData.reason,
          status: 'scheduled'
        });

      if (error) throw error;

      setIsAppointmentDialogOpen(false);
      toast.success("Appointment scheduled!", {
        description: "Your vet appointment has been booked successfully."
      });
      
      // Reset form
      setAppointmentData({
        date: '',
        time: '',
        type: 'checkup',
        reason: ''
      });
    } catch (error: any) {
      toast.error("Failed to schedule appointment", {
        description: error.message
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-8 text-center">
          <p className="text-lg">Loading pet details...</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-8 text-center">
          <p className="text-lg mb-4">Pet not found</p>
          <Button asChild>
            <Link to="/pets">Back to Pets</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/pets" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Pets
          </Link>
        </Button>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Image Section */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-hover">
                <img 
                  src={pet.image_url || '/placeholder.jpg'} 
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-4 right-4 shadow-md"
                  onClick={toggleFavorite}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-love text-love' : ''}`} />
                </Button>
              </div>
              
              <Card className="shadow-card">
                <CardContent className="pt-6 space-y-3">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="w-full shadow-soft">
                        Request Adoption
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Adoption Application</DialogTitle>
                        <DialogDescription>
                          Please fill out this form to begin the adoption process for {pet.name}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAdoptionSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="living">Living Situation</Label>
                          <Input 
                            id="living" 
                            placeholder="e.g., House with yard, Apartment" 
                            value={formData.homeType}
                            onChange={(e) => setFormData({...formData, homeType: e.target.value})}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="experience">Pet Experience</Label>
                          <Textarea 
                            id="experience" 
                            placeholder="Describe your experience with pets..."
                            value={formData.experience}
                            onChange={(e) => setFormData({...formData, experience: e.target.value})}
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="motivation">Why do you want to adopt {pet.name}?</Label>
                          <Textarea 
                            id="motivation" 
                            placeholder="Tell us about yourself and why you'd be a great fit..."
                            value={formData.reason}
                            onChange={(e) => setFormData({...formData, reason: e.target.value})}
                            required
                            rows={4}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="hasYard"
                            checked={formData.hasYard}
                            onChange={(e) => setFormData({...formData, hasYard: e.target.checked})}
                            className="h-4 w-4"
                          />
                          <Label htmlFor="hasYard" className="font-normal cursor-pointer">I have a yard</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="hasOtherPets"
                            checked={formData.hasOtherPets}
                            onChange={(e) => setFormData({...formData, hasOtherPets: e.target.checked})}
                            className="h-4 w-4"
                          />
                          <Label htmlFor="hasOtherPets" className="font-normal cursor-pointer">I have other pets</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id="hasChildren"
                            checked={formData.hasChildren}
                            onChange={(e) => setFormData({...formData, hasChildren: e.target.checked})}
                            className="h-4 w-4"
                          />
                          <Label htmlFor="hasChildren" className="font-normal cursor-pointer">I have children</Label>
                        </div>
                        <DialogFooter>
                          <Button type="submit" className="w-full">Submit Application</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog open={isAppointmentDialogOpen} onOpenChange={setIsAppointmentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg" variant="outline" className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Appointment
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Schedule Vet Appointment</DialogTitle>
                        <DialogDescription>
                          Book a veterinary appointment for {pet?.name}
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="appointmentDate">Date</Label>
                          <Input 
                            id="appointmentDate" 
                            type="date"
                            value={appointmentData.date}
                            onChange={(e) => setAppointmentData({...appointmentData, date: e.target.value})}
                            min={new Date().toISOString().split('T')[0]}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="appointmentTime">Time</Label>
                          <Input 
                            id="appointmentTime" 
                            type="time"
                            value={appointmentData.time}
                            onChange={(e) => setAppointmentData({...appointmentData, time: e.target.value})}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="appointmentType">Appointment Type</Label>
                          <select
                            id="appointmentType"
                            className="w-full border border-border rounded-md p-2"
                            value={appointmentData.type}
                            onChange={(e) => setAppointmentData({...appointmentData, type: e.target.value})}
                            required
                          >
                            <option value="checkup">General Checkup</option>
                            <option value="vaccination">Vaccination</option>
                            <option value="grooming">Grooming</option>
                            <option value="emergency">Emergency</option>
                            <option value="followup">Follow-up</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="appointmentReason">Reason</Label>
                          <Textarea 
                            id="appointmentReason"
                            placeholder="Describe the reason for this appointment..."
                            value={appointmentData.reason}
                            onChange={(e) => setAppointmentData({...appointmentData, reason: e.target.value})}
                            rows={3}
                            required
                          />
                        </div>
                        <DialogFooter>
                          <Button type="submit" className="w-full">Schedule Appointment</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-3 space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{pet.name}</h1>
                  <p className="text-xl text-muted-foreground">{pet.breed || pet.species}</p>
                </div>
                <Badge variant="outline" className="capitalize text-sm">
                  {pet.species}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4">
                {pet.age && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{pet.age} {pet.age === 1 ? 'year' : 'years'} old</span>
                  </div>
                )}
                {pet.size && pet.gender && (
                  <span className="capitalize text-muted-foreground">{pet.size} • {pet.gender}</span>
                )}
              </div>
            </div>

            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="health">Health</TabsTrigger>
                <TabsTrigger value="care">Care Needs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="space-y-4">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>About {pet.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {pet.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">Vaccination Status</p>
                        <div className="flex items-center gap-2">
                          {pet.vaccination_status === 'up_to_date' || pet.vaccination_status === 'complete' ? (
                            <CheckCircle className="h-4 w-4 text-health" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          )}
                          <span className="text-sm text-muted-foreground capitalize">
                            {pet.vaccination_status || 'Unknown'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">Spayed/Neutered</p>
                        <div className="flex items-center gap-2">
                          {pet.spayed_neutered ? (
                            <CheckCircle className="h-4 w-4 text-health" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          )}
                          <span className="text-sm text-muted-foreground">
                            {pet.spayed_neutered ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {pet.health_status && (
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm font-semibold mb-1">Health Status</p>
                        <p className="text-sm text-muted-foreground capitalize">{pet.health_status}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="health" className="space-y-4">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5 text-health" />
                      Medical History
                    </CardTitle>
                    <CardDescription>
                      {pet.name}'s health records and vaccinations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {medicalRecords.length > 0 ? (
                      <div className="space-y-4">
                        {medicalRecords.map((record) => (
                          <div key={record.id} className="border-l-2 border-health pl-4 pb-4">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline" className="capitalize">
                                {record.record_type}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(record.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm mb-1">{record.description}</p>
                            {record.veterinarian && (
                              <p className="text-xs text-muted-foreground">By {record.veterinarian}</p>
                            )}
                            {record.notes && (
                              <p className="text-xs text-muted-foreground mt-2">{record.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No medical history available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="care" className="space-y-4">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Care Requirements</CardTitle>
                    <CardDescription>
                      What {pet.name} needs to thrive
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Exercise Needs</h4>
                      <p className="text-sm text-muted-foreground">
                        {pet.energy_level ? (
                          <>
                            {pet.energy_level === 'high' && 'High - needs daily walks and active playtime'}
                            {pet.energy_level === 'moderate' && 'Moderate - regular walks and play sessions'}
                            {pet.energy_level === 'low' && 'Low - short walks and gentle play'}
                          </>
                        ) : (
                          'Energy level information not available'
                        )}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Feeding</h4>
                      <p className="text-sm text-muted-foreground">
                        High-quality {pet.species} food, as recommended by veterinarian. Fresh water always available.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Special Considerations</h4>
                      <div className="space-y-2">
                        {pet.good_with_kids !== null && (
                          <p className="text-sm text-muted-foreground">
                            • {pet.good_with_kids ? 'Good with children' : 'Not recommended for homes with young children'}
                          </p>
                        )}
                        {pet.good_with_pets !== null && (
                          <p className="text-sm text-muted-foreground">
                            • {pet.good_with_pets ? 'Good with other pets' : 'Best as an only pet'}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Adoption Feedback Section */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Adoption Feedback</CardTitle>
                <CardDescription>
                  Reviews from verified adopters
                </CardDescription>
              </CardHeader>
              <CardContent>
                {feedback.length > 0 ? (
                  <div className="space-y-4">
                    {feedback.map((item) => (
                      <div key={item.id} className="border-b pb-4 last:border-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">
                                {item.profiles?.first_name} {item.profiles?.last_name}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                Verified Adopter
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < item.rating
                                      ? "fill-yellow-500 text-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.comment}</p>
                        {item.adoption_applications?.submitted_at && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Adopted on {new Date(item.adoption_applications.submitted_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No feedback yet. Be the first to adopt and share your experience!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetail;
