import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaUserCircle, FaChevronDown, FaUserShield, FaHome, FaHeart, FaSignOutAlt, FaCog, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-blue-600 p-4 text-white relative shadow-md z-50">
      <div className="w-full px-4 lg:px-3 flex justify-between items-center">
        
        <Link to="/" onClick={closeMenu}>
          <img src={logo} alt="RealEstate Logo" className="h-10 md:h-12 w-auto hover:opacity-90 transition-opacity" />
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-white hover:text-blue-200 font-semibold transition-colors">Home</Link>
          <Link to="/about" className="text-white hover:text-blue-200 font-semibold transition-colors">About Us</Link>
          <Link to="/search" className="text-white hover:text-blue-200 font-semibold transition-colors">Properties</Link>
          <Link to="/construction" className="text-white hover:text-blue-200 font-semibold transition-colors">Construction</Link>
          <Link to="/contact" className="text-white hover:text-blue-200 font-semibold transition-colors">Contact Us</Link>
        </div>

        <div className="flex items-center space-x-3 md:space-x-6">
          
          <div className="relative">
            {userInfo ? (
              <div>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-white hover:text-gray-200 focus:outline-none transition-colors"
                >
                  <FaUserCircle className="text-2xl md:text-3xl" />
                  <span className="font-semibold text-base md:text-lg hidden sm:block">Hi, {userInfo.name.split(' ')[0]}</span>
                  <FaChevronDown className={`text-sm transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-100 transform origin-top-right transition-all">
                    {userInfo.isAdmin && (
                      <Link to="/admin/dashboard" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-5 py-4 text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-colors border-b border-gray-100 font-semibold">
                        <FaUserShield className="mr-3 text-yellow-500 text-xl" /> Admin Panel
                      </Link>
                    )}
                    <Link to="/my-properties" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-5 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium mt-1">
                      <FaHome className="mr-3 text-blue-500 text-lg" /> Your Properties
                    </Link>
                    <Link to="/favorites" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-5 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors font-medium">
                      <FaHeart className="mr-3 text-pink-500 text-lg" /> Saved Favorites
                    </Link>
                    <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-5 py-3 text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                      <FaCog className="mr-3 text-gray-500 text-lg" /> Profile Settings
                    </Link>
                    <div className="border-t border-gray-100 mt-2">
                      <button 
                        onClick={() => { setIsDropdownOpen(false); handleLogout(); }}
                        className="w-full flex items-center px-5 py-4 text-red-600 hover:bg-red-50 transition-colors font-bold text-left"
                      >
                        <FaSignOutAlt className="mr-3 text-lg" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3 md:space-x-6">
                <Link to="/login" className="hover:text-gray-300 font-semibold text-sm md:text-base">Login</Link>
                <Link to="/register" className="bg-white text-blue-600 px-3 py-1.5 md:px-5 md:py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors shadow-sm text-sm md:text-base">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button 
            onClick={() => { setIsDropdownOpen(false); setIsOpen(!isOpen); }} 
            className="md:hidden text-white hover:text-gray-200 focus:outline-none ml-2"
          >
            {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
          
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-2xl z-50 animate-fade-in-up">
          <div className="px-4 pt-2 pb-6 space-y-2 flex flex-col">
            <Link to="/" onClick={closeMenu} className="block px-3 py-3 text-gray-800 font-bold hover:bg-blue-50 rounded-lg">Home</Link>
            <Link to="/about" onClick={closeMenu} className="block px-3 py-3 text-gray-800 font-bold hover:bg-blue-50 rounded-lg">About Us</Link>
            <Link to="/search" onClick={closeMenu} className="block px-3 py-3 text-gray-800 font-bold hover:bg-blue-50 rounded-lg">Properties</Link>
            <Link to="/construction" onClick={closeMenu} className="block px-3 py-3 text-gray-800 font-bold hover:bg-blue-50 rounded-lg">Construction</Link>
            <Link to="/contact" onClick={closeMenu} className="block px-3 py-3 text-gray-800 font-bold hover:bg-blue-50 rounded-lg">Contact Us</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;