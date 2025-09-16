import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Shield, Users, MapPin, TrendingUp, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: MapPin,
      title: 'Real-time Reporting',
      description: 'Report ocean hazards instantly with location and photo evidence.'
    },
    {
      icon: Shield,
      title: 'Verified Information',
      description: 'All reports are verified by our expert team for accuracy.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Join thousands of citizens helping protect our coastlines.'
    },
    {
      icon: TrendingUp,
      title: 'Data Analytics',
      description: 'Track trends and patterns in ocean hazard occurrences.'
    }
  ];

  const stats = [
    { number: '2,847', label: 'Reports Submitted', icon: AlertTriangle },
    { number: '1,923', label: 'Verified Hazards', icon: CheckCircle2 },
    { number: '156', label: 'Pending Review', icon: Clock },
    { number: '98%', label: 'Response Rate', icon: TrendingUp }
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-ocean-50 to-ocean-100 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Protecting Our
                <span className="text-ocean-500 block">Ocean Communities</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Report and monitor ocean hazards in real-time. Join our community-driven platform 
                to help keep coastal areas safe for everyone.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <>
                    {user.role === 'citizen' && (
                      <Link
                        to="/submit-report"
                        className="bg-ocean-500 hover:bg-ocean-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center group shadow-lg hover:shadow-xl"
                      >
                        Report a Hazard
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    )}
                    <Link
                      to="/reports"
                      className="bg-white hover:bg-gray-50 text-ocean-600 px-8 py-3 rounded-lg font-semibold transition-all duration-200 border-2 border-ocean-500 flex items-center justify-center"
                    >
                      View Reports
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="bg-ocean-500 hover:bg-ocean-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center group shadow-lg hover:shadow-xl"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/reports"
                      className="bg-white hover:bg-gray-50 text-ocean-600 px-8 py-3 rounded-lg font-semibold transition-all duration-200 border-2 border-ocean-500 flex items-center justify-center"
                    >
                      View Reports
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="relative">
              <div className="relative bg-ocean-500 rounded-2xl p-8 shadow-2xl">
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-coral-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-ocean-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                <div className="relative bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alert</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-600">High Tide Warning - Mumbai Coast</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Jellyfish Sighting - Goa Beach</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">All Clear - Chennai Marina</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-ocean-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-ocean-500" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes it easy for citizens and authorities to collaborate 
              in keeping our oceans safe.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="bg-ocean-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-ocean-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-ocean-100 mb-8 max-w-2xl mx-auto">
            Join our community of ocean protectors and help keep our coastal areas safe.
          </p>
          {!user && (
            <Link
              to="/login"
              className="bg-coral-500 hover:bg-coral-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 inline-flex items-center shadow-lg hover:shadow-xl"
            >
              Join Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;