import React from 'react';
import { Award, Shield, Users, MapPin, TrendingUp, Target, Heart, Globe } from 'lucide-react';

const AboutPage = () => {
  const achievements = [
    {
      icon: Users,
      number: '50,000+',
      label: 'Active Citizens',
      description: 'Coastal communities actively participating in hazard reporting'
    },
    {
      icon: MapPin,
      number: '2,847',
      label: 'Reports Submitted',
      description: 'Ocean hazard reports submitted across Indian coastline'
    },
    {
      icon: Shield,
      number: '98%',
      label: 'Response Rate',
      description: 'Reports verified and responded to within 24 hours'
    },
    {
      icon: Award,
      number: '156',
      label: 'Lives Saved',
      description: 'Estimated lives saved through early warning system'
    },
    {
      icon: TrendingUp,
      number: '85%',
      label: 'Accuracy Rate',
      description: 'Verified reports accuracy maintained consistently'
    },
    {
      icon: Globe,
      number: '7,500km',
      label: 'Coastline Covered',
      description: 'Total Indian coastline monitored through our platform'
    }
  ];

  const features = [
    {
      icon: Target,
      title: 'Mission',
      description: 'To create a comprehensive, community-driven ocean hazard monitoring system that protects coastal communities through real-time reporting and early warning mechanisms.'
    },
    {
      icon: Heart,
      title: 'Vision',
      description: 'A future where no coastal community faces ocean hazards unprepared, where technology and community collaboration ensure the safety of all who depend on our oceans.'
    },
    {
      icon: Shield,
      title: 'Values',
      description: 'Transparency, community empowerment, scientific accuracy, rapid response, and sustainable ocean stewardship guide everything we do.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ocean-500 to-ocean-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              About Ocean Hazard Reporter
            </h1>
            <p className="text-xl lg:text-2xl text-ocean-100 max-w-4xl mx-auto">
              Protecting coastal communities through innovative technology, 
              scientific expertise, and the power of community collaboration.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-ocean-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-ocean-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-ocean-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Achievements
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Since our launch, we've made significant strides in ocean safety and community protection
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="bg-ocean-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <achievement.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-ocean-600 mb-2">{achievement.number}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{achievement.label}</h3>
                <p className="text-gray-600 text-sm">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How We Protect Communities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive approach combines technology, expertise, and community engagement
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-ocean-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Reporting</h3>
                    <p className="text-gray-600">Citizens report ocean hazards through our easy-to-use platform with location data and photographic evidence.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-ocean-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Verification</h3>
                    <p className="text-gray-600">Our team of marine scientists and safety experts verify reports and assess threat levels within hours.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-ocean-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Alert Distribution</h3>
                    <p className="text-gray-600">Verified hazards trigger immediate alerts to local authorities, emergency services, and affected communities.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-ocean-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">4</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Continuous Monitoring</h3>
                    <p className="text-gray-600">We maintain ongoing surveillance and provide updates until hazards are resolved or subside.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-ocean-500 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Real-Time Impact</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Response Time</span>
                    <span className="font-bold">&lt; 2 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Report Accuracy</span>
                    <span className="font-bold">98.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Community Reach</span>
                    <span className="font-bold">50,000+ users</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Coastal Coverage</span>
                    <span className="font-bold">7,500 km</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-20 bg-gradient-to-br from-ocean-600 via-ocean-700 to-blue-800 text-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full mix-blend-soft-light opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-coral-400 rounded-full mix-blend-soft-light opacity-10 animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl text-ocean-100 mb-12 max-w-3xl mx-auto">
            Be part of the solution. Help us protect coastal communities by reporting ocean hazards in your area. 
            Every report counts, every alert saves lives.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="group bg-white hover:bg-gray-100 text-ocean-600 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 inline-flex items-center shadow-xl hover:shadow-2xl hover:scale-105 transform">
              Become a Reporter
              <MapPin className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </button>
            <button className="group border-2 border-white text-white hover:bg-white hover:text-ocean-600 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 inline-flex items-center hover:scale-105 transform">
              Learn More
              <TrendingUp className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;