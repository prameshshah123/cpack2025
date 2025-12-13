import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({}); // Store category names
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('all'); // Which column to search
  const [showAddForm, setShowAddForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const headers = {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU'
      };

      // Fetch products and categories
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('https://enpcdhhfsnmlhlplnycu.supabase.co/rest/v1/products?select=*&order=id.asc', { headers }),
        fetch('https://enpcdhhfsnmlhlplnycu.supabase.co/rest/v1/category?select=id,name', { headers })
      ]);

      const productsData = await productsRes.json();
      setProducts(productsData);

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        const categoryMap = {};
        categoriesData.forEach(cat => {
          categoryMap[cat.id] = cat.name;
        });
        setCategories(categoryMap);
      }

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get category name (fixes ID display issue)
  const getCategoryName = (categoryId) => {
    return categories[categoryId] || `Category ${categoryId || 'N/A'}`;
  };

  // Search functionality
  const filteredProducts = products.filter(product => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    
    switch(searchColumn) {
      case 'name':
        return product.product_name?.toLowerCase().includes(term);
      case 'artwork':
        return product.artwork_code?.toLowerCase().includes(term);
      case 'sku':
        return product.sku?.toLowerCase().includes(term);
      case 'specs':
        return product.specs?.toLowerCase().includes(term);
      case 'all':
      default:
        return (
          product.product_name?.toLowerCase().includes(term) ||
          product.artwork_code?.toLowerCase().includes(term) ||
          product.sku?.toLowerCase().includes(term) ||
          product.specs?.toLowerCase().includes(term)
        );
    }
  });

  // Handle view product
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  if (loading) return <div style={{ padding: 50, textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Montserrat, Arial' }}>
      {/* DARK BLUE SIDEBAR */}
      <div style={{
        width: '250px',
        background: '#1e3a8a',
        color: 'white',
        padding: '20px',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0
      }}>
        <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            background: 'white', 
            color: '#1e3a8a', 
            width: '40px', 
            height: '40px', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: 'bold',
            fontSize: '18px'
          }}>
            CP
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>CreativePack</h2>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>Packaging Solutions</p>
          </div>
        </div>
        
        <div style={{ marginBottom: '30px' }}>
          <div style={styles.menuItemActive}>
            <span style={{ marginRight: '10px' }}>📦</span> Products
          </div>
          <div style={styles.menuItem}>
            <span style={{ marginRight: '10px' }}>📋</span> Orders
          </div>
          <div style={styles.menuItem}>
            <span style={{ marginRight: '10px' }}>🎨</span> Artwork History
          </div>
          <div style={styles.menuItem}>
            <span style={{ marginRight: '10px' }}>📊</span> Stock
          </div>
        </div>
        
        <div>
          <div style={styles.menuItem}>
            <span style={{ marginRight: '10px' }}>🏷️</span> Categories
          </div>
          <div style={styles.menuItem}>
            <span style={{ marginRight: '10px' }}>📄</span> Specifications
          </div>
          <div style={styles.menuItem}>
            <span style={{ marginRight: '10px' }}>👥</span> Customers
          </div>
          <div style={styles.menuItem}>
            <span style={{ marginRight: '10px' }}>🖨️</span> Printers
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ 
        flex: 1, 
        padding: '30px',
        marginLeft: '250px'
      }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '10px', 
          padding: '25px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          {/* Header with Search */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <h1 style={{ margin: 0, color: '#1e3a8a', fontSize: '28px', fontWeight: 'bold' }}>Product Catalog</h1>
              <p style={{ margin: '5px 0 0 0', color: '#64748b' }}>
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>
            <button 
              onClick={() => setShowAddForm(true)}
              style={{
                background: '#1e3a8a',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                minWidth: '140px'
              }}
            >
              + Add Product
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            marginBottom: '25px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 45px 12px 15px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'Montserrat, sans-serif'
                }}
              />
              <span style={{
                position: 'absolute',
                right: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8'
              }}>
                🔍
              </span>
            </div>
            
            <select
              value={searchColumn}
              onChange={(e) => setSearchColumn(e.target.value)}
              style={{
                padding: '12px 15px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'Montserrat, sans-serif',
                background: 'white',
                minWidth: '150px'
              }}
            >
              <option value="all">Search All Columns</option>
              <option value="name">Product Name</option>
              <option value="artwork">Artwork Code</option>
              <option value="sku">SKU</option>
              <option value="specs">Specifications</option>
            </select>

            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  padding: '12px 15px',
                  background: '#f1f5f9',
                  color: '#64748b',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Products Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={styles.tableHeader}>Product Details</th>
                  <th style={styles.tableHeader}>Category</th>
                  <th style={styles.tableHeader}>Specs</th>
                  <th style={styles.tableHeader}>Files</th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    {/* Column A: Product Name + Artwork Code */}
                    <td style={styles.tableCell}>
                      <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#1e293b' }}>
                        {product.product_name}
                      </div>
                      {product.artwork_code && (
                        <div style={{ 
                          color: '#475569', 
                          fontSize: '13px', 
                          background: '#f1f5f9', 
                          padding: '4px 8px', 
                          borderRadius: '4px',
                          marginTop: '5px',
                          display: 'inline-block'
                        }}>
                          🎨 {product.artwork_code}
                        </div>
                      )}
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '5px' }}>
                        SKU: {product.sku || 'N/A'}
                      </div>
                    </td>
                    
                    {/* Column B: Category (FIXED - shows name not ID) */}
                    <td style={styles.tableCell}>
                      <span style={{ 
                        background: '#e0f2fe', 
                        color: '#0369a1', 
                        padding: '6px 12px', 
                        borderRadius: '20px', 
                        fontSize: '12px', 
                        fontWeight: '500' 
                      }}>
                        {getCategoryName(product.category_id)}
                      </span>
                    </td>
                    
                    {/* Column C: Specs */}
                    <td style={styles.tableCell}>
                      <div style={{ fontSize: '14px', color: '#475569' }}>
                        {product.specs || product.spec || 'No specs'}
                      </div>
                    </td>
                    
                    {/* Column D: Files */}
                    <td style={styles.tableCell}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {product.artwork_cdr && (
                          <span style={{ 
                            background: '#dbeafe', 
                            color: '#1e40af', 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '8px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '12px'
                          }}>
                            CDR
                          </span>
                        )}
                        {product.artwork_pdf && (
                          <span style={{ 
                            background: '#fee2e2', 
                            color: '#dc2626', 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '8px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '12px'
                          }}>
                            PDF
                          </span>
                        )}
                        {!product.artwork_cdr && !product.artwork_pdf && (
                          <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '13px' }}>No files</span>
                        )}
                      </div>
                    </td>
                    
                    {/* Column E: Actions */}
                    <td style={styles.tableCell}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => handleViewProduct(product)}
                          style={styles.actionButton} 
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button 
                          onClick={() => handleEditProduct(product)}
                          style={styles.actionButton} 
                          title="Edit Product"
                        >
                          ✏️
                        </button>
                        <button 
                          style={{...styles.actionButton, background: '#fee2e2', color: '#dc2626'}} 
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
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px', opacity: 0.5 }}>📭</div>
                <h3 style={{ margin: '0 0 10px 0', color: '#475569' }}>No products found</h3>
                <p>Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals (Placeholders - You'll implement these) */}
      {showAddForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Add Product Form</h2>
            <p>Form will be implemented here</p>
            <button onClick={() => setShowAddForm(false)}>Close</button>
          </div>
        </div>
      )}

      {showViewModal && selectedProduct && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>View Product: {selectedProduct.product_name}</h2>
            <p>Full details will be shown here</p>
            <button onClick={() => setShowViewModal(false)}>Close</button>
          </div>
        </div>
      )}

      {showEditModal && selectedProduct && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Edit Product: {selectedProduct.product_name}</h2>
            <p>Edit form will be implemented here</p>
            <button onClick={() => setShowEditModal(false)}>Close</button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        body { margin: 0; font-family: 'Montserrat', sans-serif; }
        button:hover { opacity: 0.9; }
        select:hover { border-color: #94a3b8; }
      `}</style>
    </div>
  );
}

const styles = {
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 15px',
    color: 'rgba(255,255,255,0.8)',
    borderRadius: '8px',
    marginBottom: '5px',
    transition: 'all 0.2s',
    cursor: 'pointer'
  },
  menuItemActive: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 15px',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    borderRadius: '8px',
    marginBottom: '5px',
    fontWeight: '500',
    cursor: 'pointer'
  },
  tableHeader: {
    padding: '15px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#475569',
    fontSize: '14px',
    textTransform: 'uppercase'
  },
  tableCell: {
    padding: '15px',
    verticalAlign: 'top'
  },
  actionButton: {
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
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    background: 'white',
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '500px',
    width: '90%'
  }
};
