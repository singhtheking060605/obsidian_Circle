// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const TeamManagement = () => {
//   const [loading, setLoading] = useState(true);
//   const [teamData, setTeamData] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [viewMode, setViewMode] = useState('create');
//   const [uploading, setUploading] = useState(false);

//   // Form States
//   const [joinName, setJoinName] = useState('');
//   const [createForm, setCreateForm] = useState({ name: '', repoLink: '', description: '' });
//   const [formData, setFormData] = useState({ repoLink: '', description: '' });

//   // ACCESS ENVIRONMENT VARIABLES FOR VITE
//   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/team';
//   const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; 
//   const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET; 

//   // Fetch Team Data
//   const fetchTeam = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get(`${API_URL}/me`, { withCredentials: true });
      
//       if (data.success && data.team) {
//         setTeamData(data.team);
//         setFormData({
//           repoLink: data.team.repoLink || '',
//           description: data.team.description || ''
//         });
//       } else {
//         setTeamData(null);
//       }
//     } catch (err) {
//       console.error("Error fetching team:", err);
//       // Don't show error if it's just "no team found" (404 or null return)
//       if (err.response && err.response.data && !err.response.data.team) {
//           setTeamData(null);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTeam();
//   }, []);

//   const handleCreateTeam = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.post(`${API_URL}/create`, createForm, { withCredentials: true });
//       if (data.success) {
//         alert("Team Assembled Successfully!");
//         fetchTeam();
//       }
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to create party.");
//     }
//   };

//   const handleJoinTeam = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.put(`${API_URL}/join`, { teamName: joinName }, { withCredentials: true });
//       if (data.success) {
//         alert("Joined Party Successfully!");
//         fetchTeam();
//       }
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to join team.");
//     }
//   };

//   const handleUpdate = async () => {
//     try {
//       const { data } = await axios.put(`${API_URL}/update`, formData, { withCredentials: true });
//       if (data.success) {
//         setTeamData(data.team);
//         setEditMode(false);
//         alert("Team details updated!");
//       }
//     } catch (err) {
//       alert("Failed to update details.");
//     }
//   };

//   // --- IMAGE UPLOAD LOGIC ---
//   const handleImageUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Validation for environment variables
//     if (!CLOUD_NAME || !UPLOAD_PRESET) {
//       alert("Cloudinary configuration is missing in .env file");
//       return;
//     }

//     setUploading(true);
//     const uploadData = new FormData();
//     uploadData.append("file", file);
//     uploadData.append("upload_preset", UPLOAD_PRESET); 

//     try {
//       // 1. Upload to Cloudinary
//       const res = await axios.post(
//         `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
//         uploadData
//       );
      
//       const imageUrl = res.data.secure_url;

//       // 2. Send URL to Backend
//       const { data } = await axios.put(`${API_URL}/update`, { mediaLink: imageUrl }, { withCredentials: true });

//       if (data.success) {
//         setTeamData(data.team);
//         alert("Evidence uploaded successfully!");
//       }

//     } catch (err) {
//       console.error("Upload error:", err);
//       alert("Failed to upload image.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64 animate-pulse">
//         <div className="text-red-500 glow-text font-creepster text-2xl">Connecting...</div>
//       </div>
//     );
//   }

//   // --- VIEW: NO TEAM (CREATE OR JOIN) ---
//   if (!teamData) {
//     return (
//       <div className="max-w-3xl mx-auto mt-10">
//         <div className="bg-black/60 border border-red-900/50 rounded-xl p-8 glow-box backdrop-blur-sm transition-all duration-500">
          
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold text-red-500 glow-text font-creepster tracking-wider mb-2">
//               {viewMode === 'create' ? 'Assemble Your Party' : 'Join a Party'}
//             </h2>
//             <p className="text-gray-400">
//               You are currently not in a team. 
//             </p>
//           </div>

//           <div className="flex justify-center gap-4 mb-8">
//              <button 
//                onClick={() => setViewMode('create')}
//                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${viewMode === 'create' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-gray-900 text-gray-500 border border-gray-700 hover:border-red-900 hover:text-red-400'}`}
//              >
//                CREATE NEW
//              </button>
//              <button 
//                onClick={() => setViewMode('join')}
//                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${viewMode === 'join' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-gray-900 text-gray-500 border border-gray-700 hover:border-red-900 hover:text-red-400'}`}
//              >
//                JOIN EXISTING
//              </button>
//           </div>

