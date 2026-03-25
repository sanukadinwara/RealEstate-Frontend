import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaHome, FaUsers, FaTools, FaTrash, FaEye, FaCheck, FaTimes } from 'react-icons/fa'; 
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [inquiries, setInquiries] = useState([]);
  const [pendingProperties, setPendingProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalTraffic: 0, todayTraffic: 0 });

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        if (!userInfo || !userInfo.isAdmin) {
          navigate('/');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const [inqRes, propRes, statsRes] = await Promise.all([
          axios.get('realestatelkbackend.vercel.app/api/inquiries', config).catch(() => ({ data: [] })),
          axios.get('realestatelkbackend.vercel.app/api/properties/pending', config).catch(() => ({ data: [] })),
          axios.get('realestatelkbackend.vercel.app/api/analytics/stats', config).catch(() => ({ data: { totalTraffic: 0, todayTraffic: 0 } }))
        ]);

        setInquiries(inqRes.data);
        setPendingProperties(propRes.data);
        setStats(statsRes.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
        setLoading(false);
      }
    };

    fetchInquiries();
  }, [navigate]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(`realestatelkbackend.vercel.app/api/inquiries/${id}/status`, { status: newStatus }, config);

      setInquiries(inquiries.map((inq) => 
        inq._id === id ? { ...inq, status: newStatus } : inq
      ));
      
      toast.success('Status updated successfully!');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', 
      cancelButtonColor: '#3b82f6', 
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

        await axios.delete(`realestatelkbackend.vercel.app/api/inquiries/${id}`, config);
        setInquiries(inquiries.filter((inq) => inq._id !== id));
        
        toast.success('Inquiry deleted successfully!');
      } catch (err) {
        toast.error('Failed to delete inquiry');
      }
    }
  };

  const handleApprove = async (id) => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
    
    await axios.put(`realestatelkbackend.vercel.app/api/properties/${id}/approve`, {}, config);
    toast.success('Property Approved!');
    
    setPendingProperties(pendingProperties.filter(prop => prop._id !== id));
  } catch (error) {
    toast.error('Failed to approve property');
  }
};

  const handleReject = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to reject this property? It will be deleted permanently!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', 
      cancelButtonColor: '#3b82f6', 
      confirmButtonText: 'Yes, Reject it!'
    });

    if (result.isConfirmed) {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

        await axios.delete(`realestatelkbackend.vercel.app/api/properties/${id}`, config);
        
        setPendingProperties(pendingProperties.filter(prop => prop._id !== id));
        
        toast.success('Property Rejected and Removed!');
      } catch (error) {
        toast.error('Failed to reject property');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 min-h-screen">
      <h1 className="text-4xl font-montserrat font-bold text-gray-800 tracking-tight mb-8">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between transform transition hover:-translate-y-1">
          <div>
            <p className="text-blue-100 font-medium mb-1">Total Site Visits</p>
            <h3 className="text-4xl font-bold">{stats.totalTraffic}</h3>
          </div>
          <div className="bg-white/20 p-4 rounded-xl text-3xl">🌍</div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-700 rounded-2xl p-6 text-white shadow-lg flex items-center justify-between transform transition hover:-translate-y-1">
          <div>
            <p className="text-purple-100 font-medium mb-1">Today's Unique Visitors</p>
            <h3 className="text-4xl font-bold">{stats.todayTraffic}</h3>
          </div>
          <div className="bg-white/20 p-4 rounded-xl text-3xl">🔥</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-10"> 
        <Link 
          to="/admin/add-service" 
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl flex items-center shadow-lg transition-all transform hover:-translate-y-1"
        >
          <FaPlus className="mr-2" /> Add Construction Company
        </Link>

        <Link 
          to="/add-property" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl flex items-center shadow-lg transition-all transform hover:-translate-y-1"
        >
          <FaHome className="mr-2" /> Add New Property
        </Link>
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 mb-10">
        <div className="p-6 bg-indigo-900 border-b border-indigo-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Pending Property Approvals</h2>
          {pendingProperties.length > 0 && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              {pendingProperties.length} Pending
            </span>
          )}
        </div>

        {pendingProperties.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No properties pending approval.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                  <th className="p-4 font-bold border-b">Property Title</th>
                  <th className="p-4 font-bold border-b">Price</th>
                  <th className="p-4 font-bold border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingProperties.map((prop) => (
                  <tr key={prop._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-800">{prop.title}</td>
                    <td className="p-4 text-green-600 font-bold">LKR {prop.price}</td>
                    <td className="p-4 flex justify-center space-x-2">

                      <Link 
                        to={`/property/${prop._id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors px-3 py-2 rounded-lg font-bold text-sm flex items-center shadow-sm"
                        title="View Property Details"
                      >
                        <FaEye className="mr-1.5 text-lg" /> View
                      </Link>

                      <button 
                        onClick={() => handleApprove(prop._id)} 
                        className="bg-green-100 text-green-700 hover:bg-green-600 hover:text-white transition-colors px-3 py-2 rounded-lg font-bold text-sm flex items-center shadow-sm"
                        title="Approve Property"
                      >
                        <FaCheck className="mr-1.5 text-lg" /> Approve
                      </button>

                      <button 
                        onClick={() => handleReject(prop._id)} 
                        className="bg-red-100 text-red-700 hover:bg-red-600 hover:text-white transition-colors px-3 py-2 rounded-lg font-bold text-sm flex items-center shadow-sm"
                        title="Reject Property"
                      >
                        <FaTimes className="mr-1.5 text-lg" /> Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="p-6 bg-blue-600 border-b border-gray-200">
          <h2 className="text-xl font-bold text-white">Customer Inquiries</h2>
        </div>
      </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500 font-semibold">Loading inquiries...</div>
        ) : error ? (
          <div className="p-10 text-center text-red-500 font-semibold">{error}</div>
        ) : inquiries.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No inquiries found yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                  <th className="p-4 border-b font-bold">Date</th>
                  <th className="p-4 border-b font-bold">Name</th>
                  <th className="p-4 border-b font-bold">Contact Info</th>
                  <th className="p-4 border-b font-bold">Requirements</th>
                  <th className="p-4 border-b font-bold">Status</th>
                  <th className="p-4 border-b font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inquiry) => (
                  <tr key={inquiry._id} className="hover:bg-gray-50 transition-colors border-b last:border-0">
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-semibold text-gray-800">{inquiry.name}</td>
                    <td className="p-4 text-blue-600 font-medium">{inquiry.contact}</td>
                    <td className="p-4 text-gray-600 max-w-xs truncate" title={inquiry.requirements}>
                      {inquiry.requirements}
                    </td>
                    <td className="p-4">
                      <select
                        value={inquiry.status}
                        onChange={(e) => handleStatusChange(inquiry._id, e.target.value)}
                        className={`font-bold text-xs rounded-full px-3 py-1 cursor-pointer outline-none transition-colors ${
                          inquiry.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                          inquiry.status === 'Contacted' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                          'bg-green-100 text-green-800 border border-green-300'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDelete(inquiry._id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center space-x-1"
                        title="Delete Inquiry"
                      >
                        <FaTrash /> 
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};

export default AdminDashboard;