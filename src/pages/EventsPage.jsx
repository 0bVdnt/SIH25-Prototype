import React from 'react';
import { Calendar, MapPin, Users, Clock, ExternalLink, Award, Camera, Video } from 'lucide-react';

const EventsPage = () => {
  const pastEvents = [
    {
      id: 1,
      title: 'Coastal Safety Awareness Drive',
      date: '2024-08-15',
      location: 'Marina Beach, Chennai',
      type: 'community',
      description: 'A comprehensive awareness program conducted in collaboration with local fishermen communities and Coast Guard.',
      participants: 500,
      images: [
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop'
      ],
      achievements: [
        'Distributed 1000+ safety brochures',
        'Registered 150 new community reporters',
        'Conducted hands-on training sessions'
      ],
      gallery: 12
    },
    {
      id: 2,
      title: 'Marine Rescue Training Workshop',
      date: '2024-07-20',
      location: 'Goa Maritime Academy',
      type: 'training',
      description: 'Professional training program for Coast Guard personnel and volunteer rescuers on modern marine emergency response.',
      participants: 85,
      images: [
        'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=300&h=200&fit=crop'
      ],
      achievements: [
        'Certified 85 new marine rescuers',
        'Advanced equipment demonstration',
        'International best practices sharing'
      ],
      gallery: 24
    },
    {
      id: 3,
      title: 'Ocean Conservation Summit 2024',
      date: '2024-06-05',
      location: 'NIOT, Chennai',
      type: 'conference',
      description: 'National summit bringing together marine scientists, policy makers, and technology experts to discuss ocean conservation.',
      participants: 300,
      images: [
        'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=300&h=200&fit=crop'
      ],
      achievements: [
        'Signed 5 new partnership agreements',
        'Launched ocean data sharing initiative',
        'Published conservation guidelines'
      ],
      gallery: 45
    },
    {
      id: 4,
      title: 'Community Beach Cleanup Drive',
      date: '2024-05-18',
      location: 'Juhu Beach, Mumbai',
      type: 'community',
      description: 'Large-scale beach cleanup initiative involving local schools, colleges, and environmental groups.',
      participants: 800,
      images: [
        'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=300&h=200&fit=crop'
      ],
      achievements: [
        'Collected 2.5 tons of plastic waste',
        'Planted 200 coastal trees',
        'Educated 1000+ participants on ocean conservation'
      ],
      gallery: 35
    },
    {
      id: 5,
      title: 'Cyclone Preparedness Workshop',
      date: '2024-04-10',
      location: 'Paradip Port, Odisha',
      type: 'training',
      description: 'Emergency preparedness training focused on cyclone response and evacuation procedures for coastal communities.',
      participants: 250,
      images: [
        'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=300&h=200&fit=crop'
      ],
      achievements: [
        'Trained 15 community leaders',
        'Established 5 emergency shelters',
        'Created evacuation protocol manual'
      ],
      gallery: 18
    },
    {
      id: 6,
      title: 'Marine Technology Expo',
      date: '2024-03-22',
      location: 'Cochin Port, Kerala',
      type: 'conference',
      description: 'Exhibition showcasing latest marine monitoring technologies and innovations in ocean safety systems.',
      participants: 400,
      images: [
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop',
        'https://images.unsplash.com/photo-1551522435-a13afa10f3cd?w=300&h=200&fit=crop'
      ],
      achievements: [
        'Showcased 25+ innovative technologies',
        'Facilitated 10 tech partnerships',
        'Demonstrated AI-powered monitoring systems'
      ],
      gallery: 30
    }
  ];

  const upcomingEvents = [
    {
      id: 7,
      title: 'National Ocean Safety Conference 2025',
      date: '2025-01-15',
      location: 'New Delhi',
      type: 'conference',
      description: 'Annual conference bringing together stakeholders from across the country to discuss ocean safety innovations.',
      registrationOpen: true
    },
    {
      id: 8,
      title: 'Coastal Community Training Program',
      date: '2024-12-10',
      location: 'Vishakhapatnam',
      type: 'training', 
      description: 'Comprehensive training program for coastal communities on hazard reporting and emergency response.',
      registrationOpen: true
    }
  ];

  const getEventTypeStyle = (type) => {
    switch (type) {
      case 'community':
        return 'bg-green-100 text-green-800';
      case 'training':
        return 'bg-blue-100 text-blue-800';
      case 'conference':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'community':
        return Users;
      case 'training':
        return Award;
      case 'conference':
        return ExternalLink;
      default:
        return Calendar;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-ocean-500 to-ocean-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Events & Activities
            </h1>
            <p className="text-xl lg:text-2xl text-ocean-100 max-w-4xl mx-auto">
              Join our community events, training programs, and conferences 
              dedicated to ocean safety and marine conservation.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingEvents.map((event) => {
                const TypeIcon = getEventTypeIcon(event.type);
                return (
                  <div key={event.id} className="bg-gradient-to-br from-ocean-50 to-ocean-100 p-6 rounded-xl border-2 border-ocean-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeStyle(event.type)}`}>
                        <TypeIcon className="inline h-4 w-4 mr-1" />
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                      {event.registrationOpen && (
                        <span className="bg-coral-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Registration Open
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{event.title}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{event.description}</p>
                    <button className="bg-ocean-500 hover:bg-ocean-600 text-white px-6 py-2 rounded-lg transition-colors">
                      Register Now
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Past Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Past Events & Achievements
          </h2>
          <div className="space-y-8">
            {pastEvents.map((event, index) => {
              const TypeIcon = getEventTypeIcon(event.type);
              return (
                <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                    {/* Images */}
                    <div className="lg:col-span-1">
                      <div className="grid grid-cols-2 gap-1 h-64 lg:h-full">
                        {event.images.map((image, imgIndex) => (
                          <div key={imgIndex} className="relative group">
                            <img
                              src={image}
                              alt={`${event.title} ${imgIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {imgIndex === 1 && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="text-white text-center">
                                  <Camera className="h-8 w-8 mx-auto mb-2" />
                                  <span className="text-sm font-medium">+{event.gallery} photos</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="lg:col-span-2 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeStyle(event.type)}`}>
                          <TypeIcon className="inline h-4 w-4 mr-1" />
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </span>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(event.date)}
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{event.title}</h3>
                      
                      <div className="flex items-center space-x-6 mb-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.location}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {event.participants} participants
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-6">{event.description}</p>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Key Achievements:</h4>
                        <ul className="space-y-2">
                          {event.achievements.map((achievement, achIndex) => (
                            <li key={achIndex} className="flex items-center text-gray-600">
                              <div className="w-2 h-2 bg-ocean-500 rounded-full mr-3"></div>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-6">
                        <button className="flex items-center text-ocean-600 hover:text-ocean-700 font-medium">
                          <Camera className="h-4 w-4 mr-1" />
                          View Gallery ({event.gallery})
                        </button>
                        <button className="flex items-center text-ocean-600 hover:text-ocean-700 font-medium">
                          <Video className="h-4 w-4 mr-1" />
                          Watch Highlights
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-ocean-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Event Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-ocean-100">Events Organized</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">15,000+</div>
              <div className="text-ocean-100">People Trained</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">25</div>
              <div className="text-ocean-100">Partner Organizations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">12</div>
              <div className="text-ocean-100">Coastal States Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Want to Organize an Event?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Partner with us to organize ocean safety events in your community. 
            We provide resources, expertise, and support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-ocean-500 hover:bg-ocean-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Partner With Us
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors">
              Event Guidelines
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;