import { FaBed, FaBath, FaMapMarkerAlt, FaRulerCombined, FaEllipsisV, FaEdit, FaTrash, FaHeart, FaRegHeart } from 'react-icons/fa'; 
import { Link, useNavigate } from 'react-router-dom'; 
import { useState } from 'react'; 
import axios from 'axios'; 
import Swal from 'sweetalert2'; 
import { toast } from 'react-toastify';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  
  // 🛑 1. මුලින්ම userInfo එක ගන්නවා (මෙතනින් පස්සේ කිසිම අවුලක් නෑ)
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  // 🛑 2. දැන් userInfo එක පාවිච්චි කරන ඒවා ලියනවා
  const propertyUserId = property.user?._id || property.user; 
  const isAuthorized = userInfo && (userInfo._id === propertyUserId || userInfo.isAdmin);
  const [isFavorite, setIsFavorite] = useState(userInfo?.favorites?.includes(property._id) || false);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!userInfo) {
      toast.error("Please login to add to favorites ❤️");
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post(`http://localhost:5000/api/users/favorites/${property._id}`, {}, config);
      
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? "Removed from Favorites" : "Added to Favorites");
      
      userInfo.favorites = data;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault(); e.stopPropagation(); 
    const result = await Swal.fire({
      title: 'Are you sure?', text: "You want to delete this property?", icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#3b82f6', confirmButtonText: 'Yes, delete it!'
    });
    if (result.isConfirmed) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`http://localhost:5000/api/properties/${property._id}`, config);
        toast.success('Property Deleted Successfully!');
        window.location.reload(); 
      } catch (error) { toast.error('Failed to delete property'); }
    }
  };

  const handleEdit = (e) => { e.preventDefault(); e.stopPropagation(); navigate(`/edit-property/${property._id}`); };

  const defaultImage = "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800";
  const dbImage = property.image || (property.images && property.images[0]);
  const imageUrl = dbImage ? dbImage : defaultImage;

  return (
    <Link to={`/property/${property._id}`} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden cursor-pointer border border-gray-100 group block relative">
      
      {/* 🛑 Buttons: Favorite (Heart) & 3-Dot Menu 🛑 */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
        
        {/* ❤️ Heart Button (මේක හැමෝටම පේනවා) */}
        <button 
          onClick={handleFavorite}
          className="bg-white text-red-500 p-2.5 rounded-full shadow-lg hover:bg-red-50 hover:scale-110 transition-all flex items-center justify-center"
        >
          {isFavorite ? <FaHeart className="text-lg" /> : <FaRegHeart className="text-lg text-gray-400" />}
        </button>

        {/* ⚙️ 3-Dot Menu (අයිතිකාරයාට/ඇඩ්මින්ට විතරයි) */}
        {isAuthorized && (
          <div className="relative">
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(!showMenu); }}
              className="bg-white text-gray-800 p-2.5 rounded-full shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <FaEllipsisV />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
                <button onClick={handleEdit} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center font-semibold">
                  <FaEdit className="mr-2" /> Edit
                </button>
                <button onClick={handleDelete} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center border-t border-gray-100 font-semibold">
                  <FaTrash className="mr-2" /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative h-60 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={property.title || 'Property'}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          {property.purpose || 'House'}
        </div>
        
        <div className="absolute bottom-4 right-4 bg-white text-gray-900 font-bold px-4 py-2 rounded-lg shadow-md text-lg">
          LKR {property.purpose === 'Rent' ? property.rentPrice?.toLocaleString() : property.price?.toLocaleString() || 'N/A'}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-montserrat font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors truncate">
          {property.title || 'Beautiful Property'}
        </h3>
        
        <div className="flex items-center text-gray-500 mb-4 text-sm">
          <FaMapMarkerAlt className="mr-2 text-blue-500 flex-shrink-0" />
          <span className="truncate">{property.location || 'Location Not Available'}</span>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-gray-600">
          <div className="flex items-center space-x-2">
            <FaBed className="text-blue-500 text-lg" />
            <span className="font-semibold">{property.bedrooms || 0} Beds</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaBath className="text-blue-500 text-lg" />
            <span className="font-semibold">{property.bathrooms || 0} Baths</span>
          </div>
          <div className="flex items-center space-x-2 border-l pl-4">
            <FaRulerCombined className="text-blue-500 text-lg" />
            <span className="font-semibold">{property.area ? `${property.area} Sq.Ft` : 'N/A'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;