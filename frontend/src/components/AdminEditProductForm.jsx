import React, { useState } from 'react';
import { ArrowLeft, Camera, Save } from 'lucide-react';

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
            <div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Count In Stock</label>
              <input
                type="number"
                required
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                <label className="cursor-pointer flex flex-col items-center space-y-2">
                  <div className="p-3 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors">
                    <Camera className="h-6 w-6 text-red-600" />
                  </div>
                  <span className="text-sm text-gray-500 font-medium">Change Image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
                {image && <img src={image} alt="Preview" className="mt-4 h-48 w-48 object-cover rounded-lg" />}
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

export default AdminEditProductForm;