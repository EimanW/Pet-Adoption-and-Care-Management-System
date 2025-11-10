import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Search, MapPin, Calendar } from "lucide-react";
import { mockPets } from "@/data/mockPets";
import { Pet, PetType, PetSize } from "@/types/pet";

const Pets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<PetType | "all">("all");
  const [sizeFilter, setSizeFilter] = useState<PetSize | "all">("all");
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredPets = mockPets.filter((pet) => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || pet.type === typeFilter;
    const matchesSize = sizeFilter === "all" || pet.size === sizeFilter;
    const isAvailable = pet.status === "available";
    
    return matchesSearch && matchesType && matchesSize && isAvailable;
  });

  const toggleFavorite = (petId: string) => {
    setFavorites(prev => 
      prev.includes(petId) 
        ? prev.filter(id => id !== petId)
        : [...prev, petId]
    );
  };

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
          <div className="grid md:grid-cols-4 gap-4">
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
            
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as PetType | "all")}>
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
            
            <Select value={sizeFilter} onValueChange={(value) => setSizeFilter(value as PetSize | "all")}>
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPets.map((pet) => (
            <Card key={pet.id} className="overflow-hidden shadow-card hover:shadow-hover transition-all group">
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={pet.image} 
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
                <Badge className="absolute bottom-2 left-2 bg-card/90 backdrop-blur">
                  ${pet.adoptionFee}
                </Badge>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{pet.name}</CardTitle>
                    <CardDescription>{pet.breed}</CardDescription>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {pet.type}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-2 pb-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {pet.age} {pet.age === 1 ? 'year' : 'years'}
                  </span>
                  <span className="capitalize">{pet.size}</span>
                  <span className="capitalize">{pet.gender}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {pet.location}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {pet.vaccinated && (
                    <Badge variant="secondary" className="text-xs">Vaccinated</Badge>
                  )}
                  {pet.neutered && (
                    <Badge variant="secondary" className="text-xs">Neutered</Badge>
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
