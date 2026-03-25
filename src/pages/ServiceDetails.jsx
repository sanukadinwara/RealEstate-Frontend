import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaPhoneAlt, FaEnvelope, FaGlobe, FaMapMarkerAlt, FaCheckCircle, FaArrowLeft, FaStar, FaHeart, FaRegHeart, FaImage, FaTimes, FaChevronLeft, FaChevronRight, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (userInfo && userInfo.favServices && service?._id) {
      const isFav = userInfo.favServices.some(item => 
        (typeof item === 'object' ? item._id : item) === service._id
      );
      setIsFavorite(isFav);
    }
  }, [service, userInfo]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const closeLightbox = () => setSelectedImageIndex(null);
  
  const goToPrevImage = (e) => {
    e.stopPropagation(); 
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const goToNextImage = (e) => {
    e.stopPropagation();
    if (selectedImageIndex < service.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handleFavorite = async (e) => {
    e.preventDefault(); 
    
    if (!userInfo) {
      return toast.error('Please login to add to favorites');
    }

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post(`http://localhost:5000/api/users/fav-services/${service._id}`, {}, config);
      
      setIsFavorite(!isFavorite); 

      const updatedUser = { ...userInfo, favServices: data.favServices };
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update favorites');
    }
  };

  const fetchServiceDetails = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/services/${id}`);
      setService(data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load company details');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceDetails();
  }, [id]);

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (rating === 0 && !comment.trim()) {
    return toast.warning('Please provide a rating or a comment!');
    }

    try {
      setReviewLoading(true);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      await axios.post(`http://localhost:5000/api/services/${id}/reviews`, { rating, comment }, config);
      
      toast.success('Review added successfully!');
      setRating(0);
      setComment('');

      fetchServiceDetails(); 

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewLoading(false);
    }
  };

  const [editReviewId, setEditReviewId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');

  const deleteReviewHandler = async (reviewId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this review? This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', 
      cancelButtonColor: '#3b82f6', 
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`http://localhost:5000/api/services/${id}/reviews/${reviewId}`, config);

        Swal.fire(
          'Deleted!',
          'Your review has been deleted.',
          'success'
        );
        
        fetchServiceDetails(); 
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error deleting review');
      }
    }
  };


  const updateReviewHandler = async (e, reviewId) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`http://localhost:5000/api/services/${id}/reviews/${reviewId}`, { rating: editRating, comment: editComment }, config);
      toast.success('Review Updated Successfully!');
      setEditReviewId(null);
      fetchServiceDetails(); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating review');
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl font-bold">Loading Company Profile...</div>;
  if (!service) return <div className="text-center mt-20 text-red-500">Company not found!</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link to="/construction" className="flex items-center text-blue-600 font-bold hover:underline">
          <FaArrowLeft className="mr-2" /> Back to Construction Partners
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            
            <img 
              src={service.logo} 
              alt={service.name} 
              className="w-32 h-32 rounded-2xl object-cover shadow-md border-4 border-blue-50 flex-shrink-0" 
            />
            
            <div className="flex-grow w-full">
              
              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start w-full gap-4 sm:gap-0">
                
                <div className="text-center sm:text-left">
                  <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{service.name}</h1>
                  <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold uppercase inline-block">
                    {service.category}
                  </span>
                </div>

                <button 
                  onClick={handleFavorite}
                  className="bg-white text-red-500 p-1 md:p-2 rounded-full shadow-md hover:shadow-lg hover:bg-red-50 hover:scale-110 transition-all flex items-center justify-center border border-gray-100 flex-shrink-0 mt-2 sm:mt-0"
                  title="Add to Favorites"
                >
                  {isFavorite ? (
                    <FaHeart className="text-2xl md:text-3xl" />
                  ) : (
                    <FaRegHeart className="text-2xl md:text-3xl text-gray-300 hover:text-red-400" />
                  )}
                </button>

              </div>

              <p className="text-gray-600 mt-5 md:mt-4 leading-relaxed font-medium text-center sm:text-left">
                {service.description}
              </p>
              
            </div>

          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">Contact Information</h3>
          <div className="space-y-4">
            <div className="flex items-center text-gray-700">
              <FaPhoneAlt className="text-blue-600 mr-4" /> <span className="font-semibold">{service.contact?.phone}</span>
            </div>
            {service.contact?.email && (
              <div className="flex items-center text-gray-700">
                <FaEnvelope className="text-blue-600 mr-4" /> <span>{service.contact.email}</span>
              </div>
            )}
            {service.contact?.website && (
              <div className="flex items-center text-gray-700">
                <FaGlobe className="text-blue-600 mr-4" /> <a href={service.contact.website} target="_blank" rel="noreferrer" className="hover:text-blue-600 underline">Visit Website</a>
              </div>
            )}
            {service.contact?.address && (
              <div className="flex items-center text-gray-700">
                <FaMapMarkerAlt className="text-blue-600 mr-4" /> <span>{service.contact.address}</span>
              </div>
            )}
          </div>
          <button 
            onClick={() => {
              const phone = service.contact?.phone?.replace(/\s/g, ''); 
              const message = "Hi, I found your profile on the platform and I'd like to inquire about your services.";
              window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
            }}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl mt-10 hover:bg-blue-700 transition-all shadow-lg active:scale-95"
          >
            Inquire Now
          </button>
        </div>
      </div>

      {service.images && service.images.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <FaImage className="text-blue-500 mr-4" /> Project Gallery
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {service.images.map((imgUrl, index) => (
              <div 
                key={index} 
                onClick={() => setSelectedImageIndex(index)}
                className="relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 aspect-square group cursor-pointer border border-gray-100"
              >
                <img 
                  src={imgUrl} 
                  alt={`Project ${index + 1}`} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">View</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedImageIndex !== null && service.images && (
        <div 
          className="fixed inset-0 z-[100] bg-black bg-opacity-95 flex items-center justify-center backdrop-blur-sm transition-opacity"
          onClick={closeLightbox}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-3 hover:scale-110 transform"
            onClick={closeLightbox}
          >
            <FaTimes size={30} />
          </button>

          {selectedImageIndex > 0 && (
            <button 
              className="absolute left-4 md:left-10 text-white/70 hover:text-white transition-colors p-4 hover:scale-110 transform active:scale-95"
              onClick={goToPrevImage}
            >
              <FaChevronLeft size={36} />
            </button>
          )}

          <div className="max-w-5xl max-h-[85vh] px-12 md:px-24 flex flex-col items-center">
            <img 
              src={service.images[selectedImageIndex]} 
              alt={`Full size ${selectedImageIndex + 1}`} 
              className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl select-none"
              onClick={(e) => e.stopPropagation()} 
            />
            <p className="text-white/70 font-bold mt-5 tracking-widest text-sm">
              {selectedImageIndex + 1} / {service.images.length}
            </p>
          </div>

          {selectedImageIndex < service.images.length - 1 && (
            <button 
              className="absolute right-4 md:right-10 text-white/70 hover:text-white transition-colors p-4 hover:scale-110 transform active:scale-95"
              onClick={goToNextImage}
            >
              <FaChevronRight size={36} />
            </button>
          )}
          
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
           Available Service Packages
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {service.packages?.map((pkg, index) => (
            <div key={index} className="bg-white rounded-3xl p-8 border-2 border-transparent hover:border-blue-500 transition-all shadow-md flex flex-col group hover:-translate-y-2">
              <h4 className="text-2xl font-bold text-gray-800 mb-2">{pkg.title}</h4>
              <div className="text-3xl font-black text-blue-600 mb-6">{pkg.price}</div>
              
              <ul className="space-y-4 mb-8 flex-grow">
                {pkg.features?.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start text-gray-600 font-medium">
                    <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => {
                  const phone = service.contact?.phone?.replace(/\s/g, '');
                  const message = `Hi, I am interested in your "${pkg.title}" package which is priced at ${pkg.price}. Can you provide more details?`;
                  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
                }}
                className="w-full border-2 border-blue-600 text-blue-600 font-bold py-3.5 rounded-2xl hover:bg-blue-600 hover:text-white transition-all active:scale-95"
              >
                Select {pkg.title}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-black text-gray-900 mb-8">Customer Reviews</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Write a Review</h3>
              
              {userInfo ? (
                <form onSubmit={submitReviewHandler} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar 
                          key={star} 
                          size={28} 
                          className={`cursor-pointer transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Comment</label>
                    <textarea 
                      rows="4" 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience with this company... (Optional)"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none resize-none bg-gray-50"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={reviewLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:bg-blue-400"
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <p className="text-blue-800 font-medium">
                    Please <Link to="/login" className="font-bold underline">log in</Link> to write a review.
                  </p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Previous Reviews ({service.reviews?.length || 0})
              </h3>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {service.reviews?.length === 0 ? (
                  <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                ) : (
                  service.reviews?.map((review) => (
                    <div key={review._id} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 relative group">
                      
                      {editReviewId === review._id ? (
                        <form onSubmit={(e) => updateReviewHandler(e, review._id)} className="space-y-3">
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar 
                                key={star} size={20} 
                                className={`cursor-pointer transition-colors ${star <= editRating ? 'text-yellow-400' : 'text-gray-300'}`}
                                onClick={() => setEditRating(star)}
                              />
                            ))}
                          </div>
                          <textarea 
                            rows="3" 
                            value={editComment} 
                            onChange={(e) => setEditComment(e.target.value)}
                            placeholder="Update your comment..."
                            className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-blue-500 outline-none resize-none text-sm"
                          ></textarea>
                          <div className="flex gap-2">
                            <button type="submit" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-700">Save</button>
                            <button type="button" onClick={() => setEditReviewId(null)} className="bg-gray-300 text-gray-800 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-gray-400">Cancel</button>
                          </div>
                        </form>
                      ) : (
                        <>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-900">{review.name}</h4>
                            <div className="flex text-yellow-400 text-sm">
                              {review.rating > 0 && [...Array(review.rating)].map((_, i) => <FaStar key={i} />)}
                            </div>
                          </div>
                          <p className="text-xs text-gray-400 mb-3">{new Date(review.createdAt).toLocaleDateString()}</p>
                          
                          {review.comment && (
                            <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                          )}

                          {userInfo && (userInfo._id === review.user || userInfo.isAdmin) && (
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => { setEditReviewId(review._id); setEditRating(review.rating); setEditComment(review.comment); }}
                                className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                                title="Edit Review"
                              >
                                <FaEdit size={12} />
                              </button>
                              <button 
                                onClick={() => deleteReviewHandler(review._id)}
                                className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                                title="Delete Review"
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          )}
                        </>
                      )}

                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ServiceDetails;