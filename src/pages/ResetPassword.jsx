import { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaLock } from 'react-icons/fa';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { token } = useParams();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.put(`http://localhost:5000/api/users/resetpassword/${token}`, { password });
      
      toast.success(data.message || 'Password reset successful! You can now login.');
      setLoading(false);
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid or expired token');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        
        <div className="text-center mb-8">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLock className="text-green-600 text-2xl" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create New Password</h2>
          <p className="text-gray-500">Please enter your new password below.</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-5">
          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">New Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
              placeholder="Confirm new password"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition duration-300 shadow-md text-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Saving...' : 'Reset Password'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default ResetPassword;