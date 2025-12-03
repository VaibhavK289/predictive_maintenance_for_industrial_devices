'use client';

import { motion } from 'framer-motion';
import { Users, Target, Lightbulb, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const team = [
  {
    name: 'Dr. John Smith',
    role: 'Chief Technology Officer',
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    bio: '15+ years in industrial IoT and ML systems'
  },
  {
    name: 'Sarah Johnson',
    role: 'Lead Data Scientist',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    bio: 'PhD in Machine Learning from MIT'
  },
  {
    name: 'Michael Chen',
    role: 'IoT Solutions Architect',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    bio: 'Former Amazon IoT Lead Engineer'
  },
];

const stats = [
  { value: '500+', label: 'Machines Monitored', description: 'Active sensors worldwide' },
  { value: '98%', label: 'Prediction Accuracy', description: 'Industry-leading ML models' },
  { value: '50+', label: 'Enterprise Clients', description: 'Fortune 500 companies' },
  { value: '24/7', label: 'Support Available', description: 'Global support team' },
];

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To empower industries with predictive maintenance solutions that prevent equipment failures, reduce downtime, and optimize operational efficiency.',
    color: 'blue'
  },
  {
    icon: Lightbulb,
    title: 'Our Vision',
    description: 'To become the global leader in industrial predictive maintenance, driving the future of smart manufacturing and Industry 4.0.',
    color: 'emerald'
  },
];

const timeline = [
  { year: '2019', title: 'Company Founded', description: 'Started with a vision to revolutionize industrial maintenance' },
  { year: '2020', title: 'First ML Model', description: 'Developed our proprietary prediction algorithm' },
  { year: '2021', title: 'Series A Funding', description: 'Raised $10M to expand operations' },
  { year: '2022', title: '100 Clients', description: 'Reached 100 enterprise clients milestone' },
  { year: '2023', title: 'Global Expansion', description: 'Opened offices in Europe and Asia' },
  { year: '2024', title: 'AI Integration', description: 'Launched next-gen AI-powered features' },
];

export default function About() {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
            <Users className="h-4 w-4 mr-2" />
            About Us
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            About{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              PredictiveCare
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We&apos;re revolutionizing industrial maintenance through advanced machine learning
            and IoT technology, helping businesses prevent failures before they happen.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-3xl p-8 lg:p-10 ${value.color === 'blue' ? 'bg-gradient-to-br from-blue-50 to-blue-100/50' : 'bg-gradient-to-br from-emerald-50 to-emerald-100/50'}`}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-xl ${value.color === 'blue' ? 'bg-blue-100' : 'bg-emerald-100'}`}>
                    <Icon className={`h-6 w-6 ${value.color === 'blue' ? 'text-blue-600' : 'text-emerald-600'}`} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 ml-4">{value.title}</h2>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600">From startup to industry leader</p>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-blue-500 to-indigo-500" />
            
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                      <span className="text-sm font-semibold text-blue-600">{item.year}</span>
                      <h3 className="text-xl font-bold text-gray-900 mt-1">{item.title}</h3>
                      <p className="text-gray-600 mt-2">{item.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-2/12 justify-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow" />
                  </div>
                  <div className="hidden md:block w-5/12" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We&apos;re a team of passionate engineers, data scientists, and industry
              experts committed to transforming industrial maintenance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-all duration-300">
                  <div className="relative w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 font-medium">{member.role}</p>
                  <p className="text-gray-500 text-sm mt-2">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 lg:p-12 mb-24"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-white font-semibold">{stat.label}</div>
                <div className="text-gray-400 text-sm mt-1">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Want to Join Our Journey?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            We&apos;re always looking for talented individuals who share our passion for innovation.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/25 group"
          >
            Get in Touch
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
