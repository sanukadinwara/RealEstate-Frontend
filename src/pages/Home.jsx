import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import PropertyCard from '../components/PropertyCard';
import { useNavigate } from 'react-router-dom';
import Testimonials from '../components/Testimonials';
import Stats from '../components/Stats';

const Home = () => {
  const images = [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1920&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"  
  ];

  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const recordVisit = async () => {
      try {
        await axios.post('http://localhost:5000/api/analytics/visit');
      } catch (error) {
        console.log('Visit record error', error); 
      }
    };
    recordVisit();
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/properties');
        setProperties(data.properties); 
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);


  return (
    <div>
      <div className="relative h-[91vh] w-full overflow-hidden bg-gray-900 flex items-center justify-center">
        
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${image})` }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
        ))}

        <div className="relative z-10 text-center text-white px-4 w-full max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-montserrat font-bold tracking-tight mb-6 drop-shadow-lg leading-tight">
            Find Your Perfect Dream Home
          </h1>
          <p className="text-lg md:text-xl mb-10 drop-shadow-md text-gray-200">
            Discover the most premium properties and real estate options in the country.
          </p>
          
          <div className="bg-white/20 md:bg-white p-2 rounded-2xl md:rounded-full flex flex-col md:flex-row items-center shadow-2xl w-full gap-2 md:gap-0 backdrop-blur-md md:backdrop-blur-none">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by location, city, or property type..." 
              className="w-full flex-grow px-5 py-3 md:px-6 text-gray-800 rounded-xl md:rounded-l-full md:rounded-r-none focus:outline-none text-base md:text-lg bg-white"
            />
            <button 
              onClick={() => navigate(`/search?keyword=${searchTerm}`)}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl md:rounded-full font-bold transition duration-300 flex justify-center items-center text-base md:text-lg"
            >
              <FaSearch className="mr-2" /> Search
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      <Stats />

      <div className="max-w-7xl mx-auto py-20 px-4">
        <h2 className="text-4xl text-gray-800 text-center mb-4 font-montserrat font-bold tracking-tight">Latest Properties</h2>
        <p className="text-center text-gray-500 mb-12">Handpicked selection of the best properties available right now.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))
          ) : (
            <h3 className="text-center text-xl col-span-3 text-gray-500">Loading properties...</h3>
          )}
        </div>
      </div>
      
      <Testimonials />
    </div>
  );
};

export default Home;