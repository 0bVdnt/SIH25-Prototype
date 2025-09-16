import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Shield, Users, MapPin, TrendingUp, AlertTriangle, Eye, Clock, Star, ChevronRight, Waves } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  const [currentAlert, setCurrentAlert] = useState(0);
  const [stats, setStats] = useState({ reports: 1247, users: 8934, alerts: 156 });

  const alerts = [
    { type: 'High Tide Warning', location: 'Mumbai Coast', severity: 'high', time: '2 min ago' },
    { type: 'Jellyfish Sighting', location: 'Goa Beach', severity: 'medium', time: '5 min ago' },
    { type: 'Oil Spill Alert', location: 'Chennai Marina', severity: 'critical', time: '8 min ago' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlert((prev) => (prev + 1) % alerts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: AlertTriangle,
      title: 'Instant Alerts',
      description: 'Get real-time notifications about ocean hazards in your area.',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Eye,
      title: 'Community Watch',
      description: 'Join thousands of coastal guardians monitoring our shores.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Shield,
      title: 'Verified Reports',
      description: 'Expert-verified information you can trust for safety decisions.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Clock,
      title: '24/7 Monitoring',
      description: 'Round-the-clock surveillance of coastal hazards and conditions.',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai',
      text: 'This app saved my family from a dangerous rip current. The real-time alerts are incredibly accurate!',
      rating: 5
    },
    {
      name: 'Raj Patel',
      location: 'Goa',
      text: 'As a fisherman, I rely on TarangNetra daily. The community reports help me plan safer trips.',
      rating: 5
    },
    {
      name: 'Dr. Meera Nair',
      location: 'Kerala',
      text: 'The verification system ensures we get reliable information. Essential for coastal safety.',
      rating: 5
    }
  ];

  return (
    <div className="overflow-hidden bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-ocean-50 via-blue-50 to-indigo-100 flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-ocean-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <div className="text-left space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-ocean-100 text-ocean-800 rounded-full text-sm font-medium border border-ocean-200 hover:bg-ocean-200 transition-colors">
                  <Waves className="w-4 h-4 mr-2" />
                  Protecting {stats.users.toLocaleString()}+ Coastal Communities
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Stay Safe with
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-ocean-500 to-blue-600 block">
                    Ocean Alerts
                  </span>
                </h1>
                
                <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-xl">
                  Real-time hazard monitoring and community-driven safety alerts 
                  for India's coastal regions.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <>
                    {user.role === 'citizen' && (
                      <Link
                        to="/submit-report"
                        className="group bg-gradient-to-r from-ocean-500 to-blue-600 hover:from-ocean-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 transform"
                      >
                        Report Ocean Hazard
                        <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                      </Link>
                    )}
                    <Link
                      to="/reports"
                      className="group bg-white hover:bg-gray-50 text-ocean-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 border-2 border-ocean-500 flex items-center justify-center hover:shadow-xl hover:scale-105 transform"
                    >
                      View Active Alerts
                      <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="group bg-gradient-to-r from-ocean-500 to-blue-600 hover:from-ocean-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 transform"
                    >
                      Join Ocean Watch
                      <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                    </Link>
                    <Link
                      to="/reports"
                      className="group bg-white hover:bg-gray-50 text-ocean-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 border-2 border-ocean-500 flex items-center justify-center hover:shadow-xl hover:scale-105 transform"
                    >
                      View Live Alerts
                      <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-ocean-600">{stats.reports.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 font-medium">Reports Filed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-ocean-600">{stats.users.toLocaleString()}</div>
                  <div className="text-sm text-gray-600 font-medium">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-ocean-600">{stats.alerts}</div>
                  <div className="text-sm text-gray-600 font-medium">Active Alerts</div>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="relative">
                {/* Main Alert Card */}
                <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 hover:shadow-3xl transition-all duration-500 hover:scale-105 transform">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Live Alerts</h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-600">Live</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {alerts.map((alert, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-2xl border-l-4 transition-all duration-500 ${
                          index === currentAlert 
                            ? 'bg-red-50 border-red-500 scale-105 shadow-lg' 
                            : 'bg-gray-50 border-gray-300 opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                                alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {alert.severity.toUpperCase()}
                              </span>
                            </div>
                            <h4 className="font-bold text-gray-900">{alert.type}</h4>
                            <p className="text-gray-600 text-sm">{alert.location}</p>
                          </div>
                          <div className="text-xs text-gray-500 font-medium">{alert.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-6 -right-6 bg-gradient-to-r from-green-400 to-green-500 text-white p-4 rounded-2xl shadow-xl hover:scale-110 transition-transform cursor-pointer">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-xs opacity-90">Monitoring</div>
                </div>
                
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-blue-400 to-blue-500 text-white p-4 rounded-2xl shadow-xl hover:scale-110 transition-transform cursor-pointer">
                  <div className="text-2xl font-bold">95%</div>
                  <div className="text-xs opacity-90">Accuracy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Alerts Widget */}
      <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-4">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Active Alerts
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Current Ocean Hazards
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay informed about active ocean hazards across India's coastline. Real-time updates from our monitoring network.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-105 transform"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${
                      alert.severity === 'critical' ? 'bg-red-500 animate-pulse' :
                      alert.severity === 'high' ? 'bg-orange-500' :
                      'bg-yellow-500'
                    }`}></div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      alert.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      alert.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{alert.time}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">{alert.type}</h3>
                <div className="flex items-center space-x-2 text-gray-600 mb-4">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{alert.location}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <Link
                    to="/reports"
                    className="text-ocean-600 hover:text-ocean-700 font-semibold text-sm flex items-center space-x-1 hover:underline"
                  >
                    <span>View Details</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  <div className="text-xs text-gray-500">
                    {alert.severity === 'critical' ? '🔴 URGENT' : 
                     alert.severity === 'high' ? '🟠 HIGH' : '🟡 MEDIUM'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/reports"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-ocean-500 to-blue-600 hover:from-ocean-600 hover:to-blue-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              View All Alerts
              <ArrowRight className="ml-3 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-ocean-100 text-ocean-800 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2" />
              Trusted by Coastal Communities
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose TarangNetra?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced technology meets community vigilance to create the most comprehensive 
              ocean safety network in India.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:scale-105 transform cursor-pointer"
              >
                <div className={`bg-gradient-to-r ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-ocean-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Protecting Lives Daily
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from real people whose lives have been touched by our ocean safety network.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:scale-105 transform"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-ocean-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-ocean-600 to-blue-700 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-soft-light opacity-10 -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-soft-light opacity-10 translate-x-48 translate-y-48"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Ready to Make the Ocean Safer?
          </h2>
          <p className="text-xl text-ocean-100 mb-12 max-w-3xl mx-auto">
            Join thousands of coastal guardians protecting India's shores. 
            Every report counts, every alert saves lives.
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/login"
                className="group bg-white hover:bg-gray-100 text-ocean-600 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 inline-flex items-center shadow-xl hover:shadow-2xl hover:scale-105 transform"
              >
                Join the Ocean Watch
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link
                to="/reports"
                className="group border-2 border-white text-white hover:bg-white hover:text-ocean-600 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 inline-flex items-center hover:scale-105 transform"
              >
                View Live Alerts
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-ocean-100 mb-6 text-lg">
                Welcome back, <span className="font-bold text-white">{user.name}</span>! 
                Continue protecting our shores.
              </div>
              {user.role === 'citizen' && (
                <Link
                  to="/submit-report"
                  className="group bg-white hover:bg-gray-100 text-ocean-600 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 inline-flex items-center shadow-xl hover:shadow-2xl hover:scale-105 transform"
                >
                  Report New Hazard
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;