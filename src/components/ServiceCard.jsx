import { FaEllipsisV, FaEdit, FaTrash, FaPhoneAlt, FaCheckCircle, FaHeart, FaRegHeart } from 'react-icons/fa'; 
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const isAdmin = userInfo && userInfo.isAdmin;

  const [isFavorite, setIsFavorite] = useState(userInfo?.favServices?.includes(service._id) || false);

  const handleFavorite = async (e) => {
    e.preventDefault(); e.stopPropagation(); 
    
    if (!userInfo) {
      toast.error('Please login to add to favorites');
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post(`https://realestatelkbackend.vercel.app/api/users/fav-services/${service._id}`, {}, config);
      
      setIsFavorite(!isFavorite); 
      toast.success(data.message);

      userInfo.favServices = data.favServices;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update favorites');
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    
    const result = await Swal.fire({
      title: 'Are you sure?', 
      text: "You want to delete this service permanently?", 
      icon: 'warning', 
      showCancelButton: true, 
      confirmButtonColor: '#ef4444', 
      cancelButtonColor: '#3b82f6', 
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`https://realestatelkbackend.vercel.app/api/services/${service._id}`, config);
        toast.success('Service Deleted Successfully!');
        window.location.reload();
      } catch (error) { 
        toast.error('Failed to delete service'); 
      }
    }
  };

  const handleEdit = (e) => { 
    e.preventDefault(); 
    e.stopPropagation(); 
    navigate(`/admin/edit-service/${service._id}`); 
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden relative group flex flex-col h-full">
      
    <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
        
        <button 
          onClick={handleFavorite}
          className="bg-white text-red-500 p-2.5 rounded-full shadow-lg hover:bg-red-50 hover:scale-110 transition-all flex items-center justify-center border border-gray-200"
        >
          {isFavorite ? <FaHeart className="text-lg" /> : <FaRegHeart className="text-lg text-gray-400" />}
        </button>

      {isAdmin && (
        <div className="absolute top-4 right-4 z-20">
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(!showMenu); }}
            className="bg-white text-gray-800 p-2.5 rounded-full shadow-md hover:bg-gray-100 transition-colors flex items-center justify-center border border-gray-200"
          >
            <FaEllipsisV />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in-up">
              <button onClick={handleEdit} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center font-bold transition-colors">
                <FaEdit className="mr-2" /> Edit
              </button>
              <button onClick={handleDelete} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center border-t border-gray-100 font-bold transition-colors">
                <FaTrash className="mr-2" /> Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>  

      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-start gap-4 mb-4">
          <img 
            src={service.logo} 
            alt={service.name} 
            className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shadow-sm"
          />
          <div>
            <span className="bg-blue-100 text-blue-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              {service.category}
            </span>
            <h3 className="text-xl font-black text-gray-900 mt-2 leading-tight">
              {service.name}
            </h3>
            {service.verified && (
               <span className="flex items-center text-green-500 text-xs font-bold mt-1">
                 <FaCheckCircle className="mr-1"/> Verified Partner
               </span>
            )}
          </div>
        </div>

        <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-grow">
          {service.description}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
           <div className="flex items-center text-gray-600 font-semibold text-sm">
             <FaPhoneAlt className="text-blue-500 mr-2" />
             {service.contact?.phone || 'No Contact'}
           </div>
           
           <button onClick={() => navigate(`/services/${service._id}`)} className="text-blue-600 font-bold hover:text-blue-800 text-sm">
             View Profile &rarr;
           </button>
        </div>
      </div>

    </div>
  );
};

export default ServiceCard;