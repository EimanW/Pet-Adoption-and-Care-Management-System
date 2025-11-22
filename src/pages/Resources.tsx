import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Heart, Info, Utensils, Scissors, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  author_name: string | null;
  read_time: string | null;
  published_at: string;
}

const Resources = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Training", "Nutrition", "Grooming", "Health", "General", "Exercise"];

  const categoryIcons: Record<string, any> = {
    Training: GraduationCap,
    Nutrition: Utensils,
    Grooming: Scissors,
    Health: Heart,
    General: Info,
    Exercise: Calendar,
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('care_articles')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;
      setArticles((data as unknown as Article[]) || []);
    } catch (error: any) {
      toast.error("Failed to load articles", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = selectedCategory === "All" 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

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
              variant={category === selectedCategory ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Loading articles...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No articles found</p>
          </div>
        ) : (
          <>
            {/* Featured Articles */}
            {filteredArticles.length >= 2 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
                <div className="grid lg:grid-cols-2 gap-6">
                  {filteredArticles.slice(0, 2).map((article) => (
                    <Card key={article.id} className="overflow-hidden shadow-hover hover:shadow-hover transition-shadow group">
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={article.image_url || 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=400&fit=crop'} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className="absolute top-4 left-4 shadow-md">
                          {article.category}
                        </Badge>
                      </div>
                      <CardHeader>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(article.published_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {article.read_time || '5 min read'}
                          </span>
                        </div>
                        <CardTitle className="text-2xl hover:text-primary transition-colors">
                          {article.title}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {article.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button>Read Article</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Articles Grid */}
            {filteredArticles.length > 2 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">All Articles</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.slice(2).map((article) => {
                    const Icon = categoryIcons[article.category] || Info;
                    return (
                      <Card key={article.id} className="overflow-hidden shadow-card hover:shadow-hover transition-shadow group">
                        <div className="relative h-48 overflow-hidden">
                          <img 
                            src={article.image_url || 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=400&fit=crop'} 
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
                              {new Date(article.published_at).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {article.read_time || '5 min read'}
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
            )}
          </>
        )}

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
