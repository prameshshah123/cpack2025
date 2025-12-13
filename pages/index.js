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
      
      const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU';
      const baseUrl = 'https://enpcdhhfsnmlhlplnycu.supabase.co/rest/v1';
      
      const headers = {
        'apikey': apiKey,
        'Content-Type': 'application/json'
      };

      // Fetch all data
      const [productsRes, categoriesRes, gsmRes] = await Promise.all([
        fetch(`${baseUrl}/products?select=id,sku,product_name,category_id,gsm_id&order=sku.asc`, { headers }),
        fetch(`${baseUrl}/category?select=id,name`, { headers }),
        fetch(`${baseUrl}/gsm?select=id,name`, { headers })
      ]);

      // Check responses
      if (!productsRes.ok) throw new Error(`Products failed: ${productsRes.status}`);
      if (!categoriesRes.ok) throw new Error(`Categories failed: ${categoriesRes.status}`);
      if (!gsmRes.ok) throw new Error(`GSM failed: ${gsmRes.status}`);

      // Parse JSON
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      const gsmData = await gsmRes.json();

      // Create lookup objects
      const categoryMap = {};
      categoriesData.forEach(cat => {
        if (cat && cat.id !== undefined) {
          categoryMap[cat.id] = cat.name || 'Unknown Category';
        }
      });

      const gsmMap = {};
      gsmData.forEach(gsm => {
        if (gsm && gsm.id !== undefined) {
          gsmMap[gsm.id] = gsm.name || 'Unknown GSM';
        }
      });

      // Set state
      setProducts(Array.isArray(productsData) ? productsData : []);
      setCategoryNames(categoryMap);
      setGsmNames(gsmMap);

    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to fetch data');
      
      // Fallback mock data for testing
      const mockProducts = [
        { id: 1, sku: '19', product_name: 'BD Dapto 350 mg Cartons', category_id: 2, gsm_id: 19 },
        { id: 2, sku: '20', product_name: 'BD Dapto 350 MG Labels', category_id: 4, gsm_id: 5 },
        { id: 3, sku: '21', product_name: 'BD DAPTO Inserts', category_id: 3, gsm_id: 4 },
        { id: 4, sku: '22', product_name: 'Amoxycillin 500mg Tablets', category_id: 2, gsm_id: 19 },
        { id: 5, sku: '23', product_name: 'Paracetamol 500mg Pack', category_id: 1, gsm_id: 3 }
      ];
      
      const mockCategories = {
        1: 'Tablets',
        2: 'Cartons',
        3: 'Inserts',
        4: 'Labels',
        5: 'Packaging'
      };
      
      const mockGsm = {
        3: '80 GSM',
        4: '100 GSM',
        5: '120 GSM',
        19: '250 GSM'
      };

      setProducts(mockProducts);
      setCategoryNames(mockCategories);
      setGsmNames(mockGsm);
      
    } finally {
      setLoading(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    if (!product) return false;
    
    const matchesSearch = 
      (product.product_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (product.sku?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      product.category_id?.toString() === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = Object.entries(categoryNames).map(([id, name]) => ({
    id: parseInt(id),
    name
  }));

  const getCategoryName = (id) => {
    return categoryNames[id] || `Category ${id}`;
  };

  const getGsmName = (id) => {
    return gsmNames[id] || `GSM ${id}`;
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <h2 style={styles.loadingText}>Loading Products...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📦 Product Catalog</h1>
          <p style={styles.subtitle}>Manage and browse your product inventory</p>
        </div>
        <button 
          style={styles.refreshButton}
          onClick={fetchAllData}
        >
          🔄 Refresh Data
        </button>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📊</div>
          <div>
            <h3 style={styles.statNumber}>{products.length}</h3>
            <p style={styles.statLabel}>Total Products</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🏷️</div>
          <div>
            <h3 style={styles.statNumber}>{Object.keys(categoryNames).length}</h3>
            <p style={styles.statLabel}>Categories</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📄</div>
          <div>
            <h3 style={styles.statNumber}>{Object.keys(gsmNames).length}</h3>
            <p style={styles.statLabel}>GSM Types</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🔍</div>
          <div>
            <h3 style={styles.statNumber}>{filteredProducts.length}</h3>
            <p style={styles.statLabel}>Showing</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={styles.errorContainer}>
          <div style={styles.errorMessage}>
            ⚠️ <strong>Error:</strong> {error}
          </div>
          <button 
            style={styles.tryAgainButton}
            onClick={fetchAllData}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Filters */}
      <div style={styles.filtersContainer}>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search by SKU or product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <span style={styles.searchIcon}>🔍</span>
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={styles.categorySelect}
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div style={styles.tableContainer}>
        {filteredProducts.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📭</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>SKU</th>
                <th style={styles.th}>Product Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>GSM</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <span style={styles.skuBadge}>
                      #{product.sku}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <strong style={styles.productName}>{product.product_name}</strong>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.categoryBadge}>
                      {getCategoryName(product.category_id)}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.gsmBadge}>
                      {getGsmName(product.gsm_id)}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button style={styles.iconButton} title="View Details">
                        👁️
                      </button>
                      <button style={styles.iconButton} title="Edit">
                        ✏️
                      </button>
                      <button style={styles.iconButton} title="Delete">
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
      <div style={styles.footer}>
        <p>
          Product Catalog • {new Date().getFullYear()} • 
          {filteredProducts.length} of {products.length} products displayed
        </p>
      </div>
    </div>
  );
}

// Styles using plain JavaScript objects
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },

  // Loading Styles
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  loadingText: {
    color: '#2c3e50',
    margin: 0
  },

  // Header Styles
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '30px',
    padding: '20px',
    background: 'white',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  title: {
    margin: 0,
    color: '#2c3e50',
    fontSize: '2rem'
  },
  subtitle: {
    margin: '5px 0 0 0',
    color: '#7f8c8d'
  },
  refreshButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s'
  },

  // Stats Grid
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s'
  },
  statIcon: {
    fontSize: '2rem',
    marginRight: '15px'
  },
  statNumber: {
    margin: 0,
    fontSize: '1.8rem',
    color: '#2c3e50'
  },
  statLabel: {
    margin: '5px 0 0 0',
    color: '#7f8c8d',
    fontSize: '0.9rem'
  },

  // Error Styles
  errorContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#ffeaa7',
    border: '2px solid #fdcb6e',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '30px'
  },
  errorMessage: {
    margin: 0,
    color: '#d63031'
  },
  tryAgainButton: {
    padding: '8px 16px',
    background: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  },

  // Filters
  filtersContainer: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  },
  searchBox: {
    flex: 1,
    minWidth: '300px',
    position: 'relative'
  },
  searchInput: {
    width: '100%',
    padding: '12px 20px 12px 45px',
    border: '2px solid #e0e6ed',
    borderRadius: '10px',
    fontSize: '1rem',
    boxSizing: 'border-box'
  },
  searchIcon: {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#95a5a6'
  },
  categorySelect: {
    padding: '12px 20px',
    border: '2px solid #e0e6ed',
    borderRadius: '10px',
    fontSize: '1rem',
    background: 'white',
    minWidth: '200px',
    cursor: 'pointer'
  },

  // Table Styles
  tableContainer: {
    background: 'white',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '30px',
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '600px'
  },
  tableHeader: {
    background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)',
    color: 'white'
  },
  th: {
    padding: '15px 20px',
    textAlign: 'left',
    fontWeight: '600',
    borderBottom: '2px solid #3498db'
  },
  tableRow: {
    borderBottom: '1px solid #e0e6ed'
  },
  td: {
    padding: '15px 20px'
  },

  // Badges
  skuBadge: {
    background: '#e3f2fd',
    color: '#1565c0',
    padding: '5px 10px',
    borderRadius: '20px',
    fontWeight: '600',
    fontSize: '0.9rem',
    display: 'inline-block'
  },
  categoryBadge: {
    background: '#e8f5e9',
    color: '#2e7d32',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '500',
    display: 'inline-block'
  },
  gsmBadge: {
    background: '#fff3e0',
    color: '#ef6c00',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '500',
    display: 'inline-block'
  },

  // Action Buttons
  actionButtons: {
    display: 'flex',
    gap: '8px'
  },
  iconButton: {
    background: 'none',
    border: 'none',
    padding: '8px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem'
  },

  // Product Name
  productName: {
    color: '#2c3e50'
  },

  // Empty State
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '20px',
    opacity: 0.5
  },

  // Footer
  footer: {
    textAlign: 'center',
    padding: '20px',
    color: '#7f8c8d',
    fontSize: '0.9rem'
  }
};

// Add CSS for spinner animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    button:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }
    
    tr:hover {
      background-color: #f8fafc !important;
    }
  `;
  document.head.appendChild(style);
}
