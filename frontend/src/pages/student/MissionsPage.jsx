import React from 'react';

const MissionsPage = () => {
  return (
    <div className="space-y-6 p-4 md:p-8 animate-fade-in">
      <div className="mb-8 border-b border-red-900/30 pb-4">
        <h2 className="text-4xl font-bold text-white glow-text font-creepster tracking-wider mb-2">
          Active Operations
        </h2>
        <p className="text-gray-400">Select a mission to begin your training.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((task) => (
          <div key={task} className="p-6 bg-gray-900/40 border border-red-900/20 rounded-lg hover:border-red-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(220,38,38,0.1)] group flex flex-col h-full backdrop-blur-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="text-red-500 text-xs font-bold tracking-widest uppercase border border-red-900/50 px-2 py-1 rounded bg-black">Level {task}</span>
              <span className="text-gray-500 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Active
              </span>
            </div>
            <h4 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">Operation: Hawkins Lab #{task}</h4>
            <p className="text-gray-400 text-sm mb-6 flex-1">Crack the code to close the gate. Requires extensive knowledge of React and Node.js.</p>
            <button className="w-full py-2 rounded border border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white transition-all font-semibold text-sm uppercase tracking-wide">
              Accept Mission
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissionsPage;