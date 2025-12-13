import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryNames, setCategoryNames] = useState({});
  const [gsmNames, setGsmNames] = useState({});
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all data in parallel
      const [productsResponse, categoriesResponse, gsmResponse] = await Promise.all([
        fetch('https://enpcdhhfsnmlhlplnycu.supabase.co/rest/v1/products?select=id,sku,product_name,category_id,gsm_id&order=sku.asc', {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU'
          }
        }),
        fetch('https://enpcdhhfsnmlhlplnycu.supabase.co/rest/v1/category?select=id,name', {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU'
          }
        }),
        fetch('https://enpcdhhfsnmlhlplnycu.supabase.co/rest/v1/gsm?select=id,name', {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU'
          }
        })
      ]);

      // Check all responses
      if (!productsResponse.ok || !categoriesResponse.ok || !gsmResponse.ok) {
        throw new Error('Failed to fetch data from Supabase');
      }

      // Parse JSON data
      const productsData = await productsResponse.json();
      const categoriesData = await categoriesResponse.json();
      const gsmData = await gsmResponse.json();

      // Convert to lookup objects
      const categoryMap = {};
      categoriesData.forEach(cat => {
        if (cat && cat.id) {
          categoryMap[cat.id] = cat.name;
        }
      });

      const gsmMap = {};
      gsmData.forEach(gsm => {
        if (gsm && gsm.id) {
          gsmMap[gsm.id] = gsm.name;
        }
      });

      // Set state
      setProducts(Array.isArray(productsData) ? productsData : []);
      setCategoryNames(categoryMap);
      setGsmNames(gsmMap);
      
      console.log('Data loaded successfully:', {
        products: productsData.length,
        categories: categoriesData.length,
        gsm: gsmData.length
      });

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
      
      // Set empty arrays on error
      setProducts([]);
      setCategoryNames({});
      setGsmNames({});
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           product.category_id === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = Object.entries(categoryNames).map(([id, name]) => ({
    id: parseInt(id),
    name
  }));

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <h2>Loading Products...</h2>
      </div>
    );
  }

  return (
    <div className="products-container">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>📦 Product Catalog</h1>
          <p className="subtitle">Manage and browse your product inventory</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={fetchAllData}
          >
            🔄 Refresh Data
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{products.length}</h3>
            <p>Total Products</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏷️</div>
          <div className="stat-content">
            <h3>{Object.keys(categoryNames).length}</h3>
            <p>Categories</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <h3>{Object.keys(gsmNames).length}</h3>
            <p>GSM Types</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔍</div>
          <div className="stat-content">
            <h3>{filteredProducts.length}</h3>
            <p>Showing</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by SKU or product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="filter-group">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>⚠️ Error: {error}</p>
          <button onClick={fetchAllData} className="btn btn-secondary">
            Try Again
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className="table-container">
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <table className="products-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>GSM</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <span className="sku-badge">
                      #{product.sku}
                    </span>
                  </td>
                  <td className="product-name">
                    <strong>{product.product_name}</strong>
                  </td>
                  <td>
                    <span className="category-badge">
                      {categoryNames[product.category_id] || `Category ${product.category_id}`}
                    </span>
                  </td>
                  <td>
                    <span className="gsm-badge">
                      {gsmNames[product.gsm_id] || `GSM ${product.gsm_id}`}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" title="View Details">
                        👁️
                      </button>
                      <button className="btn-icon" title="Edit">
                        ✏️
                      </button>
                      <button className="btn-icon" title="Delete">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>Product Catalog • {new Date().getFullYear()} • {filteredProducts.length} of {products.length} products displayed</p>
      </footer>

      <style jsx>{`
        .products-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
        }

        /* Header Styles */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          padding: 20px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .header-content h1 {
          margin: 0;
          color: #2c3e50;
          font-size: 2rem;
        }

        .subtitle {
          margin: 5px 0 0 0;
          color: #7f8c8d;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .stat-icon {
          font-size: 2rem;
          margin-right: 15px;
        }

        .stat-content h3 {
          margin: 0;
          font-size: 1.8rem;
          color: #2c3e50;
        }

        .stat-content p {
          margin: 5px 0 0 0;
          color: #7f8c8d;
          font-size: 0.9rem;
        }

        /* Filters */
        .filters-section {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 300px;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 12px 20px 12px 45px;
          border: 2px solid #e0e6ed;
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #95a5a6;
        }

        .category-filter {
          padding: 12px 20px;
          border: 2px solid #e0e6ed;
          border-radius: 10px;
          font-size: 1rem;
          background: white;
          min-width: 200px;
          cursor: pointer;
        }

        /* Table Styles */
        .table-container {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }

        .products-table {
          width: 100%;
          border-collapse: collapse;
        }

        .products-table thead {
          background: linear-gradient(135deg, #3498db 0%, #2c3e50 100%);
          color: white;
        }

        .products-table th {
          padding: 15px 20px;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #3498db;
        }

        .products-table td {
          padding: 15px 20px;
          border-bottom: 1px solid #e0e6ed;
        }

        .products-table tbody tr:hover {
          background: #f8fafc;
        }

        /* Badges */
        .sku-badge {
          background: #e3f2fd;
          color: #1565c0;
          padding: 5px 10px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .category-badge {
          background: #e8f5e9;
          color: #2e7d32;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .gsm-badge {
          background: #fff3e0;
          color: #ef6c00;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-icon {
          background: none;
          border: none;
          padding: 8px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .btn-icon:hover {
          background: #f0f0f0;
          transform: scale(1.1);
        }

        /* Buttons */
        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .btn-primary {
          background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
        }

        .btn-secondary {
          background: #95a5a6;
          color: white;
        }

        .btn-secondary:hover {
          background: #7f8c8d;
        }

        /* Loading Spinner */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        /* Error Message */
        .error-message {
          background: #ffeaa7;
          border: 2px solid #fdcb6e;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        /* Footer */
        .footer {
          text-align: center;
          padding: 20px;
          color: #7f8c8d;
          font-size: 0.9rem;
        }

        /* Animations */
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            gap: 20px;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .filters-section {
            flex-direction: column;
          }
          
          .search-box {
            min-width: 100%;
          }
          
          .products-table {
            display: block;
            overflow-x: auto;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .header-content h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