//           {viewMode === 'create' && (
//             <form onSubmit={handleCreateTeam} className="space-y-6 animate-fade-in">
//               <div>
//                 <label className="block text-gray-300 text-sm font-bold mb-2">Team Name</label>
//                 <input 
//                   type="text" 
//                   required
//                   className="w-full bg-gray-900/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all placeholder-gray-600"
//                   placeholder="e.g. The Hellfire Club"
//                   value={createForm.name}
//                   onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-300 text-sm font-bold mb-2">GitHub Repository (Optional)</label>
//                 <input 
//                   type="url" 
//                   className="w-full bg-gray-900/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all placeholder-gray-600"
//                   placeholder="https://github.com/username/project"
//                   value={createForm.repoLink}
//                   onChange={(e) => setCreateForm({...createForm, repoLink: e.target.value})}
//                 />
//               </div>
//               <div>
//                 <label className="block text-gray-300 text-sm font-bold mb-2">Description</label>
//                 <textarea 
//                   className="w-full bg-gray-900/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none h-32 resize-none placeholder-gray-600"
//                   placeholder="Our mission is..."
//                   value={createForm.description}
//                   onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
//                 />
//               </div>
//               <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all glow-button uppercase tracking-widest">
//                 Create Team
//               </button>
//             </form>
//           )}

//           {viewMode === 'join' && (
//             <form onSubmit={handleJoinTeam} className="space-y-6 animate-fade-in">
//               <div className="py-8">
//                 <label className="block text-gray-300 text-sm font-bold mb-2">Enter Exact Team Name</label>
//                 <input 
//                   type="text" 
//                   required
//                   className="w-full bg-gray-900/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all placeholder-gray-600"
//                   placeholder="e.g. The Hellfire Club"
//                   value={joinName}
//                   onChange={(e) => setJoinName(e.target.value)}
//                 />
//                 <p className="text-xs text-gray-500 mt-2">Ask your team leader for the exact name.</p>
//               </div>
//               <button className="w-full bg-transparent border border-red-600 text-red-500 hover:bg-red-900/20 font-bold py-3 rounded-lg transition-all uppercase tracking-widest">
//                 Search & Join
//               </button>
//             </form>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // --- VIEW: HAS TEAM (DASHBOARD) ---
//   return (
//     <div className="space-y-8 animate-fade-in w-full">
      
//       {/* Top Section: Team Info & Repo */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-10">
//         {/* Team Identity Card */}
//         <div className="lg:col-span-2 p-6 bg-black/60 border border-red-900/30 rounded-xl glow-box relative overflow-hidden group transition-all duration-300 ease-in-out">
//           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
//             <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor" className="text-red-600">
//               <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2-5-2 5zm0 0l-2-5 2 5zm0 0L2 17l10 5 10-5-10-5z"></path>
//             </svg>
//           </div>
          
//           <div className="relative z-10">
//             <label className="text-xs text-red-500 uppercase tracking-widest font-bold mb-2 block">Team Name</label>
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-4xl font-bold text-white glow-text font-creepster tracking-wider break-words">
//                 {teamData.name}
//               </h2>
//               <button 
//                 onClick={() => setEditMode(!editMode)}
//                 className="text-xs border border-red-900/50 text-red-400 px-3 py-1 rounded hover:bg-red-900/20 transition-colors shrink-0 ml-4"
//               >
//                 {editMode ? 'Cancel' : 'Edit Details'}
//               </button>
//             </div>

