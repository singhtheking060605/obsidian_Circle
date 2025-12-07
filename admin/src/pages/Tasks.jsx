import React, { useState } from 'react';

const Tasks = () => {
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'view'
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
        alert('Error: ' + (data.message || 'Something went wrong'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to connect to server');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Task Management</h1>
        <div className="flex space-x-2 bg-white p-1 rounded-lg border border-gray-200">
          <button 
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'create' ? 'bg-red-50 text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Create Task
          </button>
          <button 
            onClick={() => setActiveTab('view')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'view' ? 'bg-red-50 text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            View All Tasks
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        
        {activeTab === 'create' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-700 mb-6 pb-2 border-b">Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={taskData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  placeholder="e.g. Weekly Algorithm Challenge"
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  name="description" 
                  rows="5"
                  value={taskData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                  placeholder="Provide detailed instructions..."
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input 
                    type="datetime-local" 
                    name="deadline" 
                    value={taskData.deadline}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
                  <input 
                    type="text" 
                    name="assignedTo" 
                    value={taskData.assignedTo}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    placeholder="Team ID (Optional)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave as "All" for public tasks.</p>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  Publish Task
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'view' && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">Task list fetching implementation will go here.</p>
            <p className="text-sm">Currently showing create interface only.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;