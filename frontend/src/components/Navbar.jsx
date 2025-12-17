import React, { useState } from 'react';
import { ShoppingCart, User, Search, Menu, X, Settings, LogOut, List } from 'lucide-react';

const Navbar = React.memo(({ user, cartCount, setCurrentPage, handleLogout, isMenuOpen, setIsMenuOpen, handleSearch }) => {
  const [keyword, setKeyword] = useState('');

  const submitSearch = (e) => {
    e.preventDefault();
    handleSearch(keyword);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      {/* ... (exact code from original Navbar component) ... */}
      {/* Paste the entire Navbar return JSX here – it's quite long, but unchanged */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center cursor-pointer flex-shrink-0" onClick={() => { handleSearch(''); setCurrentPage('home'); }}>
            <img 
              src="https://placehold.co/150x50/ffffff/dc2626?text=PABA&font=montserrat" 
              alt="PABA Logo" 
              className="h-8 sm:h-10 w-auto object-contain"
            />
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={submitSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-gray-100 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all text-sm"
              />
              <button type="submit" className="absolute left-3 top-2.5 text-gray-400 hover:text-red-600 transition-colors">
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {user && user.isAdmin && (
              <button 
                onClick={() => setCurrentPage('admin-dashboard')}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <Settings className="h-6 w-6" />
                <span className="ml-1 font-medium">Dashboard</span>
              </button>
            )}

            {user ? (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setCurrentPage('my-orders')}
                  className="flex items-center text-gray-600 hover:text-red-600 transition-colors font-medium"
                  title="My Orders"
                >
                  <List className="h-6 w-6" />
                </button>
                
                <button 
                  onClick={() => setCurrentPage('profile')}
                  className="flex items-center text-gray-700 hover:text-red-600 font-medium transition-colors"
                >
                  {user.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name} 
                      className="h-8 w-8 rounded-full object-cover mr-2 border border-gray-200 shadow-sm"
                    />
                  ) : (
                    <User className="h-5 w-5 mr-1" />
                  )}
                  {user.name.split(' ')[0]}
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center text-gray-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setCurrentPage('login')}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
              >
                <User className="h-6 w-6" />
                <span className="ml-1 font-medium">Sign In</span>
              </button>
            )}

            <button 
              onClick={() => setCurrentPage('cart')}
              className="relative text-gray-600 hover:text-red-600 transition-colors group"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center group-hover:bg-red-700 transition-colors">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-red-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <form onSubmit={(e) => { submitSearch(e); setIsMenuOpen(false); }}>
              <input
                type="text"
                placeholder="Search products..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full bg-gray-100 rounded mb-4 py-2 px-4 focus:outline-none"
              />
            </form>
            <button onClick={() => { setCurrentPage('cart'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50">Cart ({cartCount})</button>
            {user ? (
              <>
                {user.isAdmin && (
                  <button onClick={() => { setCurrentPage('admin-dashboard'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50">Dashboard</button>
                )}
                <button onClick={() => { setCurrentPage('my-orders'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50">My Orders</button>
                <button onClick={() => { setCurrentPage('profile'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50">Profile</button>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50">Sign Out</button>
              </>
            ) : (
              <button onClick={() => { setCurrentPage('login'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-red-600 hover:bg-red-50">Sign In</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
});

export default Navbar;