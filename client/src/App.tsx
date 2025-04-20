import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import SalonProfilePage from "@/pages/salon-profile-page";
import AuthPage from "@/pages/auth-page";
import BookingPage from "@/pages/booking-page";
import UserDashboard from "@/pages/user-dashboard";
import SalonDashboard from "@/pages/salon-dashboard";
import { ProtectedRoute } from "./lib/protected-route";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import { StoreProvider } from "./hooks/use-store";
import { lazy, Suspense } from "react";

// Lazy load store pages for code splitting
const StoreHomePage = lazy(() => import("@/pages/store/store-home"));
const ProductDetailPage = lazy(() => import("@/pages/store/product-detail"));
const CartPage = lazy(() => import("@/pages/store/cart"));
const CheckoutPage = lazy(() => import("@/pages/store/checkout"));

// Separate public routes from authenticated routes for clarity
function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={HomePage} />
      <Route path="/salons/:id" component={SalonProfilePage} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Store Routes */}
      <Route path="/store">
        {() => (
          <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <StoreHomePage />
          </Suspense>
        )}
      </Route>
      <Route path="/store/products/:id">
        {({ id }) => (
          <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <ProductDetailPage id={parseInt(id)} />
          </Suspense>
        )}
      </Route>
      <Route path="/store/cart">
        {() => (
          <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <CartPage />
          </Suspense>
        )}
      </Route>
      <Route path="/store/checkout">
        {() => (
          <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <CheckoutPage />
          </Suspense>
        )}
      </Route>
      
      {/* Protected Routes */}
      <ProtectedRoute path="/booking/:salonId/:serviceId" component={BookingPage} />
      <ProtectedRoute path="/dashboard" component={UserDashboard} />
      <ProtectedRoute path="/salon-dashboard" component={SalonDashboard} />
      
      {/* 404 Route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <StoreProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
        <Toaster />
      </div>
    </StoreProvider>
  );
}

export default App;
