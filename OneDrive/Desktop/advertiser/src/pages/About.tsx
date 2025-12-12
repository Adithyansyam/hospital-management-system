import { motion } from 'framer-motion';
import { FaBullseye, FaLightbulb, FaHandshake } from 'react-icons/fa';

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

type TeamMember = {
  id: number;
  name: string;
  role: string;
  image: string;
  social: {
    twitter?: string;
    linkedin: string;
  };
};

const About = () => {
  const stats = [
    { label: 'Years Experience', value: '10+' },
    { label: 'Clients Served', value: '250+' },
    { label: 'Campaigns', value: '500+' },
    { label: 'Team Members', value: '50+' },
  ];

  const values = [
    {
      icon: <FaBullseye className="text-4xl text-blue-600" />,
      title: 'Our Mission',
      description: 'To deliver innovative and effective advertising solutions that help businesses grow and succeed in a competitive market.'
    },
    {
      icon: <FaLightbulb className="text-4xl text-blue-600" />,
      title: 'Our Vision',
      description: 'To be the leading advertising agency recognized for creativity, innovation, and measurable results.'
    },
    {
      icon: <FaHandshake className="text-4xl text-blue-600" />,
      title: 'Our Values',
      description: 'Integrity, creativity, collaboration, and a relentless focus on delivering value to our clients.'
    }
  ];

  const team: TeamMember[] = [
    {
      id: 1,
      name: 'Alex Johnson',
      role: 'CEO & Founder',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      social: {
        twitter: '#',
        linkedin: '#',
      },
    },
    {
      id: 2,
      name: 'Sarah Williams',
      role: 'Creative Director',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      social: {
        twitter: '#',
        linkedin: '#',
      },
    },
    {
      id: 3,
      name: 'Michael Chen',
      role: 'Head of Strategy',
      image: 'https://randomuser.me/api/portraits/men/29.jpg',
      social: {
        twitter: '#',
        linkedin: '#',
      },
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      role: 'Marketing Director',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      social: {
        twitter: '#',
        linkedin: '#',
      },
    },
  ];

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              About AdvertisePro
            </motion.h1>
            <motion.p 
              className="text-xl text-blue-100 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              We're a team of passionate marketers and creatives dedicated to helping businesses grow through innovative advertising solutions.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex items-center gap-12">
            <motion.div 
              className="lg:w-1/2 mb-12 lg:mb-0"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2015, AdvertisePro started as a small team of marketing enthusiasts with a vision to transform how businesses connect with their audiences. 
                  What began as a modest startup has grown into a full-service advertising agency serving clients across various industries.
                </p>
                <p>
                  Our journey has been marked by innovation, creativity, and an unwavering commitment to delivering exceptional results for our clients. 
                  We've had the privilege of working with startups, small businesses, and Fortune 500 companies, helping them achieve their marketing goals.
                </p>
                <p>
                  Today, we continue to push boundaries and explore new frontiers in advertising, always staying ahead of industry trends and leveraging the latest technologies 
                  to create impactful campaigns that drive real business growth.
                </p>
              </div>
            </motion.div>
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009c01201c9c" 
                alt="Our Team" 
                className="rounded-lg shadow-xl w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our work and shape our company culture
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-lg text-center hover:shadow-md transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The talented individuals behind our success
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-64 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-blue-600 mb-4">{member.role}</p>
                  <div className="flex justify-center space-x-4">
                    {member.social.twitter && (
                      <a 
                        href={member.social.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <span className="sr-only">Twitter</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    )}
                    <a 
                      href={member.social.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-700 transition-colors"
                    >
                      <span className="sr-only">LinkedIn</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Work With Us?</h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Let's discuss how we can help you achieve your business goals through innovative advertising solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/portfolio"
              className="inline-block border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition"
            >
              View Our Portfolio
            </a>
            <a
              href="/contact"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
