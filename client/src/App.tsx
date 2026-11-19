import React, { Suspense, lazy } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { AuthAccountProvider } from "@/context/AuthAccountContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Toaster } from "@/components/ui/toaster";
import PremiumHomepage from "@/pages/PremiumHomepage";

const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const VerifyOtpPage = lazy(() => import("@/pages/auth/VerifyOtpPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage"));
const ProfileCreatedByPage = lazy(() => import("@/pages/auth/ProfileCreatedByPage"));
const AccountStatusPage = lazy(() => import("@/pages/auth/AccountStatusPage"));
const ProfileWizardPage = lazy(() => import("@/pages/profile/ProfileWizardPage"));
const UserDashboardPage = lazy(() => import("@/pages/dashboard/UserDashboardPage"));
const AdminPortalPage = lazy(() => import("@/pages/admin/AdminPortalPage"));
const Landing = lazy(() => import("@/pages/Landing"));
const AboutUs = lazy(() => import("@/pages/AboutUs"));

const MobilePrototypeRoute = lazy(async () => {
  const [{ MobileAppProvider }, { MobileDeviceShell }] = await Promise.all([
    import("@/context/MobileAppContext"),
    import("@/components/mobile/MobileDeviceShell"),
  ]);
  return {
    default: () => (
      <MobileAppProvider>
        <MobileDeviceShell />
      </MobileAppProvider>
    ),
  };
});

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-4 border-amber-200 border-t-[#FF7700] animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthAccountProvider>
          <Suspense fallback={<PageLoader />}>
            <Switch>
              {/* Phase 1 Website - Class-1 Premium Homepage */}
              <Route path="/" component={PremiumHomepage} />

              {/* Programme 01 - User Authentication & Account Management */}
              <Route path="/login" component={LoginPage} />
              <Route path="/register" component={RegisterPage} />
              <Route path="/registration" component={RegisterPage} />
              <Route path="/verify-otp" component={VerifyOtpPage} />
              <Route path="/forgot-password" component={ForgotPasswordPage} />
              <Route path="/profile-created-by" component={ProfileCreatedByPage} />
              <Route path="/account-status" component={AccountStatusPage} />
              <Route path="/profile-setup" component={ProfileWizardPage} />
              <Route path="/profile-wizard" component={ProfileWizardPage} />
              <Route path="/dashboard" component={UserDashboardPage} />
              <Route path="/matches" component={UserDashboardPage} />
              <Route path="/search" component={UserDashboardPage} />
              <Route path="/preferences" component={UserDashboardPage} />

              {/* Admin Portal (Login + Database Explorer + Full Admin Dashboard) */}
              <Route path="/admin" component={AdminPortalPage} />
              <Route path="/admin/login" component={AdminPortalPage} />
              <Route path="/admin/:subtab" component={AdminPortalPage} />

              {/* Preserved Mobile App UI (lazy-loaded only when opened) */}
              <Route path="/mobile" component={MobilePrototypeRoute} />

              {/* Legacy routes kept accessible (lazy-loaded) */}
              <Route path="/desktop" component={Landing} />
              <Route path="/about" component={AboutUs} />

              {/* Fallback to Premium Homepage */}
              <Route component={PremiumHomepage} />
            </Switch>
          </Suspense>
          <Toaster />
        </AuthAccountProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