//             <label className="text-xs text-red-500 uppercase tracking-widest font-bold mb-2 block">GitHub Repository</label>
//             <div className="flex gap-2">
//               <div className="flex-1 bg-gray-900/80 border border-red-900/30 rounded-lg flex items-center px-4 py-3 text-gray-300 font-mono text-sm overflow-hidden transition-all duration-300">
//                 <svg className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
//                 {editMode ? (
//                   <input 
//                     type="text" 
//                     className="bg-transparent border-none w-full text-white focus:outline-none"
//                     value={formData.repoLink}
//                     placeholder="https://github.com/..."
//                     onChange={(e) => setFormData({...formData, repoLink: e.target.value})}
//                   />
//                 ) : (
//                   <span className="truncate">{teamData.repoLink || "No repo linked"}</span>
//                 )}
//               </div>
//               {teamData.repoLink && !editMode && (
//                 <a 
//                   href={teamData.repoLink}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors font-bold flex items-center justify-center whitespace-nowrap"
//                 >
//                   Link
//                 </a>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Team Members List */}
//         <div className="bg-black/60 border border-red-900/30 rounded-xl p-6 glow-box overflow-y-auto max-h-[300px] xl:max-h-[350px] transition-all duration-300 ease-in-out">
//           <label className="text-xs text-red-500 uppercase tracking-widest font-bold mb-4 block sticky top-0 bg-black/90 pb-2 z-10 backdrop-blur-sm">Party Members</label>
//           <div className="space-y-4">
//             {teamData.members.map((memberObj, idx) => (
//               <div key={idx} className="flex items-center gap-3 p-2 hover:bg-red-900/10 rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-red-900/30">
//                 <div className="relative flex-shrink-0">
//                   <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-700 group-hover:border-red-500 transition-colors">
//                     <img 
//                       src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${memberObj.user?.name || 'Unknown'}`} 
//                       alt="Member" 
//                       className="w-full h-full object-cover" 
//                     />
//                   </div>
//                   <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full"></div>
//                 </div>
//                 <div className="min-w-0">
//                   <p className="text-white font-medium text-sm group-hover:text-red-400 transition-colors truncate">
//                     {memberObj.user?.name || "Unknown User"}
//                   </p>
//                   <p className="text-gray-500 text-xs truncate">{memberObj.role}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Middle Section: Project Media */}
//       <div className="bg-black/60 border border-red-900/30 rounded-xl p-6 glow-box transition-all duration-300 ease-in-out">
//         <div className="flex justify-between items-center mb-6">
//           <label className="text-xs text-red-500 uppercase tracking-widest font-bold">Project Media / Evidence</label>
          
//           {/* Hidden File Input */}
//           <input 
//             type="file" 
//             id="mediaUpload" 
//             accept="image/*" 
//             className="hidden" 
//             onChange={handleImageUpload} 
//             disabled={uploading}
//           />

//           <button 
//             onClick={() => document.getElementById('mediaUpload').click()}
//             disabled={uploading}
//             className="text-xs bg-red-900/20 text-red-400 px-3 py-1 rounded border border-red-900/50 hover:bg-red-900/40 transition-all flex items-center gap-2 disabled:opacity-50"
//           >
//             {uploading ? (
//               <>
//                 <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
//                 Uploading...
//               </>
//             ) : (
//               'Upload Media'
//             )}
//           </button>
//         </div>
        
//         {/* Media Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
//           {teamData.mediaLinks && teamData.mediaLinks.length > 0 ? (
//             teamData.mediaLinks.map((link, idx) => (
//               <div key={idx} className="aspect-video bg-gray-900/50 rounded-lg border border-gray-800 hover:border-red-500/50 relative group overflow-hidden cursor-pointer transition-all duration-300">
//                 <img 
//                   src={link} 
//                   alt="Project Screenshot" 
//                   className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
//                 />
//                 <a href={link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
//                   <span className="text-xs text-white font-bold">View Full</span>
//                 </a>
//               </div>
//             ))
//           ) : (
//              <div className="col-span-full py-8 text-center border-2 border-dashed border-gray-800 rounded-xl text-gray-600 text-sm italic">
//                No evidence uploaded yet.
//              </div>
//           )}
//         </div>
//       </div>

//       {/* Bottom Section: Writing/Description Area */}
//       <div className="bg-black/60 border border-red-900/30 rounded-xl p-6 glow-box transition-all duration-300 ease-in-out">
//         <div className="flex justify-between items-center mb-4">
//           <label className="text-xs text-red-500 uppercase tracking-widest font-bold">
//             Project Log / Description
//           </label>
//           <span className="text-xs text-gray-600">Markdown Supported</span>
//         </div>
//         <div className="relative group">
//           <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-black rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
//           {editMode ? (
//             <textarea 
//               className="relative w-full h-40 xl:h-64 bg-gray-900/80 border border-gray-800 rounded-lg p-4 text-gray-300 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-900 transition-all font-mono text-sm resize-none"
//               placeholder="Describe your project, paste updates, or log anomalies here..."
//               value={formData.description}
//               onChange={(e) => setFormData({...formData, description: e.target.value})}
//             ></textarea>
//           ) : (
//             <div className="relative w-full h-40 xl:h-64 bg-gray-900/40 border border-gray-800/50 rounded-lg p-4 text-gray-300 font-mono text-sm overflow-y-auto whitespace-pre-wrap">
//                {teamData.description || "No log entries found in the archives."}
//             </div>
//           )}
//         </div>
        
