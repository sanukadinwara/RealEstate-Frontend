import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post('http://localhost:5000/api/users/forgotpassword', { email });
      
      toast.success(data.message || 'Email sent successfully! Check your inbox.');
      setEmail('');
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send email');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        
        <div className="text-center mb-8">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaEnvelope className="text-blue-600 text-2xl" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Forgot Password?</h2>
          <p className="text-gray-500">Enter your email and we'll send you a link to reset your password.</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              placeholder="Enter your registered email"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition duration-300 shadow-md text-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Sending Link...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center text-gray-600 hover:text-blue-600 font-semibold transition-colors">
            <FaArrowLeft className="mr-2" /> Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;