import React from 'react';
import { Truck, CreditCard, CheckCircle, Loader, ChevronRight } from 'lucide-react';

const PlaceOrderPage = ({ cart, shippingAddress, paymentMethod, placeOrderHandler, setCurrentPage, loading }) => {
  const itemsPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  const handlePlaceOrder = () => {
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
      <div className="flex items-center justify-center mb-8 space-x-2 sm:space-x-4 text-xs sm:text-sm font-medium overflow-x-auto whitespace-nowrap">
        <span className="flex items-center text-red-600"><CheckCircle className="h-5 w-5 mr-1 sm:mr-2" /> Cart</span>
        <span className="h-px w-6 sm:w-10 bg-red-600"></span>
        <span className="flex items-center text-red-600"><Truck className="h-5 w-5 mr-1 sm:mr-2" /> Shipping</span>
        <span className="h-px w-6 sm:w-10 bg-red-600"></span>
        <span className="flex items-center text-red-600"><CreditCard className="h-5 w-5 mr-1 sm:mr-2" /> Payment</span>
        <span className="h-px w-6 sm:w-10 bg-red-600"></span>
        <span className="flex items-center text-red-600"><CheckCircle className="h-5 w-5 mr-1 sm:mr-2" /> Confirm</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3 space-y-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Shipping</h2>
            <p className="text-gray-600">
              <span className="font-semibold text-gray-800">Address: </span>
              {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Payment Method</h2>
            <p className="text-gray-600">
              <span className="font-semibold text-gray-800">Method: </span>
              {paymentMethod}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Order Items</h2>
            {cart.length === 0 ? <p>Cart is empty</p> : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-center justify-between">
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

export default PlaceOrderPage;