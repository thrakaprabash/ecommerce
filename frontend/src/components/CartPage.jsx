import React from 'react';
import { ShoppingCart, Trash2, ChevronRight, CheckCircle, ArrowLeft } from 'lucide-react';

const CartPage = ({ cart, removeFromCart, checkoutHandler, setCurrentPage }) => {
  const totalItems = cart.reduce((acc, item) => acc + Number(item.qty), 0);
  const totalPrice = cart.reduce((acc, item) => acc + Number(item.qty) * item.price, 0).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="bg-red-50 p-6 rounded-full mb-4">
            <ShoppingCart className="h-12 w-12 text-red-500" />
          </div>
          <p className="text-gray-500 text-xl mb-6">Your cart is currently empty.</p>
          <button 
            onClick={() => setCurrentPage('home')} 
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-red-600 hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3 space-y-6">
            {cart.map((item) => (
              <div key={item._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 transition-all hover:shadow-md">
                <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                  <img 
                    src={item.image || 'https://via.placeholder.com/150'} 
                    alt={item.name} 
                    loading="lazy"
                    onError={(e) => {e.target.src='https://via.placeholder.com/150?text=No+Image'; }}
                    className="w-full h-full object-contain p-2" 
                  />
                </div>
                
                <div className="flex-1 flex flex-col sm:flex-row justify-between w-full">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{item.brand}</p>
                    <p className="text-xl font-bold text-red-600">${item.price}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 mt-4 sm:mt-0">
                    <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 px-3 py-2">
                      <span className="text-gray-700 font-medium text-sm">Qty: {item.qty}</span>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item._id)} 
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                      title="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-medium">${totalPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Estimate</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax Estimate</span>
                  <span className="font-medium">$0.00</span>
                </div>
                
                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-red-600">${totalPrice}</span>
                </div>
              </div>

              <button 
                onClick={checkoutHandler}
                className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-600 transition-all shadow-lg hover:shadow-red-200 flex items-center justify-center group"
              >
                Proceed to Checkout
                <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center">
                <CheckCircle className="h-3 w-3 mr-1" /> Secure Checkout - 100% Guaranteed
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;