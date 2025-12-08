// frontend/src/components/acceptmission.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AcceptMission = ({ missionId, onMissionAccepted }) => {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    
    // Mission ID is required to accept the task
    if (!missionId) {
        return null;
    }

    const handleAccept = async () => {
        setSubmitting(true);
        
        try {
            // Call the new single-user acceptance endpoint
            const response = await axios.post(
                `/api/v1/missions/${missionId}/accept`,
                {}, 
                { withCredentials: true }
            );

            alert(response.data.message);
            
            // Call the function provided by the parent (MissionsPage) to refresh the list
            if (onMissionAccepted) {
                onMissionAccepted();
            }
            
        } catch (error) {
            console.error('Error accepting mission:', error);
            // Display friendly error message from backend or a default
            const errorMessage = error.response?.data?.message || 'Failed to accept mission. Please try again.';
            alert(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <button 
            onClick={handleAccept}
            disabled={submitting}
            className="w-full py-2 rounded border border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white transition-all font-semibold text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {submitting ? 'PROCESSING...' : 'ACCEPT MISSION'}
        </button>
    );
};

export default AcceptMission;