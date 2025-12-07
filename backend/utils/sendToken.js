import "../config/env.js";

export const sendToken = (user, statusCode, message, res) => {
  const token = user.getJWTToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // Determine redirect based on role
  let targetUrl = "";
  
  if (user.roles.includes("Admin")) {
    // Admin is on 5173
    targetUrl = `${process.env.ADMIN_URL}/auth-receiver?token=${token}`;
  } else {
    // Student is on 5174
    targetUrl = "/student/dashboard";
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      message,
      token,
      user,
      redirectUrl: targetUrl 
    });
};