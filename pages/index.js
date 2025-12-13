// pages/products/index.js
import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import AddProductModal from '../../components/AddProductModal';
import ViewProductModal from '../../components/ViewProductModal';

const SUPABASE_URL = 'https://enpcdhhfsnmlhlplnycu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [gsmTypes, setGsmTypes] = useState({});
  const [paperTypes, setPaperTypes] = useState({});
  const [sizes, setSizes] = useState({});
  const [specifications, setSpecifications] = useState({});
  const [constructions, setConstructions] = useState({});
  const [specialEffects, setSpecialEffects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      const headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      };

      // Fetch all related data in parallel
      const [
        productsRes,
        categoriesRes,
        gsmRes,
        paperTypesRes,
        sizesRes,
        specificationsRes,
        constructionsRes,
        specialEffectsRes
      ] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=sku.asc`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/category?select=id,name`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/gsm?select=id,name`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/paper_types?select=id,name`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/sizes?select=id,name`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/specifications?select=id,name`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/constructions?select=id,name`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/special_effects?select=id,name`, { headers })
      ]);

      // Parse responses
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      const gsmData = await gsmRes.json();
      const paperTypesData = await paperTypesRes.json();
      const sizesData = await sizesRes.json();
      const specificationsData = await specificationsRes.json();
      const constructionsData = await constructionsRes.json();
      const specialEffectsData = await specialEffectsRes.json();

      // Create lookup objects
      const categoryMap = {};
      categoriesData.forEach(item => categoryMap[item.id] = item.name);

      const gsmMap = {};
      gsmData.forEach(item => gsmMap[item.id] = item.name);

      const paperTypeMap = {};
      paperTypesData.forEach(item => paperTypeMap[item.id] = item.name);

      const sizeMap = {};
      sizesData.forEach(item => sizeMap[item.id] = item.name);

      const specMap = {};
      specificationsData.forEach(item => specMap[item.id] = item.name);

      const constructionMap = {};
      constructionsData.forEach(item => constructionMap[item.id] = item.name);

      // Set state
      setProducts(productsData);
      setCategories(categoryMap);
      setGsmTypes(gsmMap);
      setPaperTypes(paperTypeMap);
      setSizes(sizeMap);
      setSpecifications(specMap);
      setConstructions(constructionMap);
      setSpecialEffects(specialEffectsData);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.product_name?.toLowerCase().includes(searchLower) ||
      product.sku?.toLowerCase().includes(searchLower) ||
      product.artwork_code?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <h2>Loading Products...</h2>
        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #f8fafc;
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
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div>
            <h1 className="title">CreativePack Products</h1>
            <p className="subtitle">
              {filteredProducts.length} of {products.length} products
            </p>
          </div>
          <button 
            className="add-btn"
            onClick={() => setShowAddModal(true)}
          >
            + Add Product
          </button>
        </div>

        {/* Search */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by product name, SKU, or artwork code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        {/* Products Table */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr className="table-header">
                <th>Product Details</th>
                <th>Category</th>
                <th>Specifications</th>
                <th>Artwork Files</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="table-row">
                  <td>
                    <div className="product-details">
                      <strong className="product-name">{product.product_name}</strong>
                      <div className="sku">SKU: {product.sku}</div>
                      {product.artwork_code && (
                        <div className="artwork-code">
                          <span className="artwork-badge">🎨 {product.artwork_code}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td>
                    <span className="category-badge">
                      {categories[product.category_id] || 'N/A'}
                    </span>
                  </td>
                  
                  <td>
                    <div className="specs-grid">
                      {product.gsm_id && (
                        <div className="spec-item">
                          <span className="spec-label">GSM:</span>
                          <span className="spec-value">{gsmTypes[product.gsm_id]}</span>
                        </div>
                      )}
                      {product.size_id && (
                        <div className="spec-item">
                          <span className="spec-label">Size:</span>
                          <span className="spec-value">{sizes[product.size_id]}</span>
                        </div>
                      )}
                      {product.paper_type_id && (
                        <div className="spec-item">
                          <span className="spec-label">Paper:</span>
                          <span className="spec-value">{paperTypes[product.paper_type_id]}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td>
                    <div className="file-icons">
                      {product.artwork_cdr && (
                        <a 
                          href={product.artwork_cdr}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="file-icon cdr"
                          title="CorelDRAW File"
                        >
                          <div className="file-icon-bg">CDR</div>
                        </a>
                      )}
                      {product.artwork_pdf && (
                        <a 
                          href={product.artwork_pdf}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="file-icon pdf"
                          title="PDF File"
                        >
                          <div className="file-icon-bg">PDF</div>
                        </a>
                      )}
                      {!product.artwork_cdr && !product.artwork_pdf && (
                        <span className="no-files">No files</span>
                      )}
                    </div>
                  </td>
                  
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => handleViewProduct(product)}
                        className="action-btn view"
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button 
                        className="action-btn edit"
                        title="Edit Product"
                      >
                        ✏️
                      </button>
                      <button 
                        className="action-btn delete"
                        title="Delete Product"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No products found</h3>
              <p>Try adjusting your search or add a new product</p>
              <button 
                className="add-btn"
                onClick={() => setShowAddModal(true)}
              >
                + Add Product
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            fetchAllData();
          }}
          categories={categories}
          gsmTypes={gsmTypes}
          paperTypes={paperTypes}
          sizes={sizes}
          specifications={specifications}
          constructions={constructions}
          specialEffects={specialEffects}
        />
      )}

      {showViewModal && selectedProduct && (
        <ViewProductModal
          product={selectedProduct}
          categories={categories}
          gsmTypes={gsmTypes}
          paperTypes={paperTypes}
          sizes={sizes}
          specifications={specifications}
          constructions={constructions}
          onClose={() => setShowViewModal(false)}
        />
      )}

      <style jsx>{`
        .container {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
          font-family: 'Montserrat', sans-serif;
        }

        .mobile-menu-btn {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 100;
          background: #1e3a8a;
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          font-size: 20px;
          cursor: pointer;
          display: none;
        }

        .main-content {
          flex: 1;
          padding: 20px;
          margin-left: 0;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .title {
          margin: 0;
          color: #1e3a8a;
          font-size: 28px;
          font-weight: 700;
        }

        .subtitle {
          margin: 5px 0 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .add-btn {
          padding: 10px 20px;
          background: #1e3a8a;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-family: 'Montserrat', sans-serif;
        }

        .add-btn:hover {
          background: #1d4ed8;
          transform: translateY(-2px);
        }

        .search-container {
          position: relative;
          margin-bottom: 20px;
          max-width: 500px;
        }

        .search-input {
          width: 100%;
          padding: 12px 20px 12px 45px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          font-family: 'Montserrat', sans-serif;
          transition: all 0.3s;
        }

        .search-input:focus {
          outline: none;
          border-color: #1e3a8a;
          box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .table-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow-x: auto;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        .table-header {
          background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%);
          color: white;
        }

        .table-header th {
          padding: 16px 20px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
        }

        .table-row {
          border-bottom: 1px solid #e2e8f0;
          transition: background-color 0.2s;
        }

        .table-row:hover {
          background-color: #f8fafc;
        }

        .table-row td {
          padding: 16px 20px;
          vertical-align: top;
        }

        .product-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .product-name {
          color: #1e293b;
          font-size: 16px;
          font-weight: 600;
        }

        .sku {
          color: #64748b;
          font-size: 12px;
          background: #f1f5f9;
          padding: 4px 8px;
          border-radius: 4px;
          display: inline-block;
          width: fit-content;
        }

        .artwork-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #e0e7ff;
          color: #3730a3;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
        }

        .category-badge {
          display: inline-block;
          padding: 6px 12px;
          background: #dcfce7;
          color: #166534;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .specs-grid {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .spec-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .spec-label {
          color: #64748b;
          font-size: 12px;
          min-width: 40px;
        }

        .spec-value {
          color: #1e293b;
          font-size: 12px;
          font-weight: 500;
          background: #f8fafc;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .file-icons {
          display: flex;
          gap: 8px;
        }

        .file-icon {
          text-decoration: none;
          display: inline-flex;
        }

        .file-icon-bg {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          font-weight: 600;
          font-size: 12px;
          transition: transform 0.2s;
        }

        .file-icon.cdr .file-icon-bg {
          background: #dbeafe;
          color: #1e40af;
        }

        .file-icon.pdf .file-icon-bg {
          background: #fee2e2;
          color: #dc2626;
        }

        .file-icon:hover .file-icon-bg {
          transform: translateY(-2px);
        }

        .no-files {
          color: #94a3b8;
          font-size: 12px;
          font-style: italic;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .action-btn.view {
          background: #dbeafe;
          color: #1e40af;
        }

        .action-btn.edit {
          background: #dcfce7;
          color: #166534;
        }

        .action-btn.delete {
          background: #fee2e2;
          color: #dc2626;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          opacity: 0.9;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-state h3 {
          margin: 0 0 8px 0;
          color: #1e293b;
        }

        .empty-state p {
          margin: 0 0 20px 0;
          color: #64748b;
        }

        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: block;
          }
          
          .main-content {
            margin-left: 0;
            padding: 15px;
          }
          
          .header {
            flex-direction: column;
            gap: 15px;
            padding: 15px;
          }
          
          .title {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}
