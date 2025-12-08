// import { Team } from "../models/TeamModel.js";
// import ErrorHandler from "../middlewares/error.js";
// import { catchAsyncError } from "../middlewares/catchAsyncError.js";
// import main from "../config/gemini.js"; 

// // --- AI Description Generation ---
// export const generateContent = async (req, res) => {
//     try {
//         const { prompt, length } = req.body; 
        
//         if (!prompt) {
//             return res.status(400).json({ 
//                 success: false, 
//                 message: "A topic/title is required to generate content." 
//             });
//         }

//         const content = await main(prompt, length);
        
//         res.json({ success: true, content });

//     } catch (error) {
        
//         console.error("Gemini content generation failed:", error);
        
//         // Handle quota and 429 errors
//         if (error.message && (error.message.includes("quota") || error.message.includes("429"))) {
//             return res.status(429).json({ 
//                 success: false, 
//                 message: "API quota exceeded. You have reached your daily or rate limit. Please try again later or check your Google AI Studio plan." 
//             });
//         }
//         res.status(500).json({ 
//             success: false, 
//             message: error.message || "Failed to generate content due to an internal error. Please try again." 
//         });
//     }
// };

// // --- Get My Team ---
// export const getMyTeam = catchAsyncError(async (req, res, next) => {
//     const team = await Team.findOne({
//         $or: [{ leader: req.user._id }, { "members.user": req.user._id }],
//     })
//         .populate("leader", "name email avatar")
//         .populate("members.user", "name email avatar");

//     res.status(200).json({ success: true, team });
// });

// // --- Create Team ---
// export const createTeam = catchAsyncError(async (req, res, next) => {
//     const { name, repoLink, description } = req.body;

//     const existingTeam = await Team.findOne({
//         $or: [{ leader: req.user._id }, { "members.user": req.user._id }],
//     });
//     if (existingTeam) return next(new ErrorHandler("You are already part of a team", 400));
    
//     const nameTaken = await Team.findOne({ name });
//     if (nameTaken) return next(new ErrorHandler("Team name taken", 400));

//     const team = await Team.create({
//         name,
//         repoLink,
//         description,
//         leader: req.user._id,
//         members: [{ user: req.user._id, role: "Team Lead" }], 
//     });

//     res.status(201).json({ success: true, message: "Team created", team });
// });

// // --- Join Team ---
// export const joinTeam = catchAsyncError(async (req, res, next) => {
//     const { teamName } = req.body;
//     if (!teamName) return next(new ErrorHandler("Provide a team name", 400));

//     const userInTeam = await Team.findOne({
//         $or: [{ leader: req.user._id }, { "members.user": req.user._id }]
//     });
//     if (userInTeam) return next(new ErrorHandler("You are already in a team", 400));

//     const team = await Team.findOne({ name: teamName });
//     if (!team) return next(new ErrorHandler("Team not found", 404));

//     team.members.push({ user: req.user._id, role: "Member" });
//     await team.save();
//     await team.populate("leader members.user", "name email avatar");

//     res.status(200).json({ success: true, message: "Joined team", team });
// });

// // --- Update Team (Repo, Description, Media) ---
// export const updateTeam = catchAsyncError(async (req, res, next) => {
//     const { repoLink, description, mediaLink } = req.body;

//     let team = await Team.findOne({ leader: req.user._id });
//     if (!team) return next(new ErrorHandler("Not authorized", 404));

//     // Update fields only if they are present in the request body
//     if (repoLink !== undefined) {
//         team.repoLink = repoLink;
//     }
    

//     if (description !== undefined) { 
//         team.description = description; 
//     }
    

//     if (mediaLink) {
//         // If mediaLink is sent separately, push it to the array
//         team.mediaLinks.push(mediaLink);
//     }

//     await team.save();
    
//     // Repopulate the team object to ensure all member details are returned in the response
//     await team.populate("leader members.user", "name email avatar");

//     // Return the successfully updated team object
//     res.status(200).json({ success: true, message: "Updated", team });
// });



// controllers/teamController.js

import { Team } from "../models/TeamModel.js";
import ErrorHandler from "../middlewares/error.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import main from "../config/gemini.js"; 






import { sendEmail } from "../utils/sendEmail.js";

