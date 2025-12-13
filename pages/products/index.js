import { useState, useEffect } from 'react';

const SUPABASE_URL = 'https://enpcdhhfsnmlhlplnycu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const headers = {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      };

      // Fetch products with ALL columns
      const productsRes = await fetch(
        `${SUPABASE_URL}/rest/v1/products?select=*&order=id.asc`,
        { headers }
      );

      // Fetch categories for dropdown
      const categoriesRes = await fetch(
        `${SUPABASE_URL}/rest/v1/category?select=id,name`,
        { headers }
      );

      if (productsRes.ok) {
        const data = await productsRes.json();
        console.log('First product sample:', data[0]); // Debug: See ALL fields
        setProducts(data);
      }

      if (categoriesRes.ok) {
        const catData = await categoriesRes.json();
        const catMap = {};
        catData.forEach(cat => catMap[cat.id] = cat.name);
        setCategories(catMap);
      }

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (catId) => {
    return categories[catId] || 'No Category';
  };

  const getSpecsDisplay = (product) => {
    // Use the specs TEXT column directly
    if (product.specs) {
      return product.specs;
    }
    
    // If no specs, show other specs-related fields
    const specParts = [];
    if (product.size) specParts.push(`Size: ${product.size}`);
    if (product.gsm_id) specParts.push(`GSM: ${product.gsm_id}`);
    if (product.construction_id) specParts.push(`Construction: ${product.construction_id}`);
    
    return specParts.length > 0 ? specParts.join(' • ') : 'No specs';
  };

  const handleAddProduct = () => {
    const productName = prompt('Enter product name:');
    if (productName) {
      const newProduct = {
        id: Date.now(),
        product_name: productName,
        artwork_code: '',
        specs: '',
        created_at: new Date().toISOString()
      };
      setProducts([newProduct, ...products]);
    }
  };

  const handleDeleteProduct = (id) => {
    if (confirm('Delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // Filter products based on search
  const filteredProducts = products.filter(product => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      product.product_name?.toLowerCase().includes(term) ||
      product.artwork_code?.toLowerCase().includes(term) ||
      product.specs?.toLowerCase().includes(term)
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
      {/* Top Navigation */}
      <div style={styles.topNav}>
        <div style={styles.navLeft}>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={styles.menuButton}
          >
            ☰
          </button>
          <h1 style={styles.brandTitle}>CreativePack</h1>
        </div>
        <button style={styles.addButton} onClick={handleAddProduct}>
          + Add Product
        </button>
      </div>

      <div style={styles.mainWrapper}>
        {/* Sidebar */}
        <div style={{
          ...styles.sidebar,
          left: sidebarOpen ? '0' : '-280px'
        }}>
          <div style={styles.sidebarSection}>
            <h3 style={styles.sidebarTitle}>MAIN MENU</h3>
            <a href="#" style={styles.sidebarItemActive}>
              <span style={styles.sidebarIcon}>📦</span> Products
            </a>
            <a href="#" style={styles.sidebarItem}>
              <span style={styles.sidebarIcon}>📋</span> Orders
            </a>
            <a href="#" style={styles.sidebarItem}>
              <span style={styles.sidebarIcon}>🎨</span> Artwork History
            </a>
            <a href="#" style={styles.sidebarItem}>
              <span style={styles.sidebarIcon}>📊</span> Stock
            </a>
          </div>

          <div style={styles.sidebarSection}>
            <h3 style={styles.sidebarTitle}>MASTER DATA</h3>
            <a href="#" style={styles.sidebarItem}>
              <span style={styles.sidebarIcon}>🏷️</span> Categories
            </a>
            <a href="#" style={styles.sidebarItem}>
              <span style={styles.sidebarIcon}>📄</span> Specifications
            </a>
            <a href="#" style={styles.sidebarItem}>
              <span style={styles.sidebarIcon}>👥</span> Customers
            </a>
            <a href="#" style={styles.sidebarItem}>
              <span style={styles.sidebarIcon}>🖨️</span> Printers
            </a>
          </div>

          <div style={styles.sidebarFooter}>
            <div style={styles.userAvatar}>AD</div>
            <div>
              <div style={styles.userName}>Admin User</div>
              <div style={styles.userEmail}>admin@creativepack.com</div>
            </div>
          </div>
        </div>

        {sidebarOpen && (
          <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <div style={{
          ...styles.mainContent,
          marginLeft: sidebarOpen ? '280px' : '0'
        }}>
          <div style={styles.contentCard}>
            <div style={styles.headerSection}>
              <h2 style={styles.pageTitle}>Product Catalog</h2>
              <div style={styles.stats}>
                <span style={styles.statItem}>
                  <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
                </span>
              </div>
            </div>

            {/* Search */}
            <div style={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search products by name, artwork code, or specs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            {/* Products Table */}
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.tableHeaderCell}>Product Details</th>
                    <th style={styles.tableHeaderCell}>Category</th>
                    <th style={styles.tableHeaderCell}>Specs</th>
                    <th style={styles.tableHeaderCell}>Files</th>
                    <th style={styles.tableHeaderCell}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} style={styles.tableRow}>
                      {/* Column A: Product Name + Artwork Code */}
                      <td style={styles.tableCell}>
                        <div style={styles.productInfo}>
                          <div style={styles.productName}>
                            {product.product_name}
                          </div>
                          {product.artwork_code && (
                            <div style={styles.artworkCode}>
                              🎨 {product.artwork_code}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Column B: Category */}
                      <td style={styles.tableCell}>
                        <span style={styles.categoryBadge}>
                          {getCategoryName(product.category_id)}
                        </span>
                      </td>

                      {/* Column C: Specs (from specs TEXT column) */}
                      <td style={styles.tableCell}>
                        <div style={styles.specsBox}>
                          {getSpecsDisplay(product)}
                        </div>
                      </td>

                      {/* Column D: Files - Only show if they exist */}
                      <td style={styles.tableCell}>
                        <div style={styles.fileIcons}>
                          {product.artwork_cdr && (
                            <span style={styles.cdrIcon} title="CDR File">
                              CDR
                            </span>
                          )}
                          {product.artwork_pdf && (
                            <span style={styles.pdfIcon} title="PDF File">
                              PDF
                            </span>
                          )}
                          {!product.artwork_cdr && !product.artwork_pdf && (
                            <span style={styles.noFile}></span>
                          )}
                        </div>
                      </td>

                      {/* Column E: Actions - Icons only */}
                      <td style={styles.tableCell}>
                        <div style={styles.actionIcons}>
                          <button style={styles.iconButton} title="View">
                            👁️
                          </button>
                          <button style={styles.iconButton} title="Edit">
                            ✏️
                          </button>
                          <button 
                            style={{...styles.iconButton, ...styles.deleteButton}}
                            onClick={() => handleDeleteProduct(product.id)}
                            title="Delete"
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        
        body {
          margin: 0;
          padding: 0;
          font-family: 'Montserrat', sans-serif;
        }
        
        a {
          text-decoration: none;
          color: inherit;
        }
        
        button {
          font-family: 'Montserrat', sans-serif;
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8fafc'
  },
  topNav: {
    background: '#1e3a8a',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  menuButton: {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: 'white',
    fontSize: '20px',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandTitle: {
    margin: 0,
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold'
  },
  addButton: {
    background: 'white',
    color: '#1e3a8a',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: 'all 0.2s'
  },
  mainWrapper: {
    display: 'flex',
    position: 'relative'
  },
  sidebar: {
    width: '280px',
    background: '#1e3a8a',
    color: 'white',
    height: 'calc(100vh - 70px)',
    position: 'fixed',
    top: '70px',
    transition: 'left 0.3s',
    zIndex: 100,
    overflowY: 'auto'
  },
  sidebarSection: {
    padding: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  sidebarTitle: {
    margin: '0 0 15px 0',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  sidebarItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    color: 'rgba(255,255,255,0.8)',
    borderRadius: '8px',
    marginBottom: '5px',
    transition: 'all 0.2s'
  },
  sidebarItemActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    borderRadius: '8px',
    marginBottom: '5px',
    fontWeight: '500'
  },
  sidebarIcon: {
    fontSize: '18px'
  },
  sidebarFooter: {
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    position: 'absolute',
    bottom: '0',
    width: '100%',
    background: 'rgba(0,0,0,0.1)'
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  userName: {
    fontSize: '14px',
    fontWeight: '500'
  },
  userEmail: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.6)'
  },
  overlay: {
    position: 'fixed',
    top: '70px',
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 99
  },
  mainContent: {
    flex: 1,
    padding: '30px',
    transition: 'margin-left 0.3s',
    minHeight: 'calc(100vh - 70px)'
  },
  contentCard: {
    background: 'white',
    borderRadius: '15px',
    padding: '30px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
  },
  headerSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '25px'
  },
  pageTitle: {
    margin: 0,
    color: '#1e3a8a',
    fontSize: '24px',
    fontWeight: '600'
  },
  stats: {
    display: 'flex',
    gap: '20px'
  },
  statItem: {
    color: '#64748b',
    fontSize: '14px'
  },
  searchContainer: {
    marginBottom: '25px'
  },
  searchInput: {
    width: '100%',
    maxWidth: '500px',
    padding: '12px 20px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    fontFamily: 'Montserrat, sans-serif'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeaderRow: {
    background: '#f8fafc',
    borderBottom: '2px solid #e2e8f0'
  },
  tableHeaderCell: {
    padding: '15px 20px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  tableRow: {
    borderBottom: '1px solid #e2e8f0',
    transition: 'background 0.2s'
  },
  tableCell: {
    padding: '20px',
    verticalAlign: 'top'
  },
  productInfo: {
    
  },
  productName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '8px'
  },
  artworkCode: {
    fontSize: '13px',
    color: '#475569',
    background: '#f1f5f9',
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'inline-block'
  },
  categoryBadge: {
    background: '#e0f2fe',
    color: '#0369a1',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    display: 'inline-block'
  },
  specsBox: {
    fontSize: '14px',
    color: '#475569',
    background: '#f8fafc',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    maxWidth: '300px',
    wordBreak: 'break-word'
  },
  fileIcons: {
    display: 'flex',
    gap: '10px'
  },
  cdrIcon: {
    width: '40px',
    height: '40px',
    background: '#dbeafe',
    color: '#1e40af',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '12px'
  },
  pdfIcon: {
    width: '40px',
    height: '40px',
    background: '#fee2e2',
    color: '#dc2626',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '12px'
  },
  noFile: {
    width: '40px',
    height: '40px'
  },
  actionIcons: {
    display: 'flex',
    gap: '8px'
  },
  iconButton: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: 'none',
    background: '#f1f5f9',
    color: '#475569',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  deleteButton: {
    background: '#fee2e2',
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
    height: '100vh',
    background: '#f8fafc'
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
