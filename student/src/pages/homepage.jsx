import React, { useState, useEffect } from 'react';

const Homepage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentMentorIndex, setCurrentMentorIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const slidingImages = [
    "https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=500&fit=crop",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=500&fit=crop"
  ];

  const mentors = [
    {
      name: "Sarah Chen",
      role: "Senior Software Engineer",
      company: "Google",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      expertise: "Machine Learning & AI"
    },
    {
      name: "Michael Rodriguez",
      role: "Tech Lead",
      company: "Meta",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      expertise: "Full Stack Development"
    },
    {
      name: "Priya Sharma",
      role: "Principal Engineer",
      company: "Microsoft",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      expertise: "Cloud Architecture"
    },
    {
      name: "James Wilson",
      role: "Engineering Manager",
      company: "Amazon",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      expertise: "DevOps & Infrastructure"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === slidingImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const mentorInterval = setInterval(() => {
      setCurrentMentorIndex((prevIndex) => 
        prevIndex === mentors.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(mentorInterval);
  }, []);

  // SVG Icons as components
  const BellIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
    </svg>
  );

  const UserIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  const MenuIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );

  const XIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-sm border-b border-red-900/30 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-red-500 glow-text">
                The Obsidian Circle
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="dashboard" className="hover:text-red-500 transition-colors">Dashboard</a>
              <a href="#tasks" className="hover:text-red-500 transition-colors">Tasks</a>
              <a href="#winners" className="hover:text-red-500 transition-colors">Winners</a>
              <a href="#starkconnect" className="hover:text-red-500 transition-colors">StarkConnect</a>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.location.href = '/login'}
                className="hidden md:block px-4 py-2 text-white hover:text-red-400 transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => window.location.href = '/signup'}
                className="hidden md:block px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 glow-button"
              >
                Sign Up
              </button>
              <button 
                className="md:hidden p-2 hover:bg-red-900/20 rounded-full transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 border-t border-red-900/30">
            <div className="px-4 py-4 space-y-3">
              <a href="#dashboard" className="block hover:text-red-500 transition-colors">Dashboard</a>
              <a href="#tasks" className="block hover:text-red-500 transition-colors">Tasks</a>
              <a href="#winners" className="block hover:text-red-500 transition-colors">Winners</a>
              <a href="#starkconnect" className="block hover:text-red-500 transition-colors">StarkConnect</a>
              <div className="pt-3 border-t border-red-900/30 space-y-2">
                <button 
                  onClick={() => window.location.href = '/login'}
                  className="block w-full text-left hover:text-red-500 transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => window.location.href = '/signup'}
                  className="block w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-all text-center"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 glow-text-large">
            Enter the Upside Down
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            A Stranger Things themed hackathon where mentors guide students through mysterious challenges in collaborative task work
          </p>
          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 glow-button">
            Join the Circle
          </button>
        </div>
      </section>

      {/* Sliding Images Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-12 glow-text">
            We Drop Jaws!
          </h3>
          <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl">
            {slidingImages.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img 
                  src={img} 
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </div>
            ))}
            <div className="absolute bottom-8 left-8 z-10">
              <div className="space-y-4">
                <div className="bg-teal-400 text-black px-6 py-3 rounded-full inline-block font-bold text-lg">
                  950,000+ participants
                </div>
                <div className="bg-green-400 text-black px-6 py-3 rounded-full inline-block font-bold text-lg">
                  100,000+ tasks completed
                </div>
                <div className="bg-blue-400 text-black px-6 py-3 rounded-full inline-block font-bold text-lg">
                  1,500+ challenges solved
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-16 glow-text">
            Basic Features
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Student Portal", desc: "Secure login with GitHub OAuth for seamless authentication and collaboration" },
              { title: "Team Formation", desc: "Create or join teams, manage members and roles for collaborative task work" },
              { title: "Task Browsing", desc: "View open tasks posted by mentors with tech tags, difficulty, deadline, and scoring metrics" },
              { title: "Task Application", desc: "Teams apply to tasks or accept direct assignments from mentors for enhanced referrals" },
              { title: "Submission System", desc: "Upload files, provide GitHub repos/PR links, demo URLs with versioned submissions" },
              { title: "In-task Communication", desc: "Per-task comment threads for clarifications, mentor replies, and ongoing discussion" },
              { title: "Progress Tracking", desc: "Notifications and alerts for deadlines, review requests, messages, and earned badges" },
              { title: "Contribution Dashboard", desc: "Personal view of contributions, completed tasks, scores, and earned badges" },
              { title: "Referral System", desc: "Request and view referral status with eligibility criteria in the profile" }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-800/50 border border-red-900/30 rounded-lg p-6 hover:border-red-500/50 transition-all hover:shadow-lg hover:shadow-red-900/20"
              >
                <h4 className="text-xl font-bold text-red-400 mb-3">{feature.title}</h4>
                <p className="text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features Section with Flip Cards */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-16 glow-text">
            Advanced Features
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { 
                title: "AI Auto-Review Draft", 
                desc: "An LLM reads reports or PR descriptions and drafts rubric scores and feedback for mentors to accept or modify",
                icon: "🤖"
              },
              { 
                title: "AI Originality & Similarity Detection", 
                desc: "Flag duplicates/copies across all platform entries and public repos to ensure consistent, high-quality contributions",
                icon: "🔍"
              },
              { 
                title: "Exportable Referral Packet (Signed PDF)", 
                desc: "Generate a secure PDF with mentor recommendation, signed token, submission links, scores, and an audit trail for recruiters",
                icon: "📄"
              },
              { 
                title: "Lightweight Contribution Analytics", 
                desc: "Dashboards showing trends per student/team with highlighting notable contributors",
                icon: "📊"
              }
            ].map((feature, index) => (
              <div key={index} className="flip-card h-80">
                <div className="flip-card-inner">
                  {/* Front */}
                  <div className="flip-card-front bg-gradient-to-br from-red-900/40 to-gray-800/50 border border-red-900/50 rounded-lg p-8 flex flex-col items-center justify-center text-center">
                    <div className="text-6xl mb-4">{feature.icon}</div>
                    <h4 className="text-2xl font-bold text-red-400">{feature.title}</h4>
                  </div>
                  {/* Back */}
                  <div className="flip-card-back bg-gradient-to-br from-red-600/30 to-gray-900/70 border border-red-500/50 rounded-lg p-8 flex items-center justify-center">
                    <p className="text-gray-100 text-lg leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect with Mentors Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-4 glow-text">
            Connect with Our Mentors
          </h3>
          <p className="text-center text-gray-400 mb-12 text-lg">
            Learn from industry experts working at top tech companies
          </p>
          
          <div className="relative h-96 max-w-4xl mx-auto">
            {mentors.map((mentor, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 ${
                  index === currentMentorIndex 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-full'
                }`}
              >
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-red-900/30 rounded-2xl p-8 h-full flex items-center backdrop-blur-sm hover:border-red-500/50 transition-all">
                  <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                    {/* Mentor Image */}
                    <div className="relative">
                      <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-red-500/50 shadow-xl shadow-red-900/50">
                        <img 
                          src={mentor.image} 
                          alt={mentor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        {mentor.company}
                      </div>
                    </div>
                    
                    {/* Mentor Details */}
                    <div className="flex-1 text-center md:text-left">
                      <h4 className="text-3xl font-bold text-white mb-2 glow-text">
                        {mentor.name}
                      </h4>
                      <p className="text-xl text-red-400 mb-4">{mentor.role}</p>
                      <p className="text-gray-300 text-lg mb-6">
                        <span className="text-red-500 font-semibold">Expertise:</span> {mentor.expertise}
                      </p>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 glow-button">
                        Connect Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mentor Navigation Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {mentors.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentMentorIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentMentorIndex 
                    ? 'bg-red-500 w-8' 
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl md:text-5xl font-bold mb-6 glow-text">
            Redefining Mentorship Through Collaborative Challenges
          </h3>
          <p className="text-xl text-gray-300 mb-8">
            Join The Obsidian Circle and unlock your potential through guided task work, peer collaboration, and real-world experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input 
              type="email" 
              placeholder="Your email"
              className="px-6 py-3 rounded-lg bg-gray-800 border border-red-900/30 focus:border-red-500 focus:outline-none text-white"
            />
            <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 glow-button">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-red-900/30 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>© 2024 The Obsidian Circle. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Creepster&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
        }
        
        .glow-text {
          text-shadow: 0 0 10px rgba(239, 68, 68, 0.5),
                       0 0 20px rgba(239, 68, 68, 0.3),
                       0 0 30px rgba(239, 68, 68, 0.2);
        }
        
        .glow-text-large {
          text-shadow: 0 0 20px rgba(239, 68, 68, 0.6),
                       0 0 40px rgba(239, 68, 68, 0.4),
                       0 0 60px rgba(239, 68, 68, 0.3);
          animation: pulse 2s ease-in-out infinite;
        }
        
        .glow-button {
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
        }
        
        .glow-button:hover {
          box-shadow: 0 0 30px rgba(239, 68, 68, 0.8);
        }
        
        @keyframes pulse {
          0%, 100% {
            text-shadow: 0 0 20px rgba(239, 68, 68, 0.6),
                         0 0 40px rgba(239, 68, 68, 0.4),
                         0 0 60px rgba(239, 68, 68, 0.3);
          }
          50% {
            text-shadow: 0 0 25px rgba(239, 68, 68, 0.8),
                         0 0 50px rgba(239, 68, 68, 0.6),
                         0 0 75px rgba(239, 68, 68, 0.4);
          }
        }

        /* Flip Card Styles */
        .flip-card {
          perspective: 1000px;
        }
        
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.8s;
          transform-style: preserve-3d;
        }
        
        .flip-card:hover .flip-card-inner {
          transform: rotateY(180deg);
        }
        
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        
        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default Homepage;