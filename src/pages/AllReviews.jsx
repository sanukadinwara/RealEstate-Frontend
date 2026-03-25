import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaStar, FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevant'); 

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
      console.error('Failed to fetch reviews', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const deleteReviewHandler = async (reviewId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this review?",
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
        Swal.fire('Deleted!', 'Review has been removed.', 'success');
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

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  if (loading) return <div className="text-center py-20 text-xl font-bold text-gray-500">Loading All Reviews...</div>;

  return (
    <div className="bg-[#f4f6f9] min-h-screen py-10 px-4 font-montserrat">
      <div className="max-w-7xl mx-auto">
        
        <Link to="/" className="inline-flex items-center text-blue-600 font-bold hover:underline mb-8">
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">All Platform Reviews</h1>
          <p className="text-gray-500 font-medium">Read what our community thinks about our services.</p>
        </div>

        {reviews.length > 0 && (
          <div className="flex justify-end mb-8">
            <div className="flex items-center space-x-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
              <span className="text-sm font-bold text-gray-500 ml-2">Sort by:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-gray-800 text-sm focus:ring-0 focus:outline-none block p-1 cursor-pointer font-bold"
              >
                <option value="relevant">Most Relevant</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedReviews.map((review) => (
            <div key={review._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow relative group">
              
              {editReviewId === review._id ? (
                <form onSubmit={(e) => updateReviewHandler(e, review._id)} className="space-y-3">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar key={star} size={20} className={`cursor-pointer transition-colors ${star <= editRating ? 'text-yellow-400' : 'text-gray-300'}`} onClick={() => setEditRating(star)}/>
                    ))}
                  </div>
                  <textarea rows="3" value={editComment} onChange={(e) => setEditComment(e.target.value)} placeholder="Update your comment..." className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-blue-500 outline-none resize-none text-sm"></textarea>
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
                      <p className="text-gray-700 text-sm leading-relaxed mb-6 font-medium">"{review.comment}"</p>
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

      </div>
    </div>
  );
};

export default AllReviews;