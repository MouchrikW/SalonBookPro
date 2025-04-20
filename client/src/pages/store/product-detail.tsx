import { useState } from "react";
import { useStore } from "@/hooks/use-store";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Star,
  ShoppingCart,
  Check,
  Truck,
  RefreshCw,
  MinusCircle,
  PlusCircle,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Mock reviews
const reviews = [
  {
    id: 1,
    user: "Sarah L.",
    rating: 5,
    date: "2023-10-15",
    title: "Amazing product!",
    content:
      "I've been using this for a month now and my hair feels so much healthier. The scent is amazing too!",
    verifiedPurchase: true,
  },
  {
    id: 2,
    user: "Mohammed A.",
    rating: 4,
    date: "2023-09-22",
    title: "Good value for money",
    content:
      "Works as advertised. I've noticed less frizz and my hair looks shinier. Taking off one star because the bottle is a bit hard to squeeze.",
    verifiedPurchase: true,
  },
  {
    id: 3,
    user: "Fatima R.",
    rating: 5,
    date: "2023-11-03",
    title: "Worth every dirham!",
    content:
      "This has transformed my hair routine. I use it after every wash and my hair has never looked better. Will buy again!",
    verifiedPurchase: false,
  },
];

export default function ProductDetailPage({ id }: { id: number }) {
  const { getProductById, addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const product = getProductById(id);
  const { toast } = useToast();

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/store">Back to Store</Link>
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} has been added to your cart.`,
    });
  };

  const increaseQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="px-0 hover:bg-transparent">
          <Link href="/store" className="flex items-center text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Store
          </Link>
        </Button>
      </div>

      {/* Product Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <Badge variant="outline" className="self-start text-sm mb-2">
            {product.category}
          </Badge>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center text-amber-500 mr-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating) ? "fill-current" : ""
                  }`}
                />
              ))}
            </div>
            <span className="text-muted-foreground">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          <p className="text-muted-foreground mb-6">{product.shortDescription}</p>

          <div className="mb-6">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">
                {product.discountedPrice ? `${product.discountedPrice} MAD` : `${product.price} MAD`}
              </span>
              {product.discountedPrice && (
                <span className="text-lg text-muted-foreground line-through ml-3">
                  {product.price} MAD
                </span>
              )}
            </div>
            {product.discountedPrice && (
              <Badge variant="destructive" className="mt-2">
                Save {Math.round(((product.price - product.discountedPrice) / product.price) * 100)}%
              </Badge>
            )}
          </div>

          <div className="mb-6">
            <p className="font-medium mb-2">Quantity</p>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              <span className="mx-4 min-w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={increaseQuantity}
                disabled={quantity >= 10}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col space-y-3 mb-6">
            <Button className="w-full" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <div className="flex items-start">
              <Truck className="h-5 w-5 mr-3 text-primary" />
              <div>
                <h3 className="font-medium">Free Delivery</h3>
                <p className="text-sm text-muted-foreground">On orders over 500 MAD</p>
              </div>
            </div>
            <div className="flex items-start">
              <RefreshCw className="h-5 w-5 mr-3 text-primary" />
              <div>
                <h3 className="font-medium">30-Day Returns</h3>
                <p className="text-sm text-muted-foreground">Shop with confidence</p>
              </div>
            </div>
            <div className="flex items-start">
              <Check className="h-5 w-5 mr-3 text-primary" />
              <div>
                <h3 className="font-medium">Authentic Products</h3>
                <p className="text-sm text-muted-foreground">Guaranteed genuine items</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="mb-6">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="pt-4">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Product Details</h2>
            <p className="mb-4">{product.description}</p>

            <h3 className="text-xl font-semibold mb-3">Highlights</h3>
            <ul className="list-disc pl-5 mb-4 space-y-1">
              <li>Premium quality {product.category.toLowerCase()} product</li>
              <li>Made with natural ingredients</li>
              <li>Suitable for all skin/hair types</li>
              <li>Cruelty-free and paraben-free</li>
              <li>Made in Morocco</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">How to Use</h3>
            <p>
              Apply a small amount to clean, damp hair/skin. Massage gently and leave for a few minutes
              before rinsing. Use 2-3 times per week for best results.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="pt-4">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Customer Reviews</h2>
              <Button>Write a Review</Button>
            </div>

            <div className="flex items-center mb-6">
              <div className="flex items-center text-amber-500 mr-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? "fill-current" : ""
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-medium">
                {product.rating} out of 5 ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="space-y-6">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <div className="font-medium mr-2">{review.user}</div>
                        {review.verifiedPurchase && (
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                            <Check className="mr-1 h-3 w-3" />
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <span className="text-muted-foreground text-sm">
                        {new Date(review.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-amber-500 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(review.rating) ? "fill-current" : ""
                          }`}
                        />
                      ))}
                    </div>
                    <h4 className="font-medium mb-2">{review.title}</h4>
                    <p className="text-muted-foreground">{review.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => {
            // Get a different product for recommendations
            const relatedProductId = ((product.id + index) % 8) + 1;
            const relatedProduct = getProductById(relatedProductId);
            
            if (!relatedProduct || relatedProduct.id === product.id) return null;
            
            return (
              <Card key={index} className="group overflow-hidden">
                <Link href={`/store/products/${relatedProduct.id}`}>
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={relatedProduct.imageUrl} 
                      alt={relatedProduct.name} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <Badge variant="outline" className="mb-1 text-xs">
                      {relatedProduct.category}
                    </Badge>
                    <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-baseline mt-1">
                      <span className="font-bold">
                        {relatedProduct.discountedPrice 
                          ? `${relatedProduct.discountedPrice} MAD` 
                          : `${relatedProduct.price} MAD`
                        }
                      </span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}