import React, { useState, useEffect } from 'react';
import { Heart, Star, Loader, Filter } from 'lucide-react';
import Pagination from './Pagination';

const ProductList = React.memo(({ products, loading, error, handleProductClick, addToCart, wishlist, toggleWishlist, handleSort }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-100 pb-6">
        <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-red-600 pl-4">Latest Products</h2>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <select 
            onChange={(e) => handleSort(e.target.value)}
            className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
          >
            <option value="latest">Sort by: Latest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20"><Loader className="animate-spin h-10 w-10 text-red-600" /></div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-gray-500 text-center py-10">No products found. (Try adding some via Admin Dashboard)</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProducts.map((product) => {
              const isLiked = wishlist.some(p => p._id === product._id);
              return (
                <div key={product._id} className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer" onClick={() => handleProductClick(product)}>
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={product.image || 'https://via.placeholder.com/300?text=No+Image'} 
                      alt={product.name} 
                      loading="lazy"
                      onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/300?text=No+Image" }}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                    />
                    <button 
                      className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${isLiked ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                    >
                      <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">{product.name}</h3>
                    </div>
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">({product.numReviews || 0} reviews)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors duration-300"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Pagination itemsPerPage={itemsPerPage} totalItems={products.length} paginate={setCurrentPage} currentPage={currentPage} />
        </>
      )}
    </div>
  );
});

export default ProductList;