

// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import InvitationModal from './InvitationModal';
// // const TeamManagement = () => {
// //     const [loading, setLoading] = useState(true);
// //     const [teamData, setTeamData] = useState(null);
// //     const [editMode, setEditMode] = useState(false);
// //     const [viewMode, setViewMode] = useState('create');
// //     const [uploading, setUploading] = useState(false);
// // const [invitationModalOpen, setInvitationModalOpen] = useState(false);

// //     // --- NEW STATES FOR MEMBER INVITATION ---
// //     const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
// //     const [inviteEmail, setInviteEmail] = useState('');
// //     const [inviting, setInviting] = useState(false);

// //     // AI Generation States
// //     const [projectTitle, setProjectTitle] = useState('');
// //     const [descriptionLength, setDescriptionLength] = useState('long');
// //     const [generating, setGenerating] = useState(false);

// //     // Form States
// //     const [joinName, setJoinName] = useState('');
// //     const [createForm, setCreateForm] = useState({ name: '', repoLink: '', description: '' });
// //     const [formData, setFormData] = useState({ repoLink: '', description: '' });

// //     // ACCESS ENVIRONMENT VARIABLES FOR VITE
// //     const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/team';
// //     const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; 
// //     const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET; 


// // const isTeamLeader = () => {
// //     if (!teamData || !teamData.members) return false;
// //     const currentUserMember = teamData.members.find(
// //         m => m.user?._id === teamData.currentUserId || m.role === 'Team Lead'
// //     );
// //     return currentUserMember?.role === 'Team Lead';
// // };
// // const handleInvitationSuccess = () => {
// //     fetchTeam(); // Refresh team data after invitation sent
// // };




// // // for invite team members 
// // const handleInviteMember = async (e) => {
// //         e.preventDefault();
// //         if (!inviteEmail.trim()) {
// //             alert("Please enter a valid email address.");
// //             return;
// //         }

// //         setInviting(true);
// //         try {
// //             // The request will be sent to the new backend endpoint: /api/team/invite
// //             const { data } = await axios.post(`${API_URL}/invite`, 
// //                 { email: inviteEmail }, 
// //                 { withCredentials: true }
// //             );

// //             if (data.success) {
// //                 alert(`Invitation sent to ${inviteEmail} successfully!`);
// //                 setInviteEmail('');
// //                 setIsInviteModalOpen(false);
// //             } else {
// //                  // Handle potential server messages like 'User not found' or 'Already invited'
// //                 alert(data.message || "Failed to send invitation.");
// //             }
// //         } catch (err) {
// //             console.error("Invite error:", err);
// //             alert(err.response?.data?.message || "An error occurred while sending the invitation.");
// //         } finally {
// //             setInviting(false);
// //         }
// //     };




// //     // Fetch Team Data
// //     const fetchTeam = async () => {
// //         try {
// //             setLoading(true);
// //             const { data } = await axios.get(`${API_URL}/me`, { withCredentials: true });
            
