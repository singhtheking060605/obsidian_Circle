import React from 'react';
import { Calendar, Wrench, ArrowRight, Lock } from 'lucide-react';

const MissionCard = ({ task, onAccept, hasTeam }) => {
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="relative group flex flex-col h-full bg-gray-900/40 border border-red-900/30 rounded-xl overflow-hidden hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(220,38,38,0.15)] transition-all duration-300 backdrop-blur-sm">
      
      {/* Decorative Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="p-6 flex flex-col h-full relative z-10">
        
        {/* Header: Level & Status */}
        <div className="flex justify-between items-start mb-4">
          <span className="bg-black/60 border border-red-900/50 text-red-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
            Level {task.level || '1'}
          </span>
          
          <div className="flex items-center gap-1.5 text-green-400 text-[10px] font-bold uppercase bg-green-900/10 px-2 py-1 rounded-full border border-green-900/20">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
            Active
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-100 mb-2 group-hover:text-red-500 transition-colors line-clamp-2 font-creepster tracking-wider">
          {task.title}
        </h3>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
          {task.description}
        </p>

        {/* Meta Info Section */}
        <div className="space-y-3 mb-6 pt-4 border-t border-red-900/20">
          
          {/* Deadline */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar size={14} className="text-red-500" />
            <span className="font-mono text-gray-300">
              DEADLINE: <span className="text-white">{formatDate(task.deadline)}</span>
            </span>
          </div>

          {/* Skills Tags */}
          {task.expectedSkills && task.expectedSkills.length > 0 && (
            <div className="flex items-start gap-2">
              <Wrench size={14} className="text-red-500 mt-0.5 shrink-0" />
              <div className="flex flex-wrap gap-1.5">
                {task.expectedSkills.slice(0, 3).map((skill, idx) => (
                  <span key={idx} className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded border border-gray-700 group-hover:border-gray-600 transition-colors">
                    {skill}
                  </span>
                ))}
                {task.expectedSkills.length > 3 && (
                  <span className="text-[10px] text-gray-500 px-1 font-mono">
                    +{task.expectedSkills.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => onAccept(task._id)}
          className={`w-full py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
            hasTeam
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] transform hover:-translate-y-0.5'
              : 'bg-transparent border border-gray-700 text-gray-500 hover:border-red-500/50 hover:text-red-400'
          }`}
        >
          {hasTeam ? (
            <>
              Accept Mission <ArrowRight size={14} />
            </>
          ) : (
            <>
              <Lock size={14} /> Join Team to Accept
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MissionCard;