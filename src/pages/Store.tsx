import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShoppingCart, Star, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const Store = () => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  // Load products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      // @ts-expect-error - Supabase types don't include store_products yet
      const { data, error } = await supabase
        .from('store_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        // Fallback to hardcoded products if database query fails
        setProducts(hardcodedProducts);
      } else if (data && data.length > 0) {
        setProducts(data.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          rating: 4.7, // Default rating
          image: p.image_url,
          description: p.description
        })));
      } else {
        setProducts(hardcodedProducts);
      }
    };

    fetchProducts();
  }, []);

  const hardcodedProducts: Product[] = [
    {
      id: "1",
      name: "Premium Dog Food - 25lb",
      category: "Food",
      price: 49.99,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop",
      description: "High-quality nutrition for adult dogs"
    },
    {
      id: "2",
      name: "Cat Litter Box Set",
      category: "Supplies",
      price: 34.99,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&h=400&fit=crop",
      description: "Complete litter box with hood and scoop"
    },
    {
      id: "3",
      name: "Interactive Dog Toy Bundle",
      category: "Toys",
      price: 24.99,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1535324492437-cdd3a2b1cd3b?w=400&h=400&fit=crop",
      description: "3-piece set of durable chew toys"
    },
    {
      id: "4",
      name: "Cat Grooming Kit",
      category: "Grooming",
      price: 29.99,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&h=400&fit=crop",
      description: "Complete grooming tools for cats"
    },
    {
      id: "5",
      name: "Orthopedic Dog Bed - Large",
      category: "Accessories",
      price: 79.99,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&h=400&fit=crop",
      description: "Memory foam bed for senior dogs"
    },
    {
      id: "6",
      name: "Automatic Pet Feeder",
      category: "Supplies",
      price: 59.99,
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1625316708582-7c38734be31d?w=400&h=400&fit=crop",
      description: "Programmable feeder with timer"
    },
    {
      id: "7",
      name: "Cat Tree Tower",
      category: "Accessories",
      price: 89.99,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&h=400&fit=crop",
      description: "Multi-level climbing tree with scratching posts"
    },
    {
      id: "8",
      name: "Dog Training Treats",
      category: "Food",
      price: 14.99,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1615751072497-5f5169febe17?w=400&h=400&fit=crop",
      description: "Healthy, low-calorie training rewards"
    },
    {
      id: "9",
      name: "Pet Carrier Backpack",
      category: "Accessories",
      price: 44.99,
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=400&h=400&fit=crop",
      description: "Comfortable carrier for small pets"
    }
  ];

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    
    toast.success("Added to cart!", {
      description: `${product.name} has been added to your cart.`
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please log in to place an order");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsCheckingOut(true);

    try {
      const totalAmount = getTotalPrice();

      // @ts-expect-error - Supabase types don't include store_orders yet
      const { data: orderData, error: orderError } = await supabase
        .from('store_orders')
        .insert({
          user_id: user.id,
          total_amount: totalAmount,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }));

      // @ts-expect-error - Supabase types don't include order_items yet
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      toast.success("Order placed successfully!", {
        description: `Your order of $${totalAmount.toFixed(2)} has been placed.`
      });

      // Clear cart and close dialog
      setCart([]);
      setShowCart(false);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error("Failed to place order", {
        description: "Please try again or contact support."
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const categories = ["All", "Food", "Toys", "Supplies", "Grooming", "Accessories"];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Pet Supply Store</h1>
              <p className="text-lg text-muted-foreground">
                Everything your pet needs, delivered to your door
              </p>
            </div>
            <Button size="lg" className="gap-2" onClick={() => setShowCart(true)}>
              <ShoppingCart className="h-5 w-5" />
              Cart ({getTotalItems()})
            </Button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
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

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden shadow-card hover:shadow-hover transition-shadow group">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-3 left-3 shadow-md">
                  {product.category}
                </Badge>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    ${product.price}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span>{product.rating}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 p-8 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-3xl mb-2">🚚</div>
            <h3 className="font-semibold mb-2">Free Shipping</h3>
            <p className="text-sm text-muted-foreground">
              On orders over $50
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">💯</div>
            <h3 className="font-semibold mb-2">Quality Guaranteed</h3>
            <p className="text-sm text-muted-foreground">
              30-day money-back guarantee
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">📞</div>
            <h3 className="font-semibold mb-2">24/7 Support</h3>
            <p className="text-sm text-muted-foreground">
              Expert advice available
            </p>
          </div>
        </div>
      </div>

      {/* Cart Dialog */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Shopping Cart</DialogTitle>
            <DialogDescription>
              {cart.length === 0 ? "Your cart is empty" : `${getTotalItems()} item(s) in cart`}
            </DialogDescription>
          </DialogHeader>

          {cart.length > 0 && (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.product.name}</h4>
                    <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCart(false)}>
              Continue Shopping
            </Button>
            <Button 
              onClick={handleCheckout}
              disabled={cart.length === 0 || isCheckingOut}
            >
              {isCheckingOut ? "Processing..." : "Checkout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Store;
