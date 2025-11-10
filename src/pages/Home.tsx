import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, Stethoscope, Users, ArrowRight, PawPrint, Calendar, ShoppingBag } from "lucide-react";
import Navigation from "@/components/Navigation";
import heroPets from "@/assets/hero-pets.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90" />
        <img 
          src={heroPets} 
          alt="Happy pets" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative container py-24 md:py-32">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Find Your Perfect Companion
            </h1>
            <p className="text-xl md:text-2xl text-white/95">
              Connect with loving pets waiting for their forever home. Verified adoptions, complete health records, and lifetime support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" asChild className="shadow-hover">
                <Link to="/pets" className="gap-2">
                  <PawPrint className="h-5 w-5" />
                  Browse Pets
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-white/90 hover:bg-white">
                <Link to="/donate" className="gap-2">
                  <Heart className="h-5 w-5" />
                  Support a Shelter
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose PawHaven?</h2>
            <p className="text-lg text-muted-foreground">
              We provide everything you need for a successful pet adoption journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Verified Profiles</CardTitle>
                <CardDescription>
                  All pets are verified with complete health records and background information
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader>
                <Stethoscope className="h-12 w-12 text-health mb-4" />
                <CardTitle>Health Tracking</CardTitle>
                <CardDescription>
                  Monitor vaccinations, medical history, and schedule vet appointments easily
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Expert Support</CardTitle>
                <CardDescription>
                  Connect with veterinarians, trainers, and our supportive community
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="shadow-card hover:shadow-hover transition-shadow">
              <CardHeader>
                <Heart className="h-12 w-12 text-love mb-4" />
                <CardTitle>Lifetime Care</CardTitle>
                <CardDescription>
                  Access pet care resources, tips, and support throughout your pet's life
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Adoption Process</h2>
            <p className="text-lg text-muted-foreground">
              Four easy steps to welcome your new family member
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Browse", desc: "Search and filter pets by type, age, breed, and size" },
              { step: "2", title: "Connect", desc: "View detailed profiles and bookmark your favorites" },
              { step: "3", title: "Apply", desc: "Submit adoption request and track application status" },
              { step: "4", title: "Adopt", desc: "Complete the process and bring your pet home!" }
            ].map((item, idx) => (
              <div key={idx} className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-hero flex items-center justify-center text-2xl font-bold text-white mx-auto shadow-soft">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Sections */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-card shadow-soft border-0">
              <CardHeader>
                <Calendar className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Book Vet Appointments</CardTitle>
                <CardDescription>
                  Schedule check-ups and consultations through our platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="default" asChild className="w-full">
                  <Link to="/dashboard">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card shadow-soft border-0">
              <CardHeader>
                <ShoppingBag className="h-10 w-10 text-secondary mb-2" />
                <CardTitle>Pet Supply Store</CardTitle>
                <CardDescription>
                  Shop for food, toys, and essentials delivered to your door
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="default" asChild className="w-full">
                  <Link to="/store">Shop Now</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card shadow-soft border-0">
              <CardHeader>
                <Heart className="h-10 w-10 text-love mb-2" />
                <CardTitle>Make a Difference</CardTitle>
                <CardDescription>
                  Support shelters through donations or volunteer your time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="default" asChild className="w-full">
                  <Link to="/donate">Contribute</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">PawHaven</h3>
              <p className="text-sm text-muted-foreground">
                Connecting loving families with pets in need since 2024
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Adopt</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/pets" className="hover:text-primary">Find Pets</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary">My Applications</Link></li>
                <li><Link to="/resources" className="hover:text-primary">Adoption Guide</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/donate" className="hover:text-primary">Donate</Link></li>
                <li><Link to="/volunteer" className="hover:text-primary">Volunteer</Link></li>
                <li><Link to="/store" className="hover:text-primary">Shop</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/resources" className="hover:text-primary">Pet Care Tips</Link></li>
                <li><Link to="/resources" className="hover:text-primary">Health Articles</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary">Vet Services</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2024 PawHaven. All rights reserved. Made with ❤️ for pets and their humans.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
