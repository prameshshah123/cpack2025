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

      const [productsRes, categoriesRes, gsmRes] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=sku.asc`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/category?select=id,name`, { headers }),
        fetch(`${SUPABASE_URL}/rest/v1/gsm?select=id,name`, { headers })
      ]);

      if (productsRes.ok) setProducts(await productsRes.json());
      if (categoriesRes.ok) {
        const catData = await categoriesRes.json();
        const catMap = {};
        catData.forEach(cat => catMap[cat.id] = cat.name);
        setCategories(catMap);
      }
      if (gsmRes.ok) {
        const gsmData = await gsmRes.json();
        const gsmMap = {};
        gsmData.forEach(gsm => gsmMap[gsm.id] = gsm.name);
        setGsmTypes(gsmMap);
      }

    } catch (error) {
      console.error('Error:', error);
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
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <h2>Loading Products...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Mobile Menu Button */}
      <button 
        style={styles.mobileMenuButton}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>CreativePack Products</h1>
            <p style={styles.subtitle}>
              {filteredProducts.length} of {products.length} products
            </p>
          </div>
          <button 
            style={styles.addButton}
            onClick={() => setShowAddModal(true)}
          >
            + Add Product
          </button>
        </div>

        {/* Search */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by product name, SKU, or artwork code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <span style={styles.searchIcon}>🔍</span>
        </div>

        {/* Products Table */}
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Product Details</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Specifications</th>
                <th style={styles.th}>Artwork Files</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <div style={styles.productDetails}>
                      <strong style={styles.productName}>{product.product_name}</strong>
                      <div style={styles.sku}>SKU: {product.sku}</div>
                      {product.artwork_code && (
                        <div style={styles.artworkCode}>
                          <span style={styles.artworkBadge}>🎨 {product.artwork_code}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td style={styles.td}>
                    <span style={styles.categoryBadge}>
                      {categories[product.category_id] || 'N/A'}
                    </span>
                  </td>
                  
                  <td style={styles.td}>
                    <div style={styles.specsGrid}>
                      {product.gsm_id && (
                        <div style={styles.specItem}>
                          <span style={styles.specLabel}>GSM:</span>
                          <span style={styles.specValue}>{gsmTypes[product.gsm_id] || 'N/A'}</span>
                        </div>
                      )}
                      {product.size && (
                        <div style={styles.specItem}>
                          <span style={styles.specLabel}>Size:</span>
                          <span style={styles.specValue}>{product.size}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td style={styles.td}>
                    <div style={styles.fileIcons}>
                      {product.artwork_cdr && (
                        <div style={styles.fileIconCdr} title="CorelDRAW File">
                          CDR
                        </div>
                      )}
                      {product.artwork_pdf && (
                        <div style={styles.fileIconPdf} title="PDF File">
                          PDF
                        </div>
                      )}
                      {!product.artwork_cdr && !product.artwork_pdf && (
                        <span style={styles.noFiles}>No files</span>
                      )}
                    </div>
                  </td>
                  
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button 
                        onClick={() => handleViewProduct(product)}
                        style={styles.actionButtonView}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button 
                        style={styles.actionButtonEdit}
                        title="Edit Product"
                      >
                        ✏️
                      </button>
                      <button 
                        style={styles.actionButtonDelete}
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
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📭</div>
              <h3>No products found</h3>
              <p>Try adjusting your search or add a new product</p>
              <button 
                style={styles.addButton}
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
        />
      )}

      {showViewModal && selectedProduct && (
        <ViewProductModal
          product={selectedProduct}
          onClose={() => setShowViewModal(false)}
          categories={categories}
          gsmTypes={gsmTypes}
        />
      )}

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Styles as JavaScript objects
const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8fafc'
  },
  mobileMenuButton: {
    position: 'fixed',
    top: '20px',
    left: '20px',
    zIndex: 100,
    backgroundColor: '#1e3a8a',
    color: 'white',
    border: 'none',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'none'
  },
  mainContent: {
    flex: 1,
    padding: '20px',
    marginLeft: '0'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  title: {
    margin: 0,
    color: '#1e3a8a',
    fontSize: '28px',
    fontWeight: 700
  },
  subtitle: {
    margin: '5px 0 0 0',
    color: '#64748b',
    fontSize: '14px'
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#1e3a8a',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  searchContainer: {
    position: 'relative',
    marginBottom: '20px',
    maxWidth: '500px'
  },
  searchInput: {
    width: '100%',
    padding: '12px 20px 12px 45px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px'
  },
  searchIcon: {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8'
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '800px'
  },
  tableHeader: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
    color: 'white'
  },
  th: {
    padding: '16px 20px',
    textAlign: 'left',
    fontWeight: 600,
    fontSize: '14px'
  },
  tableRow: {
    borderBottom: '1px solid #e2e8f0',
    transition: 'background-color 0.2s'
  },
  td: {
    padding: '16px 20px',
    verticalAlign: 'top'
  },
  productDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  productName: {
    color: '#1e293b',
    fontSize: '16px',
    fontWeight: 600
  },
  sku: {
    color: '#64748b',
    fontSize: '12px',
    backgroundColor: '#f1f5f9',
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'inline-block',
    width: 'fit-content'
  },
  artworkBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 500
  },
  categoryBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    backgroundColor: '#dcfce7',
    color: '#166534',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 500
  },
  specsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  specItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  specLabel: {
    color: '#64748b',
    fontSize: '12px',
    minWidth: '40px'
  },
  specValue: {
    color: '#1e293b',
    fontSize: '12px',
    fontWeight: 500,
    backgroundColor: '#f8fafc',
    padding: '2px 6px',
    borderRadius: '4px'
  },
  fileIcons: {
    display: 'flex',
    gap: '8px'
  },
  fileIconCdr: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '12px',
    backgroundColor: '#dbeafe',
    color: '#1e40af'
  },
  fileIconPdf: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '12px',
    backgroundColor: '#fee2e2',
    color: '#dc2626'
  },
  noFiles: {
    color: '#94a3b8',
    fontSize: '12px',
    fontStyle: 'italic'
  },
  actionButtons: {
    display: 'flex',
    gap: '8px'
  },
  actionButtonView: {
    width: '36px',
    height: '36px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dbeafe',
    color: '#1e40af'
  },
  actionButtonEdit: {
    width: '36px',
    height: '36px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dcfce7',
    color: '#166534'
  },
  actionButtonDelete: {
    width: '36px',
    height: '36px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    color: '#dc2626'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.5
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8fafc'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  }
};
