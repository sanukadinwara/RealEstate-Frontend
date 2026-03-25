import { useState, useEffect, useRef } from 'react';
import axios from 'axios'; 

const StatItem = ({ endValue, label, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (endValue === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 2000;
          const increment = endValue / (duration / 16);

          const timer = setInterval(() => {
            start += increment;
            if (start >= endValue) {
              setCount(endValue);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [endValue]);

  return (
    <div ref={ref} className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors duration-300">
      <div className="text-5xl md:text-6xl font-extrabold text-blue-400 mb-2 font-montserrat tracking-tight">
        {count}{suffix}
      </div>
      <p className="text-gray-300 font-medium text-xs md:text-sm uppercase tracking-widest">{label}</p>
    </div>
  );
};

const Stats = () => {
  const bgImage = "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920";

  const [stats, setStats] = useState({
    properties: 0,
    services: 0,
    reviews: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('https://realestatelk.vercel.app/api/analytics/public-stats');
        setStats({
          properties: data.properties || 0,
          services: data.services || 0,
          reviews: data.reviews || 0
        });
      } catch (error) {
        console.error("Failed to fetch public stats", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="relative py-28 px-4 overflow-hidden mt-20 z-0">
      
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      <div className="absolute inset-0 z-1 bg-[#0b132b]/90" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <StatItem endValue={stats.reviews} suffix="+" label="Happy Clients" />
          <StatItem endValue={stats.properties} suffix="+" label="Premium Properties" />
          <StatItem endValue={stats.services} suffix="+" label="Service Partners" />
          
          <StatItem endValue={12} suffix="+" label="Years Experience" />
        </div>
      </div>
    </div>
  );
};

export default Stats;