import React from 'react';

const Footer = ({ setCurrentPage }) => (
  <footer className="bg-gray-900 text-white pt-12 pb-8 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <span className="text-2xl font-bold tracking-tighter">PABA.</span>
          <p className="mt-4 text-gray-400 text-sm">
            The best place to find high-quality tech gadgets at affordable prices.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4 text-red-500">Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li><button onClick={() => setCurrentPage('home')} className="hover:text-white">Home</button></li>
            <li><button onClick={() => setCurrentPage('home')} className="hover:text-white">Shop</button></li>
            <li><button className="hover:text-white">About</button></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4 text-red-500">Newsletter</h4>
          <div className="flex">
            <input type="email" placeholder="Enter email" className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none w-full" />
            <button className="bg-red-600 px-4 py-2 rounded-r-md hover:bg-red-700">Go</button>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
        &copy; 2024 PABA. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;