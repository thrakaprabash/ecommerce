import React from 'react';
import { ArrowLeft, CheckCircle, CreditCard, Truck, Loader } from 'lucide-react';

const OrderDetailsPage = ({ order, handlePay, setCurrentPage, loading }) => {
  if (!order) return <div className="p-12 text-center">Loading Order...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => setCurrentPage('my-orders')} className="flex items-center text-gray-600 hover:text-red-600 mb-8 transition-colors">
        <ArrowLeft className="h-5 w-5 mr-2" /> Back to My Orders
      </button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Order #{order._id.substring(0,8)}</h1>
        <span className="text-gray-500 text-sm">Placed on {order.createdAt?.substring(0,10)}</span>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-xl border border-gray-100 shadow-sm mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Order Status</h2>
        <div className="relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 rounded-full transition-all duration-1000"
            style={{ width: order.isDelivered ? '100%' : order.isPaid ? '50%' : '5%' }}
          ></div>
          
          <div className="relative flex justify-between">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white z-10 shadow-sm">
                <CheckCircle className="h-5 w-5" />
              </div>
              <span className="text-xs sm:text-sm font-medium mt-2 text-green-700">Placed</span>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shadow-sm ${order.isPaid ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                <CreditCard className="h-5 w-5" />
              </div>
              <span className={`text-xs sm:text-sm font-medium mt-2 ${order.isPaid ? 'text-green-700' : 'text-gray-500'}`}>Paid</span>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 shadow-sm ${order.isDelivered ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                <Truck className="h-5 w-5" />
              </div>
              <span className={`text-xs sm:text-sm font-medium mt-2 ${order.isDelivered ? 'text-green-700' : 'text-gray-500'}`}>Delivered</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3 space-y-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping</h2>
            <p className="mb-4 text-sm sm:text-base"><span className="font-semibold">Address:</span> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
            {order.isDelivered ? (
              <div className="bg-green-100 text-green-800 p-3 rounded-lg font-medium text-sm sm:text-base">Delivered at {order.deliveredAt?.substring(0, 10)}</div>
            ) : (
              <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg font-medium text-sm sm:text-base">Not Delivered</div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
            <p className="mb-4 text-sm sm:text-base"><span className="font-semibold">Method:</span> {order.paymentMethod}</p>
            {order.isPaid ? (
              <div className="bg-green-100 text-green-800 p-3 rounded-lg font-medium text-sm sm:text-base">Paid on {order.paidAt?.substring(0, 10)}</div>
            ) : (
              <div className="bg-red-100 text-red-800 p-3 rounded-lg font-medium text-sm sm:text-base">Not Paid</div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0">
                  <div className="flex items-center">
                    <img src={item.image} alt={item.name} className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-md mr-4" />
                    <span className="text-gray-800 text-sm sm:text-base">{item.name}</span>
                  </div>
                  <div className="text-gray-600 font-medium text-sm sm:text-base">
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
              <div className="flex justify-between"><span>Items</span><span>${order.itemsPrice?.toFixed(2)}</span></div>
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

export default OrderDetailsPage;