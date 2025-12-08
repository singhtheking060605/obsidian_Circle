import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { TeamInvitation } from "../models/teamInvitationModel.js";
import { Team } from "../models/TeamModel.js";
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";

// Send Team Invitation
export const sendInvitation = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const userId = req.user._id;

  console.log('🔍 sendInvitation called');
  console.log('📧 Email:', email);
  console.log('👤 User ID:', userId);

  if (!email) {
    console.log('❌ No email provided');
    return next(new ErrorHandler("Email is required", 400));
  }

  // Find user's team where they are the leader
  console.log('🔍 Looking for team where user is leader...');
  
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

  console.log('🔍 Team found:', team ? 'Yes ✓' : 'No ✗');

  if (!team) {
    console.log('❌ User is not a team leader');
    return next(new ErrorHandler("Only team leaders can send invitations", 403));
  }

  console.log('✅ Team found:', team.name);

  // Check if user with this email already exists in the team
  const existingMember = team.members.find(
    m => {
      // Populate the user if needed
      const memberId = m.user?._id || m.user;
      return memberId.toString() === userId.toString();
    }
  );
  
  // Actually we need to check if the EMAIL is already a member
  const userWithEmail = await User.findOne({ email: email.toLowerCase() });
  
  if (userWithEmail) {
    const isAlreadyMember = team.members.some(
      m => {
        const memberId = m.user?._id || m.user;
        return memberId.toString() === userWithEmail._id.toString();
      }
    );
    
    if (isAlreadyMember) {
      console.log('❌ User already in team');
      return next(new ErrorHandler("This user is already a team member", 400));
    }
  }

  // Check for existing pending invitation
  const existingInvitation = await TeamInvitation.findOne({
    team: team._id,
    email: email.toLowerCase(),
    status: 'pending'
  });

  console.log('🔍 Existing invitation:', existingInvitation ? 'Yes' : 'No');

  if (existingInvitation && !existingInvitation.isExpired()) {
    console.log('❌ Invitation already sent');
    return next(new ErrorHandler("An invitation has already been sent to this email", 400));
  }

  // Create new invitation
  console.log('✅ Creating new invitation...');
  const invitation = new TeamInvitation({
    team: team._id,
    invitedBy: userId,
    email: email.toLowerCase()
  });

  invitation.generateToken();
  await invitation.save();

  console.log('✅ Invitation saved:', invitation._id);

  // Add invitation to team (only if invitations field exists)
  if (team.invitations) {
    team.invitations.push(invitation._id);
    await team.save();
    console.log('✅ Invitation added to team');
  } else {
    console.log('ℹ️ Team model does not have invitations array, skipping...');
  }

  // Send invitation email
  const invitationUrl = `${process.env.FRONTEND_URL}/accept-invitation/${invitation.token}`;
  
  const emailTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1a1a1a; border: 2px solid #ef4444; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #ef4444; text-shadow: 0 0 10px rgba(239, 68, 68, 0.5); font-size: 32px; margin: 0;">
          The Obsidian Circle
        </h1>
        <p style="color: #9ca3af; margin-top: 8px;">Team Invitation</p>
      </div>

      <div style="background-color: #2a2a2a; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
        <h2 style="color: #ef4444; margin-top: 0;">You've Been Invited!</h2>
        <p style="color: #e5e5e5; line-height: 1.6;">
          You have been invited to join <strong style="color: #ef4444;">${team.name}</strong> 
          on The Obsidian Circle platform.
        </p>
        <p style="color: #e5e5e5; line-height: 1.6;">
          Click the button below to accept this invitation and join the team.
        </p>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${invitationUrl}" 
           style="display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%); 
                  color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; 
                  font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;
                  box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);">
          Accept Invitation
        </a>
      </div>

      <div style="background-color: #2a2a2a; border-left: 4px solid #ef4444; padding: 16px; margin: 24px 0;">
        <p style="color: #9ca3af; margin: 0; font-size: 14px;">
          <strong style="color: #ef4444;">⚠️ Security Note:</strong> This invitation will expire in 7 days. 
          If you didn't expect this invitation, you can safely ignore this email.
        </p>
      </div>

      <div style="text-align: center; padding-top: 24px; border-top: 1px solid #374151;">
        <p style="color: #6b7280; font-size: 12px; margin: 0;">
          The Obsidian Circle • Stranger Things Themed Hackathon Platform
        </p>
      </div>
    </div>
  `;

  try {
    console.log('📧 Sending email to:', email);
    
    await sendEmail({
      email: email.toLowerCase(),
      subject: `You're Invited to Join ${team.name} - The Obsidian Circle`,
      message: emailTemplate
    });

    console.log('✅ Email sent successfully');

    res.status(200).json({
      success: true,
      message: `Invitation sent to ${email}`,
      invitation: {
        id: invitation._id,
        email: invitation.email,
        expiresAt: invitation.expiresAt
      }
    });
  } catch (error) {
    console.error('❌ Email send failed:', error);
    
    // Delete invitation if email fails
    await TeamInvitation.findByIdAndDelete(invitation._id);
    team.invitations.pull(invitation._id);
    await team.save();
    
    return next(new ErrorHandler("Failed to send invitation email", 500));
  }
});

// Get Invitation Details by Token
export const getInvitationByToken = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;

  const invitation = await TeamInvitation.findOne({ token })
    .populate('team', 'name description')
    .populate('invitedBy', 'name');

  if (!invitation) {
    return next(new ErrorHandler("Invalid invitation link", 404));
  }

  if (invitation.status !== 'pending') {
    return next(new ErrorHandler("This invitation has already been used", 400));
  }

  if (invitation.isExpired()) {
    invitation.status = 'expired';
    await invitation.save();
    return next(new ErrorHandler("This invitation has expired", 400));
  }

  res.status(200).json({
    success: true,
    invitation: {
      teamName: invitation.team.name,
      teamDescription: invitation.team.description,
      invitedBy: invitation.invitedBy.name,
      email: invitation.email,
      expiresAt: invitation.expiresAt
    }
  });
});

// Accept Invitation and Complete Profile
export const acceptInvitation = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const { name, email, phone, password, branch, rollNumber } = req.body;

  if (!name || !email || !phone || !password || !branch || !rollNumber) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const invitation = await TeamInvitation.findOne({ token }).populate('team');

  if (!invitation) {
    return next(new ErrorHandler("Invalid invitation link", 404));
  }

  if (invitation.status !== 'pending') {
    return next(new ErrorHandler("This invitation has already been used", 400));
  }

  if (invitation.isExpired()) {
    invitation.status = 'expired';
    await invitation.save();
    return next(new ErrorHandler("This invitation has expired", 400));
  }

  if (email.toLowerCase() !== invitation.email.toLowerCase()) {
    return next(new ErrorHandler("Email does not match the invitation", 400));
  }

  let user = await User.findOne({ email: email.toLowerCase() });

  if (user) {
    const alreadyMember = invitation.team.members.some(
      m => m.user.toString() === user._id.toString()
    );

    if (alreadyMember) {
      return next(new ErrorHandler("You are already a member of this team", 400));
    }
  } else {
    user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password,
      branch,
      rollNumber,
      accountVerified: true,
      emailVerified: true,
      status: 'Active'
    });
  }

  invitation.team.members.push({
    user: user._id,
    role: 'Member'
  });

  await invitation.team.save();

  invitation.status = 'accepted';
  await invitation.save();

  const token_jwt = user.generateToken();
  
  res.status(200).cookie('token', token_jwt, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }).json({
    success: true,
    message: "Successfully joined the team!",
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    team: {
      id: invitation.team._id,
      name: invitation.team.name
    }
  });
});

// Get Team's Pending Invitations
export const getTeamInvitations = catchAsyncError(async (req, res, next) => {
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
  }).populate({
    path: 'invitations',
    match: { status: 'pending' }
  });

  if (!team) {
    return next(new ErrorHandler("You are not a team leader", 403));
  }

  res.status(200).json({
    success: true,
    invitations: team.invitations
  });
});

// Cancel Invitation
export const cancelInvitation = catchAsyncError(async (req, res, next) => {
  const { invitationId } = req.params;
  const userId = req.user._id;

  const invitation = await TeamInvitation.findById(invitationId).populate('team');

  if (!invitation) {
    return next(new ErrorHandler("Invitation not found", 404));
  }

  const isLeader = invitation.team.members.some(
    m => m.user.toString() === userId.toString() && m.role === 'Team Lead'
  );

  if (!isLeader) {
    return next(new ErrorHandler("Only team leaders can cancel invitations", 403));
  }

  invitation.team.invitations.pull(invitationId);
  await invitation.team.save();

  await TeamInvitation.findByIdAndDelete(invitationId);

  res.status(200).json({
    success: true,
    message: "Invitation cancelled successfully"
  });
});