//         {editMode && (
//           <div className="flex justify-end mt-4">
//             <button 
//               onClick={handleUpdate}
//               className="bg-red-600/10 border border-red-600/50 text-red-500 hover:bg-red-600 hover:text-white px-6 py-2 rounded transition-all text-sm font-bold uppercase tracking-wider glow-button"
//             >
//               Save Log
//             </button>
//           </div>
//         )}
//       </div>

//     </div>
//   );
// };

// export default TeamManagement;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeamManagement = () => {
    const [loading, setLoading] = useState(true);
    const [teamData, setTeamData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [viewMode, setViewMode] = useState('create');
    const [uploading, setUploading] = useState(false);

    // AI Generation States
    const [projectTitle, setProjectTitle] = useState('');
    const [descriptionLength, setDescriptionLength] = useState('long');
    const [generating, setGenerating] = useState(false);

    // Form States
    const [joinName, setJoinName] = useState('');
    const [createForm, setCreateForm] = useState({ name: '', repoLink: '', description: '' });
    const [formData, setFormData] = useState({ repoLink: '', description: '' });

    // ACCESS ENVIRONMENT VARIABLES FOR VITE
    const API_URL = (import.meta.env.VITE_API_URL + "/team") || 'http://localhost:4000/api/team';
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; 
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET; 

    // Fetch Team Data
    const fetchTeam = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_URL}/me`, { withCredentials: true });
            
            if (data.success && data.team) {
                setTeamData(data.team);
                setFormData({
                    repoLink: data.team.repoLink || '',
                    description: data.team.description || ''
                });
                setProjectTitle(data.team.name || ''); 
            } else {
                setTeamData(null);
            }
        } catch (err) {
            console.error("Error fetching team:", err);
            if (err.response && err.response.data && !err.response.data.team) {
                setTeamData(null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

    // Toggle Edit Mode: Ensures form data is synced upon entering edit mode
    const toggleEditMode = () => {
        if (!editMode && teamData) {
            setFormData({
                repoLink: teamData.repoLink || '',
                description: teamData.description || ''
            });
            setProjectTitle(teamData.name || '');
        }
        setEditMode(!editMode);
    };

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${API_URL}/create`, createForm, { withCredentials: true });
            if (data.success) {
                alert("Team Assembled Successfully!");
                fetchTeam();
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to create party.");
        }
    };

    const handleJoinTeam = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.put(`${API_URL}/join`, { teamName: joinName }, { withCredentials: true });
            if (data.success) {
                alert("Joined Party Successfully!");
                fetchTeam();
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to join team.");
        }
    };

    const handleUpdate = async () => {
        try {
            // Sends formData, which includes the AI-generated or manually edited description
            const { data } = await axios.put(`${API_URL}/update`, formData, { withCredentials: true }); 
            if (data.success) {
                setTeamData(data.team); // Updates state with the saved description from the server
                setEditMode(false);
                alert("Team details updated!");
            }
        } catch (err) {
            console.error("Frontend Update Error:", err.response?.data?.message || err.message);
            alert(err.response?.data?.message || "Failed to update details. Check console for error details.");
        }
    };

    // --- AI DESCRIPTION GENERATION (FINAL CRITICAL FIX) ---
    const handleGenerateDescription = async () => {
        if (!projectTitle.trim()) {
            alert('Please enter a project title first!');
            return;
        }

        setGenerating(true);
        
        // DEBUG: Log the input to the browser console before the API call
        console.log("Attempting to generate description for:", projectTitle, "Length:", descriptionLength);

        try {
            const { data } = await axios.post(
                `${API_URL}/generate-description`,
                { 
                    prompt: projectTitle,
                    length: descriptionLength 
                },
                { withCredentials: true }
            );

            if (data.success) {
                const generatedContent = data.content;
                
                // CRITICAL FIX: Update the correct form state to display generated text immediately
                if (teamData) {
                    setFormData(prevFormData => ({ 
                        ...prevFormData, 
                        description: generatedContent 
                    }));
                } else {
                    setCreateForm(prevCreateForm => ({
                        ...prevCreateForm,
                        description: generatedContent
                    }));
                }
                
                alert('Description generated successfully! It is now loaded into the description box. Click "Save Log" to finalize.');
            } else {
                 // Handle case where server returns success: false
                 alert(data.message || 'Failed to generate description (Server reported failure).');
            }
            
        } catch (err) {
            console.error('Generation error:', err);
            
            // CRITICAL FIX: Ensure state is reset explicitly on API failure
            setGenerating(false); 
            
            alert(err.response?.data?.message || 'Failed to generate description. Check your API quota or network connection.');

        } finally {
            // Final reset check
            setGenerating(false); 
        }
    };

    // --- IMAGE UPLOAD LOGIC ---
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!CLOUD_NAME || !UPLOAD_PRESET) {
            alert("Cloudinary configuration is missing in .env file");
            return;
        }

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("upload_preset", UPLOAD_PRESET); 

        try {
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                uploadData
            );
            
            const imageUrl = res.data.secure_url;
            const { data } = await axios.put(`${API_URL}/update`, { mediaLink: imageUrl }, { withCredentials: true });

            if (data.success) {
                setTeamData(data.team);
                alert("Evidence uploaded successfully!");
            }
        } catch (err) {
            console.error("Upload error:", err);
            alert("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 animate-pulse">
                <div className="text-red-500 glow-text font-creepster text-2xl">Connecting...</div>
            </div>
        );
    }

    // --- VIEW: NO TEAM (CREATE OR JOIN) ---
    if (!teamData) {
        return (
            <div className="max-w-3xl mx-auto mt-10">
                <div className="bg-black/60 border border-red-900/50 rounded-xl p-8 glow-box backdrop-blur-sm transition-all duration-500">
                    
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-red-500 glow-text font-creepster tracking-wider mb-2">
                            {viewMode === 'create' ? 'Assemble Your Party' : 'Join a Party'}
                        </h2>
                        <p className="text-gray-400">
                            You are currently not in a team. 
                        </p>
                    </div>

                    <div className="flex justify-center gap-4 mb-8">
                         <button 
                            onClick={() => setViewMode('create')}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${viewMode === 'create' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-gray-900 text-gray-500 border border-gray-700 hover:border-red-900 hover:text-red-400'}`}
                        >
                            CREATE NEW
                        </button>
                         <button 
                            onClick={() => setViewMode('join')}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${viewMode === 'join' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-gray-900 text-gray-500 border border-gray-700 hover:border-red-900 hover:text-red-400'}`}
                        >
                            JOIN EXISTING
                        </button>
                    </div>

                    {viewMode === 'create' && (
                        <form onSubmit={handleCreateTeam} className="space-y-6 animate-fade-in">
                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-2">Team Name</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-gray-900/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all placeholder-gray-600"
                                    placeholder="e.g. The Hellfire Club"
                                    value={createForm.name}
                                    onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-2">GitHub Repository (Optional)</label>
                                <input 
                                    type="url" 
                                    className="w-full bg-gray-900/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all placeholder-gray-600"
                                    placeholder="https://github.com/username/project"
                                    value={createForm.repoLink}
                                    onChange={(e) => setCreateForm({...createForm, repoLink: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 text-sm font-bold mb-2">Description</label>
                                <textarea 
                                    className="w-full bg-gray-900/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none h-32 resize-none placeholder-gray-600"
                                    placeholder="Our mission is..."
                                    value={createForm.description}
                                    onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
                                />
                            </div>
                            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all glow-button uppercase tracking-widest">
                                Create Team
                            </button>
                        </form>
                    )}

                    {viewMode === 'join' && (
                        <form onSubmit={handleJoinTeam} className="space-y-6 animate-fade-in">
                            <div className="py-8">
                                <label className="block text-gray-300 text-sm font-bold mb-2">Enter Exact Team Name</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full bg-gray-900/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all placeholder-gray-600"
                                    placeholder="e.g. The Hellfire Club"
                                    value={joinName}
                                    onChange={(e) => setJoinName(e.target.value)}
                                />
                                <p className="text-xs text-gray-500 mt-2">Ask your team leader for the exact name.</p>
                            </div>
                            <button className="w-full bg-transparent border border-red-600 text-red-500 hover:bg-red-900/20 font-bold py-3 rounded-lg transition-all uppercase tracking-widest">
                                Search & Join
                            </button>
                        </form>
                    )}
                </div>
            </div>
        );
    }

    // --- VIEW: HAS TEAM (DASHBOARD) ---
    return (
        <div className="space-y-8 animate-fade-in w-full">
            
            {/* Top Section: Team Info & Repo */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-10">
                {/* Team Identity Card */}
                <div className="lg:col-span-2 p-6 bg-black/60 border border-red-900/30 rounded-xl glow-box relative overflow-hidden group transition-all duration-300 ease-in-out">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor" className="text-red-600">
                            <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2-5-2 5zm0 0l-2-5 2 5zm0 0L2 17l10 5 10-5-10-5z"></path>
                        </svg>
                    </div>
                    
                    <div className="relative z-10">
                        <label className="text-xs text-red-500 uppercase tracking-widest font-bold mb-2 block">Team Name</label>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-4xl font-bold text-white glow-text font-creepster tracking-wider break-words">
                                {teamData.name}
                            </h2>
                            <button 
                                onClick={toggleEditMode}
                                className="text-xs border border-red-900/50 text-red-400 px-3 py-1 rounded hover:bg-red-900/20 transition-colors shrink-0 ml-4"
                            >
                                {editMode ? 'Cancel' : 'Edit Details'}
                            </button>
                        </div>

                        <label className="text-xs text-red-500 uppercase tracking-widest font-bold mb-2 block">GitHub Repository</label>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-gray-900/80 border border-red-900/30 rounded-lg flex items-center px-4 py-3 text-gray-300 font-mono text-sm overflow-hidden transition-all duration-300">
                                <svg className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                                {editMode ? (
                                    <input 
                                        type="text" 
                                        className="bg-transparent border-none w-full text-white focus:outline-none"
                                        value={formData.repoLink}
                                        placeholder="https://github.com/..."
                                        onChange={(e) => setFormData({...formData, repoLink: e.target.value})}
                                    />
                                ) : (
                                    <span className="truncate">{teamData.repoLink || "No repo linked"}</span>
                                )}
                            </div>
                            {teamData.repoLink && !editMode && (
                                <a 
                                    href={teamData.repoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors font-bold flex items-center justify-center whitespace-nowrap"
                                >
                                    Link
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Team Members List */}
                <div className="bg-black/60 border border-red-900/30 rounded-xl p-6 glow-box overflow-y-auto max-h-[300px] xl:max-h-[350px] transition-all duration-300 ease-in-out">
                    <label className="text-xs text-red-500 uppercase tracking-widest font-bold mb-4 block sticky top-0 bg-black/90 pb-2 z-10 backdrop-blur-sm">Party Members</label>
                    <div className="space-y-4">
                        {teamData.members.map((memberObj, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-2 hover:bg-red-900/10 rounded-lg transition-colors group cursor-pointer border border-transparent hover:border-red-900/30">
                                <div className="relative flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-700 group-hover:border-red-500 transition-colors">
                                        <img 
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${memberObj.user?.name || 'Unknown'}`} 
                                            alt="Member" 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-black rounded-full"></div>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-white font-medium text-sm group-hover:text-red-400 transition-colors truncate">
                                        {memberObj.user?.name || "Unknown User"}
                                    </p>
                                    <p className="text-gray-500 text-xs truncate">{memberObj.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Middle Section: Project Media / Evidence */}
            <div className="bg-black/60 border border-red-900/30 rounded-xl p-6 glow-box transition-all duration-300 ease-in-out">
                <div className="flex justify-between items-center mb-6">
                    <label className="text-xs text-red-500 uppercase tracking-widest font-bold">Project Media / Evidence</label>
                    
                    <input 
                        type="file" 
                        id="mediaUpload" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload} 
                        disabled={uploading}
                    />

                    <button 
                        onClick={() => document.getElementById('mediaUpload').click()}
                        disabled={uploading}
                        className="text-xs bg-red-900/20 text-red-400 px-3 py-1 rounded border border-red-900/50 hover:bg-red-900/40 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {uploading ? (
                            <>
                                <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                                Uploading...
                            </>
                        ) : (
                            'Upload Media'
                        )}
                    </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                    {teamData.mediaLinks && teamData.mediaLinks.length > 0 ? (
                        teamData.mediaLinks.map((link, idx) => (
                            <div key={idx} className="aspect-video bg-gray-900/50 rounded-lg border border-gray-800 hover:border-red-500/50 relative group overflow-hidden cursor-pointer transition-all duration-300">
                                <img 
                                    src={link} 
                                    alt="Project Screenshot" 
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                />
                                <a href={link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                    <span className="text-xs text-white font-bold">View Full</span>
                                </a>
                            </div>
                        ))
                    ) : (
                         <div className="col-span-full py-8 text-center border-2 border-dashed border-gray-800 rounded-xl text-gray-600 text-sm italic">
                            No evidence uploaded yet.
                         </div>
                    )}
                </div>
            </div>

            {/* Bottom Section: AI-Powered Project Description */}
            <div className="bg-black/60 border border-red-900/30 rounded-xl p-6 glow-box transition-all duration-300 ease-in-out">
                <div className="flex justify-between items-center mb-4">
                    <label className="text-xs text-red-500 uppercase tracking-widest font-bold">
                        Project Log / Description
                    </label>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">✨ AI Powered</span>
                        {editMode && (
                            <span className="text-xs text-gray-600">• Markdown Supported</span>
                        )}
                    </div>
                </div>

                {/* AI Generation Controls - Only show in edit mode */}
                {editMode && (
                    <div className="bg-gradient-to-r from-purple-900/20 to-red-900/20 border border-purple-500/30 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <h4 className="text-sm font-bold text-purple-400 uppercase tracking-wide">AI Description Generator</h4>
                        </div>

                        <div className="space-y-3">
                            {/* Project Title Input */}
                            <div>
                                <label className="block text-gray-400 text-xs mb-1">Project Title/Topic</label>
                                <input
                                    type="text"
                                    value={projectTitle}
                                    onChange={(e) => setProjectTitle(e.target.value)}
                                    placeholder="e.g., E-commerce Platform with Real-time Inventory"
                                    className="w-full bg-gray-900/50 border border-purple-900/30 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all placeholder-gray-600"
                                />
                            </div>

                            {/* Length Selection */}
                            <div className="flex items-center gap-4">
                                <label className="text-gray-400 text-xs">Length:</label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setDescriptionLength('short')}
                                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                                            descriptionLength === 'short'
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-800 text-gray-400 hover:text-purple-400'
                                        }`}
                                    >
                                        Short (100 words)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setDescriptionLength('long')}
                                        className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                                            descriptionLength === 'long'
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-800 text-gray-400 hover:text-purple-400'
                                        }`}
                                    >
                                        Long (Detailed)
                                    </button>
                                </div>
                            </div>

                            {/* Generate Button */}
                            <button
                                type="button"
                                onClick={handleGenerateDescription}
                                disabled={generating || !projectTitle.trim()}
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
                            >
                                {generating ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Generate AI Description
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Description Text Area/Display */}
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-black rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                    {editMode ? (
                        <textarea 
                            className="relative w-full h-40 xl:h-64 bg-gray-900/80 border border-gray-800 rounded-lg p-4 text-gray-300 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-900 transition-all font-mono text-sm resize-none"
                            placeholder="Describe your project, paste updates, or log anomalies here... Or use AI to generate it!"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                    ) : (
                        <div className="relative w-full h-40 xl:h-64 bg-gray-900/40 border border-gray-800/50 rounded-lg p-4 text-gray-300 font-mono text-sm overflow-y-auto whitespace-pre-wrap">
                             {teamData.description || "No log entries found in the archives."}
                        </div>
                    )}
                </div>
                
                {editMode && (
                    <div className="flex justify-end mt-4">
                        <button 
                            onClick={handleUpdate}
                            className="bg-red-600/10 border border-red-600/50 text-red-500 hover:bg-red-600 hover:text-white px-6 py-2 rounded transition-all text-sm font-bold uppercase tracking-wider glow-button"
                        >
                            Save Log
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
};

export default TeamManagement;
