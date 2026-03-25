import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCloudUploadAlt, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AddProperty = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
    }
  }, [navigate]);
  
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

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 7) {
      toast.error("You can only upload a maximum of 7 images.");
      return;
    }
    setImages(selectedFiles);
  };

  const uploadImagesToCloudinary = async () => {
    const imageUrls = [];
    
    for (const image of images) {
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
        toast.error("Failed to upload images. Please try again.");
        return null;
      }
    }
    return imageUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("Please select at least one image.");
      return;
    }
    
    setLoading(true);

    try {
      const uploadedImageUrls = await uploadImagesToCloudinary();
      if (!uploadedImageUrls) {
        setLoading(false);
        return;
      }

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      const finalPropertyData = {
          ...formData,
          images: uploadedImageUrls, 
          status: 'pending'
      };

      await axios.post('realestatelkbackend.vercel.app/api/properties', finalPropertyData, config);

      setLoading(false);
      setSuccess(true);
    } catch (error) {
      console.error("Error submitting property", error);
      toast.error(error.response?.data?.message || "Something went wrong!");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-lg w-full border border-gray-100">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-montserrat font-bold text-gray-800 mb-4">Request Submitted!</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Your property has been successfully submitted and is currently <span className="font-bold text-orange-500">PENDING</span>. 
            An admin will review and approve it shortly.
          </p>
          <div className="flex flex-col space-y-4">
            <button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
              Go to My Dashboard
            </button>
            <button onClick={() => setSuccess(false)} className="text-blue-600 font-semibold hover:underline">
              Submit Another Property
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-montserrat font-bold tracking-tight text-gray-900 mb-2">Add New Property</h1>
      <p className="text-gray-500 mb-10 text-lg">Fill in the details below. All submitted properties are subject to admin approval.</p>

      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 space-y-8">
        
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Property Title / Name *</label>
              <input type="text" name="name" onChange={handleChange} required placeholder="e.g. Luxury 2-Story House in Colombo" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description & Amenities *</label>
              <textarea name="description" onChange={handleChange} required rows="4" placeholder="Describe your property, nearby places, and special amenities..." className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Purpose *</label>
                <select name="purpose" value={formData.purpose} onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors">
                  <option value="Buy">For Sale (Buy)</option>
                  <option value="Rent">For Rent</option>
                </select>
              </div>

              {formData.purpose === 'Rent' ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Rent (LKR) *</label>
                  <input type="number" name="rentPrice" value={formData.rentPrice} onChange={handleChange} required min="0" placeholder="e.g. 50000" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors" />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Property Price (LKR) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" placeholder="e.g. 15000000" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors" />
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
              <input type="number" name="bedrooms" onChange={handleChange} required min="0" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bathrooms *</label>
              <input type="number" name="bathrooms" onChange={handleChange} required min="0" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Area (Sq.Ft) *</label>
              <input type="number" name="area" onChange={handleChange} required min="0" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">District *</label>
              <select name="district" onChange={handleChange} required className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white">
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Town / City *</label>
              <input type="text" name="town" onChange={handleChange} required placeholder="e.g. Malabe" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Name *</label>
              <input type="text" name="contactName" onChange={handleChange} required placeholder="John Doe" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number *</label>
              <input type="text" name="contactNumber" onChange={handleChange} required placeholder="07X XXX XXXX" className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Photos (Max 7) *</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
            <FaCloudUploadAlt className="text-5xl text-blue-500 mx-auto mb-4" />
            <label className="cursor-pointer">
              <span className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">Choose Images</span>
              <input type="file" multiple accept="image/*" onChange={handleImageChange} required className="hidden" />
            </label>
            <p className="mt-3 text-sm text-gray-500">
              {images.length > 0 ? `${images.length} file(s) selected` : "PNG, JPG up to 5MB each"}
            </p>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white font-extrabold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-xl disabled:bg-green-400">
          {loading ? 'Submitting Property...' : 'Submit Property for Review'}
        </button>

      </form>
    </div>
  );
};

export default AddProperty;