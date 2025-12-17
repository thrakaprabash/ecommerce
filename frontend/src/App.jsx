import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, User, Search, Menu, X, Star, Heart, ArrowLeft, Trash2, Plus, Settings, LogOut, Package, Loader, Save, Edit, ChevronRight, Upload, Camera, Truck, CreditCard, CheckCircle, List, Filter } from 'lucide-react';

// Use 127.0.0.1 to prevent localhost IPv6 lookup delays (often causes 1s+ or 1m+ timeouts)
const API_URL = 'http://127.0.0.1:5000/api';

// ==========================================
// SECTION: UTILITY COMPONENTS
// ==========================================

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (pageNumbers.length <= 1) return null;

  return (
    <nav className="flex justify-center mt-8">
      <ul className="flex space-x-2">
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
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

// ==========================================
// SECTION: SHARED COMPONENTS
// ==========================================

const Navbar = React.memo(({ user, cartCount, setCurrentPage, handleLogout, isMenuOpen, setIsMenuOpen, handleSearch }) => {
  const [keyword, setKeyword] = useState('');

  const submitSearch = (e) => {
    e.preventDefault();
    handleSearch(keyword);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => { handleSearch(''); setCurrentPage('home'); }}>
              <img 
                src="https://placehold.co/150x50/ffffff/dc2626?text=PABA&font=montserrat" 
                alt="PABA Logo" 
                className="h-10 w-auto object-contain"
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
                className="w-full bg-gray-100 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
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
                  {/* Profile Picture in Navbar */}
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
              <span className="ml-1 font-medium hidden">Cart</span>
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
                placeholder="Search..."
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

// ==========================================
// SECTION: CHECKOUT & CART COMPONENTS
// ==========================================

const CartPage = ({ cart, removeFromCart, checkoutHandler, setCurrentPage }) => {
  const totalItems = cart.reduce((acc, item) => acc + Number(item.qty), 0);
  const totalPrice = cart.reduce((acc, item) => acc + Number(item.qty) * item.price, 0).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>
      
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
          {/* Cart Items List */}
          <div className="lg:w-2/3 space-y-6">
            {cart.map((item) => (
              <div key={item._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6 transition-all hover:shadow-md">
                <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                    <img 
                      src={item.image || 'https://via.placeholder.com/150'} 
                      alt={item.name} 
                      loading="lazy"
                      onError={(e) => { e.target.onerror=null; e.target.src='https://via.placeholder.com/150?text=No+Image'; }}
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

          {/* Order Summary */}
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

const ShippingAddressPage = ({ shippingAddress, saveShippingAddress, setCurrentPage }) => {
  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');

  const submitHandler = (e) => {
    e.preventDefault();
    saveShippingAddress({ address, city, postalCode, country });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-8 space-x-4 text-sm font-medium">
            <span className="flex items-center text-red-600"><CheckCircle className="h-5 w-5 mr-2" /> Cart</span>
            <span className="h-px w-10 bg-red-600"></span>
            <span className="flex items-center text-red-600"><Truck className="h-5 w-5 mr-2" /> Shipping</span>
            <span className="h-px w-10 bg-gray-300"></span>
            <span className="flex items-center text-gray-400"><CreditCard className="h-5 w-5 mr-2" /> Payment</span>
            <span className="h-px w-10 bg-gray-300"></span>
            <span className="flex items-center text-gray-400"><CheckCircle className="h-5 w-5 mr-2" /> Confirm</span>
        </div>

        <button onClick={() => setCurrentPage('cart')} className="flex items-center text-gray-600 hover:text-red-600 mb-8 transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" /> Back to Cart
        </button>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gray-900 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Shipping Address</h2>
          </div>
          
          <form onSubmit={submitHandler} className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="123 Main St"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                />
                </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="flex items-center px-8 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
              >
                Continue to Payment
                <ChevronRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const PaymentPage = ({ savePaymentMethod, setCurrentPage }) => {
  const [paymentMethod, setPaymentMethod] = useState('Stripe');

  const submitHandler = (e) => {
    e.preventDefault();
    savePaymentMethod(paymentMethod);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-8 space-x-4 text-sm font-medium">
            <span className="flex items-center text-red-600"><CheckCircle className="h-5 w-5 mr-2" /> Cart</span>
            <span className="h-px w-10 bg-red-600"></span>
            <span className="flex items-center text-red-600"><Truck className="h-5 w-5 mr-2" /> Shipping</span>
            <span className="h-px w-10 bg-red-600"></span>
            <span className="flex items-center text-red-600"><CreditCard className="h-5 w-5 mr-2" /> Payment</span>
            <span className="h-px w-10 bg-gray-300"></span>
            <span className="flex items-center text-gray-400"><CheckCircle className="h-5 w-5 mr-2" /> Confirm</span>
        </div>

        <button onClick={() => setCurrentPage('shipping')} className="flex items-center text-gray-600 hover:text-red-600 mb-8 transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" /> Back to Shipping
        </button>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gray-900 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Payment Method</h2>
          </div>
          
          <form onSubmit={submitHandler} className="p-8 space-y-6">
            <div>
              <legend className="text-base font-medium text-gray-900 mb-4">Select Method</legend>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="stripe"
                    name="paymentMethod"
                    type="radio"
                    value="Stripe"
                    checked={paymentMethod === 'Stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="focus:ring-red-500 h-4 w-4 text-red-600 border-gray-300"
                  />
                  <label htmlFor="stripe" className="ml-3 block text-sm font-medium text-gray-700">
                    Stripe / Credit Card
                  </label>
                </div>
                {/* Add more methods like PayPal here if needed */}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="flex items-center px-8 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
              >
                Continue
                <ChevronRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const PlaceOrderPage = ({ cart, shippingAddress, paymentMethod, placeOrderHandler, setCurrentPage, loading }) => {
  // Calculate Prices
  const itemsPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping over $100
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2)); // 15% Tax
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  const handlePlaceOrder = () => {
    // Map _id to product for backend
    const orderItems = cart.map((item) => ({
      name: item.name,
      qty: item.qty,
      image: item.image,
      price: item.price,
      product: item._id, 
    }));

    placeOrderHandler({
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice: itemsPrice.toFixed(2),
      shippingPrice: shippingPrice.toFixed(2),
      taxPrice: taxPrice.toFixed(2),
      totalPrice,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
       <div className="flex items-center justify-center mb-8 space-x-4 text-sm font-medium">
            <span className="flex items-center text-red-600"><CheckCircle className="h-5 w-5 mr-2" /> Cart</span>
            <span className="h-px w-10 bg-red-600"></span>
            <span className="flex items-center text-red-600"><Truck className="h-5 w-5 mr-2" /> Shipping</span>
            <span className="h-px w-10 bg-red-600"></span>
            <span className="flex items-center text-red-600"><CreditCard className="h-5 w-5 mr-2" /> Payment</span>
            <span className="h-px w-10 bg-red-600"></span>
            <span className="flex items-center text-red-600"><CheckCircle className="h-5 w-5 mr-2" /> Confirm</span>
        </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3 space-y-8">
          {/* Shipping Info */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Shipping</h2>
            <p className="text-gray-600">
              <span className="font-semibold text-gray-800">Address: </span>
              {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Payment Method</h2>
            <p className="text-gray-600">
              <span className="font-semibold text-gray-800">Method: </span>
              {paymentMethod}
            </p>
          </div>

          {/* Order Items */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Order Items</h2>
            {cart.length === 0 ? <p>Cart is empty</p> : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img src={item.image} alt={item.name} className="h-12 w-12 object-cover rounded-md mr-4" />
                      <span className="text-gray-800 font-medium">{item.name}</span>
                    </div>
                    <div className="text-gray-600">
                      {item.qty} x ${item.price} = <span className="font-bold text-gray-900">${(item.qty * item.price).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Order Summary</h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex justify-between"><span>Items</span><span>${itemsPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>${shippingPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>${taxPrice.toFixed(2)}</span></div>
              <div className="border-t pt-3 mt-3 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${totalPrice}</span>
              </div>
            </div>
            <button 
              onClick={handlePlaceOrder}
              disabled={cart.length === 0 || loading}
              className="w-full mt-8 bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50 flex justify-center items-center"
            >
              {loading ? <Loader className="animate-spin h-6 w-6" /> : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderDetailsPage = ({ order, handlePay, setCurrentPage, loading }) => {
  if (!order) return <div className="p-12 text-center">Loading Order...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button onClick={() => setCurrentPage('my-orders')} className="flex items-center text-gray-600 hover:text-red-600 mb-8 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to My Orders
        </button>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order #{order._id.substring(0,8)}</h1>
        <span className="text-gray-500 text-sm">Placed on {order.createdAt?.substring(0,10)}</span>
      </div>

      {/* Progress Bar (Tracking) */}
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Status</h2>
            <div className="relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full"></div>
                <div 
                    className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 rounded-full transition-all duration-1000"
                    style={{ width: order.isDelivered ? '100%' : order.isPaid ? '50%' : '5%' }}
                ></div>
                
                <div className="relative flex justify-between">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white z-10">
                            <CheckCircle className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium mt-2 text-green-700">Placed</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${order.isPaid ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                            <CreditCard className="h-5 w-5" />
                        </div>
                        <span className={`text-sm font-medium mt-2 ${order.isPaid ? 'text-green-700' : 'text-gray-500'}`}>Paid</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${order.isDelivered ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                            <Truck className="h-5 w-5" />
                        </div>
                        <span className={`text-sm font-medium mt-2 ${order.isDelivered ? 'text-green-700' : 'text-gray-500'}`}>Delivered</span>
                    </div>
                </div>
            </div>
        </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3 space-y-8">
           {/* Shipping Status */}
           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping</h2>
            <p className="mb-4"><span className="font-semibold">Address:</span> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
            {order.isDelivered ? (
                <div className="bg-green-100 text-green-800 p-3 rounded-lg font-medium">Delivered at {order.deliveredAt?.substring(0, 10)}</div>
            ) : (
                <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg font-medium">Not Delivered</div>
            )}
          </div>

          {/* Payment Status */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
            <p className="mb-4"><span className="font-semibold">Method:</span> {order.paymentMethod}</p>
            {order.isPaid ? (
                <div className="bg-green-100 text-green-800 p-3 rounded-lg font-medium">Paid on {order.paidAt?.substring(0, 10)}</div>
            ) : (
                <div className="bg-red-100 text-red-800 p-3 rounded-lg font-medium">Not Paid</div>
            )}
          </div>

          {/* Items */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0">
                    <div className="flex items-center">
                      <img src={item.image} alt={item.name} className="h-12 w-12 object-cover rounded-md mr-4" />
                      <span className="text-gray-800">{item.name}</span>
                    </div>
                    <div className="text-gray-600 font-medium">
                      {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex justify-between"><span>Items</span><span>${order.itemsPrice?.toFixed(2) || (order.totalPrice - order.taxPrice - order.shippingPrice).toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>${order.shippingPrice?.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>${order.taxPrice?.toFixed(2)}</span></div>
              <div className="border-t pt-3 mt-3 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${order.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
            
            {!order.isPaid && (
                <div className="mt-8">
                    <button 
                        onClick={() => handlePay(order._id)}
                        disabled={loading}
                        className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition-all shadow-lg hover:shadow-green-200 flex items-center justify-center disabled:opacity-50"
                    >
                        {loading ? <Loader className="animate-spin h-6 w-6 mr-2" /> : <CreditCard className="h-5 w-5 mr-2" />}
                        {loading ? 'Processing...' : 'Pay Now (Demo Stripe)'}
                    </button>
                    <p className="text-xs text-gray-400 text-center mt-3">Click to simulate a successful Stripe payment.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// SECTION: MY ORDERS PAGE
// ==========================================

const MyOrdersPage = ({ user, setCurrentPage, handleOrderClick }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`${API_URL}/orders/myorders`, config);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders');
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  const cancelOrderHandler = async (id) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        // Attempt to call delete endpoint. Note: Backend must support DELETE /api/orders/:id
        await axios.delete(`${API_URL}/orders/${id}`, config);
        setOrders(orders.filter((order) => order._id !== id));
        alert('Order Cancelled Successfully');
      } catch (err) {
        console.error(err);
        // Improved error message to show actual server response
        const errorMessage = err.response && err.response.data && err.response.data.message 
            ? err.response.data.message 
            : 'Failed to cancel order';
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h2>
      {loading ? (
        <div className="flex justify-center py-20"><Loader className="animate-spin h-10 w-10 text-red-600" /></div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-500">You have no orders.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id.substring(0,8)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.createdAt.substring(0, 10)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.totalPrice}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.isPaid ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Paid
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Not Paid
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {order.isDelivered ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Delivered
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Processing
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                     <button 
                      onClick={() => handleOrderClick(order._id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Track
                    </button>
                    {!order.isPaid && (
                        <button 
                        onClick={() => cancelOrderHandler(order._id)}
                        className="text-red-600 hover:text-red-900"
                        >
                        Cancel
                        </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ==========================================
// SECTION: USER PROFILE COMPONENTS
// ==========================================

const ProfilePage = ({ user, handleUpdateProfile, setCurrentPage, loading }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState(user?.image || ''); // Image state
  const [message, setMessage] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      // Include image in update payload
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
            {/* Header Avatar Preview */}
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
              
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                 <label className="cursor-pointer flex flex-col items-center space-y-2">
                    <div className="p-3 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors">
                        <Camera className="h-6 w-6 text-red-600" />
                    </div>
                    <span className="text-sm text-gray-500 font-medium">Change Profile Photo</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                 </label>
                 {image && <p className="text-xs text-green-600 mt-2">New image selected</p>}
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

// ==========================================
// SECTION: ADMIN COMPONENTS
// ==========================================

// --- Create Product Form ---
const AdminProductForm = ({ handleCreateProduct, setCurrentPage }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    handleCreateProduct({
      name,
      price: Number(price),
      image,
      brand,
      category,
      countInStock: Number(countInStock),
      description,
    });
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => setCurrentPage('admin-dashboard')} className="flex items-center text-gray-600 hover:text-red-600 mb-8 transition-colors">
        <ArrowLeft className="h-5 w-5 mr-2" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gray-900 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">Create New Product</h2>
        </div>
        
        <form onSubmit={submitHandler} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="e.g. Wireless Noise Cancelling Headphones"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Count In Stock</label>
              <input
                type="number"
                required
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="Electronics"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                placeholder="Sony"
              />
            </div>

             <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
              
              {image && (
                <div className="mb-4 h-48 w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200 flex justify-center items-center">
                  <img src={image} alt="Preview" className="h-full object-contain" />
                </div>
              )}

              {/* File Upload Input */}
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
             <button
              type="submit"
              className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
            >
              <Save className="h-5 w-5 mr-2" />
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Edit Product Form ---
const AdminEditProductForm = ({ product, handleUpdateProduct, setCurrentPage }) => {
  const [name, setName] = useState(product?.name || '');
  const [price, setPrice] = useState(product?.price || 0);
  const [image, setImage] = useState(product?.image || '');
  const [brand, setBrand] = useState(product?.brand || '');
  const [category, setCategory] = useState(product?.category || '');
  const [countInStock, setCountInStock] = useState(product?.countInStock || 0);
  const [description, setDescription] = useState(product?.description || '');

  const submitHandler = (e) => {
    e.preventDefault();
    handleUpdateProduct(product._id, {
      name,
      price: Number(price),
      image,
      brand,
      category,
      countInStock: Number(countInStock),
      description,
    });
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => setCurrentPage('admin-dashboard')} className="flex items-center text-gray-600 hover:text-red-600 mb-8 transition-colors">
        <ArrowLeft className="h-5 w-5 mr-2" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gray-900 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">Edit Product</h2>
        </div>
        
        <form onSubmit={submitHandler} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Count In Stock</label>
              <input
                type="number"
                required
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>

             <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
              
              {image && (
                <div className="mb-4 h-48 w-full bg-gray-50 rounded-lg overflow-hidden border border-gray-200 flex justify-center items-center">
                  <img src={image} alt="Preview" className="h-full object-contain" />
                </div>
              )}

              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload new image</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
             <button
              type="submit"
              className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
            >
              <Save className="h-5 w-5 mr-2" />
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Admin Dashboard ---
const AdminDashboard = ({ products, orders, handleDeleteProduct, handleEditClick, handleDeliverOrder, setCurrentPage }) => {
  // Client-side pagination state
  const [prodPage, setProdPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const [activeTab, setActiveTab] = useState('products');
  const itemsPerPage = 10;

  // Pagination Logic
  const indexOfLastProd = prodPage * itemsPerPage;
  const indexOfFirstProd = indexOfLastProd - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstProd, indexOfLastProd);

  const indexOfLastOrder = orderPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-500 mt-1">Manage store inventory and customer orders</p>
        </div>
        <div className="flex space-x-4 bg-gray-100 p-1 rounded-lg">
             <button 
                onClick={() => setActiveTab('products')} 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
             >
                Products
             </button>
             <button 
                onClick={() => setActiveTab('orders')} 
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
             >
                Orders
             </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
             <p className="text-gray-500 text-sm font-medium uppercase">Total {activeTab === 'products' ? 'Products' : 'Orders'}</p>
             <p className="text-3xl font-bold text-gray-900 mt-1">{activeTab === 'products' ? products.length : orders.length}</p>
          </div>
          <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center">
            {activeTab === 'products' ? <Package className="h-6 w-6 text-red-600" /> : <Truck className="h-6 w-6 text-red-600" />}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
             <p className="text-gray-500 text-sm font-medium uppercase">Total Value</p>
             <p className="text-3xl font-bold text-gray-900 mt-1">
                 ${activeTab === 'products' 
                    ? products.reduce((acc, item) => acc + (item.price * item.countInStock), 0).toLocaleString() 
                    : orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0).toLocaleString()}
             </p>
          </div>
           <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
            <div className="text-green-600 font-bold text-xl">$</div>
          </div>
        </div>
  
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
             <p className="text-gray-500 text-sm font-medium uppercase">System Status</p>
             <div className="flex items-center mt-2">
               <span className="h-2.5 w-2.5 bg-green-500 rounded-full mr-2"></span>
               <span className="text-sm font-bold text-gray-900">Online</span>
             </div>
          </div>
           <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
            <Settings className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      {activeTab === 'products' ? (
        <>
            <div className="flex justify-end mb-6">
                <button 
                    onClick={() => setCurrentPage('admin-create-product')}
                    className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-200 font-medium"
                >
                    <Plus className="h-5 w-5 mr-2" /> Create New Product
                </button>
            </div>
            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-semibold text-gray-900">Product Inventory</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {products.length === 0 && (
                    <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No products found in the database. Add one to get started!</td>
                    </tr>
                    )}
                    {currentProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            <img className="h-full w-full object-cover" src={product.image || 'https://via.placeholder.com/40?text=No+Img'} alt="" />
                            </div>
                            <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.brand}</div>
                            </div>
                        </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                            {product.category || 'General'}
                        </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">${product.price}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{product.countInStock || 0} units</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => handleEditClick(product)} className="text-blue-600 hover:text-blue-900 transition-colors p-2 hover:bg-blue-50 rounded-full">
                            <Edit className="h-5 w-5" />
                            </button>
                            <button onClick={() => handleDeleteProduct(product._id)} className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-full">
                            <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            {/* Products Pagination */}
            <Pagination itemsPerPage={itemsPerPage} totalItems={products.length} paginate={setProdPage} currentPage={prodPage} />
            </div>
        </>
      ) : (
          // Orders View
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-semibold text-gray-900">Customer Orders</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivered</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {currentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.user && order.user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.createdAt.substring(0, 10)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.totalPrice}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {order.isPaid ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {order.paidAt.substring(0, 10)}
                            </span>
                        ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Not Paid
                            </span>
                        )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {order.isDelivered ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Delivered
                            </span>
                        ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                            </span>
                        )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {order.isPaid && !order.isDelivered && (
                                <button 
                                    onClick={() => handleDeliverOrder(order._id)}
                                    className="text-blue-600 hover:text-blue-900 font-medium"
                                >
                                    Mark Delivered
                                </button>
                            )}
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            {/* Orders Pagination */}
            <Pagination itemsPerPage={itemsPerPage} totalItems={orders.length} paginate={setOrderPage} currentPage={orderPage} />
        </div>
      )}
    </div>
  );
};

// ==========================================
// SECTION: PUBLIC PAGE COMPONENTS
// ==========================================

const Hero = () => (
  <div className="relative bg-white overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
        <svg className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polygon points="50,0 100,0 50,100 0,100" />
        </svg>
        <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
          <div className="sm:text-center lg:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block xl:inline">Modern Tech</span>{' '}
              <span className="block text-red-600 xl:inline">Best Prices</span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              Upgrade your lifestyle with our curated collection of premium gadgets. Exclusive deals available for a limited time.
            </p>
            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
              <div className="rounded-md shadow">
                <button onClick={() => document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 md:py-4 md:text-lg transition-all">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
      <img className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="https://images.unsplash.com/photo-1555529733-0e670560f7e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" alt="Hero Tech" />
    </div>
  </div>
);

const ProductList = React.memo(({ products, loading, error, handleProductClick, addToCart, wishlist, toggleWishlist, handleSort }) => {
  // Client-side pagination for Product List
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Reset page when products change (e.g. search)
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
      
      {/* Sort Dropdown */}
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
            )})}
        </div>
        <Pagination itemsPerPage={itemsPerPage} totalItems={products.length} paginate={setCurrentPage} currentPage={currentPage} />
      </>
    )}
  </div>
  );
});

const LoginPage = ({ handleLogin, setCurrentPage, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or <button onClick={() => setCurrentPage('signup')} className="font-medium text-red-600 hover:text-red-500">create a new account</button>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleLogin(email, password); }}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-50">
              {loading ? <Loader className="animate-spin h-5 w-5 mx-auto" /> : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SignupPage = ({ handleRegister, setCurrentPage, loading }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account? <button onClick={() => setCurrentPage('login')} className="font-medium text-red-600 hover:text-red-500">Sign in</button>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={(e) => { e.preventDefault(); handleRegister(name, email, password); }}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input 
                type="text" 
                required 
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm" 
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <input 
                type="email" 
                required 
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm" 
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input 
                type="password" 
                required 
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm" 
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div>
            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-50">
              {loading ? <Loader className="animate-spin h-5 w-5 mx-auto" /> : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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

    {/* Reviews Section */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Reviews List */}
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
            {product.reviews.length === 0 && <p className="text-gray-500">No reviews yet.</p>}
            {product.reviews.map((review) => (
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

        {/* Write Review Form */}
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

// ==========================================
// SECTION: MAIN APP COMPONENT
// ==========================================

const App = () => {
  // --- Global State ---
  const [currentPage, setCurrentPage] = useState('home'); 
  const [user, setUser] = useState(null); 
  // Load Cart from LocalStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [shippingAddress, setShippingAddress] = useState({}); 
  const [paymentMethod, setPaymentMethod] = useState('Stripe'); // Added Payment Method State
  const [products, setProducts] = useState([]); 
  const [adminOrders, setAdminOrders] = useState([]); // State for admin orders
  const [selectedProduct, setSelectedProduct] = useState(null); 
  const [selectedOrder, setSelectedOrder] = useState(null); // Added for displaying order details
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [wishlist, setWishlist] = useState([]); 
  const [keyword, setKeyword] = useState('');
  const [sortOption, setSortOption] = useState('latest');
  const [actionLoading, setActionLoading] = useState(false);

  // --- Init & Data Fetching ---
  useEffect(() => {
    // 1. Check for saved user login
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }

    // 2. Check for saved shipping address
    const savedAddress = localStorage.getItem('shippingAddress');
    if (savedAddress) {
        setShippingAddress(JSON.parse(savedAddress));
    }

    // 3. Check for saved payment method
    const savedPaymentMethod = localStorage.getItem('paymentMethod');
    if (savedPaymentMethod) {
        setPaymentMethod(JSON.parse(savedPaymentMethod));
    }

    // 4. Load Wishlist from LocalStorage
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
    }

    // Fetch Products initially
    fetchProducts();
  }, []);

  // Fetch orders when user (admin) changes
  useEffect(() => {
    if (user && user.isAdmin) {
      fetchAdminOrders();
    }
  }, [user]);

  // Save Cart to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cart));
  }, [cart]);

  // 5. Fetch Products from Backend (with search/sort)
  const fetchProducts = async (searchKeyword = '', sort = 'latest') => {
    setLoading(true);
    try {
      // Build query string
      let query = `${API_URL}/products?`;
      if (searchKeyword) query += `keyword=${searchKeyword}&`;
      if (sort) query += `sort=${sort}`;

      const { data } = await axios.get(query);
      setProducts(data);
    } catch (err) {
      setError('Error connecting to backend. Make sure server is running on port 5000.');
      console.error(err);
    }
    setLoading(false);
  };

  const fetchAdminOrders = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${API_URL}/orders`, config);
      setAdminOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  const handleSearch = (newKeyword) => {
    setKeyword(newKeyword);
    fetchProducts(newKeyword, sortOption);
  };

  const handleSort = (newSort) => {
    setSortOption(newSort);
    fetchProducts(keyword, newSort);
  };

  // --- Actions ---
  
  const handleLogin = async (email, password) => {
    setActionLoading(true);
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post(`${API_URL}/users/login`, { email, password }, config);
      
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      if (data.isAdmin) {
        setCurrentPage('admin-dashboard');
      } else {
        setCurrentPage('home');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Invalid email or password');
    } finally {
        setActionLoading(false);
    }
  };

  const handleRegister = async (name, email, password) => {
    setActionLoading(true);
    try {
      const config = { headers: { 'Content-Type': 'application/json' } };
      const { data } = await axios.post(`${API_URL}/users`, { name, email, password }, config);
      
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      setCurrentPage('home');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
        setActionLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    setCurrentPage('home');
    setCart([]);
  };

  const handleDeleteProduct = async (id) => {
    if (!user || !user.token) {
        alert("You are not logged in or token is missing.");
        return;
    }
    
    if (!id) {
        console.error("Attempted to delete product without an ID");
        alert("Error: Product ID is missing. Cannot delete.");
        return;
    }

    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        await axios.delete(`${API_URL}/products/${id}`, config);
        setProducts(products.filter((p) => p._id !== id));
        alert("Product deleted successfully");
      } catch (err) {
        console.error("Delete Error:", err);
        const errorMessage = err.response && err.response.data && err.response.data.message 
            ? err.response.data.message 
            : err.message;
        alert(`Delete failed: ${errorMessage}`);
      }
    }
  };

  const handleCreateProduct = async (productData) => {
    if (!user || !user.token) {
        alert("You are not logged in or token is missing.");
        return;
    }

    try {
      const config = {
        headers: {
           'Content-Type': 'application/json',
           Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`${API_URL}/products`, productData, config);
      setProducts([...products, data]);
      alert('Product created successfully');
      setCurrentPage('admin-dashboard');
    } catch (err) {
      console.error("Create Error:", err);
      const errorMessage = err.response && err.response.data && err.response.data.message 
            ? err.response.data.message 
            : err.message;
      alert(`Product creation failed: ${errorMessage}`);
    }
  };

  const handleUpdateProduct = async (id, productData) => {
    if (!user || !user.token) {
        alert("You are not logged in or token is missing.");
        return;
    }

     try {
      const config = {
        headers: {
           'Content-Type': 'application/json',
           Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(`${API_URL}/products/${id}`, productData, config);
      const updatedProducts = products.map(p => p._id === id ? data : p);
      setProducts(updatedProducts);
      alert('Product updated successfully');
      setCurrentPage('admin-dashboard');
    } catch (err) {
      console.error("Update Error:", err);
      const errorMessage = err.response && err.response.data && err.response.data.message 
            ? err.response.data.message 
            : err.message;
      alert(`Product update failed: ${errorMessage}`);
    }
  };

  const handleUpdateProfile = async (userData) => {
    if (!user || !user.token) {
        alert("You are not logged in or token is missing.");
        return;
    }
    setActionLoading(true);
    try {
      const config = {
        headers: {
           'Content-Type': 'application/json',
           Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(`${API_URL}/users/profile`, userData, config);
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (err) {
      console.error("Profile Error:", err);
      const errorMessage = err.response && err.response.data && err.response.data.message 
            ? err.response.data.message 
            : err.message;
      alert(`Profile update failed: ${errorMessage}`);
    } finally {
        setActionLoading(false);
    }
  };

  const handleCreateReview = async (productId, reviewData) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
        };
        await axios.post(`${API_URL}/products/${productId}/reviews`, reviewData, config);
        alert('Review Submitted!');
        const { data } = await axios.get(`${API_URL}/products/${productId}`);
        setSelectedProduct(data);
        const prodRes = await axios.get(`${API_URL}/products`);
        setProducts(prodRes.data);
    } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Review submission failed');
    }
  };

  const handleDeliverOrder = async (orderId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.put(`${API_URL}/orders/${orderId}/deliver`, {}, config);
      fetchAdminOrders(); // Refresh orders list
      alert('Order Marked as Delivered');
    } catch (error) {
      console.error(error);
      alert('Failed to mark as delivered');
    }
  };

  const addToCart = (product) => {
    const existItem = cart.find((x) => x._id === product._id);
    if (existItem) {
      setCart(cart.map((x) => (x._id === product._id ? { ...x, qty: x.qty + 1 } : x)));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((x) => x._id !== id));
  };

  const toggleWishlist = (product) => {
    const exists = wishlist.find((p) => p._id === product._id);
    let updatedWishlist;
    if (exists) {
        updatedWishlist = wishlist.filter((p) => p._id !== product._id);
    } else {
        updatedWishlist = [...wishlist, product];
    }
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  const checkoutHandler = () => {
    if (user) {
        setCurrentPage('shipping');
    } else {
        alert("Please sign in to continue to checkout.");
        setCurrentPage('login');
    }
  };

  const saveShippingAddress = (data) => {
    setShippingAddress(data);
    localStorage.setItem('shippingAddress', JSON.stringify(data));
    setCurrentPage('payment');
  };

  const savePaymentMethod = (data) => {
    setPaymentMethod(data);
    localStorage.setItem('paymentMethod', JSON.stringify(data));
    setCurrentPage('placeorder');
  };

  const placeOrderHandler = async (order) => {
    setActionLoading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      const { data } = await axios.post(`${API_URL}/orders`, order, config);
      setCart([]);
      setSelectedOrder(data);
      setCurrentPage('order-details');
    } catch (error) {
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message;
      alert(`Order Failed: ${errorMessage}`);
    } finally {
        setActionLoading(false);
    }
  };

  const handlePay = async (orderId) => {
    setActionLoading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const paymentResult = {
        id: `PAYID-${Math.floor(Math.random() * 1000000)}`,
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: user.email,
      };
      const { data } = await axios.put(`${API_URL}/orders/${orderId}/pay`, paymentResult, config);
      setSelectedOrder(data);
      alert('Payment Successful!');
    } catch (error) {
        console.error(error);
        alert('Payment Failed');
    } finally {
        setActionLoading(false);
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product-details');
  };

  const handleOrderClick = async (orderId) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${API_URL}/orders/${orderId}`, config);
      setSelectedOrder(data);
      setCurrentPage('order-details');
    } catch (err) {
      console.error(err);
      alert('Failed to fetch order details');
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setCurrentPage('admin-edit-product');
  };

  // --- Main Render Logic ---
  const renderContent = () => {
    switch (currentPage) {
      case 'login': 
        return <LoginPage handleLogin={handleLogin} setCurrentPage={setCurrentPage} loading={actionLoading} />;
      case 'signup': 
        return <SignupPage handleRegister={handleRegister} setCurrentPage={setCurrentPage} loading={actionLoading} />;
      case 'profile':
        return <ProfilePage user={user} handleUpdateProfile={handleUpdateProfile} setCurrentPage={setCurrentPage} loading={actionLoading} />;
      case 'my-orders':
        return <MyOrdersPage user={user} setCurrentPage={setCurrentPage} handleOrderClick={handleOrderClick} />;
      case 'product-details': 
        return <ProductDetails product={selectedProduct} addToCart={addToCart} setCurrentPage={setCurrentPage} user={user} handleCreateReview={handleCreateReview} wishlist={wishlist} toggleWishlist={toggleWishlist} />;
      case 'cart': 
        return <CartPage cart={cart} removeFromCart={removeFromCart} checkoutHandler={checkoutHandler} setCurrentPage={setCurrentPage} />;
      case 'shipping':
        return <ShippingAddressPage shippingAddress={shippingAddress} saveShippingAddress={saveShippingAddress} setCurrentPage={setCurrentPage} />;
      case 'payment':
        return <PaymentPage savePaymentMethod={savePaymentMethod} setCurrentPage={setCurrentPage} />;
      case 'placeorder':
        return <PlaceOrderPage cart={cart} shippingAddress={shippingAddress} paymentMethod={paymentMethod} placeOrderHandler={placeOrderHandler} setCurrentPage={setCurrentPage} loading={actionLoading} />;
      case 'order-details':
        return <OrderDetailsPage order={selectedOrder} handlePay={handlePay} setCurrentPage={setCurrentPage} loading={actionLoading} />;
      case 'admin-dashboard': 
        return user?.isAdmin ? 
          <AdminDashboard products={products} orders={adminOrders} handleDeleteProduct={handleDeleteProduct} handleEditClick={handleEditClick} handleDeliverOrder={handleDeliverOrder} setCurrentPage={setCurrentPage} /> 
          : <div className="p-8 text-center text-red-600 font-bold">Access Denied: Admin Only</div>;
      case 'admin-create-product':
        return user?.isAdmin ?
          <AdminProductForm handleCreateProduct={handleCreateProduct} setCurrentPage={setCurrentPage} />
          : <div className="p-8 text-center text-red-600 font-bold">Access Denied: Admin Only</div>;
      case 'admin-edit-product':
        return user?.isAdmin ?
          <AdminEditProductForm product={selectedProduct} handleUpdateProduct={handleUpdateProduct} setCurrentPage={setCurrentPage} />
          : <div className="p-8 text-center text-red-600 font-bold">Access Denied: Admin Only</div>;
      case 'home':
      default:
        return (
          <>
            <Hero />
            <ProductList 
              products={products} 
              loading={loading} 
              error={error} 
              handleProductClick={handleProductClick} 
              addToCart={addToCart} 
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              handleSort={handleSort}
            />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
      <Navbar 
        user={user} 
        cartCount={cart.reduce((acc, item) => acc + item.qty, 0)} 
        setCurrentPage={setCurrentPage} 
        handleLogout={handleLogout} 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen} 
        handleSearch={handleSearch}
      />
      {renderContent()}
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default App;