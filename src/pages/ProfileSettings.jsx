import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUserEdit, FaSave } from 'react-icons/fa';

const ProfileSettings = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo) {
      navigate('/login');
    } else {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        'https://realestatelk.vercel.app/api/users/profile',
        { name, email, password },
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      
      toast.success('Profile Updated Successfully!');
      setPassword(''); 
      setConfirmPassword('');
      setLoading(false);
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 min-h-screen">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        
        <div className="bg-blue-600 p-8 text-center">
          <FaUserEdit className="text-white text-5xl mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-white tracking-wide">Profile Settings</h1>
          <p className="text-blue-100 mt-2">Update your personal details and password here.</p>
        </div>

        <div className="p-8 md:p-10 bg-gray-50">
          <form onSubmit={submitHandler} className="space-y-6">
            
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Full Name</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-100 cursor-not-allowed"
                required
                disabled 
              />
            </div>

            <hr className="my-6 border-gray-200" />
            <p className="text-sm text-gray-500 font-semibold mb-4 text-center">Leave password fields blank if you do not want to change it.</p>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col w-full">
                <label className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">New Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="Enter new password"
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Confirm Password</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition duration-300 shadow-lg text-lg flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <FaSave className="mr-2 text-xl" />
              {loading ? 'Updating...' : 'Save Changes'}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default ProfileSettings;