import React from 'react';
import { Link } from 'react-router-dom';

const AboutSection = ({ title, description, image, maskClass, imageLeft = true }) => {
  return (
    <div className={`flex flex-col ${imageLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-20 py-16 md:py-24`}>
      
      <div className="w-full md:w-1/2 relative">
        <div className={`absolute -inset-4 bg-blue-50/70 ${maskClass} z-0 transform ${imageLeft ? '-rotate-3' : 'rotate-3'}`} />
        
        <img 
          src={image} 
          alt={title} 
          className={`relative z-10 w-full h-[400px] md:h-[450px] object-cover shadow-2xl ${maskClass}`}
        />
      </div>

      <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
        <h2 className="text-4xl font-montserrat font-bold text-gray-900 leading-tight">
          {title}
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

const About = () => {
  const images = {
    team: "https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?q=80&w=1181&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // කම්පැනියේ ටීම් එක
    interior: "https://images.unsplash.com/photo-1638972691611-69633a3d3127?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // ලස්සන Interior එකක්
    couple: "https://images.unsplash.com/photo-1581579186913-45ac3e6efe93?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // සතුටින් ඉන්න Couple එකක් (පවුලක්)
  };

  const maskShapes = [
    "rounded-[30%_70%_70%_30%/30%_30%_70%_70%]",
    "rounded-[60%_40%_50%_50%/40%_50%_50%_60%]",
    "rounded-[40%_60%_60%_40%/60%_30%_70%_40%]" 
  ];

  return (
    <div className="bg-white min-h-screen">
      
      <div className="bg-gray-50 py-24 px-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-blue-600 font-semibold uppercase tracking-widest mb-3">Who We Are</p>
          <h1 className="text-6xl font-montserrat font-bold tracking-tight text-gray-900 tracking-tight">
            About Us
          </h1>
          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Your trusted partner in finding the perfect place to call home in Sri Lanka, built on a foundation of trust and service.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <AboutSection 
          title="Our Story: A Vision for Sri Lankan Homes"
          description="Founded in 2024, RealEstate began with a simple yet powerful vision: to make the process of buying, selling, and renting properties in Sri Lanka seamless, transparent, and trustworthy. What started as a small team has grown into a leading real estate platform, connecting thousands of families to their dream homes. We believe everyone deserves a safe and beautiful space, and we're here to help you find yours."
          image={images.team}
          maskClass={maskShapes[0]}
          imageLeft={true}
        />

        <AboutSection 
          title="A Modern & Tech-Driven Approach"
          description="We combine cutting-edge technology with personalized service. Our platform features detailed listings, high-quality images, and advanced search filters, making it easier than ever to explore properties. But beyond the tech, we pride ourselves on our expert agents who are dedicated to guiding you through every step of your real estate journey, ensuring you make informed decisions with confidence."
          image={images.interior}
          maskClass={maskShapes[1]}
          imageLeft={false}
        />

        <AboutSection 
          title="Built for Families, Driven by Trust"
          description="At Real Estate, our commitment is to you. We focus on verified listings, secure transactions, and honest advice. We understand that a home is more than just a property; it's where memories are made and futures are built. That's why we treat every client like family, working tirelessly to find a home that not only meets your needs but exceeds your expectations."
          image={images.couple}
          maskClass={maskShapes[2]}
          imageLeft={true}
        />

        <div className="bg-[#0b132b] text-white rounded-3xl p-12 md:p-16 my-20 text-center shadow-xl">
          <h3 className="text-4xl font-montserrat font-bold mb-6">Ready to Find Your Home?</h3>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">
            Browse thousands of properties across Sri Lanka or list your own property today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/search" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors text-lg">
              Explore Properties
            </Link>
            <Link to="/add-property" className="bg-white hover:bg-gray-100 text-[#0b132b] font-bold py-3 px-8 rounded-xl transition-colors text-lg border-2 border-white">
              List Your Property
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;