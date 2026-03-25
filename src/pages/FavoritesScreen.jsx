import { useState, useEffect } from 'react';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard'; 
import ServiceCard from '../components/ServiceCard';  
import { FaHeart, FaSpinner, FaRegHeart, FaHome, FaBuilding } from 'react-icons/fa';
import { toast } from 'react-toastify';

const FavoritesScreen = () => {
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [favoriteServices, setFavoriteServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('properties');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        
        const { data } = await axios.get('realestatelkbackend.vercel.app/api/users/favorites', config);

        console.log("BACKEND DATA:", data);
        
        setFavoriteProperties(data.properties || []);
        setFavoriteServices(data.services || []);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load favorites');
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) return <div className="text-center mt-20 text-2xl text-gray-500 font-bold"><FaSpinner className="animate-spin inline mr-2"/> Loading Favorites...</div>;

  const tabStyle = "flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300";
  const activeTabStyle = "bg-blue-600 text-white shadow-lg scale-105";
  const inactiveTabStyle = "text-gray-600 hover:bg-blue-50 hover:text-blue-700";

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 min-h-screen">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-10 flex items-center tracking-tight">
        My Favorite Wishlist
      </h1>

      <div className="flex items-center gap-4 mb-12 bg-white w-max p-2 rounded-full shadow-md border border-gray-100 flex-wrap">
        <button 
          onClick={() => setActiveTab('properties')} 
          className={`${tabStyle} ${activeTab === 'properties' ? activeTabStyle : inactiveTabStyle}`}
        >
          <FaHome className="text-xl" /> Saved Properties ({favoriteProperties.length})
        </button>
        <button 
          onClick={() => setActiveTab('services')} 
          className={`${tabStyle} ${activeTab === 'services' ? activeTabStyle : inactiveTabStyle}`}
        >
          <FaBuilding className="text-xl" /> Service Partners ({favoriteServices.length})
        </button>
      </div>

      <div className="animate-fade-in">
        
        {activeTab === 'properties' && (
          <div>
            {favoriteProperties.length === 0 ? (
              <NoFavoritesMessage type="properties" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {favoriteProperties.map((prop) => (
                  <PropertyCard key={prop._id} property={prop} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'services' && (
          <div>
            {favoriteServices.length === 0 ? (
              <NoFavoritesMessage type="services" />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {favoriteServices.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

const NoFavoritesMessage = ({ type }) => (
  <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 shadow-inner max-w-3xl mx-auto">
    <FaRegHeart className="text-6xl text-gray-300 mx-auto mb-5" />
    <h2 className="text-2xl font-bold text-gray-600 capitalize">No favorite {type} yet!</h2>
    <p className="text-gray-500 mt-2 font-medium">Start browsing and add some {type} to your wishlist.</p>
  </div>
);

export default FavoritesScreen;