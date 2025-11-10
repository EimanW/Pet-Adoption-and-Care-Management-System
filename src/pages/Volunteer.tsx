import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Heart, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";

const Volunteer = () => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }
    toast.success("Application submitted!", {
      description: "We'll review your application and contact you soon."
    });
  };

  const opportunities = [
    {
      title: "Dog Walking",
      description: "Help our dogs get exercise and socialization",
      commitment: "2-3 hours/week",
      icon: "🐕"
    },
    {
      title: "Cat Socialization",
      description: "Spend time playing with and caring for cats",
      commitment: "2-4 hours/week",
      icon: "🐱"
    },
    {
      title: "Event Support",
      description: "Help at adoption events and fundraisers",
      commitment: "As needed",
      icon: "🎪"
    },
    {
      title: "Foster Care",
      description: "Provide temporary homes for pets",
      commitment: "Varies",
      icon: "🏠"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Users className="h-16 w-16 text-accent mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Become a Volunteer</h1>
          <p className="text-lg text-muted-foreground">
            Join our community of dedicated volunteers and make a real difference in the lives of animals. Your time and compassion can change everything.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Application Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-hover">
              <CardHeader>
                <CardTitle className="text-2xl">Volunteer Application</CardTitle>
                <CardDescription>
                  Fill out the form below to start your volunteering journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Personal Information</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" required />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input id="phone" type="tel" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" placeholder="Street address" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input id="zip" />
                      </div>
                    </div>
                  </div>

                  {/* Volunteer Preferences */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Volunteer Preferences</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="interests">Areas of Interest *</Label>
                      <Select required>
                        <SelectTrigger id="interests">
                          <SelectValue placeholder="Select an area" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="walking">Dog Walking</SelectItem>
                          <SelectItem value="cats">Cat Care</SelectItem>
                          <SelectItem value="events">Event Support</SelectItem>
                          <SelectItem value="foster">Foster Care</SelectItem>
                          <SelectItem value="admin">Administrative</SelectItem>
                          <SelectItem value="transport">Transportation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="availability">Availability *</Label>
                      <Select required>
                        <SelectTrigger id="availability">
                          <SelectValue placeholder="Select your availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekday-morning">Weekday Mornings</SelectItem>
                          <SelectItem value="weekday-afternoon">Weekday Afternoons</SelectItem>
                          <SelectItem value="weekday-evening">Weekday Evenings</SelectItem>
                          <SelectItem value="weekend">Weekends</SelectItem>
                          <SelectItem value="flexible">Flexible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hours">Hours Per Week</Label>
                      <Select>
                        <SelectTrigger id="hours">
                          <SelectValue placeholder="Select hours" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2">1-2 hours</SelectItem>
                          <SelectItem value="3-5">3-5 hours</SelectItem>
                          <SelectItem value="6-10">6-10 hours</SelectItem>
                          <SelectItem value="10+">10+ hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Experience & Skills</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="experience">Do you have experience with pets?</Label>
                      <Textarea 
                        id="experience"
                        placeholder="Tell us about your experience with animals..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills">Special Skills or Qualifications</Label>
                      <Textarea 
                        id="skills"
                        placeholder="Any relevant skills, certifications, or experience..."
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="motivation">Why do you want to volunteer with us? *</Label>
                      <Textarea 
                        id="motivation"
                        placeholder="Share your motivation..."
                        rows={4}
                        required
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={agreedToTerms}
                      onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to undergo a background check and commit to the volunteer requirements. I understand that PawHaven reserves the right to accept or decline volunteer applications.
                    </label>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Submit Application
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Opportunities */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Volunteer Opportunities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {opportunities.map((opp, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{opp.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{opp.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {opp.description}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {opp.commitment}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <p className="text-muted-foreground">Must be 18 years or older</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <p className="text-muted-foreground">Complete background check</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <p className="text-muted-foreground">Attend orientation session</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <p className="text-muted-foreground">Commit to minimum 3 months</p>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle>Our Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-2xl font-bold text-primary">200+</div>
                  <p className="text-sm text-muted-foreground">Active Volunteers</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">5,000+</div>
                  <p className="text-sm text-muted-foreground">Volunteer Hours This Year</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <p className="text-sm text-muted-foreground">Animals Helped</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
