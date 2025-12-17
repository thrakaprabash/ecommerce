import React from 'react';

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (pageNumbers.length <= 1) return null;

  return (
    <nav className="flex justify-center mt-8 overflow-x-auto py-2">
      <ul className="flex space-x-2">
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`px-3 py-1 sm:px-4 sm:py-2 text-sm font-medium rounded-md transition-colors ${
                currentPage === number 
                  ? 'bg-red-600 text-white border border-red-600' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;