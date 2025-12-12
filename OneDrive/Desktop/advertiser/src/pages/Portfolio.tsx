import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaExternalLinkAlt } from 'react-icons/fa';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const portfolioItems = [
    {
      id: 1,
      title: 'Retail Campaign',
      category: 'retail',
      image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d',
      description: 'A comprehensive retail campaign that increased foot traffic by 40%.',
    },
    {
      id: 2,
      title: 'Food & Beverage',
      category: 'food',
      image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df',
      description: 'Brand awareness campaign for a leading food chain.',
    },
    {
      id: 3,
      title: 'Tech Launch',
      category: 'technology',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692',
      description: 'Product launch campaign for a tech startup.',
    },
    {
      id: 4,
      title: 'Fashion Week',
      category: 'fashion',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016042',
      description: 'Promotional campaign for a major fashion event.',
    },
    {
      id: 5,
      title: 'Healthcare Awareness',
      category: 'healthcare',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef',
      description: 'Public health awareness campaign.',
    },
    {
      id: 6,
      title: 'Automotive Launch',
      category: 'automotive',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e',
      description: 'New vehicle launch campaign with interactive displays.',
    },
  ];

  const filters = [
    { id: 'all', name: 'All Work' },
    { id: 'retail', name: 'Retail' },
    { id: 'food', name: 'Food & Beverage' },
    { id: 'technology', name: 'Technology' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'automotive', name: 'Automotive' },
  ];

  const filteredItems = activeFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Portfolio
          </motion.h1>
          <motion.p 
            className="text-xl text-blue-100 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Explore our successful advertising campaigns and see how we've helped businesses grow.
          </motion.p>
        </div>
      </section>

      {/* Portfolio Filters */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                    <button className="text-white p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition">
                      <FaSearch className="text-xl" />
                    </button>
                    <a 
                      href={item.image} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-white p-3 bg-blue-600 rounded-full hover:bg-blue-700 transition"
                    >
                      <FaExternalLinkAlt className="text-xl" />
                    </a>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
