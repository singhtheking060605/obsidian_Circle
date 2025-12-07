import React from 'react';

const AlumniPage = () => {
  return (
    <div className="space-y-6 p-4 md:p-8 animate-fade-in">
      <div className="mb-8 border-b border-red-900/30 pb-4">
        <h2 className="text-4xl font-bold text-white glow-text font-creepster tracking-wider mb-2">
          Alumni Network
        </h2>
        <p className="text-gray-400">Connect with agents who have successfully navigated the Upside Down.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
         {[1, 2, 3, 4].map((i) => (
           <div key={i} className="flex items-center gap-4 p-4 bg-black/60 border border-red-900/30 rounded-lg hover:border-red-500 transition-all backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-gray-800 overflow-hidden border border-gray-700">
                 <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Alumni${i}`} alt="Alumni" className="w-full h-full object-cover" />
              </div>
              <div>
                 <h4 className="font-bold text-white">Senior Agent {i}</h4>
                 <p className="text-xs text-gray-400">Software Engineer at Google</p>
                 <button className="text-xs text-red-500 hover:text-red-400 mt-1 uppercase tracking-wide font-bold">Connect &rarr;</button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

export default AlumniPage;