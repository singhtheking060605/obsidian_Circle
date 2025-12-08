import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

const StudentMissions = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMission, setSelectedMission] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Modal form state
  const [teamName, setTeamName] = useState('');
  const [githubRepository, setGithubRepository] = useState('');
  const [teamMembers, setTeamMembers] = useState([
    { name: '', rollNumber: '', branch: '', githubId: '', role: 'Leader' },
    { name: '', rollNumber: '', branch: '', githubId: '', role: 'Member' }
  ]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/missions/active', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load missions (${response.status})`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      let missionData = data.missions || data.data?.missions || [];
      console.log('Extracted missions:', missionData);
      setMissions(missionData);
    } catch (err) {
      console.error('Error fetching missions:', err);
      setError(err.message || 'Failed to load missions');
    } finally {
      setLoading(false);
    }
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  const addMember = () => {
    if (teamMembers.length < 3) {
      setTeamMembers([...teamMembers, { 
        name: '', rollNumber: '', branch: '', githubId: '', role: 'Member' 
      }]);
    }
  };

  const removeMember = (index) => {
    if (teamMembers.length > 2) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index));
    }
  };

  const handleAcceptMission = (mission) => {
    setSelectedMission(mission);
    setShowModal(true);
    setTeamName('');
    setGithubRepository('');
    setTeamMembers([
      { name: '', rollNumber: '', branch: '', githubId: '', role: 'Leader' },
      { name: '', rollNumber: '', branch: '', githubId: '', role: 'Member' }
    ]);
  };

  const handleSubmitAcceptance = async () => {
    if (!teamName.trim()) {
      alert('Team name is required');
      return;
    }

    if (teamMembers.length < 2 || teamMembers.length > 3) {
      alert('Team must have 2-3 members');
      return;
    }

    for (let i = 0; i < teamMembers.length; i++) {
      const member = teamMembers[i];
      if (!member.name || !member.rollNumber || !member.branch || !member.githubId) {
        alert(`Team member ${i + 1} is missing required information`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/missions/${selectedMission._id}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          teamName,
          githubRepository,
          teamMembers
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to accept mission');
      }

      alert('Mission accepted! Awaiting admin approval.');
      setShowModal(false);
      fetchMissions();
    } catch (err) {
      alert(err.message || 'Error accepting mission');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (mission) => {
    if (!mission.acceptanceStatus) {
      return <span style={styles.statusActive}>● Active</span>;
    }
    
    const { adminApproval } = mission.acceptanceStatus;
    
    if (adminApproval === 'pending') {
      return <span style={styles.statusPending}>○ NOT SUBMITTED</span>;
    } else if (adminApproval === 'approved') {
      return <span style={styles.statusApproved}>● Approved</span>;
    } else if (adminApproval === 'rejected') {
      return <span style={styles.statusRejected}>● Rejected</span>;
    }
    
    return <span style={styles.statusActive}>● Active</span>;
  };

  const getButtonForMission = (mission) => {
    if (!mission.acceptanceStatus) {
      return (
        <button 
          onClick={() => handleAcceptMission(mission)}
          style={styles.acceptBtn}
          onMouseEnter={(e) => e.target.style.background = '#cc0000'}
          onMouseLeave={(e) => e.target.style.background = '#ff3333'}
        >
          ACCEPT MISSION
        </button>
      );
    }

    const { adminApproval } = mission.acceptanceStatus;
    let buttonText = 'IN PROGRESS';
    
    if (adminApproval === 'pending') {
      buttonText = 'AWAITING APPROVAL';
    } else if (adminApproval === 'approved') {
      buttonText = 'IN PROGRESS';
    } else if (adminApproval === 'rejected') {
      buttonText = 'REJECTED';
    }

    return (
      <button style={styles.statusBtn} disabled>
        {buttonText}
      </button>
    );
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p>Loading missions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <AlertCircle size={48} color="#ef4444" />
          <h2 style={styles.errorTitle}>Error Loading Missions</h2>
          <p style={styles.errorMessage}>{error}</p>
          <button onClick={fetchMissions} style={styles.retryBtn}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>ACTIVE OPERATIONS</h1>
        <p style={styles.subtitle}>Select a mission to begin your training.</p>
      </div>
      
      <div style={styles.grid}>
        {missions.map((mission) => (
          <div key={mission._id} style={styles.card}>
            <div style={styles.cardHeader}>
              <span style={styles.levelBadge}>LEVEL {mission.level}</span>
              {getStatusBadge(mission)}
            </div>
            
            <h2 style={styles.missionTitle}>Operation: {mission.title}</h2>
            <p style={styles.briefing}>{mission.briefing}</p>
            
            <div style={styles.missionMeta}>
              <span style={styles.metaItem}>
                📅 Due: {new Date(mission.deadline).toLocaleDateString()}
              </span>
              {mission.expectedSkills && mission.expectedSkills.length > 0 && (
                <span style={styles.metaItem}>
                  🛠️ Skills: {mission.expectedSkills.join(', ')}
                </span>
              )}
            </div>
            
            <div style={styles.footer}>
              {getButtonForMission(mission)}
            </div>
          </div>
        ))}
      </div>

      {missions.length === 0 && (
        <div style={styles.noMissions}>
          <p>No active missions available at the moment.</p>
          <button onClick={fetchMissions} style={styles.refreshBtn}>
            Refresh
          </button>
        </div>
      )}

      {showModal && (
        <div style={styles.overlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                Accept Mission: {selectedMission?.title}
              </h2>
              <button 
                onClick={() => setShowModal(false)} 
                style={styles.closeBtn}
              >
                ×
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.label}>TEAM NAME</label>
                <input
                  type="text"
                  placeholder="e.g., HEIGHTS"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>GITHUB REPOSITORY</label>
                <input
                  type="url"
                  placeholder="https://github.com/username/repo"
                  value={githubRepository}
                  onChange={(e) => setGithubRepository(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.membersSection}>
                <h3 style={styles.membersTitle}>
                  PARTY MEMBERS ({teamMembers.length})
                </h3>
                <p style={styles.memberNote}>
                  ✗ Minimum 2 members required<br/>
                  ✓ Maximum 3 members allowed
                </p>

                {teamMembers.map((member, index) => (
                  <div key={index} style={styles.memberCard}>
                    <div style={styles.memberHeader}>
                      <span style={styles.memberRole}>{member.role}</span>
                      {index > 1 && (
                        <button 
                          onClick={() => removeMember(index)} 
                          style={styles.removeBtn}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div style={styles.memberFields}>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={member.name}
                        onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                        style={styles.memberInput}
                      />
                      <input
                        type="text"
                        placeholder="Roll Number"
                        value={member.rollNumber}
                        onChange={(e) => handleMemberChange(index, 'rollNumber', e.target.value)}
                        style={styles.memberInput}
                      />
                      <input
                        type="text"
                        placeholder="Branch"
                        value={member.branch}
                        onChange={(e) => handleMemberChange(index, 'branch', e.target.value)}
                        style={styles.memberInput}
                      />
                      <input
                        type="text"
                        placeholder="GitHub Username"
                        value={member.githubId}
                        onChange={(e) => handleMemberChange(index, 'githubId', e.target.value)}
                        style={styles.memberInput}
                      />
                    </div>
                  </div>
                ))}

                {teamMembers.length < 3 && (
                  <button 
                    onClick={addMember} 
                    style={styles.addMemberBtn}
                  >
                    + Add Member
                  </button>
                )}
              </div>

              <button 
                onClick={handleSubmitAcceptance}
                style={styles.submitBtn}
                disabled={submitting}
              >
                {submitting ? 'ACCEPTING...' : 'ACCEPT MISSION'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '40px',
    background: '#000',
    minHeight: '100vh',
    color: '#fff'
  },
  header: {
    marginBottom: '40px'
  },
  title: {
    color: '#ff3333',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    letterSpacing: '2px',
    margin: '0 0 10px 0',
    textTransform: 'uppercase'
  },
  subtitle: {
    color: '#888',
    fontSize: '1rem',
    margin: 0
  },
  loading: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#888',
    fontSize: '1.2rem',
    background: '#000',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #333',
    borderTop: '4px solid #ff3333',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  errorCard: {
    background: '#1a0a0a',
    border: '2px solid #ef4444',
    borderRadius: '8px',
    padding: '60px 40px',
    textAlign: 'center',
    maxWidth: '500px',
    margin: '100px auto'
  },
  errorTitle: {
    color: '#ef4444',
    fontSize: '1.5rem',
    margin: '20px 0 10px'
  },
  errorMessage: {
    color: '#aaa',
    fontSize: '1rem',
    marginBottom: '30px'
  },
  retryBtn: {
    background: '#ff3333',
    border: 'none',
    color: '#fff',
    padding: '12px 30px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem'
  },
  refreshBtn: {
    marginTop: '20px',
    background: '#ff3333',
    border: 'none',
    color: '#fff',
    padding: '10px 24px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '25px',
    marginBottom: '40px'
  },
  card: {
    background: '#0a0a0a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '25px',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  levelBadge: {
    background: '#ff3333',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    letterSpacing: '1px'
  },
  statusActive: {
    color: '#22c55e',
    fontSize: '0.85rem',
    fontWeight: '500'
  },
  statusPending: {
    color: '#8b5cf6',
    fontSize: '0.85rem',
    fontWeight: '500'
  },
  statusApproved: {
    color: '#22c55e',
    fontSize: '0.85rem',
    fontWeight: '500'
  },
  statusRejected: {
    color: '#ef4444',
    fontSize: '0.85rem',
    fontWeight: '500'
  },
  missionTitle: {
    color: '#fff',
    fontSize: '1.3rem',
    fontWeight: 'bold',
    margin: '0 0 12px 0',
    lineHeight: '1.3'
  },
  briefing: {
    color: '#aaa',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    margin: '0 0 15px 0',
    flex: 1
  },
  missionMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px',
    paddingTop: '15px',
    borderTop: '1px solid #222'
  },
  metaItem: {
    color: '#666',
    fontSize: '0.85rem'
  },
  footer: {
    marginTop: 'auto'
  },
  acceptBtn: {
    width: '100%',
    padding: '12px',
    background: '#ff3333',
    border: 'none',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '0.95rem',
    borderRadius: '4px',
    cursor: 'pointer',
    letterSpacing: '1px',
    transition: 'all 0.3s'
  },
  statusBtn: {
    width: '100%',
    padding: '12px',
    background: '#333',
    border: '1px solid #444',
    color: '#888',
    fontWeight: 'bold',
    fontSize: '0.95rem',
    borderRadius: '4px',
    cursor: 'not-allowed',
    letterSpacing: '1px'
  },
  noMissions: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666',
    fontSize: '1.1rem'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    background: '#1a1a1a',
    border: '2px solid #ff3333',
    borderRadius: '8px',
    maxWidth: '700px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    color: '#fff'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #333'
  },
  modalTitle: {
    color: '#ff3333',
    fontSize: '1.5rem',
    margin: 0
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '2rem',
    cursor: 'pointer',
    padding: 0,
    width: '30px',
    height: '30px',
    lineHeight: '30px'
  },
  modalBody: {
    padding: '20px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    color: '#ff3333',
    fontWeight: 'bold',
    marginBottom: '8px',
    fontSize: '0.9rem'
  },
  input: {
    width: '100%',
    padding: '12px',
    background: '#0a0a0a',
    border: '1px solid #333',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '1rem',
    boxSizing: 'border-box',
    outline: 'none'
  },
  membersSection: {
    margin: '30px 0'
  },
  membersTitle: {
    color: '#ff3333',
    marginBottom: '10px',
    fontSize: '1.1rem'
  },
  memberNote: {
    color: '#888',
    fontSize: '0.85rem',
    marginBottom: '15px',
    lineHeight: '1.6'
  },
  memberCard: {
    background: '#0a0a0a',
    border: '1px solid #333',
    borderRadius: '4px',
    padding: '15px',
    marginBottom: '15px'
  },
  memberHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  memberRole: {
    background: '#ff3333',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontWeight: 'bold'
  },
  removeBtn: {
    background: 'none',
    border: '1px solid #ff3333',
    color: '#ff3333',
    padding: '4px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem'
  },
  memberFields: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px'
  },
  memberInput: {
    width: '100%',
    padding: '10px',
    background: '#1a1a1a',
    border: '1px solid #444',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '0.9rem',
    boxSizing: 'border-box',
    outline: 'none'
  },
  addMemberBtn: {
    width: '100%',
    padding: '12px',
    background: 'transparent',
    border: '2px dashed #ff3333',
    color: '#ff3333',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.95rem'
  },
  submitBtn: {
    width: '100%',
    padding: '15px',
    background: '#ff3333',
    border: 'none',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'background 0.3s'
  }
};

export default StudentMissions;