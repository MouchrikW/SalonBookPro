import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  // Default values if auth fails
  let user = null;
  let isLoading = false;
  
  try {
    const auth = useAuth();
    user = auth.user;
    isLoading = auth.isLoading;
  } catch (error) {
    console.error("Auth provider not available:", error);
    // If auth provider is not available, redirect to auth page
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}
