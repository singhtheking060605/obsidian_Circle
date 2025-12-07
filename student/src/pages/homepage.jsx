import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Homepage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentMentorIndex, setCurrentMentorIndex] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white font-sans">
      
      <Navbar isDashboard={false} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 glow-text-large font-creepster tracking-wider">
            Enter the Upside Down
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto font-light">
            A Stranger Things themed hackathon where mentors guide students through mysterious challenges in collaborative task work
          </p>
          <button 
            onClick={() => user ? navigate('/dashboard') : navigate('/signup')}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 glow-button uppercase tracking-widest"
          >
            {user ? 'Go to Dashboard' : 'Join the Circle'}
          </button>
        </div>
      </section>

      {/* Sliding Images Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-12 glow-text font-creepster tracking-wide">
            We Drop Jaws!
          </h3>
          <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl border border-red-900/30">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>
            ))}
            <div className="absolute bottom-8 left-8 z-10 hidden sm:block">
              <div className="space-y-4">
                <div className="bg-red-900/80 backdrop-blur-sm border border-red-500/30 text-white px-6 py-3 rounded-r-lg font-bold text-lg glow-box border-l-4 border-l-red-500">
                  950,000+ participants
                </div>
                <br />
                <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-500/30 text-white px-6 py-3 rounded-r-lg font-bold text-lg glow-box border-l-4 border-l-gray-500">
                  100,000+ tasks completed
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-16 glow-text font-creepster tracking-wide">
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
                className="bg-gray-900/40 border border-red-900/30 rounded-lg p-6 hover:border-red-500/50 transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.2)] group"
              >
                <h4 className="text-xl font-bold text-red-500 mb-3 group-hover:text-red-400 transition-colors">{feature.title}</h4>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features Section with Flip Cards */}
      <section className="py-20 px-4 relative overflow-hidden">
         <div className="absolute inset-0 bg-red-900/5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h3 className="text-4xl font-bold text-center mb-16 glow-text font-creepster tracking-wide">
            Advanced Features
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { 
                title: "AI Auto-Review Draft", 
                desc: "An LLM reads reports or PR descriptions and drafts rubric scores and feedback for mentors to accept or modify",
                icon: "､"
              },
              { 
                title: "AI Originality & Similarity Detection", 
                desc: "Flag duplicates/copies across all platform entries and public repos to ensure consistent, high-quality contributions",
                icon: "剥"
              },
              { 
                title: "Exportable Referral Packet", 
                desc: "Generate a secure PDF with mentor recommendation, signed token, submission links, scores, and an audit trail for recruiters",
                icon: "塘"
              },
              { 
                title: "Contribution Analytics", 
                desc: "Dashboards showing trends per student/team with highlighting notable contributors",
                icon: "投"
              }
            ].map((feature, index) => (
              <div key={index} className="flip-card h-80 group cursor-pointer">
                <div className="flip-card-inner relative w-full h-full transition-transform duration-700 transform-style-3d group-hover:rotate-y-180">
                  {/* Front */}
                  <div className="flip-card-front absolute w-full h-full backface-hidden bg-gradient-to-br from-gray-900 to-black border border-red-900/30 rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-xl">
                    <div className="text-6xl mb-6 text-red-500">{feature.icon}</div>
                    <h4 className="text-2xl font-bold text-white group-hover:text-red-400 transition-colors">{feature.title}</h4>
                  </div>
                  {/* Back */}
                  <div className="flip-card-back absolute w-full h-full backface-hidden bg-red-900/90 border border-red-500 rounded-xl p-8 flex items-center justify-center rotate-y-180 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)]">
                    <p className="text-lg leading-relaxed font-medium">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect with Mentors Section */}
      <section id="mentors" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-4 glow-text font-creepster tracking-wide">
            Connect with Our Mentors
          </h3>
          <p className="text-center text-gray-400 mb-12 text-lg">
            Learn from industry experts working at top tech companies
          </p>
          
          <div className="relative h-96 max-w-4xl mx-auto">
            {mentors.map((mentor, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentMentorIndex 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-full'
                }`}
              >
                <div className="bg-gradient-to-r from-gray-900 to-black border border-red-900/30 rounded-2xl p-8 h-full flex items-center shadow-2xl">
                  <div className="flex flex-col md:flex-row items-center gap-10 w-full px-6">
                    {/* Mentor Image */}
                    <div className="relative shrink-0">
                      <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                        <img 
                          src={mentor.image} 
                          alt={mentor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg uppercase tracking-wider whitespace-nowrap">
                        {mentor.company}
                      </div>
                    </div>
                    
                    {/* Mentor Details */}
                    <div className="flex-1 text-center md:text-left">
                      <h4 className="text-4xl font-bold text-white mb-2 font-creepster tracking-wider text-red-500">
                        {mentor.name}
                      </h4>
                      <p className="text-xl text-gray-300 mb-4 font-light">{mentor.role}</p>
                      <p className="text-gray-400 text-lg mb-8">
                        <span className="text-red-500 font-bold uppercase text-xs tracking-widest mr-2">Expertise:</span> 
                        {mentor.expertise}
                      </p>
                      <button className="bg-transparent border border-red-600 text-red-500 hover:bg-red-600 hover:text-white px-6 py-2 rounded-full font-semibold transition-all transform hover:scale-105">
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
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentMentorIndex 
                    ? 'bg-red-600 w-8' 
                    : 'bg-gray-700 w-2 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-t from-red-900/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl md:text-5xl font-bold mb-6 glow-text font-creepster tracking-wide">
            Redefining Mentorship
          </h3>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join The Obsidian Circle and unlock your potential through guided task work, peer collaboration, and real-world experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="px-6 py-3 w-full sm:w-80 rounded-lg bg-black border border-red-900/50 focus:border-red-500 focus:outline-none text-white focus:ring-1 focus:ring-red-500 transition-all"
            />
            <button className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold uppercase tracking-wider transition-all transform hover:scale-105 glow-button">
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-black border-t border-red-900/30 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-sm">
          <p>ﾂｩ 2024 The Obsidian Circle. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-red-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-red-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-red-500 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      <style>{`
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};

export default Homepage;