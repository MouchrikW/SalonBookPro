import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useStore } from "@/hooks/use-store";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingCart, CreditCard, ChevronLeft, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { cart, totalAmount, clearCart } = useStore();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [orderComplete, setOrderComplete] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvc: "",
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, we would send the order to a backend API
    // For this demo, we'll just simulate a successful checkout
    
    setTimeout(() => {
      setOrderComplete(true);
      clearCart();
      
      toast({
        title: "Order placed successfully",
        description: "Your order has been received and is being processed.",
      });
    }, 1500);
  };
  
  // Navigate back if cart is empty (unless order is complete)
  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
        <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">
          You need to add items to your cart before proceeding to checkout.
        </p>
        <Button asChild>
          <Link href="/store">Continue Shopping</Link>
        </Button>
      </div>
    );
  }
  
  // Order complete confirmation
  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Your order has been placed and will be processed soon. We've sent a confirmation email with all the details.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/store">Continue Shopping</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">View Your Orders</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back link */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="px-0 hover:bg-transparent">
          <Link href="/store/cart" className="flex items-center text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Cart
          </Link>
        </Button>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {/* Customer Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Shipping Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="mb-4">
                <Label htmlFor="address">Street Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="resize-none"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">Postal Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" defaultValue="Morocco" disabled />
                </div>
              </div>
            </div>
            
            {/* Payment Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              
              <RadioGroup defaultValue="card" value={paymentMethod} onValueChange={setPaymentMethod} className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Credit/Debit Card
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">Cash on Delivery</Label>
                </div>
              </RadioGroup>
              
              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardExpiry">Expiry Date (MM/YY)</Label>
                      <Input
                        id="cardExpiry"
                        name="cardExpiry"
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardCvc">CVC</Label>
                      <Input
                        id="cardCvc"
                        name="cardCvc"
                        placeholder="123"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <Button type="submit" className="w-full py-6 text-lg">
              Complete Order
            </Button>
          </form>
        </div>
        
        {/* Order Summary */}
        <div>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-4">
                {cart.map((item) => (
                  <div key={item.productId} className="flex justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded overflow-hidden mr-3 flex-shrink-0">
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="font-medium">
                      {(item.product.discountedPrice || item.product.price) * item.quantity} MAD
                    </div>
                  </div>
                ))}
              </div>
              
              <Separator className="my-4" />
              
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}