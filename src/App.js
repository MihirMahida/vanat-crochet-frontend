import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import logo from './logo.png';
import headerImage from './headerImage.png';

// Configure your backend URL
const API_BASE_URL = 'https://vanat-crochet.onrender.com';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [showFilterOptions, setShowFilterOptions] = useState(false);

  // Hardcoded categories based on your image context
  const categories = ['All', 'Flower', 'Cartoon', 'EvilEye'];

  useEffect(() => {
    fetchProducts();
  }, [filterCategory, sortOrder]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url;
      
      // LOGIC: Utilizing your backend controller specific endpoints
      if (filterCategory !== 'All') {
        // Use the sorted category endpoint if a specific category is chosen
        // Endpoint: /category/{category}/sort?sort={asc/desc}
        url = `${API_BASE_URL}/api/products/category/${filterCategory}/sort?sort=${sortOrder}`;
      } else {
        // If "All", use the global sort endpoint
        url = `${API_BASE_URL}/api/products/sort?sort=${sortOrder}`;
      }

      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleCategorySelect = (category) => {
    setFilterCategory(category);
    setShowFilterOptions(false);
  };

  return (
      <div className="app-container">
      {/* HEADER SECTION */}
            <header className="header">
              <div className="logo-container">
                <img src={logo} alt="Logo" className="logo-img" />
              </div>
              <div className="header-image-container">
                <img src={headerImage} alt="Header" className="header-img" />
              </div>
            </header>

      {/* ACTION BAR (Sort & Filter) */}
      <div className="action-bar">
        <button className="action-btn left" onClick={handleSortToggle}>
          Sort ({sortOrder === 'asc' ? 'Low to High' : 'High to Low'})
        </button>
        <div className="divider"></div>
        <div className="filter-wrapper">
            <button 
                className="action-btn right" 
                onClick={() => setShowFilterOptions(!showFilterOptions)}
            >
              Filter - {filterCategory}
            </button>
            
            {showFilterOptions && (
                <div className="dropdown">
                    {categories.map(cat => (
                        <div key={cat} className="dropdown-item" onClick={() => handleCategorySelect(cat)}>
                            {cat}
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <main className="product-grid">
        {loading ? (
            <p className="loading-text">Loading handmade items...</p>
        ) : products.length > 0 ? (
            products.map((product) => (
            <div key={product.id} className="product-card">
                <div className="image-container">
                {product.imageUrl ? (
                    <img
                        src={`${API_BASE_URL}${product.imageUrl}`}
                        alt={product.name}
                        className="product-image"
                    />
                ) : (
                    <div className="no-image">No Image</div>
                )}
                </div>
                <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">₹ {product.price.toFixed(2)}</p>
                </div>
            </div>
            ))
        ) : (
            <p className="empty-text">No products found in this category.</p>
        )}
      </main>
    </div>
  );
}

export default App;

