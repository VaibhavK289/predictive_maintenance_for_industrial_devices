'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Activity, 
  BarChart3, 
  Shield, 
  Clock, 
  ArrowRight, 
  Sparkles,
  Zap,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'Real-time Monitoring',
    description: 'Track machine performance and health metrics in real-time with precision sensors.',
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
  },
  {
    icon: BarChart3,
    title: 'Predictive Analytics',
    description: 'ML-powered predictions for proactive maintenance scheduling.',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
  },
  {
    icon: Shield,
    title: 'Failure Prevention',
    description: 'Prevent costly breakdowns and extend equipment lifespan.',
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'bg-purple-50',
  },
  {
    icon: Clock,
    title: '24/7 Alerts',
    description: 'Instant notifications for critical maintenance needs.',
    color: 'from-orange-500 to-amber-500',
    bgColor: 'bg-orange-50',
  },
];

const stats = [
  { value: '99.9%', label: 'Uptime Guarantee' },
  { value: '50%', label: 'Cost Reduction' },
  { value: '3x', label: 'Faster Detection' },
  { value: '24/7', label: 'Monitoring' },
];

const benefits = [
  'Reduce unplanned downtime by up to 70%',
  'Extend equipment lifespan significantly',
  'Lower maintenance costs dramatically',
  'Improve operational efficiency',
  'Data-driven decision making',
  'Real-time visibility across all assets',
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Predictive Maintenance
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="text-gray-900">Smart</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Industrial
                </span>
                <br />
                <span className="text-gray-900">Maintenance</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
                Predict and prevent equipment failures before they happen. 
                Reduce downtime, cut costs, and maximize operational efficiency.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-blue-500/25 group"
                >
                  View Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/features"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                >
                  Explore Features
                </Link>
              </div>
            </motion.div>
            
            {/* Hero Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square">
                {/* Main Card */}
                <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      <span className="text-sm text-gray-500">Live Dashboard</span>
                    </div>
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                        <p className="text-sm text-blue-600 font-medium">Uptime</p>
                        <p className="text-2xl font-bold text-blue-700">99.8%</p>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4">
                        <p className="text-sm text-emerald-600 font-medium">Active</p>
                        <p className="text-2xl font-bold text-emerald-700">24</p>
                      </div>
                      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4">
                        <p className="text-sm text-amber-600 font-medium">Warnings</p>
                        <p className="text-2xl font-bold text-amber-700">3</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                        <p className="text-sm text-purple-600 font-medium">Predicted</p>
                        <p className="text-2xl font-bold text-purple-700">12h</p>
                      </div>
                    </div>
                    
                    {/* Chart Placeholder */}
                    <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600">Performance Trend</span>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div className="h-24 flex items-end justify-between space-x-1">
                        {[40, 60, 45, 75, 55, 80, 65, 90, 70, 85, 75, 95].map((height, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                            style={{ height: `${height}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <Zap className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">All Systems</p>
                      <p className="text-xs text-emerald-600">Operational</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Prediction</p>
                      <p className="text-xs text-blue-600">98.5% accuracy</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-gray-600 mt-2 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">PredictiveCare</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with practical solutions 
              to deliver a complete predictive maintenance system.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full card-hover">
                    <div className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-7 w-7 bg-gradient-to-r ${feature.color} bg-clip-text`} style={{ color: feature.color.includes('blue') ? '#3b82f6' : feature.color.includes('emerald') ? '#10b981' : feature.color.includes('purple') ? '#8b5cf6' : '#f97316' }} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Transform Your <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Maintenance Operations
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Move from reactive to proactive maintenance with our intelligent platform 
                that learns and adapts to your equipment&apos;s unique patterns.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 rounded-3xl p-8">
                <div className="h-full bg-white rounded-2xl shadow-xl p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-gray-900">ROI Calculator</h3>
                    <span className="text-sm text-gray-500">Annual Savings</span>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Downtime Reduction</span>
                        <span className="font-semibold text-emerald-600">$120,000</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-4/5 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Maintenance Savings</span>
                        <span className="font-semibold text-blue-600">$80,000</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-3/5 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Equipment Lifespan</span>
                        <span className="font-semibold text-purple-600">$50,000</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-2/5 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-100 mt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Total Annual Savings</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        $250,000
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Operations?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join hundreds of companies that have revolutionized their maintenance 
              with our predictive analytics platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-xl group"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white rounded-xl font-semibold border-2 border-white/30 hover:bg-white/10 transition-all duration-200"
              >
                View Live Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
