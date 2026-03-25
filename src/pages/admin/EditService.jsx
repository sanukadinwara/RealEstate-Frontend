import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlus, FaTrash, FaBuilding, FaPhoneAlt, FaImage, FaAlignLeft, FaSpinner, FaTimes } from 'react-icons/fa';

const EditService = () => {
  const { id } = useParams(); // URL එකෙන් ID එක ගන්නවා
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Construction');
  const [description, setDescription] = useState('');
  
  const [logo, setLogo] = useState(''); 
  const [images, setImages] = useState([]); 

  const [packages, setPackages] = useState([{ title: '', price: '', features: '' }]);
  const [phone, setPhone] = useState('');

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState({});
  const [fetching, setFetching] = useState(true); // ඩේටා ලෝඩ් වෙනකම් පෙන්වන්න

  const inputStyle = "w-full px-5 py-3 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 bg-gray-50/50 shadow-sm font-medium";
  const labelStyle = "block text-sm font-bold text-gray-700 mb-2 ml-1 flex items-center gap-2";

  // 🔄 පේජ් එකට එද්දි ඩේටාබේස් එකෙන් පරණ විස්තර ටික අරන් ෆෝම් එක පුරවනවා
  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await axios.get(`https://realestatelkbackend.vercel.app/api/services/${id}`);
        setName(data.name);
        setCategory(data.category);
        setDescription(data.description);
        setLogo(data.logo);
        setImages(data.images?.length > 0 ? data.images : ['']);
        setPhone(data.contact?.phone || '');
        
        // Packages වල Features Array එක ආපහු String එකක් (කොමා දාලා) කරනවා
        if (data.packages && data.packages.length > 0) {
          const formattedPackages = data.packages.map(pkg => ({
            ...pkg,
            features: Array.isArray(pkg.features) ? pkg.features.join(', ') : pkg.features
          }));
          setPackages(formattedPackages);
        }

        setFetching(false);
      } catch (error) {
        toast.error('Failed to fetch service details');
        setFetching(false);
      }
    };
    fetchService();
  }, [id]);

  const uploadFileHandler = async (e, type, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "realestate_uploads"); 
    formData.append("cloud_name", "ddikxasg2");            
    try {
      if (type === 'logo') setUploadingLogo(true);
      if (type === 'gallery') setUploadingGallery(prev => ({ ...prev, [index]: true }));

      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/ddikxasg2/image/upload",
        formData
      );

      if (type === 'logo') {
        setLogo(data.secure_url);
        toast.success('Logo uploaded successfully!');
      } else if (type === 'gallery') {
        const newImages = [...images];
        newImages[index] = data.secure_url;
        setImages(newImages);
        toast.success(`Gallery image uploaded!`);
      }

    } catch (error) {
      toast.error('Failed to upload image. Please try again.');
    } finally {
      if (type === 'logo') setUploadingLogo(false);
      if (type === 'gallery') setUploadingGallery(prev => ({ ...prev, [index]: false }));
    }
  };

  const addImageField = () => setImages([...images, '']);
  const removeImageField = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    // ඔක්කොම මැකුවොත් හිස් එකක් ඉතුරු කරනවා අලුතින් දාන්න
    if (newImages.length === 0) {
      setImages(['']);
    } else {
      setImages(newImages);
    }
  };
  
  const addPackage = () => setPackages([...packages, { title: '', price: '', features: '' }]);
  const removePackage = (index) => {
    const list = [...packages];
    list.splice(index, 1);
    setPackages(list);
  };
  const handlePackageChange = (index, field, value) => {
    const list = [...packages];
    list[index][field] = value;
    setPackages(list);
  };

  // 🔄 Update Button එක එබුවම
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (uploadingLogo || Object.values(uploadingGallery).some(v => v)) {
        return toast.warning('Please wait until all images are uploaded.');
    }

    if (!logo) {
        return toast.error('Please upload a Main Logo / Preview Image before submitting.');
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const validImages = images.filter(img => img && typeof img === 'string' && img.trim() !== '');

      const serviceData = {
        name, 
        category, 
        description, 
        logo,
        images: validImages,
        contact: { phone },
        packages: packages.map(pkg => ({
          ...pkg,
          features: pkg.features ? pkg.features.split(',').map(f => f.trim()) : [] 
        }))
      };

      await axios.put(`https://realestatelkbackend.vercel.app/api/services/${id}`, serviceData, config);
      toast.success('Company Updated Successfully!');
      navigate('/construction');
    } catch (error) {
      const exactError = error.response?.data?.message || error.message || "Unknown Error";
      toast.error(`Error: ${exactError}`, { autoClose: false }); 
    }
  };

  if (fetching) return <div className="text-center py-20 text-xl font-bold text-gray-500">Loading Service Data...</div>;

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-gray-100">
        
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-3">Edit <span className="text-blue-600">Service Partner</span></h2>
          <p className="text-gray-500 font-medium">Update construction company or architect details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={labelStyle}><FaBuilding className="text-blue-500"/> Company Name</label>
              <input type="text" value={name} className={inputStyle} onChange={(e) => setName(e.target.value)} required />
            </div>
            
            <div className="space-y-2">
              <label className={labelStyle}>Category</label>
              <select className={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Construction">Construction</option>
                <option value="Architect">Architect</option>
                <option value="Interior Design">Interior Design</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className={labelStyle}><FaImage className="text-blue-500"/> Main Logo / Preview Image</label>
              <div className="flex items-center gap-4">
                
                {/* ❌ ලෝගෝ එකක් තියෙනවා නම් කතිරයත් එක්ක පෙන්නනවා, නැත්නම් File Input එක පෙන්නනවා */}
                {logo ? (
                  <div className="relative inline-block border-2 border-blue-100 rounded-2xl p-1">
                    <img src={logo} alt="Logo" className="w-24 h-24 rounded-xl object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setLogo('')} 
                      className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg transform hover:scale-110 transition-all"
                      title="Remove Logo"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                ) : (
                  <input 
                    type="file" 
                    accept="image/*"
                    className={`${inputStyle} file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer`} 
                    onChange={(e) => uploadFileHandler(e, 'logo')} 
                    required
                  />
                )}
                {uploadingLogo && <FaSpinner className="animate-spin text-blue-600 text-xl" />}
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelStyle}><FaAlignLeft className="text-blue-500"/> Company Description</label>
              <textarea rows="4" value={description} className={`${inputStyle} resize-none`} onChange={(e) => setDescription(e.target.value)} required></textarea>
            </div>
          </div>

          <div className="border-t pt-8 mt-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2">
                <FaImage className="text-blue-500"/> Project Gallery
              </h3>
              <button type="button" onClick={addImageField} className="bg-blue-100 text-blue-700 px-5 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-200 transition-all">
                <FaPlus size={14} /> Add Image Slot
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((img, index) => (
                <div key={index}>
                  {/* ❌ ගැලරි ඉමේජ් එකක් තියෙනවා නම් කතිරය එක්ක පෙන්නනවා */}
                  {img ? (
                    <div className="relative border-2 border-gray-100 rounded-2xl p-2 bg-white shadow-sm h-full flex flex-col justify-center">
                      <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-32 rounded-xl object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImageField(index)} 
                        className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg transform hover:scale-110 transition-all"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  ) : (
                    /* නැත්නම් File Input එක පෙන්නනවා */
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 relative group space-y-3 h-full flex flex-col justify-center">
                      <div className="flex items-center gap-3">
                        <input 
                          type="file" 
                          accept="image/*"
                          className={`w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 cursor-pointer`}
                          onChange={(e) => uploadFileHandler(e, 'gallery', index)} 
                        />
                        {uploadingGallery[index] && <FaSpinner className="animate-spin text-blue-600" />}
                        {images.length > 1 && (
                          <button type="button" onClick={() => removeImageField(index)} className="absolute -top-2 -right-2 bg-red-100 text-red-600 p-1.5 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-sm">
                            <FaTimes size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50/50 p-8 rounded-[2rem] border border-blue-100 space-y-4">
             <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><FaPhoneAlt /> Contact Information</h3>
             <input type="text" value={phone} className={inputStyle} onChange={(e) => setPhone(e.target.value)} required />
          </div>

          <div className="pt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gray-800 tracking-tight">Service Packages</h3>
              <button type="button" onClick={addPackage} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95">
                <FaPlus size={14} /> Add Package
              </button>
            </div>
            <div className="space-y-6">
              {packages.map((pkg, index) => (
                <div key={index} className="p-8 bg-white rounded-3xl border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors relative group">
                  {packages.length > 1 && (
                    <button type="button" onClick={() => removePackage(index)} className="absolute -top-3 -right-3 bg-red-100 text-red-600 p-2.5 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-sm">
                      <FaTrash size={14} /> {/* පැකේජ් මකන එකට විතරක් Trash එක තිබ්බා */}
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input type="text" placeholder="Package Title" className={inputStyle} value={pkg.title} onChange={(e) => handlePackageChange(index, 'title', e.target.value)} required />
                    <input type="text" placeholder="Price" className={inputStyle} value={pkg.price} onChange={(e) => handlePackageChange(index, 'price', e.target.value)} required />
                    <div className="md:col-span-2"><input type="text" placeholder="Features (commas)" className={inputStyle} value={pkg.features} onChange={(e) => handlePackageChange(index, 'features', e.target.value)} required /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[1.5rem] font-black text-xl shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 disabled:bg-gray-400" disabled={uploadingLogo || Object.values(uploadingGallery).some(v => v)}>
            {uploadingLogo || Object.values(uploadingGallery).some(v => v) ? 'Uploading Images...' : 'Update Construction Company'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditService;