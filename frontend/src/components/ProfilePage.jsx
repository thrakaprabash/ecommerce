import React, { useState } from 'react';
import { ArrowLeft, Camera, Save, Loader } from 'lucide-react';

const ProfilePage = ({ user, handleUpdateProfile, setCurrentPage, loading }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState(user?.image || '');
  const [message, setMessage] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      handleUpdateProfile({ id: user._id, name, email, password, image });
      setMessage('Profile Updated Successfully');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setCurrentPage('home')} className="flex items-center text-gray-600 hover:text-red-600 mb-8 transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" /> Back to Shop
        </button>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gray-900 px-8 py-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">User Profile</h2>
            <div className="relative">
              {image ? (
                <img src={image} alt="Profile" className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md" />
              ) : (
                <div className="h-16 w-16 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-white">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          
          <div className="p-8">
            {message && (
              <div className={`p-4 rounded-md mb-6 ${message.includes('match') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {message}
              </div>
            )}
            
            <form onSubmit={submitHandler} className="space-y-6">
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                <label className="cursor-pointer flex flex-col items-center space-y-2">
                  <div className="p-3 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors">
                    <Camera className="h-6 w-6 text-red-600" />
                  </div>
                  <span className="text-sm text-gray-500 font-medium">Change Profile Photo</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
                {image && !user?.image && <p className="text-xs text-green-600 mt-2">New image selected</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to keep current"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-200 disabled:opacity-50"
                >
                  {loading ? <Loader className="animate-spin h-5 w-5 mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;