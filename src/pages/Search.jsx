import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Search = () => {
  const locationUrl = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(locationUrl.search);
  const initialKeyword = queryParams.get('keyword') || '';
  const initialPurpose = queryParams.get('purpose') || '';
  const [inquiryData, setInquiryData] = useState({ name: '', contact: '', requirements: '' });
  const [inquiryStatus, setInquiryStatus] = useState('idle');
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  const handleInquiryChange = (e) => {
    setInquiryData({ ...inquiryData, [e.target.name]: e.target.value });
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquiryStatus('loading');
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        'realestatelkbackend.vercel.app/api/inquiries', 
        inquiryData,
        config
      );

      if (data) {
        setInquiryStatus('success');
        setInquiryData({ name: '', contact: '', requirements: '' }); 
      }
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setInquiryStatus('idle');
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  const [filters, setFilters] = useState({
    keyword: initialKeyword,
    purpose: initialPurpose,
    location: '',     
    town: '',         
    minPrice: '',
    maxPrice: '',
    maxRent: '',
    bedrooms: '',
    bathrooms: '',
    floors: '',        
    area: '',        
  });

  const [properties, setProperties] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchFilteredProperties = async () => {
    setLoading(true);
    try {
      const activeFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
      const queryString = new URLSearchParams(activeFilters).toString();
      
      const { data } = await axios.get(`realestatelkbackend.vercel.app/api/properties?${queryString}`);
      
      setProperties(data.properties); 
      setTotalResults(data.total);
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProperties();
  }, [locationUrl.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const activeFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
    const queryString = new URLSearchParams(activeFilters).toString();
    navigate(`/search?${queryString}`);
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-montserrat font-bold tracking-tight text-gray-900 mb-8">Advanced Search</h1>
      
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mb-10">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          
          <div className="lg:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Keyword</label>
            <input 
              type="text" name="keyword" value={filters.keyword} onChange={handleChange}
              placeholder="e.g. Luxury Villa, Beachfront..." 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Purpose</label>
            <select name="purpose" value={filters.purpose} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white transition-all">
              <option value="">Any</option>
              <option value="Buy">For Sale (Buy)</option>
              <option value="Rent">For Rent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">District</label>
            <select name="location" value={filters.location} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white transition-all">
              <option value="">All Districts</option>
              <option value="Ampara">Ampara</option>
              <option value="Anuradhapura">Anuradhapura</option>
              <option value="Badulla">Badulla</option>
              <option value="Batticaloa">Batticaloa</option>
              <option value="Colombo">Colombo</option>
              <option value="Galle">Galle</option>
              <option value="Gampaha">Gampaha</option>
              <option value="Hambantota">Hambantota</option>
              <option value="Jaffna">Jaffna</option>
              <option value="Kalutara">Kalutara</option>
              <option value="Kandy">Kandy</option>
              <option value="Kegalle">Kegalle</option>
              <option value="Kilinochchi">Kilinochchi</option>
              <option value="Kurunegala">Kurunegala</option>
              <option value="Mannar">Mannar</option>
              <option value="Matale">Matale</option>
              <option value="Matara">Matara</option>
              <option value="Monaragala">Monaragala</option>
              <option value="Mullaitivu">Mullaitivu</option>
              <option value="Nuwara Eliya">Nuwara Eliya</option>
              <option value="Polonnaruwa">Polonnaruwa</option>
              <option value="Puttalam">Puttalam</option>
              <option value="Ratnapura">Ratnapura</option>
              <option value="Trincomalee">Trincomalee</option>
              <option value="Vavuniya">Vavuniya</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Town / City</label>
            <input 
              type="text" name="town" value={filters.town} onChange={handleChange}
              placeholder="e.g. Nugegoda, Malabe" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          {filters.purpose === 'Rent' ? (
            <div className="lg:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Max Monthly Rent (LKR)</label>
              <input 
                type="number" name="maxRent" value={filters.maxRent} onChange={handleChange} min="0" placeholder="e.g. 50000"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Min Price (LKR)</label>
                <input 
                  type="number" name="minPrice" value={filters.minPrice} onChange={handleChange} min="0" placeholder="0"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Max Price (LKR)</label>
                <input 
                  type="number" name="maxPrice" value={filters.maxPrice} onChange={handleChange} min="0" placeholder="No Limit"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Bedrooms</label>
              <input 
                type="number" name="bedrooms" value={filters.bedrooms} onChange={handleChange} min="0" placeholder="Any"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Bathrooms</label>
              <input 
                type="number" name="bathrooms" value={filters.bathrooms} onChange={handleChange} min="0" placeholder="Any"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Floors</label>
              <input 
                type="number" name="floors" value={filters.floors} onChange={handleChange} min="0" placeholder="Any"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Sq.Ft</label>
              <input 
                type="number" name="area" value={filters.area} onChange={handleChange} min="0" placeholder="Any"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="lg:col-span-4 mt-2">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg text-lg">
              <FaSearch className="mr-2" /> Search Properties
            </button>
          </div>
        </form>
      </div>

      <div className="mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Showing <span className="text-blue-600">{totalResults}</span> Results
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : properties.length === 0 ? (
        
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 text-center max-w-2xl mx-auto mt-10">
          
          {!showInquiryForm ? (
            <div className="animate-fade-in-up">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No properties found</h3>
              <p className="text-gray-600 text-lg">
                Didn't find the house you're looking for?{' '}
                <button 
                  onClick={() => setShowInquiryForm(true)} 
                  className="text-blue-600 font-bold hover:text-blue-800 hover:underline transition-colors"
                >
                  Tell us.
                </button>
              </p>
            </div>
          ) : (
            
            <div className="relative overflow-hidden text-left animate-fade-in-up">
              {inquiryStatus === 'success' ? (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Request Sent Successfully!</h3>
                  <p className="text-gray-500 mb-6">We've saved your requirements. Our agents will contact you soon.</p>
                  <button onClick={() => { setInquiryStatus('idle'); setShowInquiryForm(false); }} className="text-blue-600 font-semibold hover:underline">
                    Close
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h3 className="text-2xl font-montserrat font-bold text-gray-900">Tell us what you need</h3>
                    <button onClick={() => setShowInquiryForm(false)} className="text-gray-400 hover:text-red-500 text-xl font-bold">✕</button>
                  </div>
                  
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name *</label>
                        <input type="text" name="name" value={inquiryData.name} onChange={handleInquiryChange} required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Details *</label>
                        <input type="text" name="contact" value={inquiryData.contact} onChange={handleInquiryChange} required placeholder="Phone or Email" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Property Requirements *</label>
                      <textarea name="requirements" value={inquiryData.requirements} onChange={handleInquiryChange} required rows="3" placeholder="I am looking for..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50"></textarea>
                    </div>
                    <button type="submit" disabled={inquiryStatus === 'loading'} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors disabled:bg-blue-400">
                      {inquiryStatus === 'loading' ? 'Sending...' : 'Send Request'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
          
        </div>
        
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;