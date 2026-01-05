import React from 'react';

const Settings = () => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <form className="max-w-md space-y-4">
          <div>
              <label className="block text-gray-700 mb-2">Site Name</label>
              <input type="text" className="w-full border rounded px-3 py-2" defaultValue="Campus Marketplace" />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Save Changes</button>
      </form>
    </div>
  );
};

export default Settings;
