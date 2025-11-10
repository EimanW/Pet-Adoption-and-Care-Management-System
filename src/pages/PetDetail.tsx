import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MapPin, Calendar, ArrowLeft, CheckCircle, AlertCircle, Stethoscope, Star } from "lucide-react";
import { mockPets } from "@/data/mockPets";
import { toast } from "sonner";
import { PetFeedback } from "@/types/pet";

const PetDetail = () => {
  const { id } = useParams();
  const pet = mockPets.find(p => p.id === id);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock feedback data
  const mockFeedback: PetFeedback[] = [
    {
      id: "1",
      petId: id || "",
      userId: "user1",
      userName: "Sarah Johnson",
      userEmail: "sarah@example.com",
      rating: 5,
      comment: "Max has been the perfect addition to our family! He's so gentle with our kids and loves playing in the backyard. The adoption process was smooth and the staff was very helpful.",
      adoptionDate: "2024-01-15",
      submittedDate: "2024-02-01",
      isVerifiedAdopter: true,
    },
    {
      id: "2",
      petId: id || "",
      userId: "user2",
      userName: "Michael Chen",
      userEmail: "michael@example.com",
      rating: 5,
      comment: "Couldn't be happier with our decision to adopt! The team provided excellent support and answered all our questions. Highly recommend!",
      adoptionDate: "2024-02-10",
      submittedDate: "2024-03-05",
      isVerifiedAdopter: true,
    },
  ];

  if (!pet) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Pet Not Found</h1>
          <Button asChild>
            <Link to="/pets">Back to Pets</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAdoptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDialogOpen(false);
    toast.success("Adoption request submitted!", {
      description: "We'll review your application and get back to you soon."
    });
  };

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
                  src={pet.image} 
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-4 right-4 shadow-md"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-love text-love' : ''}`} />
                </Button>
              </div>
              
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-2xl">${pet.adoptionFee}</CardTitle>
                  <CardDescription>Adoption Fee</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
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
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" type="tel" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="living">Living Situation</Label>
                          <Input id="living" placeholder="e.g., House with yard, Apartment" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="motivation">Why do you want to adopt {pet.name}?</Label>
                          <Textarea 
                            id="motivation" 
                            placeholder="Tell us about yourself and why you'd be a great fit..."
                            required
                            rows={4}
                          />
                        </div>
                        <DialogFooter>
                          <Button type="submit" className="w-full">Submit Application</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                  
                  <Button variant="outline" size="lg" className="w-full">
                    Schedule Visit
                  </Button>
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
                  <p className="text-xl text-muted-foreground">{pet.breed}</p>
                </div>
                <Badge variant="outline" className="capitalize text-sm">
                  {pet.type}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{pet.age} {pet.age === 1 ? 'year' : 'years'} old</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{pet.location}</span>
                </div>
                <span className="capitalize text-muted-foreground">{pet.size} • {pet.gender}</span>
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
                        <p className="text-sm font-semibold">Vaccinated</p>
                        <div className="flex items-center gap-2">
                          {pet.vaccinated ? (
                            <CheckCircle className="h-4 w-4 text-health" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          )}
                          <span className="text-sm text-muted-foreground">
                            {pet.vaccinated ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">Spayed/Neutered</p>
                        <div className="flex items-center gap-2">
                          {pet.neutered ? (
                            <CheckCircle className="h-4 w-4 text-health" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          )}
                          <span className="text-sm text-muted-foreground">
                            {pet.neutered ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {pet.specialNeeds && (
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm font-semibold mb-1">Special Needs</p>
                        <p className="text-sm text-muted-foreground">{pet.specialNeeds}</p>
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
                    {pet.medicalHistory.length > 0 ? (
                      <div className="space-y-4">
                        {pet.medicalHistory.map((record) => (
                          <div key={record.id} className="border-l-2 border-health pl-4 pb-4">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline" className="capitalize">
                                {record.type}
                              </Badge>
                              <span className="text-sm text-muted-foreground">{record.date}</span>
                            </div>
                            <p className="text-sm mb-1">{record.description}</p>
                            <p className="text-xs text-muted-foreground">By {record.vet}</p>
                            {record.nextDue && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Next due: {record.nextDue}
                              </p>
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
                        {pet.type === 'dog' && pet.size === 'large' && 'High - needs daily walks and active playtime'}
                        {pet.type === 'dog' && pet.size === 'medium' && 'Moderate - regular walks and play sessions'}
                        {pet.type === 'dog' && pet.size === 'small' && 'Low to Moderate - short walks and indoor play'}
                        {pet.type === 'cat' && 'Moderate - interactive play and climbing opportunities'}
                        {pet.type === 'rabbit' && 'Moderate - supervised exercise outside cage daily'}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Feeding</h4>
                      <p className="text-sm text-muted-foreground">
                        High-quality {pet.type} food, twice daily. Fresh water always available.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Grooming</h4>
                      <p className="text-sm text-muted-foreground">
                        {pet.breed.includes('Persian') && 'Daily brushing required to prevent matting'}
                        {pet.breed.includes('Golden') && 'Weekly brushing, more during shedding season'}
                        {!pet.breed.includes('Persian') && !pet.breed.includes('Golden') && 'Regular brushing to maintain healthy coat'}
                      </p>
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
                {mockFeedback.length > 0 ? (
                  <div className="space-y-4">
                    {mockFeedback.map((feedback) => (
                      <div key={feedback.id} className="border-b pb-4 last:border-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{feedback.userName}</span>
                              {feedback.isVerifiedAdopter && (
                                <Badge variant="secondary" className="text-xs">
                                  Verified Adopter
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < feedback.rating
                                      ? "fill-yellow-500 text-yellow-500"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(feedback.submittedDate).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{feedback.comment}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Adopted on {new Date(feedback.adoptionDate).toLocaleDateString()}
                        </p>
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
