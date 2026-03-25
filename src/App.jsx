import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';       
import Register from './pages/Register'; 
import Search from './pages/Search';
import AddProperty from './pages/AddProperty';
import Footer from './components/Footer';
import About from './pages/About';
import AdminDashboard from "./pages/AdminDashboard.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyProperties from './pages/MyProperties';
import ProfileSettings from './pages/ProfileSettings';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Construction from './pages/Construction';
import AddService from './pages/admin/AddService';
import ServiceDetails from './pages/ServiceDetails';
import Contact from './pages/Contact';
import EditProperty from './pages/EditProperty';
import FavoritesScreen from './pages/FavoritesScreen';
import EditService from './pages/admin/EditService';
import AllReviews from './pages/AllReviews';

const AppContent = () => {
  const location = useLocation();
  
  const hideHeaderFooter = 
    location.pathname === '/login' || 
    location.pathname === '/register' || 
    location.pathname === '/forgot-password' || 
    location.pathname.startsWith('/reset-password');

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      
      {!hideHeaderFooter && <Navbar />}

      <main className="flex-1 bg-gray-50 overflow-y-auto relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/add-property" element={<AddProperty />} />
          <Route path="/edit-property/:id" element={<EditProperty />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/my-properties" element={<MyProperties />} />
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/construction" element={<Construction />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/admin/add-service" element={<AddService />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/favorites" element={<FavoritesScreen />} />
          <Route path="/admin/edit-service/:id" element={<EditService />} />
          <Route path="/all-platform-reviews" element={<AllReviews />} />
        </Routes>

        {!hideHeaderFooter && <Footer />}
        
        <ToastContainer position="top-right" autoClose={3000} />
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;