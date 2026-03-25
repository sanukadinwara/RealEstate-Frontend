import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

    const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem('userInfo'))?.favorites || []
    );

  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
          navigate('/login');
          return;
        }

        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get('https://realestatelkbackend.vercel.app/api/properties/myproperties', config);
        
        setProperties(data);
        setLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch properties');
        setLoading(false);
      }
    };
    fetchMyProperties();
  }, [navigate]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this property? This cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#3b82f6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

        await axios.delete(`https://realestatelkbackend.vercel.app/api/properties/${id}`, config);
        
        setProperties(properties.filter((prop) => prop._id !== id));
        toast.success('Property deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete property');
      }
    }
  };

  const handleFavoriteToggle = async (propertyId) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    if (!userInfo) {
      toast.error('Please login to save favorites!');
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const { data } = await axios.post(`https://realestatelkbackend.vercel.app/api/users/favorites/${propertyId}`, {}, config);
      
      setFavorites(data.favorites);
      
      userInfo.favorites = data.favorites;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));

      toast.success(data.message + (data.message.includes('added') ? ' ❤️' : ' 💔'));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl font-bold text-gray-500">Loading your properties...</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-gray-900">Your Properties</h1>
        <Link to="/add-property" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl flex items-center transition-colors shadow-md">
          <FaPlus className="mr-2" /> Add New
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-200">
          <p className="text-xl text-gray-500 mb-4">You haven't listed any properties yet.</p>
          <Link to="/add-property" className="text-blue-600 font-bold hover:underline">Click here to add your first property!</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property._id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 flex flex-col relative">
    
            <div className="relative"> 
            <img src={property.image} alt={property.title} className="w-full h-48 object-cover" />
            

            <button 
                onClick={(e) => {
                e.preventDefault(); 
                handleFavoriteToggle(property._id); 
                }}
                className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 z-10 group"
            >
                {favorites?.includes(property._id) ? (
                <FaHeart className="text-red-500 text-xl transition-colors" />
                ) : (
                <FaRegHeart className="text-gray-400 text-xl group-hover:text-red-500 transition-colors" />
                )}
            </button>
            </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">{property.title}</h3>
                <span className="text-blue-600 font-extrabold mb-3">LKR {property.price?.toLocaleString()}</span>
                
                <div className="flex items-center text-gray-500 bg-gray-50 w-max px-3 py-1 rounded-full text-sm font-semibold mb-5 border border-gray-200">
                  <FaEye className="mr-2 text-blue-500" /> 
                  {property.views || 0} {property.views === 1 ? 'View' : 'Views'}
                </div>

                <div className="mt-auto flex justify-between gap-3 pt-4 border-t border-gray-100">
                  <Link to={`/property/${property._id}`} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-lg text-center transition flex items-center justify-center">
                    <FaEye className="mr-1" /> View
                  </Link>
                  <Link to={`/edit-property/${property._id}`} className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-bold py-2 rounded-lg text-center transition flex items-center justify-center">
                    <FaEdit className="mr-1" /> Edit
                  </Link>
                  <button onClick={() => handleDelete(property._id)} className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold py-2 rounded-lg transition flex items-center justify-center">
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProperties;