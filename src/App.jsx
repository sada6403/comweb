import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataProvider";
import { useLenis } from "./hooks/useLenis";

import Layout from "./components/layout/Layout";
import ScrollToTop from "./components/layout/ScrollToTop";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Reviews from "./pages/Reviews";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

/* Gate for the admin dashboard: bounce to the login page (remembering where the
   user was headed) when there's no active session. */
function RequireAuth({ children }) {
  const { admin } = useAuth();
  const location = useLocation();
  if (!admin) {
    return <Navigate to="/admin" replace state={{ from: location.pathname }} />;
  }
  return children;
}

export default function App() {
  useLenis();

  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public site shares the chrome in Layout */}
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="services" element={<Services />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin lives outside the public chrome */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <RequireAuth>
                  <AdminDashboard />
                </RequireAuth>
              }
            />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}
