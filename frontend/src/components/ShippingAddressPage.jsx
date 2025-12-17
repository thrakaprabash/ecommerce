import React, { useState } from 'react';
import { ArrowLeft, Truck, CreditCard, CheckCircle, ChevronRight } from 'lucide-react';

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
        <div className="flex items-center justify-center mb-8 space-x-2 sm:space-x-4 text-xs sm:text-sm font-medium overflow-x-auto whitespace-nowrap">
          <span className="flex items-center text-red-600"><CheckCircle className="h-5 w-5 mr-1 sm:mr-2" /> Cart</span>
          <span className="h-px w-6 sm:w-10 bg-red-600"></span>
          <span className="flex items-center text-red-600"><Truck className="h-5 w-5 mr-1 sm:mr-2" /> Shipping</span>
          <span className="h-px w-6 sm:w-10 bg-gray-300"></span>
          <span className="flex items-center text-gray-400"><CreditCard className="h-5 w-5 mr-1 sm:mr-2" /> Payment</span>
          <span className="h-px w-6 sm:w-10 bg-gray-300"></span>
          <span className="flex items-center text-gray-400"><CheckCircle className="h-5 w-5 mr-1 sm:mr-2" /> Confirm</span>
        </div>

        <button onClick={() => setCurrentPage('cart')} className="flex items-center text-gray-600 hover:text-red-600 mb-8 transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" /> Back to Cart
        </button>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gray-900 px-8 py-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Shipping Address</h2>
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

export default ShippingAddressPage;