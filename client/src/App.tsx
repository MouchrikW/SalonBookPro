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

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/salons/:id" component={SalonProfilePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/booking/:salonId/:serviceId" component={BookingPage} />
      <ProtectedRoute path="/dashboard" component={UserDashboard} />
      <ProtectedRoute path="/salon-dashboard" component={SalonDashboard} />
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
