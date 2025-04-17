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

// Separate public routes from authenticated routes for clarity
function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={HomePage} />
      <Route path="/salons/:id" component={SalonProfilePage} />
      <Route path="/auth" component={AuthPage} />
      
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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Router />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
