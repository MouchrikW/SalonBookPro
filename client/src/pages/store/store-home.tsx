import { useState } from "react";
import { Link } from "wouter";
import { useStore } from "@/hooks/use-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Star, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StoreHomePage() {
  const { products, featuredProducts, getProductsByCategory, addToCart } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const { toast } = useToast();
  
  // Get products to display based on active category and search query
  const getDisplayProducts = () => {
    let displayProducts = activeCategory === "all" 
      ? products 
      : getProductsByCategory(activeCategory);
      
    // Filter by search query if any
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      displayProducts = displayProducts.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query)
      );
    }
    
    return displayProducts;
  };
  
  const displayProducts = getDisplayProducts();
  
  // Handle adding product to cart
  const handleAddToCart = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart(product, 1);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Beauty Product Store</h1>
          <p className="text-muted-foreground max-w-2xl">
            Discover premium beauty products from Morocco's top salons and brands.
            All products are authentic and carefully selected by professionals.
          </p>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="w-full max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search products, brands, categories..."
            className="pl-10 py-6 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        </div>
      </div>
      
      {/* Featured Products Carousel */}
      {featuredProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <Card key={product.id} className="group overflow-hidden">
                <div className="h-56 overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-1">
                    <Badge variant="outline" className="bg-primary/10 text-primary font-normal">
                      {product.category}
                    </Badge>
                    <div className="flex items-center text-amber-500">
                      <Star className="fill-current h-4 w-4 mr-1" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                  </div>
                  <Link href={`/store/products/${product.id}`}>
                    <h3 className="font-semibold hover:text-primary transition-colors mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                    {product.shortDescription}
                  </p>
                  <div className="flex items-baseline">
                    <span className="text-lg font-bold">{product.discountedPrice ? `${product.discountedPrice} MAD` : `${product.price} MAD`}</span>
                    {product.discountedPrice && (
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        {product.price} MAD
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Product Categories */}
      <Tabs 
        defaultValue="all" 
        className="mb-12"
        onValueChange={setActiveCategory}
      >
        <h2 className="text-2xl font-semibold mb-4">Shop by Category</h2>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="Hair">Hair</TabsTrigger>
          <TabsTrigger value="Skin">Skin</TabsTrigger>
          <TabsTrigger value="Makeup">Makeup</TabsTrigger>
          <TabsTrigger value="Tools">Tools</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeCategory} className="mt-0">
          {displayProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayProducts.map(product => (
                <Card key={product.id} className="group overflow-hidden">
                  <div className="h-56 overflow-hidden">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start mb-1">
                      <Badge variant="outline" className="bg-primary/10 text-primary font-normal">
                        {product.category}
                      </Badge>
                      <div className="flex items-center text-amber-500">
                        <Star className="fill-current h-4 w-4 mr-1" />
                        <span className="text-sm">{product.rating}</span>
                      </div>
                    </div>
                    <Link href={`/store/products/${product.id}`}>
                      <h3 className="font-semibold hover:text-primary transition-colors mb-1 line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                      {product.shortDescription}
                    </p>
                    <div className="flex items-baseline">
                      <span className="text-lg font-bold">{product.discountedPrice ? `${product.discountedPrice} MAD` : `${product.price} MAD`}</span>
                      {product.discountedPrice && (
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          {product.price} MAD
                        </span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      variant="default" 
                      className="w-full"
                      onClick={() => handleAddToCart(product.id)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria.</p>
              <Button onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}>
                Reset Filters
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Brand Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Our Featured Brands</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["MoroccanGlow", "RoseBotanicals", "SalonPro", "ColorFusion", "AtlasSkincare", "SalonEssentials"].map((brand, index) => (
            <Card key={index} className="flex items-center justify-center p-6 bg-muted/50 hover:bg-primary/5 transition-colors cursor-pointer">
              <h3 className="text-lg font-semibold text-primary">{brand}</h3>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}