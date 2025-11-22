import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Search, MapPin, Calendar } from "lucide-react";
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
  image_url: string | null;
  status: string | null;
  arrival_date: string | null;
}

const Pets = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sizeFilter, setSizeFilter] = useState<string>("all");
  const [ageFilter, setAgeFilter] = useState<string>("all");
  const [breedFilter, setBreedFilter] = useState("");
  const [pets, setPets] = useState<Pet[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch pets from Supabase
  useEffect(() => {
    fetchPets();
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchPets = async () => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPets((data as unknown as Pet[]) || []);
    } catch (error: any) {
      toast.error("Failed to load pets", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('pet_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(data?.map(f => f.pet_id) || []);
    } catch (error: any) {
      console.error("Failed to load favorites:", error);
    }
  };

  const toggleFavorite = async (petId: string) => {
    if (!user) {
      toast.error("Please log in to save favorites");
      return;
    }

    const isFavorite = favorites.includes(petId);

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('pet_id', petId);

        if (error) throw error;
        setFavorites(prev => prev.filter(id => id !== petId));
        toast.success("Removed from favorites");
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert({ user_id: user.id, pet_id: petId });

        if (error) throw error;
        setFavorites(prev => [...prev, petId]);
        toast.success("Added to favorites");
      }
    } catch (error: any) {
      toast.error("Failed to update favorites", {
        description: error.message
      });
    }
  };

  const filteredPets = pets.filter((pet) => {
    const matchesSearch = 
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed?.toLowerCase().includes(breedFilter.toLowerCase());
    const matchesType = typeFilter === "all" || pet.species?.toLowerCase() === typeFilter.toLowerCase();
    const matchesSize = sizeFilter === "all" || pet.size?.toLowerCase() === sizeFilter.toLowerCase();
    const matchesAge = ageFilter === "all" || 
      (ageFilter === "young" && (pet.age || 0) <= 2) ||
      (ageFilter === "adult" && (pet.age || 0) > 2 && (pet.age || 0) <= 7) ||
      (ageFilter === "senior" && (pet.age || 0) > 7);
    
    return matchesSearch && matchesType && matchesSize && matchesAge;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Pet</h1>
          <p className="text-lg text-muted-foreground">
            Browse our available pets and find your new best friend
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="grid md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or breed..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Pet Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="dog">Dogs</SelectItem>
                <SelectItem value="cat">Cats</SelectItem>
                <SelectItem value="bird">Birds</SelectItem>
                <SelectItem value="rabbit">Rabbits</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sizeFilter} onValueChange={setSizeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ageFilter} onValueChange={setAgeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Age" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                <SelectItem value="young">Young (0-2 years)</SelectItem>
                <SelectItem value="adult">Adult (3-7 years)</SelectItem>
                <SelectItem value="senior">Senior (8+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredPets.length} {filteredPets.length === 1 ? 'pet' : 'pets'}
            </p>
            {favorites.length > 0 && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard" className="gap-2">
                  <Heart className="h-4 w-4 fill-love text-love" />
                  View {favorites.length} Favorites
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Pet Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Loading pets...</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPets.map((pet) => (
              <Card key={pet.id} className="overflow-hidden shadow-card hover:shadow-hover transition-all group">
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src={pet.image_url || 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=400&fit=crop'} 
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 right-2 shadow-md"
                    onClick={() => toggleFavorite(pet.id)}
                  >
                    <Heart 
                      className={`h-4 w-4 ${favorites.includes(pet.id) ? 'fill-love text-love' : ''}`}
                    />
                  </Button>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{pet.name}</CardTitle>
                      <CardDescription>{pet.breed || pet.species}</CardDescription>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {pet.species}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-2 pb-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {pet.age} {pet.age === 1 ? 'year' : 'years'}
                    </span>
                    {pet.size && <span className="capitalize">{pet.size}</span>}
                    {pet.gender && <span className="capitalize">{pet.gender}</span>}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {pet.vaccination_status && (
                      <Badge variant="secondary" className="text-xs">Vaccinated</Badge>
                    )}
                    {pet.spayed_neutered && (
                      <Badge variant="secondary" className="text-xs">Spayed/Neutered</Badge>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Button asChild className="w-full">
                    <Link to={`/pets/${pet.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {filteredPets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No pets found matching your criteria
            </p>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setTypeFilter("all");
              setSizeFilter("all");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pets;
