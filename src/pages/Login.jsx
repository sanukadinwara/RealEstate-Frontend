import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      
      const { data } = await axios.post('https://realestatelk.vercel.app/api/users/login', {
        email,
        password,
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Email or Password!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full bg-white overflow-hidden">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:px-16 lg:px-24 overflow-hidden h-full">
        <div className="w-full max-w-md">
          <Link 
          to="/" 
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-semibold mb-6 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to Home
          </Link>
          <h2 className="text-4xl font-montserrat font-bold tracking-tight text-gray-900 mb-3">Welcome Back</h2>
          <p className="text-gray-500 mb-8 text-lg">Please enter your details to sign in.</p>
          
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-50 focus:bg-white"
                placeholder="hello@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-gray-50 focus:bg-white"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-semibold text-blue-600 hover:text-blue-800">Forgot password?</Link>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg disabled:bg-blue-400"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600">
            Don't have an account? <Link to="/register" className="font-bold text-blue-600 hover:text-blue-800">Sign up for free</Link>
          </p>
        </div>
      </div>

      <div 
        className="hidden md:block w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920')" }}
      >
        <div className="w-full h-full bg-black bg-opacity-70 flex flex-col items-center justify-center p-12 text-center">
          <div className="text-white">
            <h3 className="text-4xl font-montserrat font-bold mb-2">Find Your Safe Haven</h3>
            <p className="text-lg text-gray-200">Join our community and discover premium properties around the world.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;