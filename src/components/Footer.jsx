import { FaApple, FaGooglePlay, FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0b132b] text-white pt-10 pb-6 md:pt-16 md:pb-8 border-t border-gray-800 mt-10 md:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 🛑 MAIN GRID: ෆෝන් එකේදි Grid 2කට කැඩුවා */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-12 mb-8 md:mb-16">
          
          {/* 1. Brand Section (ෆෝන් එකේදි සම්පූර්ණ පළල ගන්නවා) */}
          <div className="col-span-2 lg:col-span-1 space-y-4 md:space-y-6">
            <h2 className="text-3xl font-montserrat font-bold tracking-tight text-white tracking-wide text-center md:text-left">
              Real<span className="text-blue-500">Estate</span>
            </h2>
            {/* 🛑 ෆෝන් එකේදි මේ ඡේදය හංගනවා ඉඩ ඉතුරු කරන්න */}
            <p className="text-gray-400 text-sm leading-relaxed hidden md:block">
              Discover your dream home with us. We provide the most accurate and up-to-date real estate listings, helping you make the best decisions for your future.
            </p>
            <div>
              <p className="text-sm font-semibold mb-2 md:mb-3 text-center md:text-left">Subscribe to our Newsletter</p>
              <div className="flex justify-center md:justify-start">
                <input 
                  type="email" 
                  placeholder="Enter email" 
                  className="bg-gray-800 text-white px-4 py-2 rounded-l-lg w-full max-w-[200px] md:max-w-full outline-none focus:ring-1 focus:ring-blue-500 text-sm border border-gray-700"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg font-bold transition-colors text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* 2. Quick Links (ෆෝන් එකේදි වම් පැත්තේ බාගය) */}
          <div className="col-span-1">
            <h3 className="text-base md:text-lg font-bold mb-3 md:mb-6 border-b border-gray-700 pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-400">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link to="/search?purpose=Buy" className="hover:text-blue-400 transition-colors">Buy</Link></li>
              <li><Link to="/search?purpose=Rent" className="hover:text-blue-400 transition-colors">Rent</Link></li>
              <li><Link to="/add-property" className="hover:text-blue-400 transition-colors">List Property</Link></li>
              <li><Link to="#" className="hover:text-blue-400 transition-colors">Find Agent</Link></li>
            </ul>
          </div>

          {/* 3. Popular Cities (ෆෝන් එකේදි දකුණු පැත්තේ බාගය) */}
          <div className="col-span-1">
            <h3 className="text-base md:text-lg font-bold mb-3 md:mb-6 border-b border-gray-700 pb-2 inline-block">Popular Cities</h3>
            <ul className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-400">
              <li><Link to="/search?location=Colombo" className="hover:text-blue-400 transition-colors">Colombo</Link></li>
              <li><Link to="/search?location=Kandy" className="hover:text-blue-400 transition-colors">Kandy</Link></li>
              <li><Link to="/search?location=Galle" className="hover:text-blue-400 transition-colors">Galle</Link></li>
              <li><Link to="/search?location=Gampaha" className="hover:text-blue-400 transition-colors">Gampaha</Link></li>
              <li><Link to="/search?location=Kurunegala" className="hover:text-blue-400 transition-colors">Kurunegala</Link></li>
            </ul>
          </div>

          {/* 4. Contact & Apps (ෆෝන් එකේදි ආයෙත් සම්පූර්ණ පළල ගන්නවා) */}
          <div className="col-span-2 lg:col-span-1 space-y-4 md:space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            <div>
              <h3 className="text-base md:text-lg font-bold mb-2 md:mb-4">Contact Us</h3>
              <ul className="space-y-1 text-xs md:text-sm text-gray-400">
                <li>support@realestate.lk</li>
                <li>+94 77 123 4567</li>
              </ul>
            </div>
            
            <div className="w-full">
              <p className="text-sm font-bold mb-2 md:mb-3">Get Our App</p>
              <div className="flex justify-center md:justify-start gap-2">
                <button className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition w-36 md:w-44">
                  <FaApple className="text-xl" />
                  <div className="text-left">
                    <p className="text-[8px] md:text-[10px] leading-none text-gray-400">Download on</p>
                    <p className="text-xs font-bold">App Store</p>
                  </div>
                </button>
                <button className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-700 transition w-36 md:w-44">
                  <FaGooglePlay className="text-xl text-green-400" />
                  <div className="text-left">
                    <p className="text-[8px] md:text-[10px] leading-none text-gray-400">GET IT ON</p>
                    <p className="text-xs font-bold">Google Play</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-xs text-gray-400 text-center md:text-left">
            <p>© {new Date().getFullYear()} Real Estate. All rights reserved.</p>
          </div>
          <div className="flex space-x-4 text-lg text-gray-400">
            <a href="#" className="hover:text-blue-500 transition-colors"><FaFacebookF /></a>
            <a href="#" className="hover:text-white transition-colors"><FaXTwitter /></a>
            <a href="#" className="hover:text-pink-500 transition-colors"><FaInstagram /></a>
            <a href="#" className="hover:text-blue-400 transition-colors"><FaLinkedinIn /></a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;