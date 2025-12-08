import React, { useState, useEffect } from 'react';
import { getMyMissions, updateTeamDetails, submitForApproval, uploadEvidence }  from '../../../backend/services/api';

const MyTeam = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMission, setEditingMission] = useState(null);

  useEffect(() => {
    fetchMyMissions();
  }, []);

  const fetchMyMissions = async () => {
    try {
      const { data } = await getMyMissions();
      setMissions(data.acceptances || []);
    } catch (error) {
      console.error('Error fetching missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForApproval = async (acceptanceId) => {
    try {
      await submitForApproval(acceptanceId);
      alert('Submitted for admin approval!');
      fetchMyMissions();
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting for approval');
    }
  };

  const handleUploadEvidence = async (acceptanceId) => {
    const evidenceUrl = prompt('Enter evidence URL (image/video/document):');
    if (evidenceUrl) {
      try {
        await uploadEvidence(acceptanceId, evidenceUrl);
        alert('Evidence uploaded successfully!');
        fetchMyMissions();
      } catch (error) {
        alert('Error uploading evidence');
      }
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        Loading your missions...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>MY TEAM</h1>
      
      {missions.length === 0 ? (
        <div style={styles.noMissions}>
          <p>No missions accepted yet. Visit "All Missions" to accept one!</p>
        </div>
      ) : (
        <div style={styles.missionsList}>
          {missions.map((acceptance) => (
            <div key={acceptance._id} style={styles.missionCard}>
              {/* Team Header */}
              <div style={styles.teamHeader}>
                <div>
                  <h2 style={styles.teamName}>{acceptance.teamName}</h2>
                  <p style={styles.missionTitle}>{acceptance.mission?.title}</p>
                </div>
                <button style={styles.editBtn}>Edit Details</button>
              </div>

              {/* GitHub Repository */}
              {acceptance.githubRepository && (
                <div style={styles.githubSection}>
                  <label style={styles.label}>GITHUB REPOSITORY</label>
                  <div style={styles.githubLink}>
                    <span style={styles.githubUrl}>🔗 {acceptance.githubRepository}</span>
                    <a 
                      href={acceptance.githubRepository} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={styles.linkBtn}
                    >
                      Link
                    </a>
                  </div>
                </div>
              )}

              {/* Admin Approval Status */}
              <div style={{
                ...styles.approvalSection,
                borderColor: acceptance.adminApproval.status === 'pending' ? '#8b5cf6' : 
                             acceptance.adminApproval.status === 'approved' ? '#22c55e' : '#ef4444'
              }}>
                <div style={styles.approvalHeader}>
                  <h3 style={styles.approvalTitle}>ADMIN APPROVAL</h3>
                  <span style={{
                    ...styles.approvalBadge,
                    color: acceptance.adminApproval.status === 'pending' ? '#8b5cf6' : 
                           acceptance.adminApproval.status === 'approved' ? '#22c55e' : '#ef4444'
                  }}>
                    {acceptance.adminApproval.status === 'pending' && '○ NOT SUBMITTED'}
                    {acceptance.adminApproval.status === 'approved' && '● APPROVED'}
                    {acceptance.adminApproval.status === 'rejected' && '● REJECTED'}
                  </span>
                </div>

                <div style={styles.approvalInfo}>
                  <p style={styles.approvalText}>
                    Team size: {acceptance.teamMembers.length}/3 members
                  </p>
                  {acceptance.adminApproval.status === 'pending' && (
                    <>
                      <p style={styles.warningText}>✗ Minimum 2 members required</p>
                      <p style={styles.successText}>✓ Maximum 3 members allowed</p>
                      
                      {acceptance.teamMembers.length >= 2 && acceptance.teamMembers.length <= 3 && (
                        <button 
                          onClick={() => handleSubmitForApproval(acceptance._id)}
                          style={styles.submitApprovalBtn}
                        >
                          ⚠ Submit for Approval
                        </button>
                      )}
                    </>
                  )}
                  {acceptance.adminApproval.status === 'rejected' && acceptance.adminApproval.rejectionReason && (
                    <p style={styles.rejectionReason}>
                      Reason: {acceptance.adminApproval.rejectionReason}
                    </p>
                  )}
                </div>
              </div>

              {/* Team Members */}
              <div style={styles.partyMembersSection}>
                <h3 style={styles.partyTitle}>
                  PARTY MEMBERS ({acceptance.teamMembers.length})
                </h3>
                <div style={styles.membersList}>
                  {acceptance.teamMembers.map((member, idx) => (
                    <div key={idx} style={styles.memberItem}>
                      <div style={styles.memberAvatar}>
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={styles.memberInfo}>
                        <div style={styles.memberNameRole}>
                          <span style={styles.memberName}>{member.name}</span>
                          <span style={{
                            ...styles.memberRoleBadge,
                            backgroundColor: member.role === 'Leader' ? '#ff3333' : '#333',
                            color: member.role === 'Leader' ? '#fff' : '#ccc'
                          }}>
                            {member.role}
                          </span>
                        </div>
                        <span style={styles.memberEmail}>
                          {member.rollNumber} • {member.branch}
                        </span>
                      </div>
                      <span style={{
                        ...styles.statusIndicator,
                        color: acceptance.adminApproval.status === 'approved' ? '#22c55e' : '#8b5cf6'
                      }}>
                        ● Active
                      </span>
                    </div>
                  ))}
                </div>

                {acceptance.teamMembers.length < 3 && acceptance.adminApproval.status === 'pending' && (
                  <button style={styles.inviteBtn}>+ Invite</button>
                )}
              </div>

              {/* Project Evidence */}
              <div style={styles.evidenceSection}>
                <div style={styles.evidenceHeader}>
                  <h3 style={styles.evidenceTitle}>PROJECT MEDIA / EVIDENCE</h3>
                  {acceptance.adminApproval.status === 'approved' && (
                    <button 
                      onClick={() => handleUploadEvidence(acceptance._id)}
                      style={styles.uploadBtn}
                    >
                      Upload Media
                    </button>
                  )}
                </div>
                
                {!acceptance.submission?.evidence || acceptance.submission.evidence.length === 0 ? (
                  <div style={styles.noEvidence}>
                    <p>No evidence uploaded yet.</p>
                  </div>
                ) : (
                  <div style={styles.evidenceGrid}>
                    {acceptance.submission.evidence.map((url, idx) => (
                      <div key={idx} style={styles.evidenceItem}>
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={styles.evidenceLink}
                        >
                          Evidence {idx + 1}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
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
  title: {
    color: '#ff3333',
    fontSize: '2.5rem',
    marginBottom: '30px',
    fontWeight: 'bold',
    letterSpacing: '2px'
  },
  loading: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#888',
    fontSize: '1.2rem'
  },
  noMissions: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#888'
  },
  missionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },
  missionCard: {
    background: '#0a0a0a',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '30px'
  },
  teamHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #222'
  },
  teamName: {
    color: '#fff',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    margin: '0 0 5px 0',
    textTransform: 'uppercase'
  },
  missionTitle: {
    color: '#888',
    fontSize: '0.9rem',
    margin: 0
  },
  editBtn: {
    background: 'transparent',
    border: '1px solid #ff3333',
    color: '#ff3333',
    padding: '8px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s'
  },
  githubSection: {
    marginBottom: '25px'
  },
  label: {
    display: 'block',
    color: '#ff3333',
    fontSize: '0.85rem',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  githubLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#1a1a1a',
    border: '1px solid #333',
    padding: '12px 15px',
    borderRadius: '4px'
  },
  githubUrl: {
    color: '#ccc',
    fontSize: '0.9rem'
  },
  linkBtn: {
    background: '#ff3333',
    color: '#fff',
    padding: '6px 20px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.9rem',
    transition: 'all 0.3s'
  },
  approvalSection: {
    background: '#1a1a1a',
    border: '1px solid',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '25px'
  },
  approvalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  approvalTitle: {
    color: '#8b5cf6',
    fontSize: '1rem',
    margin: 0
  },
  approvalBadge: {
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  approvalInfo: {
    marginTop: '15px'
  },
  approvalText: {
    color: '#ccc',
    margin: '8px 0',
    fontSize: '0.9rem'
  },
  warningText: {
    color: '#ef4444',
    margin: '8px 0',
    fontSize: '0.9rem'
  },
  successText: {
    color: '#22c55e',
    margin: '8px 0',
    fontSize: '0.9rem'
  },
  rejectionReason: {
    color: '#ef4444',
    fontWeight: '500',
    margin: '8px 0',
    fontSize: '0.9rem'
  },
  submitApprovalBtn: {
    marginTop: '15px',
    background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    border: 'none',
    color: '#fff',
    padding: '12px 30px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    width: '100%',
    transition: 'opacity 0.3s'
  },
  partyMembersSection: {
    marginBottom: '25px'
  },
  partyTitle: {
    color: '#ff3333',
    fontSize: '1rem',
    marginBottom: '15px'
  },
  membersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  memberItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    background: '#1a1a1a',
    padding: '15px',
    borderRadius: '6px',
    border: '1px solid #333'
  },
  memberAvatar: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    background: '#ff3333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    flexShrink: 0
  },
  memberInfo: {
    flex: 1
  },
  memberNameRole: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '4px'
  },
  memberName: {
    color: '#fff',
    fontWeight: '500',
    fontSize: '1rem'
  },
  memberRoleBadge: {
    fontSize: '0.75rem',
    padding: '2px 8px',
    borderRadius: '4px',
    fontWeight: 'bold'
  },
  memberEmail: {
    color: '#888',
    fontSize: '0.85rem'
  },
  statusIndicator: {
    fontSize: '0.9rem'
  },
  inviteBtn: {
    marginTop: '15px',
    width: '100%',
    background: 'transparent',
    border: '2px dashed #ff3333',
    color: '#ff3333',
    padding: '12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s'
  },
  evidenceSection: {
    paddingTop: '20px',
    borderTop: '1px solid #222'
  },
  evidenceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  evidenceTitle: {
    color: '#ff3333',
    fontSize: '1rem',
    margin: 0
  },
  uploadBtn: {
    background: '#ff3333',
    border: 'none',
    color: '#fff',
    padding: '8px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s'
  },
  noEvidence: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#666',
    background: '#0a0a0a',
    border: '2px dashed #333',
    borderRadius: '4px'
  },
  evidenceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '15px'
  },
  evidenceItem: {
    background: '#1a1a1a',
    border: '1px solid #333',
    padding: '20px',
    borderRadius: '4px',
    textAlign: 'center'
  },
  evidenceLink: {
    color: '#ff3333',
    textDecoration: 'none',
    fontWeight: '500'
  }
};

export default MyTeam;