import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  FaUserCircle,
  FaFileAlt,
  FaUpload,
  FaSave,
  FaGithub,
} from "react-icons/fa";

const StudentUpdateProfile = () => {
  const { user, updateUser } = useAuth();

  // State for text fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [github, setGithub] = useState("");

  // State for files
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setBio(user.bio || "");
      setGithub(user.github || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData();

    if (name !== user.name) formData.append("name", name);
    if (phone !== user.phone) formData.append("phone", phone);
    if (bio !== user.bio) formData.append("bio", bio);
    if (github !== user.github) formData.append("github", github);

    if (profilePhoto) formData.append("profilePhoto", profilePhoto);
    if (resume) formData.append("resume", resume);

    if (formData.entries().next().done) {
      setError("No changes detected to save.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.put(
        "http://localhost:4000/api/auth/update-me",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      
      updateUser(res.data.user);
      setMessage("Profile updated successfully!");
      setProfilePhoto(null);
      setResume(null);
    } 
    catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update profile.");
    } 
    finally {
      setLoading(false);
    }
  };

  const renderFilePreview = (file, currentPath, isPhoto = false) => {
    if (file && typeof file !== "string") {
      return (
        <span className="text-sm text-green-400 flex items-center gap-2">
          <FaFileAlt /> Selected: {file.name}
        </span>
      );
    }

    if (currentPath) {
      const fileName = currentPath.split("/").pop();
      return (
        <a
          href={currentPath}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-red-500 hover:text-red-400 transition-colors flex items-center gap-2"
        >
          {isPhoto ? <FaUserCircle /> : <FaFileAlt />} Current: {fileName}
        </a>
      );
    }

    return <span className="text-sm text-gray-500">No file uploaded.</span>;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h3 className="text-3xl font-bold text-white mb-6 border-l-4 border-red-600 pl-4">
        Update Student Profile
      </h3>

      {message && (
        <div className="p-3 bg-green-900/50 text-green-300 rounded-md">
          {message}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-900/50 text-red-300 rounded-md">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Photo Upload */}
        <div className="p-4 bg-gray-900/40 border border-red-900/20 rounded-lg">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Profile Photo
          </label>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
              {user?.profilePhoto && !profilePhoto ? (
                <img
                  src={
                    user.profilePhoto.startsWith("/uploads")
                      ? `/${user.profilePhoto}`
                      : user.profilePhoto
                  }
                  alt="Current Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserCircle className="w-10 h-10 text-red-500" />
              )}
            </div>

            <label className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
              <FaUpload /> Change Photo
              <input
                type="file"
                name="profilePhoto"
                className="hidden"
                accept="image/*"
                onChange={(e) => setProfilePhoto(e.target.files[0])}
              />
            </label>

            {renderFilePreview(profilePhoto, user?.profilePhoto, true)}
          </div>
        </div>

        {/* Text inputs */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-red-900/30 bg-black/50 rounded-lg text-white"
            placeholder="Your Name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border border-red-900/30 bg-black/50 rounded-lg text-white"
            placeholder="+91XXXXXXXXXX"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <FaGithub /> GitHub URL (Optional)
          </label>
          <input
            type="url"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            className="w-full p-3 border border-red-900/30 bg-black/50 rounded-lg text-white"
            placeholder="https://github.com/yourusername"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Bio (max 500 chars)
          </label>
          <textarea
            rows="3"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 border border-red-900/30 bg-black/50 rounded-lg text-white"
            maxLength="500"
          ></textarea>
        </div>

        {/* Resume upload */}
        <div className="p-4 bg-gray-900/40 border border-red-900/20 rounded-lg">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Resume Upload (PDF, DOCX)
          </label>

          <label className="cursor-pointer bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg w-fit flex items-center gap-2">
            <FaUpload /> Select Resume File
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
            />
          </label>

          {renderFilePreview(resume, user?.resume)}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <FaSave className="animate-spin" /> Saving...
            </>
          ) : (
            <>
              <FaSave /> Save Profile
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default StudentUpdateProfile;
