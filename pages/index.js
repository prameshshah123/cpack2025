import { useState, useEffect } from 'react';

const SUPABASE_URL = 'https://enpcdhhfsnmlhlplnycu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [gsmTypes, setGsmTypes] = useState({});
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

  const handleAddProduct = () => {
    const newProduct = {
      sku: prompt('Enter SKU:'),
      product_name: prompt('Enter Product Name:'),
      artwork_code: prompt('Enter Artwork Code (optional):')
    };
    if (newProduct.sku && newProduct.product_name) {
      setProducts([...products, { id: Date.now(), ...newProduct }]);
    }
  };

  const handleDeleteProduct = (id) => {
    if (confirm('Delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
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
      {/* Mobile Menu */}
      <button 
        style={styles.mobileMenuBtn}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div style={{
        ...styles.sidebar,
        left: sidebarOpen ? '0' : '-280px'
      }}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>CP</div>
          <div>
            <h2 style={styles.brandName}>CreativePack</h2>
            <p style={styles.brandSub}>Packaging Solutions</p>
          </div>
        </div>
        
        <div style={styles.sidebarMenu}>
          <a href="/products" style={styles.menuItemActive}>📦 Products</a>
          <a href="/orders" style={styles.menuItem}>📋 Orders</a>
          <a href="/artwork" style={styles.menuItem}>🎨 Artwork History</a>
          <a href="/stock" style={styles.menuItem}>📊 Stock</a>
          <a href="/categories" style={styles.menuItem}>🏷️ Categories</a>
          <a href="/gsm" style={styles.menuItem}>📄 GSM Types</a>
        </div>

        <div style={styles.sidebarFooter}>
          <div style={styles.userAvatar}>AD</div>
          <div>
            <p style={styles.userName}>Admin User</p>
            <p style={styles.userEmail}>admin@creativepack.com</p>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

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
          <button style={styles.addBtn} onClick={handleAddProduct}>
            + Add Product
          </button>
        </div>

        {/* Search */}
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <span style={styles.searchIcon}>🔍</span>
        </div>

        {/* Products Table */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Product Details</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Specs</th>
                <th style={styles.th}>Files</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <div>
                      <strong style={styles.productName}>{product.product_name}</strong>
                      <div style={styles.artworkCode}>
                        <span style={styles.artworkBadge}>🎨 {product.artwork_code || 'No artwork'}</span>
                      </div>
                      <div style={styles.sku}>SKU: {product.sku}</div>
                    </div>
                  </td>
                  
                  <td style={styles.td}>
                    <span style={styles.categoryBadge}>
                      {categories[product.category_id] || 'Uncategorized'}
                    </span>
                  </td>
                  
                  <td style={styles.td}>
                    <div style={styles.specs}>
                      <div style={styles.specItem}>
                        <span style={styles.specLabel}>GSM:</span>
                        <span>{gsmTypes[product.gsm_id] || 'N/A'}</span>
                      </div>
                      <div style={styles.specItem}>
                        <span style={styles.specLabel}>Size:</span>
                        <span>{product.size || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td style={styles.td}>
                    <div style={styles.fileIcons}>
                      {product.cdr_file && (
                        <span style={styles.fileCdr} title="CDR File">CDR</span>
                      )}
                      {product.pdf_file && (
                        <span style={styles.filePdf} title="PDF File">PDF</span>
                      )}
                      {!product.cdr_file && !product.pdf_file && (
                        <span style={styles.noFiles}>No files</span>
                      )}
                    </div>
                  </td>
                  
                  <td style={styles.td}>
                    <div style={styles.actionBtns}>
                      <button 
                        style={styles.actionBtn}
                        onClick={() => alert(`View: ${product.product_name}`)}
                      >
                        👁️ View
                      </button>
                      <button 
                        style={styles.actionBtn}
                        onClick={() => alert(`Edit: ${product.product_name}`)}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        style={{...styles.actionBtn, background: '#fee2e2', color: '#dc2626'}}
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: "'Montserrat', Arial, sans-serif"
  },
  mobileMenuBtn: {
    display: 'none',
    position: 'fixed',
    top: '20px',
    left: '20px',
    zIndex: 100,
    background: '#1e3a8a',
    color: 'white',
    border: 'none',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    fontSize: '20px',
    cursor: 'pointer'
  },
  sidebar: {
    width: '280px',
    background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)',
    color: 'white',
    height: '100vh',
    position: 'fixed',
    top: 0,
    transition: 'left 0.3s',
    zIndex: 50,
    display: 'flex',
    flexDirection: 'column'
  },
  sidebarHeader: {
    padding: '24px 20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  logo: {
    width: '40px',
    height: '40px',
    background: 'white',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#1e3a8a',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  brandName: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 'bold'
  },
  brandSub: {
    margin: '2px 0 0 0',
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.7)'
  },
  sidebarMenu: {
    flex: 1,
    padding: '20px 0',
    display: 'flex',
    flexDirection: 'column'
  },
  menuItem: {
    padding: '12px 20px',
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.2s'
  },
  menuItemActive: {
    padding: '12px 20px',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  sidebarFooter: {
    padding: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  },
  userName: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 'bold'
  },
  userEmail: {
    margin: '2px 0 0 0',
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.7)'
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 40
  },
  mainContent: {
    flex: 1,
    padding: '20px',
    marginLeft: '280px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    padding: '20px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  title: {
    margin: 0,
    color: '#1e3a8a',
    fontSize: '28px',
    fontWeight: 'bold'
  },
  subtitle: {
    margin: '5px 0 0 0',
    color: '#64748b',
    fontSize: '14px'
  },
  addBtn: {
    padding: '10px 20px',
    background: '#1e3a8a',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px'
  },
  searchBox: {
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
  tableWrapper: {
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeader: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)',
    color: 'white'
  },
  th: {
    padding: '16px 20px',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  tableRow: {
    borderBottom: '1px solid #e2e8f0',
    transition: 'background 0.2s'
  },
  td: {
    padding: '16px 20px',
    verticalAlign: 'top'
  },
  productName: {
    color: '#1e293b',
    fontSize: '16px',
    display: 'block',
    marginBottom: '8px'
  },
  artworkCode: {
    marginBottom: '8px'
  },
  artworkBadge: {
    background: '#e0e7ff',
    color: '#3730a3',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '500'
  },
  sku: {
    color: '#64748b',
    fontSize: '12px',
    background: '#f1f5f9',
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'inline-block'
  },
  categoryBadge: {
    background: '#dcfce7',
    color: '#166534',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    display: 'inline-block'
  },
  specs: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  specItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  specLabel: {
    color: '#64748b',
    fontSize: '12px',
    minWidth: '40px'
  },
  fileIcons: {
    display: 'flex',
    gap: '8px'
  },
  fileCdr: {
    background: '#dbeafe',
    color: '#1e40af',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  filePdf: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  noFiles: {
    color: '#94a3b8',
    fontSize: '12px',
    fontStyle: 'italic'
  },
  actionBtns: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  actionBtn: {
    padding: '6px 12px',
    background: '#f1f5f9',
    color: '#475569',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    textAlign: 'left'
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