// //             if (data.success && data.team) {
// //                 setTeamData(data.team);
// //                 setFormData({
// //                     repoLink: data.team.repoLink || '',
// //                     description: data.team.description || ''
// //                 });
// //                 setProjectTitle(data.team.name || ''); 
// //             } else {
// //                 setTeamData(null);
// //             }
// //         } catch (err) {
// //             console.error("Error fetching team:", err);
// //             if (err.response && err.response.data && !err.response.data.team) {
// //                 setTeamData(null);
// //             }
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     useEffect(() => {
// //         fetchTeam();
// //     }, []);

// //     // Toggle Edit Mode: Ensures form data is synced upon entering edit mode
// //     const toggleEditMode = () => {
// //         if (!editMode && teamData) {
// //             setFormData({
// //                 repoLink: teamData.repoLink || '',
// //                 description: teamData.description || ''
// //             });
// //             setProjectTitle(teamData.name || '');
// //         }
// //         setEditMode(!editMode);
// //     };

// //     const handleCreateTeam = async (e) => {
// //         e.preventDefault();
// //         try {
// //             const { data } = await axios.post(`${API_URL}/create`, createForm, { withCredentials: true });
// //             if (data.success) {
// //                 alert("Team Assembled Successfully!");
// //                 fetchTeam();
// //             }
// //         } catch (err) {
// //             alert(err.response?.data?.message || "Failed to create party.");
// //         }
// //     };

// //     const handleJoinTeam = async (e) => {
// //         e.preventDefault();
// //         try {
// //             const { data } = await axios.put(`${API_URL}/join`, { teamName: joinName }, { withCredentials: true });
// //             if (data.success) {
// //                 alert("Joined Party Successfully!");
// //                 fetchTeam();
// //             }
// //         } catch (err) {
// //             alert(err.response?.data?.message || "Failed to join team.");
// //         }
// //     };

// //     const handleUpdate = async () => {
// //         try {
// //             // Sends formData, which includes the AI-generated or manually edited description
// //             const { data } = await axios.put(`${API_URL}/update`, formData, { withCredentials: true }); 
// //             if (data.success) {
// //                 setTeamData(data.team); // Updates state with the saved description from the server
// //                 setEditMode(false);
// //                 alert("Team details updated!");
// //             }
// //         } catch (err) {
// //             console.error("Frontend Update Error:", err.response?.data?.message || err.message);
// //             alert(err.response?.data?.message || "Failed to update details. Check console for error details.");
// //         }
// //     };

// //     // --- AI DESCRIPTION GENERATION (FINAL CRITICAL FIX) ---
// //     const handleGenerateDescription = async () => {
// //         if (!projectTitle.trim()) {
// //             alert('Please enter a project title first!');
// //             return;
// //         }

// //         setGenerating(true);
        
// //         // DEBUG: Log the input to the browser console before the API call
// //         console.log("Attempting to generate description for:", projectTitle, "Length:", descriptionLength);

// //         try {
// //             const { data } = await axios.post(
// //                 `${API_URL}/generate-description`,
// //                 { 
// //                     prompt: projectTitle,
// //                     length: descriptionLength 
// //                 },
// //                 { withCredentials: true }
// //             );

// //             if (data.success) {
// //                 const generatedContent = data.content;
                
// //                 // CRITICAL FIX: Update the correct form state to display generated text immediately
// //                 if (teamData) {
// //                     setFormData(prevFormData => ({ 
// //                         ...prevFormData, 
// //                         description: generatedContent 
// //                     }));
// //                 } else {
// //                     setCreateForm(prevCreateForm => ({
// //                         ...prevCreateForm,
// //                         description: generatedContent
// //                     }));
// //                 }
                
// //                 alert('Description generated successfully! It is now loaded into the description box. Click "Save Log" to finalize.');
// //             } else {
// //                  // Handle case where server returns success: false
// //                  alert(data.message || 'Failed to generate description (Server reported failure).');
// //             }
            
// //         } catch (err) {
// //             console.error('Generation error:', err);
            
// //             // CRITICAL FIX: Ensure state is reset explicitly on API failure
// //             setGenerating(false); 
            
// //             alert(err.response?.data?.message || 'Failed to generate description. Check your API quota or network connection.');

// //         } finally {
// //             // Final reset check
// //             setGenerating(false); 
// //         }
// //     };

// //     // --- IMAGE UPLOAD LOGIC ---
// //     const handleImageUpload = async (e) => {
// //         const file = e.target.files[0];
// //         if (!file) return;

// //         if (!CLOUD_NAME || !UPLOAD_PRESET) {
// //             alert("Cloudinary configuration is missing in .env file");
// //             return;
// //         }

// //         setUploading(true);
// //         const uploadData = new FormData();
// //         uploadData.append("file", file);
// //         uploadData.append("upload_preset", UPLOAD_PRESET); 

// //         try {
// //             const res = await axios.post(
// //                 `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
// //                 uploadData
// //             );
            
// //             const imageUrl = res.data.secure_url;
// //             const { data } = await axios.put(`${API_URL}/update`, { mediaLink: imageUrl }, { withCredentials: true });

// //             if (data.success) {
// //                 setTeamData(data.team);
// //                 alert("Evidence uploaded successfully!");
// //             }
// //         } catch (err) {
// //             console.error("Upload error:", err);
// //             alert("Failed to upload image.");
// //         } finally {
// //             setUploading(false);
// //         }
// //     };

// //     if (loading) {
// //         return (
// //             <div className="flex items-center justify-center h-64 animate-pulse">
// //                 <div className="text-red-500 glow-text font-creepster text-2xl">Connecting...</div>
// //             </div>
// //         );
// //     }

// //     // --- VIEW: NO TEAM (CREATE OR JOIN) ---
// //     if (!teamData) {
// //         return (
// //             <div className="max-w-3xl mx-auto mt-10">
// //                 <div className="bg-black/60 border border-red-900/50 rounded-xl p-8 glow-box backdrop-blur-sm transition-all duration-500">
                    
// //                     <div className="text-center mb-8">
// //                         <h2 className="text-3xl font-bold text-red-500 glow-text font-creepster tracking-wider mb-2">
// //                             {viewMode === 'create' ? 'Assemble Your Party' : 'Join a Party'}
// //                         </h2>
// //                         <p className="text-gray-400">
// //                             You are currently not in a team. 
// //                         </p>
// //                     </div>

// //                     <div className="flex justify-center gap-4 mb-8">
// //                          <button 
// //                             onClick={() => setViewMode('create')}
// //                             className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${viewMode === 'create' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-gray-900 text-gray-500 border border-gray-700 hover:border-red-900 hover:text-red-400'}`}
// //                         >
// //                             CREATE NEW
// //                         </button>
// //                          <button 
// //                             onClick={() => setViewMode('join')}
// //                             className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${viewMode === 'join' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-gray-900 text-gray-500 border border-gray-700 hover:border-red-900 hover:text-red-400'}`}
// //                         >
// //                             JOIN EXISTING
// //                         </button>
// //                     </div>

// //                     {viewMode === 'create' && (
// //                         <form onSubmit={handleCreateTeam} className="space-y-6 animate-fade-in">
// //                             <div>
// //                                 <label className="block text-gray-300 text-sm font-bold mb-2">Team Name</label>
// //                                 <input 
// //                                     type="text" 
// //                                     required
// //                                     className="w-full bg-gray-900/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all placeholder-gray-600"
// //                                     placeholder="e.g. The Hellfire Club"
// //                                     value={createForm.name}
// //                                     onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
// //                                 />
// //                             </div>
// //                             <div>
// //                                 <label className="block text-gray-300 text-sm font-bold mb-2">GitHub Repository (Optional)</label>
// //                                 <input 
// //                                     type="url" 
// //                                     className="w-full bg-gray-900/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all placeholder-gray-600"
// //                                     placeholder="https://github.com/username/project"
// //                                     value={createForm.repoLink}
// //                                     onChange={(e) => setCreateForm({...createForm, repoLink: e.target.value})}
// //                                 />
// //                             </div>
// //                             <div>
// //                                 <label className="block text-gray-300 text-sm font-bold mb-2">Description</label>
// //                                 <textarea 
// //                                     className="w-full bg-gray-900/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none h-32 resize-none placeholder-gray-600"
// //                                     placeholder="Our mission is..."
// //                                     value={createForm.description}
// //                                     onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
// //                                 />
// //                             </div>
// //                             <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all glow-button uppercase tracking-widest">
// //                                 Create Team
// //                             </button>
// //                         </form>
// //                     )}

// //                     {viewMode === 'join' && (
// //                         <form onSubmit={handleJoinTeam} className="space-y-6 animate-fade-in">
// //                             <div className="py-8">
// //                                 <label className="block text-gray-300 text-sm font-bold mb-2">Enter Exact Team Name</label>
// //                                 <input 
// //                                     type="text" 
// //                                     required
// //                                     className="w-full bg-gray-900/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all placeholder-gray-600"
// //                                     placeholder="e.g. The Hellfire Club"
// //                                     value={joinName}
// //                                     onChange={(e) => setJoinName(e.target.value)}
// //                                 />
// //                                 <p className="text-xs text-gray-500 mt-2">Ask your team leader for the exact name.</p>
// //                             </div>
// //                             <button className="w-full bg-transparent border border-red-600 text-red-500 hover:bg-red-900/20 font-bold py-3 rounded-lg transition-all uppercase tracking-widest">
// //                                 Search & Join
// //                             </button>
// //                         </form>
// //                     )}
// //                 </div>
// //             </div>
// //         );
// //     }

// //     // --- VIEW: HAS TEAM (DASHBOARD) ---
// //     return (
// //         <div className="space-y-8 animate-fade-in w-full">
            
// //             {/* Invitation Modal */}
// // <InvitationModal 
// //     isOpen={invitationModalOpen}
// //     onClose={() => setInvitationModalOpen(false)}
// //     onSuccess={handleInvitationSuccess}
// // />





// //             {/* Top Section: Team Info & Repo */}
// //             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-10">
// //                 {/* Team Identity Card */}
// //                 <div className="lg:col-span-2 p-6 bg-black/60 border border-red-900/30 rounded-xl glow-box relative overflow-hidden group transition-all duration-300 ease-in-out">
// //                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
// //                         <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor" className="text-red-600">
// //                             <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2-5-2 5zm0 0l-2-5 2 5zm0 0L2 17l10 5 10-5-10-5z"></path>
// //                         </svg>
// //                     </div>
                    
// //                     <div className="relative z-10">
// //                         <label className="text-xs text-red-500 uppercase tracking-widest font-bold mb-2 block">Team Name</label>
// //                         <div className="flex items-center justify-between mb-6">
// //                             <h2 className="text-4xl font-bold text-white glow-text font-creepster tracking-wider break-words">
// //                                 {teamData.name}
// //                             </h2>
// //                             <button 
// //                                 onClick={toggleEditMode}
// //                                 className="text-xs border border-red-900/50 text-red-400 px-3 py-1 rounded hover:bg-red-900/20 transition-colors shrink-0 ml-4"
// //                             >
// //                                 {editMode ? 'Cancel' : 'Edit Details'}
// //                             </button>
// //                         </div>

// //                         <label className="text-xs text-red-500 uppercase tracking-widest font-bold mb-2 block">GitHub Repository</label>
// //                         <div className="flex gap-2">
// //                             <div className="flex-1 bg-gray-900/80 border border-red-900/30 rounded-lg flex items-center px-4 py-3 text-gray-300 font-mono text-sm overflow-hidden transition-all duration-300">
// //                                 <svg className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
// //                                 {editMode ? (
// //                                     <input 
// //                                         type="text" 
// //                                         className="bg-transparent border-none w-full text-white focus:outline-none"
// //                                         value={formData.repoLink}
// //                                         placeholder="https://github.com/..."
// //                                         onChange={(e) => setFormData({...formData, repoLink: e.target.value})}
// //                                     />
// //                                 ) : (
// //                                     <span className="truncate">{teamData.repoLink || "No repo linked"}</span>
// //                                 )}
// //                             </div>
// //                             {teamData.repoLink && !editMode && (
// //                                 <a 
// //                                     href={teamData.repoLink}
// //                                     target="_blank"
// //                                     rel="noopener noreferrer"
// //                                     className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors font-bold flex items-center justify-center whitespace-nowrap"
// //                                 >
// //                                     Link
// //                                 </a>
// //                             )}
// //                         </div>
// //                     </div>
// //                 </div>

// //             {/* Team Members List - Add this to your TeamManagement component  */}
// // <div className="p-6 bg-black/60 border border-red-900/30 rounded-xl glow-box">
// //   <div className="flex items-center justify-between mb-4 sticky top-0 bg-black/90 pb-2 z-10 backdrop-blur-sm">
// //     <label className="text-xs text-red-500 uppercase tracking-widest font-bold">
// //       Party Members ({teamData.members?.length || 0})
// //     </label>
// //     {isTeamLeader() && (
// //       <button
// //         onClick={() => setInvitationModalOpen(true)}
// //         className="text-xs bg-red-600/20 hover:bg-red-600/40 text-red-400 px-3 py-1 rounded border border-red-600/50 transition-all flex items-center gap-1"
// //         title="Invite Team Member"
// //       >
// //         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
// //         </svg>
// //         Invite
// //       </button>
// //     )}
// //   </div>

// //   {/* Members Grid */}
// //   <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
// //     {teamData.members && teamData.members.length > 0 ? (
// //       teamData.members.map((member, idx) => (
// //         <div
// //           key={idx}
// //           className="bg-gray-900/50 border border-red-900/20 rounded-lg p-4 hover:border-red-500/50 transition-all group"
// //         >
// //           <div className="flex items-center gap-3">
// //             {/* Avatar */}
// //             <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center text-red-500 font-bold text-lg border-2 border-red-900/50 group-hover:border-red-500/50 transition-all">
// //               {member.user?.name?.charAt(0).toUpperCase() || '?'}
// //             </div>

// //             {/* Member Info */}
// //             <div className="flex-1">
// //               <div className="flex items-center gap-2">
// //                 <h4 className="text-white font-bold">
// //                   {member.user?.name || 'Unknown'}
// //                 </h4>
// //                 {member.role === 'Team Lead' && (
// //                   <span className="text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded border border-red-600/30">
// //                     Leader
// //                   </span>
// //                 )}
// //               </div>
// //               <p className="text-gray-400 text-sm">
// //                 {member.user?.email || 'No email'}
// //               </p>
// //             </div>

// //             {/* Status Indicator */}
// //             <div className="flex items-center gap-2">
// //               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
// //               <span className="text-xs text-gray-500">Active</span>
// //             </div>
// //           </div>
// //         </div>
// //       ))
// //     ) : (
// //       <div className="text-center py-8 text-gray-600">
// //         No members yet. Invite someone to join!
// //       </div>
// //     )}
// //   </div>
// // </div>
// //             </div>

// //             {/* Middle Section: Project Media / Evidence */}
// //             <div className="bg-black/60 border border-red-900/30 rounded-xl p-6 glow-box transition-all duration-300 ease-in-out">
// //                 <div className="flex justify-between items-center mb-6">
// //                     <label className="text-xs text-red-500 uppercase tracking-widest font-bold">Project Media / Evidence</label>
                    
// //                     <input 
// //                         type="file" 
// //                         id="mediaUpload" 
// //                         accept="image/*" 
// //                         className="hidden" 
// //                         onChange={handleImageUpload} 
// //                         disabled={uploading}
// //                     />

// //                     <button 
// //                         onClick={() => document.getElementById('mediaUpload').click()}
// //                         disabled={uploading}
// //                         className="text-xs bg-red-900/20 text-red-400 px-3 py-1 rounded border border-red-900/50 hover:bg-red-900/40 transition-all flex items-center gap-2 disabled:opacity-50"
// //                     >
// //                         {uploading ? (
// //                             <>
// //                                 <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
// //                                 Uploading...
// //                             </>
// //                         ) : (
// //                             'Upload Media'
// //                         )}
// //                     </button>
// //                 </div>
                
// //                 <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
// //                     {teamData.mediaLinks && teamData.mediaLinks.length > 0 ? (
// //                         teamData.mediaLinks.map((link, idx) => (
// //                             <div key={idx} className="aspect-video bg-gray-900/50 rounded-lg border border-gray-800 hover:border-red-500/50 relative group overflow-hidden cursor-pointer transition-all duration-300">
// //                                 <img 
// //                                     src={link} 
// //                                     alt="Project Screenshot" 
// //                                     className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
// //                                 />
// //                                 <a href={link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
// //                                     <span className="text-xs text-white font-bold">View Full</span>
// //                                 </a>
// //                             </div>
// //                         ))
// //                     ) : (
// //                          <div className="col-span-full py-8 text-center border-2 border-dashed border-gray-800 rounded-xl text-gray-600 text-sm italic">
// //                             No evidence uploaded yet.
// //                          </div>
// //                     )}
// //                 </div>
// //             </div>

// //             {/* Bottom Section: AI-Powered Project Description */}
// //             <div className="bg-black/60 border border-red-900/30 rounded-xl p-6 glow-box transition-all duration-300 ease-in-out">
// //                 <div className="flex justify-between items-center mb-4">
// //                     <label className="text-xs text-red-500 uppercase tracking-widest font-bold">
// //                         Project Log / Description
// //                     </label>
// //                     <div className="flex items-center gap-2">
// //                         <span className="text-xs text-gray-600">✨ AI Powered</span>
// //                         {editMode && (
// //                             <span className="text-xs text-gray-600">• Markdown Supported</span>
// //                         )}
// //                     </div>
// //                 </div>

// //                 {/* AI Generation Controls - Only show in edit mode */}
// //                 {editMode && (
// //                     <div className="bg-gradient-to-r from-purple-900/20 to-red-900/20 border border-purple-500/30 rounded-lg p-4 mb-4">
// //                         <div className="flex items-center gap-2 mb-3">
// //                             <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
// //                             </svg>
// //                             <h4 className="text-sm font-bold text-purple-400 uppercase tracking-wide">AI Description Generator</h4>
// //                         </div>

// //                         <div className="space-y-3">
// //                             {/* Project Title Input */}
// //                             <div>
// //                                 <label className="block text-gray-400 text-xs mb-1">Project Title/Topic</label>
// //                                 <input
// //                                     type="text"
// //                                     value={projectTitle}
// //                                     onChange={(e) => setProjectTitle(e.target.value)}
// //                                     placeholder="e.g., E-commerce Platform with Real-time Inventory"
// //                                     className="w-full bg-gray-900/50 border border-purple-900/30 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all placeholder-gray-600"
// //                                 />
// //                             </div>

// //                             {/* Length Selection */}
// //                             <div className="flex items-center gap-4">
// //                                 <label className="text-gray-400 text-xs">Length:</label>
// //                                 <div className="flex gap-2">
// //                                     <button
// //                                         type="button"
// //                                         onClick={() => setDescriptionLength('short')}
// //                                         className={`px-3 py-1 rounded text-xs font-bold transition-all ${
// //                                             descriptionLength === 'short'
// //                                                 ? 'bg-purple-600 text-white'
// //                                                 : 'bg-gray-800 text-gray-400 hover:text-purple-400'
// //                                         }`}
// //                                     >
// //                                         Short (100 words)
// //                                     </button>
// //                                     <button
// //                                         type="button"
// //                                         onClick={() => setDescriptionLength('long')}
// //                                         className={`px-3 py-1 rounded text-xs font-bold transition-all ${
// //                                             descriptionLength === 'long'
// //                                                 ? 'bg-purple-600 text-white'
// //                                                 : 'bg-gray-800 text-gray-400 hover:text-purple-400'
// //                                         }`}
// //                                     >
// //                                         Long (Detailed)
// //                                     </button>
// //                                 </div>
// //                             </div>

// //                             {/* Generate Button */}
// //                             <button
// //                                 type="button"
// //                                 onClick={handleGenerateDescription}
// //                                 disabled={generating || !projectTitle.trim()}
// //                                 className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
// //                             >
// //                                 {generating ? (
// //                                     <>
// //                                         <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
// //                                         Generating...
// //                                     </>
// //                                 ) : (
// //                                     <>
// //                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
// //                                         </svg>
// //                                         Generate AI Description
// //                                     </>
// //                                 )}
// //                             </button>
// //                         </div>
// //                     </div>
// //                 )}

// //                 {/* Description Text Area/Display */}
// //                 <div className="relative group">
// //                     <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-black rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
// //                     {editMode ? (
// //                         <textarea 
// //                             className="relative w-full h-40 xl:h-64 bg-gray-900/80 border border-gray-800 rounded-lg p-4 text-gray-300 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-900 transition-all font-mono text-sm resize-none"
// //                             placeholder="Describe your project, paste updates, or log anomalies here... Or use AI to generate it!"
// //                             value={formData.description}
// //                             onChange={(e) => setFormData({...formData, description: e.target.value})}
// //                         ></textarea>
// //                     ) : (
// //                         <div className="relative w-full h-40 xl:h-64 bg-gray-900/40 border border-gray-800/50 rounded-lg p-4 text-gray-300 font-mono text-sm overflow-y-auto whitespace-pre-wrap">
// //                              {teamData.description || "No log entries found in the archives."}
// //                         </div>
// //                     )}
// //                 </div>
                
// //                 {editMode && (
// //                     <div className="flex justify-end mt-4">
// //                         <button 
// //                             onClick={handleUpdate}
// //                             className="bg-red-600/10 border border-red-600/50 text-red-500 hover:bg-red-600 hover:text-white px-6 py-2 rounded transition-all text-sm font-bold uppercase tracking-wider glow-button"
// //                         >
// //                             Save Log
// //                         </button>
// //                     </div>
// //                 )}
// //             </div>

// //         </div>
// //     );
// // };

// // export default TeamManagement;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import InvitationModal from './InvitationModal';

// const TeamManagement = () => {
//     const [loading, setLoading] = useState(true);
//     const [teamData, setTeamData] = useState(null);
//     const [editMode, setEditMode] = useState(false);
//     const [viewMode, setViewMode] = useState('create');
//     const [uploading, setUploading] = useState(false);
//     const [invitationModalOpen, setInvitationModalOpen] = useState(false);

//     // AI Generation States
//     const [projectTitle, setProjectTitle] = useState('');
//     const [descriptionLength, setDescriptionLength] = useState('long');
//     const [generating, setGenerating] = useState(false);

//     // Form States
//     const [joinName, setJoinName] = useState('');
//     const [createForm, setCreateForm] = useState({ name: '', repoLink: '', description: '' });
//     const [formData, setFormData] = useState({ repoLink: '', description: '' });

//     // ✅ NEW: Approval States
//     const [approvalStatus, setApprovalStatus] = useState('not_submitted');
//     const [submittingApproval, setSubmittingApproval] = useState(false);

//     // Environment Variables


//     // ACCESS ENVIRONMENT VARIABLES FOR VITE
//     const API_URL = (import.meta.env.VITE_API_URL + "/team") || 'http://localhost:4000/api/team';

//     const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; 
//     const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET; 

//     const isTeamLeader = () => {
//         if (!teamData || !teamData.members) return false;
//         const currentUserMember = teamData.members.find(
//             m => m.user?._id === teamData.currentUserId || m.role === 'Team Lead'
//         );
//         return currentUserMember?.role === 'Team Lead';
//     };

//     const handleInvitationSuccess = () => {
//         fetchTeam();
//     };

//     // ✅ NEW: Fetch Approval Status
//     const fetchApprovalStatus = async () => {
//         try {
//             const { data } = await axios.get(`${API_URL}/approval-status`, { withCredentials: true });
//             if (data.success) {
//                 setApprovalStatus(data.approval.status);
//             }
//         } catch (err) {
//             console.error('Failed to fetch approval status:', err);
//         }
//     };

//     // Fetch Team Data
//     const fetchTeam = async () => {
//         try {
//             setLoading(true);
//             const { data } = await axios.get(`${API_URL}/me`, { withCredentials: true });
            
//             if (data.success && data.team) {
//                 setTeamData(data.team);
//                 setFormData({
//                     repoLink: data.team.repoLink || '',
//                     description: data.team.description || ''
//                 });
//                 setProjectTitle(data.team.name || ''); 
//                 setApprovalStatus(data.team.approvalStatus || 'not_submitted'); // ✅ Set status from team data
//             } else {
//                 setTeamData(null);
//             }
//         } catch (err) {
//             console.error("Error fetching team:", err);
//             if (err.response && err.response.data && !err.response.data.team) {
//                 setTeamData(null);
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchTeam();
//         fetchApprovalStatus(); // ✅ Fetch approval status on mount
//     }, []);

//     // ✅ NEW: Handle Approval Request
//     const handleRequestApproval = async () => {
//         if (!teamData || teamData.members.length < 2) {
//             alert('Your team must have at least 2 members to request approval.');
//             return;
//         }

//         if (teamData.members.length > 3) {
//             alert('Your team cannot have more than 3 members.');
//             return;
//         }

//         if (!window.confirm(
//             `Submit "${teamData.name}" for admin approval?\n\n` +
//             `Team Size: ${teamData.members.length} members\n` +
//             `This action will notify the admin for review.`
//         )) {
//             return;
//         }

//         setSubmittingApproval(true);

//         try {
//             const { data } = await axios.post(
//                 `${API_URL}/request-approval`,
//                 {},
//                 { withCredentials: true }
//             );

//             if (data.success) {
//                 alert('✅ Approval request submitted successfully!\n\nThe admin will review your team and notify you via email.');
//                 setApprovalStatus('pending');
//                 fetchApprovalStatus();
//             }
//         } catch (err) {
//             alert(err.response?.data?.message || 'Failed to submit approval request.');
//         } finally {
//             setSubmittingApproval(false);
//         }
//     };

//     const toggleEditMode = () => {
//         if (!editMode && teamData) {
//             setFormData({
//                 repoLink: teamData.repoLink || '',
//                 description: teamData.description || ''
//             });
//             setProjectTitle(teamData.name || '');
//         }
//         setEditMode(!editMode);
//     };

//     const handleCreateTeam = async (e) => {
//         e.preventDefault();
//         try {
//             const { data } = await axios.post(`${API_URL}/create`, createForm, { withCredentials: true });
//             if (data.success) {
//                 alert("Team Assembled Successfully!");
//                 fetchTeam();
//             }
//         } catch (err) {
//             alert(err.response?.data?.message || "Failed to create party.");
//         }
//     };

//     const handleJoinTeam = async (e) => {
//         e.preventDefault();
//         try {
//             const { data } = await axios.put(`${API_URL}/join`, { teamName: joinName }, { withCredentials: true });
//             if (data.success) {
//                 alert("Joined Party Successfully!");
//                 fetchTeam();
//             }
//         } catch (err) {
//             alert(err.response?.data?.message || "Failed to join team.");
//         }
//     };

//     const handleUpdate = async () => {
//         try {
//             const { data } = await axios.put(`${API_URL}/update`, formData, { withCredentials: true }); 
//             if (data.success) {
//                 setTeamData(data.team);
//                 setEditMode(false);
//                 alert("Team details updated!");
//             }
//         } catch (err) {
//             console.error("Frontend Update Error:", err.response?.data?.message || err.message);
//             alert(err.response?.data?.message || "Failed to update details.");
//         }
//     };

//     const handleGenerateDescription = async () => {
//         if (!projectTitle.trim()) {
//             alert('Please enter a project title first!');
//             return;
//         }

//         setGenerating(true);
        
//         console.log("Generating description for:", projectTitle, "Length:", descriptionLength);

//         try {
//             const { data } = await axios.post(
//                 `${API_URL}/generate-description`,
//                 { 
//                     prompt: projectTitle,
//                     length: descriptionLength 
//                 },
//                 { withCredentials: true }
//             );

//             if (data.success) {
//                 const generatedContent = data.content;
                
//                 if (teamData) {
//                     setFormData(prevFormData => ({ 
//                         ...prevFormData, 
//                         description: generatedContent 
//                     }));
//                 } else {
//                     setCreateForm(prevCreateForm => ({
//                         ...prevCreateForm,
//                         description: generatedContent
//                     }));
//                 }
                
//                 alert('Description generated successfully! Click "Save Log" to finalize.');
//             } else {
//                 alert(data.message || 'Failed to generate description.');
//             }
            
//         } catch (err) {
//             console.error('Generation error:', err);
//             setGenerating(false); 
//             alert(err.response?.data?.message || 'Failed to generate description.');
//         } finally {
//             setGenerating(false); 
//         }
//     };

//     const handleImageUpload = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         if (!CLOUD_NAME || !UPLOAD_PRESET) {
//             alert("Cloudinary configuration is missing in .env file");
//             return;
//         }

//         setUploading(true);
//         const uploadData = new FormData();
//         uploadData.append("file", file);
//         uploadData.append("upload_preset", UPLOAD_PRESET); 

//         try {
//             const res = await axios.post(
//                 `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
//                 uploadData
//             );
            
//             const imageUrl = res.data.secure_url;
//             const { data } = await axios.put(`${API_URL}/update`, { mediaLink: imageUrl }, { withCredentials: true });

//             if (data.success) {
//                 setTeamData(data.team);
//                 alert("Evidence uploaded successfully!");
//             }
//         } catch (err) {
//             console.error("Upload error:", err);
//             alert("Failed to upload image.");
//         } finally {
//             setUploading(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-64 animate-pulse">
//                 <div className="text-red-500 glow-text font-creepster text-2xl">Connecting...</div>
//             </div>
//         );
//     }

//     // NO TEAM VIEW
//     if (!teamData) {
//         return (
//             <div className="max-w-3xl mx-auto mt-10">
//                 <div className="bg-black/60 border border-red-900/50 rounded-xl p-8 glow-box backdrop-blur-sm transition-all duration-500">
                    
//                     <div className="text-center mb-8">
//                         <h2 className="text-3xl font-bold text-red-500 glow-text font-creepster tracking-wider mb-2">
//                             {viewMode === 'create' ? 'Assemble Your Party' : 'Join a Party'}
//                         </h2>
//                         <p className="text-gray-400">You are currently not in a team.</p>
//                     </div>

//                     <div className="flex justify-center gap-4 mb-8">
//                         <button 
//                             onClick={() => setViewMode('create')}
//                             className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${viewMode === 'create' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-gray-900 text-gray-500 border border-gray-700 hover:border-red-900 hover:text-red-400'}`}
//                         >
//                             CREATE NEW
//                         </button>
//                         <button 
//                             onClick={() => setViewMode('join')}
//                             className={`px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 ${viewMode === 'join' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-gray-900 text-gray-500 border border-gray-700 hover:border-red-900 hover:text-red-400'}`}
//                         >
//                             JOIN EXISTING
//                         </button>
//                     </div>

//                     {viewMode === 'create' && (
//                         <form onSubmit={handleCreateTeam} className="space-y-6 animate-fade-in">
//                             <div>
//                                 <label className="block text-gray-300 text-sm font-bold mb-2">Team Name</label>
//                                 <input 
//                                     type="text" 
//                                     required
//                                     className="w-full bg-gray-900/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all placeholder-gray-600"
//                                     placeholder="e.g. The Hellfire Club"
//                                     value={createForm.name}
//                                     onChange={(e) => setCreateForm({...createForm, name: e.target.value})}
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-gray-300 text-sm font-bold mb-2">GitHub Repository (Optional)</label>
//                                 <input 
//                                     type="url" 
//                                     className="w-full bg-gray-900/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all placeholder-gray-600"
//                                     placeholder="https://github.com/username/project"
//                                     value={createForm.repoLink}
//                                     onChange={(e) => setCreateForm({...createForm, repoLink: e.target.value})}
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-gray-300 text-sm font-bold mb-2">Description</label>
//                                 <textarea 
//                                     className="w-full bg-gray-900/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none h-32 resize-none placeholder-gray-600"
//                                     placeholder="Our mission is..."
//                                     value={createForm.description}
//                                     onChange={(e) => setCreateForm({...createForm, description: e.target.value})}
//                                 />
//                             </div>
//                             <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all glow-button uppercase tracking-widest">
//                                 Create Team
//                             </button>
//                         </form>
//                     )}

//                     {viewMode === 'join' && (
//                         <form onSubmit={handleJoinTeam} className="space-y-6 animate-fade-in">
//                             <div className="py-8">
//                                 <label className="block text-gray-300 text-sm font-bold mb-2">Enter Exact Team Name</label>
//                                 <input 
//                                     type="text" 
//                                     required
//                                     className="w-full bg-gray-900/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all placeholder-gray-600"
//                                     placeholder="e.g. The Hellfire Club"
//                                     value={joinName}
//                                     onChange={(e) => setJoinName(e.target.value)}
//                                 />
//                                 <p className="text-xs text-gray-500 mt-2">Ask your team leader for the exact name.</p>
//                             </div>
//                             <button className="w-full bg-transparent border border-red-600 text-red-500 hover:bg-red-900/20 font-bold py-3 rounded-lg transition-all uppercase tracking-widest">
//                                 Search & Join
//                             </button>
//                         </form>
//                     )}
//                 </div>
//             </div>
//         );
//     }

//     // HAS TEAM VIEW - DASHBOARD
//     return (
//         <div className="space-y-8 animate-fade-in w-full">
            
//             {/* Invitation Modal */}
//             <InvitationModal 
//                 isOpen={invitationModalOpen}
//                 onClose={() => setInvitationModalOpen(false)}
//                 onSuccess={handleInvitationSuccess}
//             />

//             {/* Top Section: Team Info & Members */}
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-10">
                
//                 {/* Team Identity Card */}
//                 <div className="lg:col-span-2 p-6 bg-black/60 border border-red-900/30 rounded-xl glow-box relative overflow-hidden group transition-all duration-300 ease-in-out">
//                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
//                         <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor" className="text-red-600">
//                             <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2-5-2 5zm0 0l-2-5 2 5zm0 0L2 17l10 5 10-5-10-5z"></path>
//                         </svg>
//                     </div>
                    
//                     <div className="relative z-10">
//                         <label className="text-xs text-red-500 uppercase tracking-widest font-bold mb-2 block">Team Name</label>
//                         <div className="flex items-center justify-between mb-6">
//                             <h2 className="text-4xl font-bold text-white glow-text font-creepster tracking-wider break-words">
//                                 {teamData.name}
//                             </h2>
//                             <button 
//                                 onClick={toggleEditMode}
//                                 className="text-xs border border-red-900/50 text-red-400 px-3 py-1 rounded hover:bg-red-900/20 transition-colors shrink-0 ml-4"
//                             >
//                                 {editMode ? 'Cancel' : 'Edit Details'}
//                             </button>
//                         </div>

//                         <label className="text-xs text-red-500 uppercase tracking-widest font-bold mb-2 block">GitHub Repository</label>
//                         <div className="flex gap-2">
//                             <div className="flex-1 bg-gray-900/80 border border-red-900/30 rounded-lg flex items-center px-4 py-3 text-gray-300 font-mono text-sm overflow-hidden transition-all duration-300">
//                                 <svg className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
//                                 {editMode ? (
//                                     <input 
//                                         type="text" 
//                                         className="bg-transparent border-none w-full text-white focus:outline-none"
//                                         value={formData.repoLink}
//                                         placeholder="https://github.com/..."
//                                         onChange={(e) => setFormData({...formData, repoLink: e.target.value})}
//                                     />
//                                 ) : (
//                                     <span className="truncate">{teamData.repoLink || "No repo linked"}</span>
//                                 )}
//                             </div>
//                             {teamData.repoLink && !editMode && (
//                                 <a 
//                                     href={teamData.repoLink}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors font-bold flex items-center justify-center whitespace-nowrap"
//                                 >
//                                     Link
//                                 </a>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* Party Members List */}
//                 <div className="p-6 bg-black/60 border border-red-900/30 rounded-xl glow-box">
//                     <div className="flex items-center justify-between mb-4 sticky top-0 bg-black/90 pb-2 z-10 backdrop-blur-sm">
//                         <label className="text-xs text-red-500 uppercase tracking-widest font-bold">
//                             Party Members ({teamData.members?.length || 0})
//                         </label>
//                         {isTeamLeader() && (
//                             <button
//                                 onClick={() => setInvitationModalOpen(true)}
//                                 className="text-xs bg-red-600/20 hover:bg-red-600/40 text-red-400 px-3 py-1 rounded border border-red-600/50 transition-all flex items-center gap-1"
//                                 title="Invite Team Member"
//                             >
//                                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                                 </svg>
//                                 Invite
//                             </button>
//                         )}
//                     </div>

//                     {/* Members Grid */}
//                     <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
//                         {teamData.members && teamData.members.length > 0 ? (
//                             teamData.members.map((member, idx) => (
//                                 <div
//                                     key={idx}
//                                     className="bg-gray-900/50 border border-red-900/20 rounded-lg p-4 hover:border-red-500/50 transition-all group"
//                                 >
//                                     <div className="flex items-center gap-3">
//                                         <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center text-red-500 font-bold text-lg border-2 border-red-900/50 group-hover:border-red-500/50 transition-all">
//                                             {member.user?.name?.charAt(0).toUpperCase() || '?'}
//                                         </div>

//                                         <div className="flex-1">
//                                             <div className="flex items-center gap-2">
//                                                 <h4 className="text-white font-bold">
//                                                     {member.user?.name || 'Unknown'}
//                                                 </h4>
//                                                 {member.role === 'Team Lead' && (
//                                                     <span className="text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded border border-red-600/30">
//                                                         Leader
//                                                     </span>
//                                                 )}
//                                             </div>
//                                             <p className="text-gray-400 text-sm">
//                                                 {member.user?.email || 'No email'}
//                                             </p>
//                                         </div>

//                                         <div className="flex items-center gap-2">
//                                             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                                             <span className="text-xs text-gray-500">Active</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))
//                         ) : (
//                             <div className="text-center py-8 text-gray-600">
//                                 No members yet. Invite someone to join!
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* ✅ NEW: Team Approval Status Card */}
//             <div className="bg-gradient-to-br from-purple-900/20 to-red-900/20 border-2 border-purple-500/30 rounded-xl p-6 relative overflow-hidden">
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>
                
//                 <div className="relative z-10">
//                     <div className="flex items-center justify-between mb-4">
//                         <div className="flex items-center gap-3">
//                             <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center border-2 border-purple-500/30">
//                                 <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                 </svg>
//                             </div>
//                             <div>
//                                 <h3 className="text-lg font-bold text-purple-400 uppercase tracking-wide">
//                                     Admin Approval
//                                 </h3>
//                                 <p className="text-gray-400 text-sm">
//                                     Team size: {teamData.members?.length || 0} / 3 members
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Status Badge */}
//                         <div className={`px-4 py-2 rounded-full border-2 font-bold text-sm uppercase tracking-wider ${
//                             approvalStatus === 'approved' 
//                                 ? 'bg-green-900/20 border-green-500/50 text-green-400'
//                                 : approvalStatus === 'pending'
//                                 ? 'bg-yellow-900/20 border-yellow-500/50 text-yellow-400'
//                                 : approvalStatus === 'rejected'
//                                 ? 'bg-red-900/20 border-red-500/50 text-red-400'
//                                 : 'bg-gray-900/20 border-gray-500/50 text-gray-400'
//                         }`}>
//                             {approvalStatus === 'approved' && '✓ Approved'}
//                             {approvalStatus === 'pending' && '⏳ Pending'}
//                             {approvalStatus === 'rejected' && '✗ Rejected'}
//                             {approvalStatus === 'not_submitted' && '○ Not Submitted'}
//                         </div>
//                     </div>

