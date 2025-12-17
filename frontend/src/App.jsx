import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, User, Search, Menu, X, Star, Heart, ArrowLeft, Trash2, Plus, Settings, LogOut, Package, Loader, Save, Edit, ChevronRight, Upload, Camera, Truck, CreditCard, CheckCircle, List, Filter } from 'lucide-react';

// Use 127.0.0.1 to prevent localhost IPv6 lookup delays
const API_URL = 'http://127.0.0.1:5000/api';

// Import all extracted components
import Pagination from './components/Pagination';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartPage from './components/CartPage';
import ShippingAddressPage from './components/ShippingAddressPage';
import PaymentPage from './components/PaymentPage';
import PlaceOrderPage from './components/PlaceOrderPage';
import OrderDetailsPage from './components/OrderDetailsPage';
import MyOrdersPage from './components/MyOrdersPage';
import ProfilePage from './components/ProfilePage';
import AdminProductForm from './components/AdminProductForm';
import AdminEditProductForm from './components/AdminEditProductForm'; // Assuming this is extracted similarly to AdminProductForm
import AdminDashboard from './components/AdminDashboard';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ProductDetails from './components/ProductDetails';

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

  const handleAdminOrderView = async (orderId) => {
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
    alert('Failed to load order details');
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
    <AdminDashboard 
      products={products} 
      orders={adminOrders} 
      handleDeleteProduct={handleDeleteProduct} 
      handleEditClick={handleEditClick} 
      handleDeliverOrder={handleDeliverOrder}
      setCurrentPage={setCurrentPage}
      onViewOrder={handleAdminOrderView}   // ← NEW PROP
    /> 
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