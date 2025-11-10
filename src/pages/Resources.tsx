import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Heart, Info, Utensils, Scissors, GraduationCap } from "lucide-react";

const Resources = () => {
  const articles = [
    {
      id: "1",
      title: "Complete Guide to Puppy Training",
      category: "Training",
      excerpt: "Learn essential training techniques for your new puppy, from basic commands to house training.",
      date: "2024-10-25",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop",
      icon: GraduationCap,
      readTime: "8 min read"
    },
    {
      id: "2",
      title: "Nutrition Basics for Cats",
      category: "Nutrition",
      excerpt: "Understand what your cat needs nutritionally at different life stages for optimal health.",
      date: "2024-10-22",
      image: "https://images.unsplash.com/photo-1529257414772-1960b7bea4eb?w=600&h=400&fit=crop",
      icon: Utensils,
      readTime: "6 min read"
    },
    {
      id: "3",
      title: "Grooming Your Dog at Home",
      category: "Grooming",
      excerpt: "Step-by-step guide to grooming your dog, including bathing, brushing, and nail trimming.",
      date: "2024-10-20",
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&h=400&fit=crop",
      icon: Scissors,
      readTime: "10 min read"
    },
    {
      id: "4",
      title: "Understanding Pet Vaccination Schedules",
      category: "Health",
      excerpt: "A comprehensive overview of essential vaccinations and when your pet should receive them.",
      date: "2024-10-18",
      image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=600&h=400&fit=crop",
      icon: Heart,
      readTime: "7 min read"
    },
    {
      id: "5",
      title: "First-Time Pet Owner's Checklist",
      category: "General",
      excerpt: "Everything you need to prepare your home for a new pet, from supplies to safety tips.",
      date: "2024-10-15",
      image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=400&fit=crop",
      icon: Info,
      readTime: "5 min read"
    },
    {
      id: "6",
      title: "Creating a Pet-Friendly Exercise Routine",
      category: "Exercise",
      excerpt: "Tips for keeping your pet active and healthy with age-appropriate exercise routines.",
      date: "2024-10-12",
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=400&fit=crop",
      icon: Calendar,
      readTime: "9 min read"
    }
  ];

  const categories = ["All", "Training", "Nutrition", "Grooming", "Health", "General", "Exercise"];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Pet Care Resources</h1>
          <p className="text-lg text-muted-foreground">
            Expert advice and guides to help you provide the best care for your pet
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <Button 
              key={category} 
              variant={category === "All" ? "default" : "outline"}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Featured Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="overflow-hidden shadow-hover hover:shadow-hover transition-shadow group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={articles[0].image} 
                  alt={articles[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 shadow-md">
                  {articles[0].category}
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {articles[0].date}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {articles[0].readTime}
                  </span>
                </div>
                <CardTitle className="text-2xl hover:text-primary transition-colors">
                  {articles[0].title}
                </CardTitle>
                <CardDescription className="text-base">
                  {articles[0].excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button>Read Article</Button>
              </CardContent>
            </Card>

            <Card className="overflow-hidden shadow-hover hover:shadow-hover transition-shadow group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={articles[1].image} 
                  alt={articles[1].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 shadow-md">
                  {articles[1].category}
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {articles[1].date}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {articles[1].readTime}
                  </span>
                </div>
                <CardTitle className="text-2xl hover:text-primary transition-colors">
                  {articles[1].title}
                </CardTitle>
                <CardDescription className="text-base">
                  {articles[1].excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button>Read Article</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* All Articles Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">All Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(2).map((article) => {
              const Icon = article.icon;
              return (
                <Card key={article.id} className="overflow-hidden shadow-card hover:shadow-hover transition-shadow group">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 shadow-md">
                      {article.category}
                    </Badge>
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {article.readTime}
                      </span>
                    </div>
                    <CardTitle className="text-lg hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button variant="outline" size="sm" className="w-full">
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Tips Section */}
        <div className="bg-muted/30 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Quick Care Tips</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <GraduationCap className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Training</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Start training early with positive reinforcement</li>
                  <li>• Be consistent with commands and rewards</li>
                  <li>• Keep training sessions short and fun</li>
                  <li>• Socialize your pet with other animals</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <Utensils className="h-10 w-10 text-secondary mb-2" />
                <CardTitle>Nutrition</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Feed age-appropriate, quality food</li>
                  <li>• Maintain regular feeding schedule</li>
                  <li>• Always provide fresh water</li>
                  <li>• Avoid toxic foods like chocolate, grapes</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <Heart className="h-10 w-10 text-health mb-2" />
                <CardTitle>Health</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Schedule regular vet checkups</li>
                  <li>• Keep vaccinations up to date</li>
                  <li>• Watch for behavior changes</li>
                  <li>• Maintain dental hygiene</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
