import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home            from "./components/home";
import QuickCommerce   from "./components/QuickCommerce";
import ECommerce       from "./components/ECommerce";
import Rides           from "./components/Rides";
import Auth            from "./components/Auth";
import AdminDashboard  from "./components/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                element={<Home />} />
        <Route path="/quick-commerce"  element={<QuickCommerce />} />
        <Route path="/ecommerce"       element={<ECommerce />} />
        <Route path="/rides"           element={<Rides />} />
        <Route path="/login"           element={<Auth defaultTab="login"  />} />
        <Route path="/signup"          element={<Auth defaultTab="signup" />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
