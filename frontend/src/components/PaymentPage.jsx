import React, { useState } from 'react';
import { ArrowLeft, Truck, CreditCard, CheckCircle, ChevronRight } from 'lucide-react';

const PaymentPage = ({ savePaymentMethod, setCurrentPage }) => {
  const [paymentMethod, setPaymentMethod] = useState('Stripe');

  const submitHandler = (e) => {
    e.preventDefault();
    savePaymentMethod(paymentMethod);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-8 space-x-2 sm:space-x-4 text-xs sm:text-sm font-medium overflow-x-auto whitespace-nowrap">
          <span className="flex items-center text-red-600"><CheckCircle className="h-5 w-5 mr-1 sm:mr-2" /> Cart</span>
          <span className="h-px w-6 sm:w-10 bg-red-600"></span>
          <span className="flex items-center text-red-600"><Truck className="h-5 w-5 mr-1 sm:mr-2" /> Shipping</span>
          <span className="h-px w-6 sm:w-10 bg-red-600"></span>
          <span className="flex items-center text-red-600"><CreditCard className="h-5 w-5 mr-1 sm:mr-2" /> Payment</span>
          <span className="h-px w-6 sm:w-10 bg-gray-300"></span>
          <span className="flex items-center text-gray-400"><CheckCircle className="h-5 w-5 mr-1 sm:mr-2" /> Confirm</span>
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

export default PaymentPage;