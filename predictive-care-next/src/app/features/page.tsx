'use client';

import { motion } from 'framer-motion';
import { 
  Activity, 
  BarChart3, 
  Bell, 
  Clock, 
  Database, 
  Shield, 
  Smartphone, 
  Zap,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Activity,
    title: "Real-time Monitoring",
    description: "Monitor machine health metrics in real-time with our advanced sensor network. Get instant visibility into all your equipment.",
    color: "blue",
    stats: "< 100ms latency"
  },
  {
    icon: BarChart3,
    title: "ML-Powered Analytics",
    description: "Leverage machine learning algorithms to predict maintenance needs with 98%+ accuracy using historical and real-time data.",
    color: "emerald",
    stats: "98.5% accuracy"
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description: "Receive instant notifications via email, SMS, or push when maintenance attention is required or anomalies are detected.",
    color: "red",
    stats: "Instant alerts"
  },
  {
    icon: Clock,
    title: "Predictive Scheduling",
    description: "Optimize maintenance schedules based on actual equipment condition rather than fixed time intervals.",
    color: "purple",
    stats: "40% cost savings"
  },
  {
    icon: Database,
    title: "Data Management",
    description: "Centralized storage and analysis of all maintenance-related data with enterprise-grade security and compliance.",
    color: "indigo",
    stats: "Unlimited storage"
  },
  {
    icon: Shield,
    title: "Risk Prevention",
    description: "Identify and prevent potential equipment failures before they occur, reducing unplanned downtime significantly.",
    color: "amber",
    stats: "70% less downtime"
  },
  {
    icon: Smartphone,
    title: "Mobile Access",
    description: "Access your dashboard and alerts from any device, anywhere with our responsive web and native mobile apps.",
    color: "pink",
    stats: "iOS & Android"
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description: "Maximize equipment efficiency and reduce downtime with AI-driven insights and recommendations.",
    color: "orange",
    stats: "25% efficiency gain"
  }
];

const specifications = {
  sensors: [
    "Temperature monitoring (±0.1°C accuracy)",
    "Vibration analysis (up to 20kHz)",
    "Rotation speed measurement",
    "Torque monitoring",
    "Power consumption tracking",
    "Pressure sensors",
    "Acoustic emission detection"
  ],
  system: [
    "Modern web browser (Chrome, Firefox, Safari, Edge)",
    "Internet connection (minimum 1Mbps)",
    "Compatible with all major operating systems",
    "Mobile-responsive design",
    "99.9% system availability",
    "GDPR and SOC 2 compliant",
    "API access for integrations"
  ]
};

const colorClasses: Record<string, { bg: string; iconBg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-50', iconBg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
  emerald: { bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200' },
  red: { bg: 'bg-red-50', iconBg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
  purple: { bg: 'bg-purple-50', iconBg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
  indigo: { bg: 'bg-indigo-50', iconBg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' },
  amber: { bg: 'bg-amber-50', iconBg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' },
  pink: { bg: 'bg-pink-50', iconBg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200' },
  orange: { bg: 'bg-orange-50', iconBg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
};

export default function Features() {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
            <Zap className="h-4 w-4 mr-2" />
            Powerful Features
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Comprehensive Maintenance{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Features
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our platform combines advanced technology with practical solutions to deliver
            a complete predictive maintenance system for modern industrial operations.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = colorClasses[feature.color];
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className={`h-full bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                  <div className={`${colors.iconBg} p-3 rounded-xl inline-flex mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-6 w-6 ${colors.text}`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{feature.description}</p>
                  <div className={`inline-flex items-center px-3 py-1 ${colors.bg} rounded-full`}>
                    <span className={`text-xs font-semibold ${colors.text}`}>{feature.stats}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Technical Specifications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Technical Specifications
            </h2>
            <p className="text-lg text-gray-600">
              Enterprise-grade capabilities for industrial environments
            </p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
              <div className="p-8 lg:p-10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Sensor Capabilities</h3>
                </div>
                <ul className="space-y-4">
                  {specifications.sensors.map((spec, index) => (
                    <motion.li
                      key={spec}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start space-x-3"
                    >
                      <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{spec}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="p-8 lg:p-10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Database className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">System Requirements</h3>
                </div>
                <ul className="space-y-4">
                  {specifications.system.map((spec, index) => (
                    <motion.li
                      key={spec}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start space-x-3"
                    >
                      <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{spec}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 lg:p-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to See It in Action?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Experience the power of predictive maintenance with our live dashboard demo.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-xl group"
          >
            View Live Dashboard
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
