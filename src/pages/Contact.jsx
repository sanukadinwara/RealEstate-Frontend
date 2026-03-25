import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', contact: '', requirements: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.contact || !formData.requirements) {
      return toast.warning('Please fill all the fields!');
    }

    try {
      setLoading(true);
      await axios.post('realestatelkbackend.vercel.app/api/inquiries', formData);
      
      toast.success('Message sent successfully! Our admin will contact you soon.');
      setFormData({ name: '', contact: '', requirements: '' }); 
    } catch (error) {
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 py-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Get in Touch with Us</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Want to advertise on our platform, report an issue, or simply say hello? Drop us a message and our team will get back to you within 24 hours.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
          
          <div className="bg-blue-600 p-10 lg:w-1/3 text-white flex flex-col justify-center">
            <h3 className="text-3xl font-bold mb-8">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-2xl mr-4 text-blue-200 mt-1" />
                <div>
                  <h4 className="font-semibold text-lg">Our Office</h4>
                  <p className="text-blue-100">123 Real Estate Ave, Colombo 03, Sri Lanka</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaPhoneAlt className="text-2xl mr-4 text-blue-200" />
                <div>
                  <h4 className="font-semibold text-lg">Phone Number</h4>
                  <p className="text-blue-100">+94 12 345 6789</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-2xl mr-4 text-blue-200" />
                <div>
                  <h4 className="font-semibold text-lg">Email Address</h4>
                  <p className="text-blue-100">admin@yourdomain.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 lg:w-2/3">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                  <input 
                    type="text" name="name" value={formData.name} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 transition"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email or Phone</label>
                  <input 
                    type="text" name="contact" value={formData.contact} onChange={handleChange} required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 transition"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Message (Ads, Inquiries, etc.)</label>
                <textarea 
                  name="requirements" value={formData.requirements} onChange={handleChange} required rows="5"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none bg-gray-50 transition resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button 
                type="submit" disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition flex items-center justify-center disabled:bg-blue-400 w-full md:w-auto"
              >
                {loading ? 'Sending...' : <><FaPaperPlane className="mr-2" /> Send Message</>}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;