import React from 'react';
import { useNavigate } from 'react-router-dom';

const MissionCard = ({ task, onAccept, hasTeam }) => {
  const navigate = useNavigate();

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="p-6 bg-gray-900/40 border border-red-900/20 rounded-lg hover:border-red-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(220,38,38,0.1)] group flex flex-col h-full backdrop-blur-sm">
      <div className="flex justify-between items-start mb-4">
        {/* Check if level exists, default to 1 */}
        <span className="text-red-500 text-xs font-bold tracking-widest uppercase border border-red-900/50 px-2 py-1 rounded bg-black">
          Level {task.level || '1'}
        </span>
        <span className="text-gray-500 text-xs flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          Active
        </span>
      </div>
      
      <h4 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors line-clamp-2">
        {task.title}
      </h4>
      
      <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-3">
        {task.description}
      </p>

      {/* Meta Details */}
      <div className="mb-4 space-y-2 border-t border-red-900/20 pt-3">
        <div className="text-xs text-gray-500 flex justify-between">
          <span>DEADLINE:</span> 
          <span className="text-gray-300">{formatDate(task.deadline)}</span>
        </div>
        
        {task.expectedSkills && task.expectedSkills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.expectedSkills.slice(0, 3).map((skill, index) => (
              <span key={index} className="text-[10px] bg-red-900/10 text-red-400 px-2 py-0.5 rounded border border-red-900/20">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      <button 
        onClick={() => onAccept(task._id)}
        className="w-full py-2 rounded border border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white transition-all font-semibold text-sm uppercase tracking-wide"
      >
        {hasTeam ? 'Accept Mission' : 'Join Team to Accept'}
      </button>
    </div>
  );
};

export default MissionCard;