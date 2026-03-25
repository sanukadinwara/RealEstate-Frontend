import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'; 
import { FaBuilding, FaShieldAlt, FaRegStar, FaPhoneAlt, FaEllipsisV, FaEdit, FaTrash, FaHeart, FaRegHeart } from 'react-icons/fa'; 
import { Link, useNavigate, useLocation } from 'react-router-dom'; 

const Construction = () => {
const [services, setServices] = useState([]);
const [loading, setLoading] = useState(true);

const navigate = useNavigate();
const location = useLocation();
  const [openMenuId, setOpenMenuId] = useState(null); 

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const isAdmin = userInfo && userInfo.isAdmin;

  const handleDelete = async (id, e) => {
    e.preventDefault(); e.stopPropagation(); 
    const result = await Swal.fire({
      title: 'Are you sure?', text: "You want to delete this service permanently?", icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#3b82f6', confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`http://localhost:5000/api/services/${id}`, config);
        toast.success('Service Deleted Successfully!');
        window.location.reload(); 
      } catch (error) { toast.error('Failed to delete service'); }
    }
  };

  const [favServiceIds, setFavServiceIds] = useState([]);

  const handleFavorite = async (id, e) => {
    e.preventDefault(); e.stopPropagation(); 
    
    if (!userInfo) {
      return toast.error('Please login to add to favorites');
    }

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post(`http://localhost:5000/api/users/fav-services/${id}`, {}, config);
      
      setFavServiceIds(data.favServices); 
      
      const updatedUser = { ...userInfo, favServices: data.favServices };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update favorites');
    }
  };

  useEffect(() => {
    const loadFreshFavorites = () => {
      const latestUser = JSON.parse(localStorage.getItem('userInfo'));
      
      if (latestUser && latestUser.favServices) {
        const validIds = latestUser.favServices.map(item => 
          typeof item === 'object' ? item._id : item
        );
        setFavServiceIds(validIds);
      }
    };

    loadFreshFavorites();

    window.addEventListener('popstate', loadFreshFavorites);
    
    window.addEventListener('focus', loadFreshFavorites);

    return () => {
      window.removeEventListener('popstate', loadFreshFavorites);
      window.removeEventListener('focus', loadFreshFavorites);
    };
  }, [location.key]);

  const handleEdit = (id, e) => { 
    e.preventDefault(); e.stopPropagation(); 
    navigate(`/admin/edit-service/${id}`); 
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/services');
        setServices(data);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load construction companies');
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return <div className="text-center mt-20 text-2xl font-bold text-gray-500">Loading construction companies...</div>;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 min-h-screen">
      
      <div className="text-center mb-16 bg-blue-50 py-16 rounded-3xl border border-blue-100 shadow-inner">
        <FaBuilding className="text-blue-600 text-6xl mx-auto mb-5" />
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
          Build Your <span className="text-blue-600">Dream Home</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
          Discover trusted construction companies, architects, and designers to turn your vision into reality. Find the perfect partner for your next project.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {services.map((service) => (
          <div key={service._id} className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col group relative">

            <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">

              <button 
                onClick={(e) => handleFavorite(service._id, e)}
                className="bg-white text-red-500 p-2.5 rounded-full shadow-lg hover:bg-red-50 hover:scale-110 transition-all flex items-center justify-center border border-gray-200"
              >
                {favServiceIds?.includes(service._id) ? (
                  <FaHeart className="text-lg" />
                ) : (
                  <FaRegHeart className="text-lg text-gray-400" />
                )}
              </button>

              {isAdmin && (
                <div className="relative">
                  <button 
                    onClick={(e) => { 
                      e.preventDefault(); e.stopPropagation(); 
                      setOpenMenuId(openMenuId === service._id ? null : service._id); 
                    }}
                    className="bg-white text-gray-800 p-2.5 rounded-full shadow-lg hover:bg-gray-100 transition-colors flex items-center justify-center border border-gray-200"
                  >
                    <FaEllipsisV />
                  </button>
                  
                  {openMenuId === service._id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                      <button onClick={(e) => handleEdit(service._id, e)} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center font-bold transition-colors">
                        <FaEdit className="mr-2" /> Edit
                      </button>
                      <button onClick={(e) => handleDelete(service._id, e)} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center border-t border-gray-100 font-bold transition-colors">
                        <FaTrash className="mr-2" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="relative h-60 overflow-hidden">
              <img 
                src={service.logo}
                alt={service.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                Construction
              </span>
            </div>

            <div className="p-7 flex flex-col flex-grow">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
                {service.name}
              </h3>
              
              <div className="flex items-center mb-5 bg-gray-50 w-max px-3 py-1 rounded-full border border-gray-100">
                <FaRegStar className="text-yellow-500 text-lg mr-2" />
                <span className="text-lg font-bold text-gray-700">{service.rating.toFixed(1)}</span>
                <span className="text-sm text-gray-400 ml-1.5">(Trusted Partner)</span>
              </div>
              
              <p className="text-gray-600 mb-8 line-clamp-2 font-medium">
                {service.description}
              </p>

              <Link 
                to={`/services/${service._id}`} 
                className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl text-lg flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg transform active:scale-95 text-center"
                >
                Contact Now
              </Link>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Construction;