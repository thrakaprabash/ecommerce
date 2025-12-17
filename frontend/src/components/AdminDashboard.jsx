// src/components/AdminDashboard.jsx
import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  Plus, 
  Edit, 
  Trash2, 
  Settings, 
  Search 
} from 'lucide-react';
import Pagination from './Pagination';

const AdminDashboard = ({ 
  products, 
  orders, 
  handleDeleteProduct, 
  handleEditClick, 
  handleDeliverOrder, 
  setCurrentPage,
  onViewOrder
}) => {
  const [prodPage, setProdPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  // Filter orders for search
  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination for products
  const prodStart = (prodPage - 1) * itemsPerPage;
  const prodEnd = prodStart + itemsPerPage;
  const currentProducts = products.slice(prodStart, prodEnd);

  // Pagination for filtered orders
  const orderStart = (orderPage - 1) * itemsPerPage;
  const orderEnd = orderStart + itemsPerPage;
  const currentOrders = filteredOrders.slice(orderStart, orderEnd);

 const handleViewOrder = (orderId) => {
    if (onViewOrder) {
      onViewOrder(orderId);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-500 mt-1">Manage store inventory and customer orders</p>
        </div>
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('products')} 
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'products' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Products
          </button>
          <button 
            onClick={() => setActiveTab('orders')} 
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'orders' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Orders
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase">
              Total {activeTab === 'products' ? 'Products' : 'Orders'}
            </p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {activeTab === 'products' ? products.length : orders.length}
            </p>
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
                ? products.reduce((acc, p) => acc + (p.price * p.countInStock), 0).toLocaleString()
                : orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0).toLocaleString()
              }
            </p>
          </div>
          <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
            <span className="text-green-600 font-bold text-xl">$</span>
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

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <>
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setCurrentPage('admin-create-product')}
              className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-lg font-medium"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Product
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
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
                  {currentProducts.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    currentProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                              <img 
                                className="h-full w-full object-cover" 
                                src={product.image || 'https://via.placeholder.com/40?text=No+Img'} 
                                alt={product.name} 
                              />
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.countInStock || 0} units
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <button 
                              onClick={() => handleEditClick(product)}
                              className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-full"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product._id)}
                              className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-full"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Pagination 
              itemsPerPage={itemsPerPage} 
              totalItems={products.length} 
              paginate={setProdPage} 
              currentPage={prodPage} 
            />
          </div>
        </>
      )}

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <>
          {/* Search Bar */}
          <div className="mb-6 flex justify-end">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search by Order ID or Customer name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setOrderPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              />
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-900">
                Customer Orders ({filteredOrders.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                        {searchTerm ? 'No orders match your search.' : 'No orders yet.'}
                      </td>
                    </tr>
                  ) : (
                    currentOrders.map((order) => (
                      <tr 
                        key={order._id} 
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleViewOrder(order._id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order._id.substring(0, 10)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {order.user?.name || 'Guest'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${order.totalPrice?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.isPaid 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {order.isPaid 
                              ? `Paid ${new Date(order.paidAt).toLocaleDateString()}`
                              : 'Not Paid'
                            }
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.isDelivered 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.isDelivered ? 'Delivered' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div onClick={(e) => e.stopPropagation()} className="flex justify-end space-x-4">
                            {order.isPaid && !order.isDelivered && (
                              <button
                                onClick={() => handleDeliverOrder(order._id)}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Mark Delivered
                              </button>
                            )}
                            <button
                              onClick={() => handleViewOrder(order._id)}
                              className="text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Pagination 
              itemsPerPage={itemsPerPage} 
              totalItems={filteredOrders.length} 
              paginate={setOrderPage} 
              currentPage={orderPage} 
            />
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;