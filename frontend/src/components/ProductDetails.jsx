import React, { useState } from 'react';
import { ArrowLeft, Heart, Star } from 'lucide-react';

const ProductDetails = ({ product, addToCart, setCurrentPage, user, handleCreateReview, wishlist, toggleWishlist }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const submitReviewHandler = (e) => {
    e.preventDefault();
    handleCreateReview(product._id, { rating, comment });
    setComment('');
    setRating(5);
  };

  const isLiked = wishlist.some(p => p._id === product._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => setCurrentPage('home')} className="flex items-center text-gray-600 hover:text-red-600 mb-8 transition-colors">
        <ArrowLeft className="h-5 w-5 mr-2" /> Back to Shop
      </button>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="h-96 md:h-[600px] bg-gray-100 relative">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="ml-3 text-gray-500 text-sm">({product.numReviews || 0} Reviews)</span>
            </div>
            
            <p className="text-4xl font-bold text-red-600 mb-6">${product.price}</p>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">{product.description}</p>
            
            <div className="flex space-x-4">
              <button 
                onClick={() => addToCart(product)}
                className="flex-1 bg-red-600 text-white py-4 px-8 rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg shadow-red-200"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-xl border-2 transition-all ${isLiked ? 'border-red-200 text-red-500 bg-red-50' : 'border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'}`}
              >
                <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>
            
            <div className="mt-12 border-t pt-8">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Features</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Premium Materials</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>2 Year Warranty</li>
                <li className="flex items-center"><span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>Free Shipping</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
          {product.reviews?.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
          {product.reviews?.map((review) => (
            <div key={review._id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900">{review.name}</span>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
              </div>
              <p className="text-gray-500 text-xs mb-3">{review.createdAt?.substring(0,10)}</p>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm h-fit sticky top-24">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Write a Customer Review</h3>
          {user ? (
            <form onSubmit={submitReviewHandler}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none"
                  required
                  placeholder="Share your thoughts about this product..."
                ></textarea>
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-red-600 transition-colors shadow-lg shadow-gray-200">
                Submit Review
              </button>
            </form>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">Please sign in to write a review.</p>
              <button onClick={() => setCurrentPage('login')} className="px-6 py-2 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-colors">
                Sign In Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;