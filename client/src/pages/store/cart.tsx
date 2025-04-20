import { useStore } from "@/hooks/use-store";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingBag,
  Trash2,
  ChevronLeft,
  MinusCircle,
  PlusCircle,
  ShoppingCart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CartPage() {
  const { cart, updateCartItemQuantity, removeFromCart, totalAmount } = useStore();
  const { toast } = useToast();

  const handleRemoveItem = (productId: number, productName: string) => {
    removeFromCart(productId);
    toast({
      title: "Item removed",
      description: `${productName} has been removed from your cart.`,
    });
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
        <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">
          Looks like you haven't added any products to your cart yet.
        </p>
        <Button asChild>
          <Link href="/store">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="px-0 hover:bg-transparent">
          <Link href="/store" className="flex items-center text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Continue Shopping
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Shopping Cart</h1>
              <div className="text-muted-foreground">
                {cart.length} {cart.length === 1 ? "item" : "items"}
              </div>
            </div>

            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.productId}>
                  <div className="flex items-center space-x-4">
                    <div className="h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between mb-1">
                        <Link href={`/store/products/${item.productId}`}>
                          <h3 className="font-medium hover:text-primary transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                        <div className="font-bold">
                          {item.product.discountedPrice
                            ? item.product.discountedPrice * item.quantity
                            : item.product.price * item.quantity}{" "}
                          MAD
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.product.shortDescription}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => 
                              updateCartItemQuantity(item.productId, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <span className="w-6 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => 
                              updateCartItemQuantity(item.productId, item.quantity + 1)
                            }
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.productId, item.product.name)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Separator className="mt-6" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{totalAmount.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {totalAmount >= 500 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      "50.00 MAD"
                    )}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>
                    {totalAmount >= 500
                      ? totalAmount.toFixed(2)
                      : (totalAmount + 50).toFixed(2)}{" "}
                    MAD
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {totalAmount >= 500
                    ? "You qualify for free shipping!"
                    : `Add ${(500 - totalAmount).toFixed(2)} MAD more to qualify for free shipping.`}
                </p>
              </div>
              <Button className="w-full mt-6" asChild>
                <Link href="/store/checkout">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Proceed to Checkout
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}