//                     {/* Status Messages */}
//                     {approvalStatus === 'not_submitted' && isTeamLeader() && (
//                         <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-4 mb-4">
//                             <div className="flex items-start gap-3">
//                                 <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                 </svg>
//                                 <div className="flex-1">
//                                     <p className="text-gray-300 text-sm mb-2">
//                                         Your team is ready! Submit for admin approval to participate in the hackathon.
//                                     </p>
//                                     <ul className="text-xs text-gray-400 space-y-1 mb-3">
//                                         <li className={teamData.members?.length >= 2 ? 'text-green-400' : 'text-red-400'}>
//                                             {teamData.members?.length >= 2 ? '✓' : '✗'} Minimum 2 members required
//                                         </li>
//                                         <li className={teamData.members?.length <= 3 ? 'text-green-400' : 'text-red-400'}>
//                                             {teamData.members?.length <= 3 ? '✓' : '✗'} Maximum 3 members allowed
//                                         </li>
//                                     </ul>
//                                     <button
//                                         onClick={handleRequestApproval}
//                                         disabled={submittingApproval || teamData.members?.length < 2 || teamData.members?.length > 3}
//                                         className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
//                                     >
//                                         {submittingApproval ? (
//                                             <>
//                                                 <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                                                 Submitting...
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//                                                 </svg>
//                                                 Submit for Approval
//                                             </>
//                                         )}
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {approvalStatus === 'pending' && (
//                         <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-lg p-4">
//                             <div className="flex items-start gap-3">
//                                 <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
//                                 <div>
//                                     <p className="text-yellow-300 font-semibold mb-1">Review in Progress</p>
//                                     <p className="text-gray-400 text-sm">
//                                         Your team approval request is under admin review. You'll receive an email notification once it's processed.
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {approvalStatus === 'approved' && (
//                         <div className="bg-green-900/10 border border-green-500/20 rounded-lg p-4">
//                             <div className="flex items-start gap-3">
//                                 <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
//                                     <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                     </svg>
//                                 </div>
//                                 <div>
//                                     <p className="text-green-300 font-semibold mb-1">🎉 Team Approved!</p>
//                                     <p className="text-gray-400 text-sm">
//                                         Congratulations! Your team has been approved by the admin. You're all set for the hackathon!
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {approvalStatus === 'rejected' && (
//                         <div className="bg-red-900/10 border border-red-500/20 rounded-lg p-4">
//                             <div className="flex items-start gap-3">
//                                 <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                 </svg>
//                                 <div>
//                                     <p className="text-red-300 font-semibold mb-1">Request Rejected</p>
//                                     <p className="text-gray-400 text-sm">
//                                         Your approval request was not accepted. Please contact the admin for more information.
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Project Media / Evidence */}
//             <div className="bg-black/60 border border-red-900/30 rounded-xl p-6 glow-box transition-all duration-300 ease-in-out">
//                 <div className="flex justify-between items-center mb-6">
//                     <label className="text-xs text-red-500 uppercase tracking-widest font-bold">Project Media / Evidence</label>
                    
//                     <input 
//                         type="file" 
//                         id="mediaUpload" 
//                         accept="image/*" 
//                         className="hidden" 
//                         onChange={handleImageUpload} 
//                         disabled={uploading}
//                     />

//                     <button 
//                         onClick={() => document.getElementById('mediaUpload').click()}
//                         disabled={uploading}
//                         className="text-xs bg-red-900/20 text-red-400 px-3 py-1 rounded border border-red-900/50 hover:bg-red-900/40 transition-all flex items-center gap-2 disabled:opacity-50"
//                     >
//                         {uploading ? (
//                             <>
//                                 <span className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
//                                 Uploading...
//                             </>
//                         ) : (
//                             'Upload Media'
//                         )}
//                     </button>
//                 </div>
                
//                 <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
//                     {teamData.mediaLinks && teamData.mediaLinks.length > 0 ? (
//                         teamData.mediaLinks.map((link, idx) => (
//                             <div key={idx} className="aspect-video bg-gray-900/50 rounded-lg border border-gray-800 hover:border-red-500/50 relative group overflow-hidden cursor-pointer transition-all duration-300">
//                                 <img 
//                                     src={link} 
//                                     alt="Project Screenshot" 
//                                     className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
//                                 />
//                                 <a href={link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
//                                     <span className="text-xs text-white font-bold">View Full</span>
//                                 </a>
//                             </div>
//                         ))
//                     ) : (
//                         <div className="col-span-full py-8 text-center border-2 border-dashed border-gray-800 rounded-xl text-gray-600 text-sm italic">
//                             No evidence uploaded yet.
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Bottom Section: AI-Powered Project Description */}
//             <div className="bg-black/60 border border-red-900/30 rounded-xl p-6 glow-box transition-all duration-300 ease-in-out">
//                 <div className="flex justify-between items-center mb-4">
//                     <label className="text-xs text-red-500 uppercase tracking-widest font-bold">
//                         Project Log / Description
//                     </label>
//                     <div className="flex items-center gap-2">
//                         <span className="text-xs text-gray-600">✨ AI Powered</span>
//                         {editMode && (
//                             <span className="text-xs text-gray-600">• Markdown Supported</span>
//                         )}
//                     </div>
//                 </div>

//                 {/* AI Generation Controls - Only show in edit mode */}
//                 {editMode && (
//                     <div className="bg-gradient-to-r from-purple-900/20 to-red-900/20 border border-purple-500/30 rounded-lg p-4 mb-4">
//                         <div className="flex items-center gap-2 mb-3">
//                             <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                             </svg>
//                             <h4 className="text-sm font-bold text-purple-400 uppercase tracking-wide">AI Description Generator</h4>
//                         </div>

//                         <div className="space-y-3">
//                             {/* Project Title Input */}
//                             <div>
//                                 <label className="block text-gray-400 text-xs mb-1">Project Title/Topic</label>
//                                 <input
//                                     type="text"
//                                     value={projectTitle}
//                                     onChange={(e) => setProjectTitle(e.target.value)}
//                                     placeholder="e.g., E-commerce Platform with Real-time Inventory"
//                                     className="w-full bg-gray-900/50 border border-purple-900/30 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all placeholder-gray-600"
//                                 />
//                             </div>

//                             {/* Length Selection */}
//                             <div className="flex items-center gap-4">
//                                 <label className="text-gray-400 text-xs">Length:</label>
//                                 <div className="flex gap-2">
//                                     <button
//                                         type="button"
//                                         onClick={() => setDescriptionLength('short')}
//                                         className={`px-3 py-1 rounded text-xs font-bold transition-all ${
//                                             descriptionLength === 'short'
//                                                 ? 'bg-purple-600 text-white'
//                                                 : 'bg-gray-800 text-gray-400 hover:text-purple-400'
//                                         }`}
//                                     >
//                                         Short (100 words)
//                                     </button>
//                                     <button
//                                         type="button"
//                                         onClick={() => setDescriptionLength('long')}
//                                         className={`px-3 py-1 rounded text-xs font-bold transition-all ${
//                                             descriptionLength === 'long'
//                                                 ? 'bg-purple-600 text-white'
//                                                 : 'bg-gray-800 text-gray-400 hover:text-purple-400'
//                                         }`}
//                                     >
//                                         Long (Detailed)
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Generate Button */}
//                             <button
//                                 type="button"
//                                 onClick={handleGenerateDescription}
//                                 disabled={generating || !projectTitle.trim()}
//                                 className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
//                             >
//                                 {generating ? (
//                                     <>
//                                         <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//                                         Generating...
//                                     </>
//                                 ) : (
//                                     <>
//                                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                                         </svg>
//                                         Generate AI Description
//                                     </>
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 )}

//                 {/* Description Text Area/Display */}
//                 <div className="relative group">
//                     <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-black rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
//                     {editMode ? (
//                         <textarea 
//                             className="relative w-full h-40 xl:h-64 bg-gray-900/80 border border-gray-800 rounded-lg p-4 text-gray-300 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-900 transition-all font-mono text-sm resize-none"
//                             placeholder="Describe your project, paste updates, or log anomalies here... Or use AI to generate it!"
//                             value={formData.description}
//                             onChange={(e) => setFormData({...formData, description: e.target.value})}
//                         ></textarea>
//                     ) : (
//                         <div className="relative w-full h-40 xl:h-64 bg-gray-900/40 border border-gray-800/50 rounded-lg p-4 text-gray-300 font-mono text-sm overflow-y-auto whitespace-pre-wrap">
//                             {teamData.description || "No log entries found in the archives."}
//                         </div>
//                     )}
//                 </div>
                
//                 {editMode && (
//                     <div className="flex justify-end mt-4">
//                         <button 
//                             onClick={handleUpdate}
//                             className="bg-red-600/10 border border-red-600/50 text-red-500 hover:bg-red-600 hover:text-white px-6 py-2 rounded transition-all text-sm font-bold uppercase tracking-wider glow-button"
//                         >
//                             Save Log
//                         </button>
//                     </div>
//                 )}
//             </div>

//         </div>
//     );
// };

// export default TeamManagement;



import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InvitationModal from './InvitationModal';

const TeamManagement = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [teamData, setTeamData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [viewMode, setViewMode] = useState('create');
    const [uploading, setUploading] = useState(false);
    const [invitationModalOpen, setInvitationModalOpen] = useState(false);

    // AI Generation States
    const [projectTitle, setProjectTitle] = useState('');
    const [descriptionLength, setDescriptionLength] = useState('long');
    const [generating, setGenerating] = useState(false);

    // Form States
    const [joinName, setJoinName] = useState('');
    const [createForm, setCreateForm] = useState({ name: '', repoLink: '', description: '' });
    const [formData, setFormData] = useState({ repoLink: '', description: '' });

    // Approval States
    const [approvalStatus, setApprovalStatus] = useState('not_submitted');
    const [submittingApproval, setSubmittingApproval] = useState(false);

    // FIX: Consistent API URL Construction
    const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'; 
    const TEAM_API_URL = `${BASE_API_URL}/team`;
    
    const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; 
    const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET; 

    const isTeamLeader = () => {
        if (!teamData || !teamData.members) return false;
        const currentUserMember = teamData.members.find(
            m => m.user?._id === teamData.currentUserId || m.role === 'Team Lead'
        );
        return currentUserMember?.role === 'Team Lead';
    };

    const handleInvitationSuccess = () => {
        fetchTeam();
    };

    // Fetch Approval Status
    const fetchApprovalStatus = async () => {
        try {
            // FIX: Using the correct TEAM_API_URL
            const { data } = await axios.get(`${TEAM_API_URL}/approval-status`, { withCredentials: true });
            if (data.success) {
                setApprovalStatus(data.approval.status);
            }
        } catch (err) {
            console.error('Failed to fetch approval status:', err);
        }
    };

    // Fetch Team Data
    const fetchTeam = async () => {
        try {
            setLoading(true);
            // FIX: Using the correct TEAM_API_URL - Resolves the 404 in the console
            const { data } = await axios.get(`${TEAM_API_URL}/me`, { withCredentials: true });
            
            if (data.success && data.team) {
                setTeamData(data.team);
                setFormData({
                    repoLink: data.team.repoLink || '',
                    description: data.team.description || ''
                });
                setProjectTitle(data.team.name || ''); 
                setApprovalStatus(data.team.approvalStatus || 'not_submitted');
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
        fetchApprovalStatus();
    }, []);

    // Handle Approval Request
    const handleRequestApproval = async () => {
        if (!teamData || teamData.members.length < 2) {
            alert('Your team must have at least 2 members to request approval.');
            return;
        }

        if (teamData.members.length > 3) {
            alert('Your team cannot have more than 3 members.');
            return;
        }

        if (!window.confirm(
            `Submit "${teamData.name}" for admin approval?\n\n` +
            `Team Size: ${teamData.members.length} members\n` +
            `This action will notify the admin for review.`
        )) {
            return;
        }

        setSubmittingApproval(true);

        try {
            // FIX: Using the correct TEAM_API_URL
            const { data } = await axios.post(
                `${TEAM_API_URL}/request-approval`,
                {},
                { withCredentials: true }
            );

            if (data.success) {
                alert('✅ Approval request submitted successfully!\n\nThe admin will review your team and notify you via email.');
                setApprovalStatus('pending');
                fetchApprovalStatus();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit approval request.');
        } finally {
            setSubmittingApproval(false);
        }
    };

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
            // FIX: Using the correct TEAM_API_URL
            const { data } = await axios.post(`${TEAM_API_URL}/create`, createForm, { withCredentials: true });
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
            // FIX: Using the correct TEAM_API_URL
            const { data } = await axios.put(`${TEAM_API_URL}/join`, { teamName: joinName }, { withCredentials: true });
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
            // FIX: Using the correct TEAM_API_URL
            const { data } = await axios.put(`${TEAM_API_URL}/update`, formData, { withCredentials: true }); 
            if (data.success) {
                setTeamData(data.team);
                setEditMode(false);
                alert("Team details updated!");
            }
        } catch (err) {
            console.error("Frontend Update Error:", err.response?.data?.message || err.message);
            alert(err.response?.data?.message || "Failed to update details.");
        }
    };

    const handleGenerateDescription = async () => {
        if (!projectTitle.trim()) {
            alert('Please enter a project title first!');
            return;
        }

        setGenerating(true);
        
        console.log("Generating description for:", projectTitle, "Length:", descriptionLength);

        try {
            // FIX: Using the correct TEAM_API_URL
            const { data } = await axios.post(
                `${TEAM_API_URL}/generate-description`,
                { 
                    prompt: projectTitle,
                    length: descriptionLength 
                },
                { withCredentials: true }
            );

            if (data.success) {
                const generatedContent = data.content;
                
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
                
                alert('Description generated successfully! Click "Save Log" to finalize.');
            } else {
                alert(data.message || 'Failed to generate description.');
            }
            
        } catch (err) {
            console.error('Generation error:', err);
            setGenerating(false); 
            alert(err.response?.data?.message || 'Failed to generate description.');
        } finally {
            setGenerating(false); 
        }
    };

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
            // FIX: Using the correct TEAM_API_URL
            const { data } = await axios.put(`${TEAM_API_URL}/update`, { mediaLink: imageUrl }, { withCredentials: true });

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

    // NO TEAM VIEW
    if (!teamData) {
        return (
            <div className="max-w-3xl mx-auto mt-10">
                <div className="bg-black/60 border border-red-900/50 rounded-xl p-8 glow-box backdrop-blur-sm transition-all duration-500">
                    
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-red-500 glow-text font-creepster tracking-wider mb-2">
                            {viewMode === 'create' ? 'Assemble Your Party' : 'Join a Party'}
                        </h2>
                        <p className="text-gray-400">You are currently not in a team.</p>
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
                                    className="w-full bg-gray-900/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:outline-none h-32 resize-none placeholder-gray-600"
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
                                    className="w-full bg-gray-900/50 border border-red-900/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-red-500 transition-all placeholder-gray-600"
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

    // HAS TEAM VIEW - DASHBOARD
    return (
        <div className="space-y-8 animate-fade-in w-full">
            
            {/* Invitation Modal */}
            <InvitationModal 
                isOpen={invitationModalOpen}
                onClose={() => setInvitationModalOpen(false)}
                onSuccess={handleInvitationSuccess}
            />

            {/* Top Section: Team Info & Members */}
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

                            
                            <div className="flex items-center gap-3">
                                {/* Existing Edit Button */}
                                <button 
                                    onClick={toggleEditMode}
                                    className="text-xs border border-red-900/50 text-red-400 px-3 py-1 rounded hover:bg-red-900/20 transition-colors shrink-0"
                                >
                                    {editMode ? 'Cancel' : 'Edit Details'}
                                </button>

                                {/* NEW BUTTON: Talk with Mentor */}
                                <button 
                                    onClick={() => navigate('/qna')}
                                    className="text-xs bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded transition-colors shrink-0 flex items-center gap-2 shadow-[0_0_10px_rgba(220,38,38,0.4)]"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                    </svg>
                                    Talk with Mentor
                                </button>
                            </div>
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

                {/* Party Members List */}
                <div className="p-6 bg-black/60 border border-red-900/30 rounded-xl glow-box">
                    <div className="flex items-center justify-between mb-4 sticky top-0 bg-black/90 pb-2 z-10 backdrop-blur-sm">
                        <label className="text-xs text-red-500 uppercase tracking-widest font-bold">
                            Party Members ({teamData.members?.length || 0})
                        </label>
                        {isTeamLeader() && (
                            <button
                                onClick={() => setInvitationModalOpen(true)}
                                className="text-xs bg-red-600/20 hover:bg-red-600/40 text-red-400 px-3 py-1 rounded border border-red-600/50 transition-all flex items-center gap-1"
                                title="Invite Team Member"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Invite
                            </button>
                        )}
                    </div>

                    {/* Members Grid */}
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {teamData.members && teamData.members.length > 0 ? (
                            teamData.members.map((member, idx) => (
                                <div
                                    key={idx}
                                    className="bg-gray-900/50 border border-red-900/20 rounded-lg p-4 hover:border-red-500/50 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-red-900/30 flex items-center justify-center text-red-500 font-bold text-lg border-2 border-red-900/50 group-hover:border-red-500/50 transition-all">
                                            {member.user?.name?.charAt(0).toUpperCase() || '?'}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-white font-bold">
                                                    {member.user?.name || 'Unknown'}
                                                </h4>
                                                {member.role === 'Team Lead' && (
                                                    <span className="text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded border border-red-600/30">
                                                        Leader
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                                {member.user?.email || 'No email'}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            <span className="text-xs text-gray-500">Active</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-600">
                                No members yet. Invite someone to join!
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Team Approval Status Card */}
            <div className="bg-gradient-to-br from-purple-900/20 to-red-900/20 border-2 border-purple-500/30 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center border-2 border-purple-500/30">
                                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-purple-400 uppercase tracking-wide">
                                    Admin Approval
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    Team size: {teamData.members?.length || 0} / 3 members
                                </p>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className={`px-4 py-2 rounded-full border-2 font-bold text-sm uppercase tracking-wider ${
                            approvalStatus === 'approved' 
                                ? 'bg-green-900/20 border-green-500/50 text-green-400'
                                : approvalStatus === 'pending'
                                ? 'bg-yellow-900/20 border-yellow-500/50 text-yellow-400'
                                : approvalStatus === 'rejected'
                                ? 'bg-red-900/20 border-red-500/50 text-red-400'
                                : 'bg-gray-900/20 border-gray-500/50 text-gray-400'
                        }`}>
                            {approvalStatus === 'approved' && '✓ Approved'}
                            {approvalStatus === 'pending' && '⏳ Pending'}
                            {approvalStatus === 'rejected' && '✗ Rejected'}
                            {approvalStatus === 'not_submitted' && '○ Not Submitted'}
                        </div>
                    </div>

                    {/* Status Messages */}
                    {approvalStatus === 'not_submitted' && isTeamLeader() && (
                        <div className="bg-purple-900/10 border border-purple-500/20 rounded-lg p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="flex-1">
                                    <p className="text-gray-300 text-sm mb-2">
                                        Your team is ready! Submit for admin approval to participate in the hackathon.
                                    </p>
                                    <ul className="text-xs text-gray-400 space-y-1 mb-3">
                                        <li className={teamData.members?.length >= 2 ? 'text-green-400' : 'text-red-400'}>
                                            {teamData.members?.length >= 2 ? '✓' : '✗'} Minimum 2 members required
                                        </li>
                                        <li className={teamData.members?.length <= 3 ? 'text-green-400' : 'text-red-400'}>
                                            {teamData.members?.length <= 3 ? '✓' : '✗'} Maximum 3 members allowed
                                        </li>
                                    </ul>
                                    <button
                                        onClick={handleRequestApproval}
                                        disabled={submittingApproval || teamData.members?.length < 2 || teamData.members?.length > 3}
                                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
                                    >
                                        {submittingApproval ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                                Submit for Approval
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {approvalStatus === 'pending' && (
                        <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                                <div>
                                    <p className="text-yellow-300 font-semibold mb-1">Review in Progress</p>
                                    <p className="text-gray-400 text-sm">
                                        Your team approval request is under admin review. You'll receive an email notification once it's processed.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {approvalStatus === 'approved' && (
                        <div className="bg-green-900/10 border border-green-500/20 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-green-300 font-semibold mb-1">🎉 Team Approved!</p>
                                    <p className="text-gray-400 text-sm">
                                        Congratulations! Your team has been approved by the admin. You're all set for the hackathon!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {approvalStatus === 'rejected' && (
                        <div className="bg-red-900/10 border border-red-500/20 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="text-red-300 font-semibold mb-1">Request Rejected</p>
                                    <p className="text-gray-400 text-sm">
                                        Your approval request was not accepted. Please contact the admin for more information.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Project Media / Evidence */}
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