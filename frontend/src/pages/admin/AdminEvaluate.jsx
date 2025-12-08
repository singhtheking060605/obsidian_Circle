import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle, FileText, Github, ExternalLink, Calculator, Save } from 'lucide-react';

const AdminEvaluate = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rubric, setRubric] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Evaluation State
  const [scores, setScores] = useState({});
  const [feedback, setFeedback] = useState('');
  const [totalScore, setTotalScore] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  // 1. Fetch Submissions (Assigned/Submitted Tasks)
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/task/assignments/all`, { withCredentials: true });
      if (data.success) {
        // Filter for items that are ready for review or already graded
        const reviewable = data.assignments.filter(a => 
          ['Submitted', 'In Progress', 'Graded'].includes(a.status)
        );
        setSubmissions(reviewable);
      }
    } catch (error) {
      console.error("Failed to fetch intel:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // 2. Fetch Full Task & Rubric Details when a submission is selected
  const handleSelectSubmission = async (item) => {
    setSelectedItem(item);
    setScores({});
    setFeedback(item.feedback || '');
    setTotalScore(item.score || 0);
    
    try {
      // We need the full task details to get the Rubric ID/Data
      const { data } = await axios.get(`${API_URL}/task/${item.task._id}`, { withCredentials: true });
      
      if (data.success && data.task.rubric) {
        setRubric(data.task.rubric);
        
        // Initialize scores if this is a fresh grading
        if (item.status !== 'Graded') {
            const initialScores = {};
            data.task.rubric.criteria.forEach(c => initialScores[c.criterionName] = 0);
            setScores(initialScores);
        }
      } else {
        setRubric(null);
      }
    } catch (error) {
      console.error("Failed to retrieve mission protocols (rubric):", error);
    }
  };

  // 3. Handle Grading Logic
  const handleScoreChange = (criterionName, value, max) => {
    const safeValue = Math.min(Math.max(0, Number(value)), max);
    const newScores = { ...scores, [criterionName]: safeValue };
    setScores(newScores);
    
    // Auto-calculate total
    const total = Object.values(newScores).reduce((acc, curr) => acc + curr, 0);
    setTotalScore(total);
  };

  // 4. Submit Evaluation
  const submitEvaluation = async () => {
    if (!selectedItem) return;

    try {
      const payload = {
        score: totalScore,
        feedback: feedback,
        status: 'Graded'
      };

      const { data } = await axios.put(
        `${API_URL}/task/evaluate/${selectedItem._id}`, // Requires new backend route
        payload, 
        { withCredentials: true }
      );

      if (data.success) {
        alert("Mission Report Updated Successfully");
        fetchSubmissions(); // Refresh list
        setSelectedItem(null);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Evaluation upload failed");
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen text-gray-200 font-sans animate-fade-in">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8 border-b border-red-900/30 pb-4">
        <div>
          <h1 className="text-4xl font-creepster text-red-600 tracking-wider glow-text">
            Evaluation Protocol
          </h1>
          <p className="text-gray-400 mt-2 text-sm font-mono">
            Review field agent submissions and authorize grade clearance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Submission List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-red-500 font-bold uppercase tracking-widest text-xs border-b border-gray-800 pb-2">
            Incoming Intel ({submissions.length})
          </h3>
          
          <div className="space-y-3 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {submissions.map((item) => (
              <div 
                key={item._id}
                onClick={() => handleSelectSubmission(item)}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                  selectedItem?._id === item._id 
                    ? 'bg-red-900/20 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]' 
                    : 'bg-gray-900/40 border-gray-800 hover:border-red-900'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-white text-lg">{item.team?.name}</span>
                  <span className={`text-[10px] px-2 py-1 rounded border uppercase font-bold ${
                    item.status === 'Graded' ? 'border-green-500 text-green-500' : 'border-yellow-500 text-yellow-500'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-1">{item.task?.title}</p>
                <p className="text-xs text-gray-600 font-mono">
                  Updated: {new Date(item.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Evaluation Form */}
        <div className="lg:col-span-2">
          {selectedItem ? (
            <div className="bg-gray-900/50 border border-red-900/30 rounded-xl p-6 backdrop-blur-sm relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <FileText size={120} className="text-red-500" />
              </div>

              {/* Submission Details */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  {selectedItem.task?.title}
                  {selectedItem.submissionLink && (
                    <a 
                      href={selectedItem.submissionLink} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center gap-1 transition-colors"
                    >
                      <Github size={12} /> View Code
                    </a>
                  )}
                </h2>
                
                <div className="grid grid-cols-2 gap-4 text-sm bg-black/40 p-4 rounded-lg border border-gray-800">
                  <div>
                    <span className="text-gray-500 block">Squad Leader</span>
                    <span className="text-gray-300">{selectedItem.team?.leader?.name || 'Unknown'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Repository</span>
                    <a href={selectedItem.team?.repoLink} className="text-red-400 hover:underline truncate block">
                      {selectedItem.team?.repoLink || 'No Repo Linked'}
                    </a>
                  </div>
                </div>
              </div>

              {/* Rubric Evaluator */}
              {rubric ? (
                <div className="mb-8 animate-fade-in">
                  <h3 className="text-red-500 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                    <Calculator size={14} /> Grading Rubric: {rubric.title}
                  </h3>
                  
                  <div className="space-y-4">
                    {rubric.criteria.map((criterion, idx) => (
                      <div key={idx} className="bg-black/20 p-4 rounded border border-gray-800 flex justify-between items-center group hover:border-red-900/50 transition-colors">
                        <div className="flex-1">
                          <p className="text-white font-medium">{criterion.criterionName}</p>
                          <div className="w-full bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-red-600 h-full transition-all duration-300" 
                              style={{ width: `${((scores[criterion.criterionName] || 0) / criterion.maxScore) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="ml-6 flex items-center gap-2">
                          <input 
                            type="number"
                            min="0"
                            max={criterion.maxScore}
                            value={scores[criterion.criterionName] || 0}
                            onChange={(e) => handleScoreChange(criterion.criterionName, e.target.value, criterion.maxScore)}
                            className="w-16 bg-black border border-gray-700 rounded p-2 text-center text-white focus:border-red-500 outline-none"
                          />
                          <span className="text-gray-500 font-mono text-sm">/ {criterion.maxScore}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-end items-center gap-4 border-t border-gray-800 pt-4">
                    <span className="text-gray-400 uppercase text-xs tracking-widest">Total Score</span>
                    <span className="text-4xl font-creepster text-red-500">{totalScore}</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-yellow-900/20 border border-yellow-700/50 rounded mb-6 text-yellow-200 text-sm flex items-center gap-2">
                   <AlertCircle size={16} /> No grading rubric attached to this mission. Manual scoring enabled.
                </div>
              )}

              {/* Feedback Section */}
              <div className="mb-8">
                <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">
                  Mentor Feedback
                </h3>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter detailed feedback for the squad..."
                  className="w-full bg-black/40 border border-gray-700 rounded-lg p-4 text-gray-300 min-h-[150px] focus:border-red-500 outline-none transition-colors"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4">
                 <button 
                   onClick={submitEvaluation}
                   className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)]"
                 >
                   <Save size={18} /> Submit Evaluation
                 </button>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-gray-800 rounded-xl bg-gray-900/20 min-h-[400px]">
              <AlertCircle size={48} className="mb-4 opacity-50" />
              <p className="uppercase tracking-widest">Select a submission to begin protocol</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminEvaluate;