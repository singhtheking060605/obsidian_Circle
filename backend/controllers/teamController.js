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
    
    // CRITICAL: Explicitly include description and repoLink if they were sent
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
            ...(mediaLink && { $push: { mediaLinks: mediaLink } }) // Conditionally push mediaLink
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