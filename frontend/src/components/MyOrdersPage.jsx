import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader } from 'lucide-react';
import Pagination from './Pagination';

const API_URL = 'http://127.0.0.1:5000/api';

const MyOrdersPage = ({ user, setCurrentPage, handleOrderClick }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPageNum] = useState(1);
  const itemsPerPage = 10;

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
        await axios.delete(`${API_URL}/orders/${id}`, config);
        setOrders(orders.filter((order) => order._id !== id));
        alert('Order Cancelled Successfully');
      } catch (err) {
        const errorMessage = err.response && err.response.data && err.response.data.message 
            ? err.response.data.message 
            : 'Failed to cancel order';
        alert(errorMessage);
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">My Orders</h2>
      {loading ? (
        <div className="flex justify-center py-20"><Loader className="animate-spin h-10 w-10 text-red-600" /></div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-500">You have no orders.</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
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
                {currentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id.substring(0,8)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.createdAt.substring(0, 10)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.totalPrice}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {order.isPaid ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Paid {order.paidAt.substring(0, 10)}
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
          <Pagination itemsPerPage={itemsPerPage} totalItems={orders.length} paginate={setCurrentPageNum} currentPage={currentPage} />
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;