import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaSpinner, FaTrashAlt, FaPlus, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const EditProperty = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    purpose: 'Buy',
    price: '',
    rentPrice: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    district: '',
    town: '',
    contactName: '',
    contactNumber: ''
  });

  const [existingImages, setExistingImages] = useState([]); 
  const [newImages, setNewImages] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fetching, setFetching] = useState(true); 

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchProperty = async () => {
      try {
        const { data } = await axios.get(`https://realestatelk.vercel.app/api/properties/${id}`);
        
        const locationParts = data.location ? data.location.split(', ') : ['', ''];
        const town = locationParts[0] || '';
        const district = locationParts[1] || '';

        setFormData({
          name: data.title || '',
          description: data.description || '',
          purpose: data.purpose || 'Buy',
          price: data.price || '',
          rentPrice: data.rentPrice || '',
          bedrooms: data.bedrooms || '',
          bathrooms: data.bathrooms || '',
          area: data.area || '',
          district: district,
          town: town,
          contactName: data.contactName || '',
          contactNumber: data.contactNumber || ''
        });

        const imgs = data.images && data.images.length > 0 ? data.images : (data.image ? [data.image] : []);
        setExistingImages(imgs);
        
        setFetching(false);
      } catch (error) {
        toast.error('Failed to load property data');
        navigate('/');
      }
    };

    fetchProperty();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadImagesToCloudinary = async () => {
    const imageUrls = [];
    for (const image of newImages) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "realestate_uploads"); 
      data.append("cloud_name", "ddikxasg2");     
      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/ddikxasg2/image/upload",
          data
        );
        imageUrls.push(res.data.secure_url);
      } catch (err) {
        console.error("Image upload failed", err);
        toast.error("Failed to upload new images. Please try again.");
        return null;
      }
    }
    return imageUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (existingImages.length === 0 && newImages.length === 0) {
      toast.error("Please have at least one image.");
      return;
    }
    
    setLoading(true);

    try {
      let uploadedImageUrls = [];
      if (newImages.length > 0) {
        uploadedImageUrls = await uploadImagesToCloudinary();
        if (!uploadedImageUrls) {
          setLoading(false);
          return;
        }
      }

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      const combinedImages = [...existingImages, ...uploadedImageUrls];

      const finalPropertyData = {
          ...formData,
          title: formData.name, 
          location: `${formData.town}, ${formData.district}`, 
          images: combinedImages, 
          image: combinedImages[0],
          status: 'pending' 
      };

      await axios.put(`https://realestatelk.vercel.app/api/properties/${id}`, finalPropertyData, config);

      setLoading(false);
      setSuccess(true);
    } catch (error) {
      console.error("Error updating property", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-gray-500">Loading Property Data <FaSpinner className="animate-spin ml-3" /></div>;
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-lg w-full border border-gray-100">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-montserrat font-bold text-gray-800 mb-4">Property Updated!</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Your property details have been successfully updated and are currently <span className="font-bold text-orange-500">PENDING</span> approval.
          </p>
          <button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors w-full">
            Go to My Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-montserrat font-bold tracking-tight text-gray-900 mb-2">Edit Property</h1>
      <p className="text-gray-500 mb-10 text-lg">Update your property details below.</p>

      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 space-y-8">
        
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Property Title / Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description & Amenities</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Purpose</label>
                <select name="purpose" value={formData.purpose} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors">
                  <option value="Buy">For Sale (Buy)</option>
                  <option value="Rent">For Rent</option>
                </select>
              </div>

              {formData.purpose === 'Rent' ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Rent (LKR) *</label>
                  <input type="number" name="rentPrice" value={formData.rentPrice} onChange={handleChange} required min="0" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors" />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Property Price (LKR)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Property Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrooms *</label>
              <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required min="0" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bathrooms *</label>
              <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required min="0" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Area (Sq.Ft) *</label>
              <input type="number" name="area" value={formData.area} onChange={handleChange} required min="0" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">District *</label>
              <select name="district" value={formData.district} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white">
                <option value="">Select District</option>
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Town / City</label>
              <input type="text" name="town" value={formData.town} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Name</label>
              <input type="text" name="contactName" value={formData.contactName} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
              <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Manage Photos (Max 7) *</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            
            {existingImages.map((imgUrl, index) => (
              <div key={`existing-${index}`} className="relative h-32 rounded-xl overflow-hidden border border-gray-300 shadow-sm">
                <img src={imgUrl} alt="Existing Property" className="w-full h-full object-cover" />
                
                <button 
                  type="button" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    setExistingImages(existingImages.filter((_, i) => i !== index)); 
                  }}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    zIndex: 999,
                    backgroundColor: '#dc2626', 
                    color: 'white',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: 'none',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.5)'
                  }}
                >
                  <FaTimes />
                </button>
              </div>
            ))}

            {newImages.map((file, index) => (
              <div key={`new-${index}`} className="relative h-32 rounded-xl overflow-hidden border-2 border-dashed border-blue-400 bg-blue-50 shadow-inner">
                <img src={URL.createObjectURL(file)} alt="New Property" className="w-full h-full object-cover opacity-80" />
                
                <button 
                  type="button" 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    setNewImages(newImages.filter((_, i) => i !== index)); 
                  }}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    zIndex: 999,
                    backgroundColor: '#1f2937',
                    color: 'white',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: 'none',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.5)'
                  }}
                >
                  <FaTimes />
                </button>
              </div>
            ))}

            {(existingImages.length + newImages.length) < 7 && (
              <label className="flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed border-blue-500 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-all shadow-sm">
                <FaPlus className="text-3xl mb-2 text-blue-600" />
                <span className="text-sm font-bold text-blue-700">Add Photo</span>
                <input 
                  type="file" multiple accept="image/*" className="hidden" 
                  onChange={(e) => {
                    const selectedFiles = Array.from(e.target.files);
                    const totalImages = existingImages.length + newImages.length + selectedFiles.length;
                    if (totalImages > 7) { 
                      toast.error("Max 7 images allowed."); 
                      return; 
                    }
                    setNewImages([...newImages, ...selectedFiles]);
                  }} 
                />
              </label>
            )}
          </div>
          
          <p className="text-sm font-semibold text-gray-500 bg-gray-100 inline-block px-3 py-1 rounded-full">
            Total Images: {existingImages.length + newImages.length} / 7
          </p>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-xl disabled:bg-blue-400 flex items-center justify-center">
          {loading ? <><FaSpinner className="animate-spin mr-3" /> Updating Property...</> : 'Save Changes & Submit'}
        </button>

      </form>
    </div>
  );
};

export default EditProperty;