import { motion } from 'framer-motion';
import { FaBullseye, FaMobileScreenButton, FaLocationDot, FaChartLine } from 'react-icons/fa6';

// Create motion components with proper TypeScript types
type MotionComponentProps = {
  children?: React.ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  transition?: any;
  viewport?: any;
  whileInView?: any;
  [key: string]: any;
};

const MotionH1 = ({ children, ...props }: MotionComponentProps) => (
  <motion.h1 {...props}>{children}</motion.h1>
);

const MotionP = ({ children, ...props }: MotionComponentProps) => (
  <motion.p {...props}>{children}</motion.p>
);

const MotionDiv = ({ children, ...props }: MotionComponentProps) => (
  <motion.div {...props}>{children}</motion.div>
);

const Services = () => {
  const services = [
    {
      icon: <FaBullseye className="text-4xl text-blue-600" />,
      title: 'Digital Screen Advertising',
      description: 'High-impact digital displays in strategic locations to maximize your brand visibility and reach your target audience effectively.',
    },
    {
      icon: <FaMobileScreenButton className="text-4xl text-blue-600" />,
      title: 'Mobile Advertising',
      description: 'Reach customers on the go with our targeted mobile advertising solutions that deliver results across all devices.',
    },
    {
      icon: <FaLocationDot className="text-4xl text-blue-600" />,
      title: 'Location-Based Marketing',
      description: 'Target customers based on their geographic location with our advanced location-based marketing strategies.',
    },
    {
      icon: <FaChartLine className="text-4xl text-blue-600" />,
      title: 'Performance Analytics',
      description: 'Comprehensive analytics and reporting to track the performance of your campaigns and optimize for better results.',
    },
  ];

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
            Our Advertising Services
          </motion.h1>
          <motion.p 
            className="text-xl text-blue-100 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Comprehensive advertising solutions designed to help your business grow and reach its full potential.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-2xl font-semibold mb-3 text-black">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Contact us today to discuss how we can help you achieve your advertising goals.
          </p>
          <a
            href="/contact"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
};

export default Services;
