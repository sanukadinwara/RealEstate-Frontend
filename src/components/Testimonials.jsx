import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaPen, FaEdit, FaTrash } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const [editReviewId, setEditReviewId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get('realestatelkbackend.vercel.app/api/sitereviews');
      setReviews(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch site reviews', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (rating === 0 && !comment.trim()) {
      return toast.warning('Please provide a rating or a comment!');
    }

    try {
      setSubmitLoading(true);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post('realestatelkbackend.vercel.app/api/sitereviews', { rating, comment }, config);
      
      toast.success('Thank you for your review!');
      setRating(0);
      setComment('');
      setShowForm(false);
      fetchReviews(); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitLoading(false);
    }
  };

  const deleteReviewHandler = async (reviewId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete your platform review?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#3b82f6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.delete(`realestatelkbackend.vercel.app/api/sitereviews/${reviewId}`, config);
        Swal.fire('Deleted!', 'Your review has been removed.', 'success');
        fetchReviews(); 
      } catch (error) {
        toast.error(error.response?.data?.message || 'Error deleting review');
      }
    }
  };

  const updateReviewHandler = async (e, reviewId) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`realestatelkbackend.vercel.app/api/sitereviews/${reviewId}`, { rating: editRating, comment: editComment }, config);
      toast.success('Review Updated Successfully!');
      setEditReviewId(null);
      fetchReviews(); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating review');
    }
  };

  const ratedReviews = reviews.filter(r => r.rating > 0);
  const avgRating = ratedReviews.length > 0 
    ? (ratedReviews.reduce((sum, r) => sum + r.rating, 0) / ratedReviews.length).toFixed(1)
    : 0;

  const topReviews = [...reviews].sort((a, b) => {
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  }).slice(0, 3);

  return (
    <div className="bg-[#f4f6f9] py-16 px-4 font-montserrat">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-4xl font-black text-gray-900 mb-4 tracking-tight">
            What Our <span className="text-blue-600">Users Say</span>
          </h2>
          <p className="text-lg text-gray-600 font-medium max-w-2xl mx-auto mb-6">
            Real experiences from people who found their perfect properties and construction partners through our platform.
          </p>
          
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center space-x-3 text-gray-800 bg-white px-6 py-2 rounded-full shadow-sm border border-gray-100">
              <span className="font-extrabold text-2xl">{avgRating}</span>
              <div className="flex text-yellow-400 text-xl">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
              </div>
              <span className="text-gray-400">|</span>
              <MdVerified className="text-blue-500 text-xl" />
              <span className="font-medium text-sm">Based on {ratedReviews.length} ratings</span>
            </div>

            {!showForm && (
              <button 
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-full shadow-md transition-all flex items-center mt-2"
              >
                <FaPen className="mr-2" /> Write a Review
              </button>
            )}
          </div>
        </div>

        {showForm && (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-md mb-12 border border-gray-200 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Rate Your Experience</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-red-500 font-bold text-2xl">×</button>
            </div>
            
            {userInfo ? (
              <form onSubmit={submitReviewHandler} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar 
                        key={star} size={32} 
                        className={`cursor-pointer transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-200 hover:text-yellow-100'}`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Share your thoughts (Optional)</label>
                  <textarea 
                    rows="4" value={comment} onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you loved about the platform..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 resize-none"
                  ></textarea>
                </div>
                <button type="submit" disabled={submitLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition disabled:bg-blue-300">
                  {submitLoading ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            ) : (
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <p className="text-blue-800 font-medium">Please <Link to="/login" className="font-bold underline">log in</Link> to share your experience.</p>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-500 font-bold text-lg">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-500 italic bg-white p-10 rounded-3xl border border-gray-100 max-w-2xl mx-auto">No reviews yet. Be the first to share your experience!</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topReviews.map((review) => (
                <div key={review._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow duration-300 relative group">
                  
                  {editReviewId === review._id ? (
                    <form onSubmit={(e) => updateReviewHandler(e, review._id)} className="space-y-3">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FaStar key={star} size={20} className={`cursor-pointer transition-colors ${star <= editRating ? 'text-yellow-400' : 'text-gray-300'}`} onClick={() => setEditRating(star)}/>
                        ))}
                      </div>
                      <textarea 
                        rows="3" value={editComment} onChange={(e) => setEditComment(e.target.value)} placeholder="Update your comment..."
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-blue-500 outline-none resize-none text-sm"
                      ></textarea>
                      <div className="flex gap-2">
                        <button type="submit" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-700">Save</button>
                        <button type="button" onClick={() => setEditReviewId(null)} className="bg-gray-300 text-gray-800 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-gray-400">Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex text-yellow-400 text-lg">
                            {review.rating > 0 && [...Array(review.rating)].map((_, i) => <FaStar key={i} />)}
                          </div>
                          
                          {userInfo && (userInfo._id === review.user || userInfo.isAdmin) && (
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditReviewId(review._id); setEditRating(review.rating); setEditComment(review.comment); }} className="text-blue-500 hover:text-blue-700 p-1"><FaEdit size={14} /></button>
                              <button onClick={() => deleteReviewHandler(review._id)} className="text-red-500 hover:text-red-700 p-1"><FaTrash size={14} /></button>
                            </div>
                          )}
                        </div>

                        {review.comment && (
                          <p className="text-gray-700 text-sm leading-relaxed mb-6 font-medium">
                            "{review.comment}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-auto border-t border-gray-50 pt-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg border border-blue-100">
                            {review.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <span className="block font-bold text-gray-900 text-sm">{review.name}</span>
                            <span className="block text-xs text-gray-400 font-medium">{new Date(review.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <MdVerified className="text-blue-500 text-xl" title="Verified User" />
                      </div>
                    </>
                  )}

                </div>
              ))}
            </div>

            {reviews.length > 3 && (
              <div className="text-center mt-10">
                <Link 
                  to="/all-platform-reviews"
                  className="text-blue-600 font-bold hover:text-blue-800 transition-colors underline underline-offset-4 decoration-2"
                >
                  See all {reviews.length} reviews...
                </Link>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default Testimonials;