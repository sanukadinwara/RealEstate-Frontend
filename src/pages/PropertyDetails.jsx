import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaBed, FaBath, FaMapMarkerAlt, FaArrowLeft, FaChevronLeft, FaChevronRight, FaTimes, FaHeart, FaRegHeart } from 'react-icons/fa'; 

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showSellerInfo, setShowSellerInfo] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [isFavorite, setIsFavorite] = useState(userInfo?.favorites?.includes(id) || false);

  const handleFavorite = async (e) => {
    e.preventDefault();
    
    if (!userInfo) {
      toast.error("Please login to add to favorites");
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post(`http://localhost:5000/api/users/favorites/${id}`, {}, config);
      
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? "Removed from Favorites" : "Added to Favorites");
      
      userInfo.favorites = data;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/properties/${id}`);
        setProperty(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching property:", error);
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) return <div className="text-center mt-20 text-2xl text-gray-500 font-bold">Loading Property Details...</div>;
  if (!property) return <div className="text-center mt-20 text-2xl text-red-500">Property not found!</div>;

  const propertyImages = property.images && property.images.length > 0 ? property.images : [property.image || property.imageUrl || "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=800"];
  const totalImages = propertyImages.length;

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev < totalImages - 1 ? prev + 1 : prev));
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black bg-opacity-95 flex items-center justify-center backdrop-blur-sm transition-opacity"
          onClick={() => setIsLightboxOpen(false)}
        >

          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-3 hover:scale-110 transform"
            onClick={() => setIsLightboxOpen(false)}
          >
            <FaTimes size={30} />
          </button>

          {currentImageIndex > 0 && (
            <button 
              className="absolute left-4 md:left-10 text-white/70 hover:text-white transition-colors p-4 hover:scale-110 transform active:scale-95"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              <FaChevronLeft size={36} />
            </button>
          )}

          <div className="max-w-5xl max-h-[85vh] px-12 md:px-24 flex flex-col items-center">
            <img 
              src={propertyImages[currentImageIndex]} 
              alt={`Full size ${currentImageIndex + 1}`} 
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl select-none"
              onClick={(e) => e.stopPropagation()} 
            />
            <p className="text-white/70 font-bold mt-5 tracking-widest text-sm">
              {currentImageIndex + 1} / {totalImages}
            </p>
          </div>

          {currentImageIndex < totalImages - 1 && (
            <button 
              className="absolute right-4 md:right-10 text-white/70 hover:text-white transition-colors p-4 hover:scale-110 transform active:scale-95"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              <FaChevronRight size={36} />
            </button>
          )}
          
        </div>
      )}

      <Link to="/my-properties" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-semibold text-lg transition-colors">
        <FaArrowLeft className="mr-2" /> Back to My Properties
      </Link>
      
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        <div className="relative group bg-gray-100">
          <div className="h-[50vh] md:h-[60vh] w-full overflow-hidden cursor-pointer flex justify-center items-center" onClick={() => setIsLightboxOpen(true)}>
            <img 
              src={propertyImages[currentImageIndex]} 
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          </div>
          
          {currentImageIndex > 0 && (
            <button 
              onClick={prevImage} 
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-blue-700 p-3 md:p-4 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <FaChevronLeft className="text-xl md:text-2xl" />
            </button>
          )}
          {currentImageIndex < totalImages - 1 && (
            <button 
              onClick={nextImage} 
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-blue-700 p-3 md:p-4 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
            >
              <FaChevronRight className="text-xl md:text-2xl" />
            </button>
          )}

          <div className="absolute top-6 left-6 bg-blue-600 text-white font-bold px-5 py-2 rounded-full uppercase tracking-widest shadow-lg">
            {property.purpose || 'House'}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 p-4 bg-gray-50 border-b border-gray-200">
          {propertyImages.map((imgUrl, index) => (
            <div 
              key={index} 
              onClick={() => setCurrentImageIndex(index)}
              className={`relative cursor-pointer w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden transition-all duration-300 
                ${currentImageIndex === index 
                  ? 'border-4 border-blue-600 shadow-md opacity-100 scale-105' 
                  : 'border-2 border-transparent opacity-40 hover:opacity-100'}`}
            >
              <img src={imgUrl} alt={`${property.title} - ${index}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
        
        <div className="p-8 md:p-12 text-left">
          
          <div className="flex justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold tracking-tight text-gray-900">
              {property.title}
            </h1>
            
            <button 
              onClick={handleFavorite}
              className="flex items-center justify-center bg-white border border-gray-200 p-4 rounded-full shadow-md hover:shadow-lg hover:bg-red-50 transition-all group flex-shrink-0"
              title="Add to Favorites"
            >
              {isFavorite ? <FaHeart className="text-2xl text-red-500 transform scale-110 transition-transform" /> : <FaRegHeart className="text-2xl text-gray-400 group-hover:text-red-400 transition-colors" />}
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-wide">Description</h2>
            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
              {property.description || 'No description available for this property.'}
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-10">
            
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-blue-50 p-3 rounded-full mr-4">
                <FaMapMarkerAlt className="text-blue-500 text-2xl" />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Location</span>
                <span className="text-gray-800 font-semibold text-lg">
                  From {property.town ? `${property.town}, ` : ''}{property.location}
                </span>
              </div>
            </div>

            <div className="text-left md:text-right border-l-4 border-blue-500 pl-4">
              <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1 block">Property Price</span>
              <span className="text-3xl md:text-4xl font-extrabold text-blue-700">
                LKR {property.purpose === 'Rent' ? property.rentPrice?.toLocaleString() : property.price?.toLocaleString() || 'N/A'}
              </span>
            </div>

          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 text-center">
            <div className="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <FaBed className="text-4xl text-blue-500 mx-auto mb-3" />
              <span className="block text-2xl font-extrabold text-gray-800">{property.bedrooms || 0}</span>
              <span className="text-gray-500 font-medium">Bedrooms</span>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <FaBath className="text-4xl text-blue-500 mx-auto mb-3" />
              <span className="block text-2xl font-extrabold text-gray-800">{property.bathrooms || 0}</span>
              <span className="text-gray-500 font-medium">Bathrooms</span>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center">
              <span className="block text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">
                {property.area ? property.area.toLocaleString() : 'N/A'}
              </span>
              <span className="text-gray-500 font-medium text-lg uppercase tracking-wide">
                Sq/Ft
              </span>
            </div>
            <div className="flex items-center justify-center h-full">
              {!showSellerInfo ? (
                <button 
                  onClick={() => setShowSellerInfo(true)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-2xl w-full h-full transition duration-300 shadow-lg text-lg flex items-center justify-center"
                >
                  Contact Agent
                </button>
              ) : (
                <div className="w-full h-full flex flex-col rounded-2xl shadow-lg overflow-hidden border border-gray-200 bg-white transition-all duration-300">
                  
                  <button 
                    onClick={() => setShowSellerInfo(false)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold text-sm h-1/3 flex items-center justify-center transition-colors w-full"
                  >
                    Hide Contact
                  </button>
                  
                  <div className="h-2/3 flex flex-col items-center justify-center p-2 bg-gray-50 text-center">
                    <span className="text-gray-900 font-extrabold text-base truncate w-full mb-1">
                      {property.contactName || (property.user && property.user.name) || 'Unknown Seller'}
                    </span>
                    <a href={`tel:${property.contactNumber}`} className="text-blue-600 font-bold text-sm hover:text-blue-800 transition-colors bg-blue-50 px-3 py-1 rounded-full">
                      {property.contactNumber || 'N/A'}
                    </a>
                  </div>

                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;