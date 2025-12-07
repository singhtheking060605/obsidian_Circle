import React, { useState } from 'react';

const CreateTask = () => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    deadline: '',
    assignedTo: 'All'
  });

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    if (!token) {
      alert("No token found. Please log in again.");
      window.location.href = 'http://localhost:5173/login';
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/v1/tasks/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (data.success) {
        alert('Task Created Successfully!');
        setTaskData({ title: '', description: '', deadline: '', assignedTo: 'All' });
      } else {
        alert('Error: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to server');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Create New Task</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Task Title</label>
          <input 
            type="text" 
            name="title" 
            value={taskData.title}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
            placeholder="Enter task title"
            required 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea 
            name="description" 
            rows="5"
            value={taskData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
            placeholder="Detailed instructions..."
            required 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Deadline</label>
            <input 
              type="datetime-local" 
              name="deadline" 
              value={taskData.deadline}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              required 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Assign To (Optional)</label>
            <input 
              type="text" 
              name="assignedTo" 
              value={taskData.assignedTo}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="e.g., Team ID or 'All'"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          Publish Task
        </button>
      </form>
    </div>
  );
};

export default CreateTask;