// Request Admin Approval
export const requestApproval = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  console.log('🔍 Requesting approval for team...');
  console.log('👤 User ID:', userId);

  // Find team where user is the leader
  const team = await Team.findOne({
    $or: [
      { leader: userId },
      {
        'members': {
          $elemMatch: {
            user: userId,
            role: 'Team Lead'
          }
        }
      }
    ]
  }).populate('members.user', 'name email');

  if (!team) {
    return next(new ErrorHandler("Only team leaders can request approval", 403));
  }

  console.log('✅ Team found:', team.name);
  console.log('👥 Member count:', team.members.length);

  // Validate team size
  if (team.members.length < 2) {
    return next(new ErrorHandler("Team must have at least 2 members", 400));
  }

  if (team.members.length > 3) {
    return next(new ErrorHandler("Team cannot have more than 3 members", 400));
  }

  // Check if already submitted
  if (team.approvalStatus === 'pending') {
    return next(new ErrorHandler("Approval request already submitted", 400));
  }

  if (team.approvalStatus === 'approved') {
    return next(new ErrorHandler("Team is already approved", 400));
  }

  // Update approval status
  team.approvalStatus = 'pending';
  team.approvalRequestedAt = new Date();
  await team.save();

  console.log('✅ Approval status updated to pending');

  // Send notification email to admin
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@obsidiancircle.com';
  
  const membersList = team.members.map(m => 
    `<li style="color: #e5e5e5;">${m.user.name} (${m.user.email})</li>`
  ).join('');

  const emailTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1a1a1a; border: 2px solid #ef4444; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #ef4444; text-shadow: 0 0 10px rgba(239, 68, 68, 0.5); font-size: 32px; margin: 0;">
          New Team Approval Request
        </h1>
        <p style="color: #9ca3af; margin-top: 8px;">The Obsidian Circle</p>
      </div>

      <div style="background-color: #2a2a2a; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
        <h2 style="color: #ef4444; margin-top: 0;">Team Details</h2>
        <table style="width: 100%; color: #e5e5e5;">
          <tr>
            <td style="padding: 8px 0; color: #9ca3af;">Team Name:</td>
            <td style="padding: 8px 0;"><strong>${team.name}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #9ca3af;">Members:</td>
            <td style="padding: 8px 0;"><strong>${team.members.length}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #9ca3af;">Repository:</td>
            <td style="padding: 8px 0;">${team.repoLink || 'Not provided'}</td>
          </tr>
        </table>
      </div>

      <div style="background-color: #2a2a2a; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
        <h3 style="color: #ef4444; margin-top: 0;">Team Members:</h3>
        <ul style="padding-left: 20px;">
          ${membersList}
        </ul>
      </div>

      ${team.description ? `
      <div style="background-color: #2a2a2a; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
        <h3 style="color: #ef4444; margin-top: 0;">Project Description:</h3>
        <p style="color: #e5e5e5; line-height: 1.6;">${team.description}</p>
      </div>
      ` : ''}

      <div style="text-align: center; margin: 32px 0;">
        <a href="${process.env.FRONTEND_URL}/admin/teams" 
           style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%); 
                  color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; 
                  font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;
                  box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);">
          Review Team
        </a>
      </div>

      <div style="text-align: center; padding-top: 24px; border-top: 1px solid #374151;">
        <p style="color: #6b7280; font-size: 12px; margin: 0;">
          The Obsidian Circle • Admin Dashboard
        </p>
      </div>
    </div>
  `;

  try {
    await sendEmail({
      email: adminEmail,
      subject: `🔴 New Team Approval Request: ${team.name}`,
      message: emailTemplate
    });

    console.log('✅ Admin notification email sent');
  } catch (error) {
    console.error('❌ Failed to send admin email:', error);
    // Don't fail the request if email fails
  }

  res.status(200).json({
    success: true,
    message: 'Approval request submitted successfully! Admin will review your team.',
    team: {
      id: team._id,
      name: team.name,
      approvalStatus: team.approvalStatus,
      approvalRequestedAt: team.approvalRequestedAt
    }
  });
});

// Get Team Approval Status
export const getApprovalStatus = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  const team = await Team.findOne({
    $or: [
      { leader: userId },
      { "members.user": userId }
    ]
  }).select('name approvalStatus approvalRequestedAt approvedAt rejectionReason');

  if (!team) {
    return next(new ErrorHandler("Team not found", 404));
  }

  res.status(200).json({
    success: true,
    approval: {
      status: team.approvalStatus,
      requestedAt: team.approvalRequestedAt,
      approvedAt: team.approvedAt,
      rejectionReason: team.rejectionReason
    }
  });
});

// Cancel Approval Request (if needed)
export const cancelApprovalRequest = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  const team = await Team.findOne({
    $or: [
      { leader: userId },
      {
        'members': {
          $elemMatch: {
            user: userId,
            role: 'Team Lead'
          }
        }
      }
    ]
  });

  if (!team) {
    return next(new ErrorHandler("Only team leaders can cancel approval requests", 403));
  }

  if (team.approvalStatus !== 'pending') {
    return next(new ErrorHandler("No pending approval request to cancel", 400));
  }

  team.approvalStatus = 'not_submitted';
  team.approvalRequestedAt = undefined;
  await team.save();

  res.status(200).json({
    success: true,
    message: 'Approval request cancelled'
  });
});










// --- AI Description Generation ---
export const generateContent = async (req, res) => {
    try {
        const { prompt, length } = req.body; 
        
        if (!prompt) {
            return res.status(400).json({ 
                success: false, 
                message: "A topic/title is required to generate content." 
            });
        }

        const content = await main(prompt, length);
        
        res.json({ success: true, content });

    } catch (error) {
        
        console.error("Gemini content generation failed:", error);
        
        // Handle quota and 429 errors
        if (error.message && (error.message.includes("quota") || error.message.includes("429"))) {
            return res.status(429).json({ 
                success: false, 
                message: "API quota exceeded. You have reached your daily or rate limit. Please try again later or check your Google AI Studio plan." 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to generate content due to an internal error. Please try again." 
        });
    }
};

// --- Get My Team ---
export const getMyTeam = catchAsyncError(async (req, res, next) => {
    const team = await Team.findOne({
        $or: [{ leader: req.user._id }, { "members.user": req.user._id }],
    })
        .populate("leader", "name email avatar")
        .populate("members.user", "name email avatar");

    res.status(200).json({ success: true, team });
});

// --- Create Team ---
export const createTeam = catchAsyncError(async (req, res, next) => {
    const { name, repoLink, description } = req.body;

    const existingTeam = await Team.findOne({
        $or: [{ leader: req.user._id }, { "members.user": req.user._id }],
    });
    if (existingTeam) return next(new ErrorHandler("You are already part of a team", 400));
    
    const nameTaken = await Team.findOne({ name });
    if (nameTaken) return next(new ErrorHandler("Team name taken", 400));

    const team = await Team.create({
        name,
        repoLink,
        description,
        leader: req.user._id,
        members: [{ user: req.user._id, role: "Team Lead" }], 
    });

    res.status(201).json({ success: true, message: "Team created", team });
});

// --- Join Team ---
export const joinTeam = catchAsyncError(async (req, res, next) => {
    const { teamName } = req.body;
    if (!teamName) return next(new ErrorHandler("Provide a team name", 400));

    const userInTeam = await Team.findOne({
        $or: [{ leader: req.user._id }, { "members.user": req.user._id }]
    });
    if (userInTeam) return next(new ErrorHandler("You are already in a team", 400));

    const team = await Team.findOne({ name: teamName });
    if (!team) return next(new ErrorHandler("Team not found", 404));

    team.members.push({ user: req.user._id, role: "Member" });
    await team.save();
    await team.populate("leader members.user", "name email avatar");

    res.status(200).json({ success: true, message: "Joined team", team });
});

// --- Update Team (Repo, Description, Media) ---
export const updateTeam = catchAsyncError(async (req, res, next) => {
    const { repoLink, description, mediaLink } = req.body;

    const existingTeam = await Team.findOne({ leader: req.user._id });
    if (!existingTeam) return next(new ErrorHandler("Not authorized or team not found", 404));

    const updateFields = {};
    
    if (description !== undefined) { 
        updateFields.description = description; 
    }
    
    if (repoLink !== undefined) {
        updateFields.repoLink = repoLink;
    }

    // Use findByIdAndUpdate to guarantee return of the latest document
    let updatedTeam = await Team.findByIdAndUpdate(
        existingTeam._id,
        { 
            $set: updateFields, 
            ...(mediaLink && { $push: { mediaLinks: mediaLink } }) 
        },
        { 
            new: true, // GUARANTEES the saved description is returned to the frontend
            runValidators: true 
        }
    )
        .populate("leader", "name email avatar")
        .populate("members.user", "name email avatar");

    if (!updatedTeam) {
        return next(new ErrorHandler("Team update failed on the server side.", 500));
    }
    
    res.status(200).json({ success: true, message: "Updated", team: updatedTeam });
});


export const getAllTeams = catchAsyncError(async (req, res, next) => {
    // Populate leader details for contact info
    const teams = await Team.find()
        .populate("leader", "name email")
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, teams });
});