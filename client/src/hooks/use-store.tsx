import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Product, CartItem, sampleProducts } from "@/models/product";

type StoreContextType = {
  products: Product[];
  featuredProducts: Product[]; 
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartItemQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  getProductsByCategory: (category: string) => Product[];
  getProductById: (id: number) => Product | undefined;
};

// Initial context value
const initialStoreContextValue: StoreContextType = {
  products: [],
  featuredProducts: [],
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartItemQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalAmount: 0,
  getProductsByCategory: () => [],
  getProductById: () => undefined,
};

export const StoreContext = createContext<StoreContextType>(initialStoreContextValue);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Initialize products from sample data
  useEffect(() => {
    setProducts(sampleProducts);
    
    // Try to load cart from localStorage
    const savedCart = localStorage.getItem('salonbook_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('salonbook_cart', JSON.stringify(cart));
  }, [cart]);
  
  // Get featured products
  const featuredProducts = products.filter(product => product.featured);
  
  // Get products by category
  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };
  
  // Get product by id
  const getProductById = (id: number) => {
    return products.find(product => product.id === id);
  };
  
  // Add product to cart
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.productId === product.id);
      
      if (existingItemIndex !== -1) {
        // Item already exists, update quantity
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        // Add new item to cart
        return [...prevCart, { productId: product.id, quantity, product }];
      }
    });
  };
  
  // Remove product from cart
  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };
  
  // Update cart item quantity
  const updateCartItemQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.productId === productId) {
          return { ...item, quantity };
        }
        return item;
      });
    });
  };
  
  // Clear cart
  const clearCart = () => {
    setCart([]);
  };
  
  // Calculate total items in cart
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate total amount
  const totalAmount = cart.reduce((total, item) => {
    const price = item.product.discountedPrice || item.product.price;
    return total + (price * item.quantity);
  }, 0);
  
  return (
    <StoreContext.Provider
      value={{
        products,
        featuredProducts,
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        totalItems,
        totalAmount,
        getProductsByCategory,
        getProductById,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}