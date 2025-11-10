import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Heart, DollarSign, Package, Users, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const Donate = () => {
  const [donationType, setDonationType] = useState<"money" | "supplies">("money");
  const [amount, setAmount] = useState("50");
  const [customAmount, setCustomAmount] = useState("");

  const handleMoneyDonation = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = amount === "custom" ? customAmount : amount;
    toast.success("Thank you for your donation!", {
      description: `Your $${finalAmount} donation will help care for animals in need.`
    });
  };

  const handleSuppliesDonation = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Supply donation registered!", {
      description: "We'll contact you with pickup/dropoff details."
    });
  };

  const presetAmounts = ["25", "50", "100", "250", "custom"];

  const impactItems = [
    { amount: "$25", impact: "Provides food for a pet for one week" },
    { amount: "$50", impact: "Covers basic vaccinations for one pet" },
    { amount: "$100", impact: "Supports medical care for emergency treatments" },
    { amount: "$250", impact: "Funds complete adoption preparation for one pet" }
  ];

  const neededSupplies = [
    "Pet food (dry and wet)",
    "Litter and litter boxes",
    "Blankets and bedding",
    "Toys and enrichment items",
    "Collars, leashes, and harnesses",
    "Food and water bowls",
    "Cleaning supplies",
    "Medical supplies"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Heart className="h-16 w-16 text-love mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Make a Difference</h1>
          <p className="text-lg text-muted-foreground">
            Your generosity helps us provide shelter, medical care, and love to animals waiting for their forever homes. Every contribution makes a real impact.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Main Donation Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-hover">
              <CardHeader>
                <CardTitle className="text-2xl">Choose Your Donation</CardTitle>
                <CardDescription>
                  Select how you'd like to help our furry friends
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Donation Type Selector */}
                <RadioGroup 
                  value={donationType} 
                  onValueChange={(value) => setDonationType(value as "money" | "supplies")}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="money" id="money" className="peer sr-only" />
                    <Label
                      htmlFor="money"
                      className="flex flex-col items-center justify-between rounded-lg border-2 border-border bg-card p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                    >
                      <DollarSign className="h-8 w-8 mb-2" />
                      <span className="font-semibold">Monetary Donation</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="supplies" id="supplies" className="peer sr-only" />
                    <Label
                      htmlFor="supplies"
                      className="flex flex-col items-center justify-between rounded-lg border-2 border-border bg-card p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                    >
                      <Package className="h-8 w-8 mb-2" />
                      <span className="font-semibold">Donate Supplies</span>
                    </Label>
                  </div>
                </RadioGroup>

                {/* Money Donation Form */}
                {donationType === "money" && (
                  <form onSubmit={handleMoneyDonation} className="space-y-6">
                    <div className="space-y-3">
                      <Label>Select Amount</Label>
                      <div className="grid grid-cols-5 gap-2">
                        {presetAmounts.map((preset) => (
                          <Button
                            key={preset}
                            type="button"
                            variant={amount === preset ? "default" : "outline"}
                            onClick={() => setAmount(preset)}
                            className="h-12"
                          >
                            {preset === "custom" ? "Custom" : `$${preset}`}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {amount === "custom" && (
                      <div className="space-y-2">
                        <Label htmlFor="customAmount">Custom Amount</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="customAmount"
                            type="number"
                            min="1"
                            placeholder="Enter amount"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your@email.com" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message (Optional)</Label>
                      <Textarea 
                        id="message"
                        placeholder="Leave a message of support..."
                        rows={3}
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      <Heart className="mr-2 h-5 w-5" />
                      Donate ${amount === "custom" ? customAmount || "0" : amount}
                    </Button>
                  </form>
                )}

                {/* Supplies Donation Form */}
                {donationType === "supplies" && (
                  <form onSubmit={handleSuppliesDonation} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your@email.com" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="(555) 123-4567" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="items">Items You're Donating</Label>
                      <Textarea 
                        id="items"
                        placeholder="List the items you'd like to donate..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Delivery Method</Label>
                      <RadioGroup defaultValue="dropoff">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dropoff" id="dropoff" />
                          <Label htmlFor="dropoff" className="font-normal">
                            I'll drop off the items
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pickup" id="pickup" />
                          <Label htmlFor="pickup" className="font-normal">
                            Please arrange pickup
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      <Package className="mr-2 h-5 w-5" />
                      Submit Supply Donation
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Impact Section */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-health" />
                  Your Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {impactItems.map((item, idx) => (
                  <div key={idx} className="pb-3 border-b border-border last:border-0 last:pb-0">
                    <p className="font-semibold text-primary">{item.amount}</p>
                    <p className="text-sm text-muted-foreground">{item.impact}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Needed Supplies */}
            {donationType === "supplies" && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-secondary" />
                    Most Needed Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {neededSupplies.map((supply, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-health mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{supply}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Volunteer CTA */}
            <Card className="shadow-card bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-accent" />
                  Volunteer With Us
                </CardTitle>
                <CardDescription>
                  Can't donate? Consider volunteering your time!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Learn About Volunteering
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 p-8 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">500+</div>
            <p className="text-sm text-muted-foreground">Pets Adopted</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">$50K+</div>
            <p className="text-sm text-muted-foreground">Raised This Year</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">200+</div>
            <p className="text-sm text-muted-foreground">Active Volunteers</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">95%</div>
            <p className="text-sm text-muted-foreground">Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
