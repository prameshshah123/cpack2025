import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://enpcdhhfsnmlhlplnycu.supabase.co/rest/v1/products?select=*&order=id.asc', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU'
      }
    })
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

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

      {/* MAIN CONTENT - With ALL columns you wanted */}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h1 style={{ margin: 0, color: '#1e3a8a', fontSize: '28px', fontWeight: 'bold' }}>Product Catalog</h1>
              <p style={{ margin: '5px 0 0 0', color: '#64748b' }}>{products.length} products</p>
            </div>
            <button style={{
              background: '#1e3a8a',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              + Add Product
            </button>
          </div>

          {/* Products Table with ALL columns */}
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
                {products.map((product) => (
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
                    </td>
                    
                    {/* Column B: Category */}
                    <td style={styles.tableCell}>
                      <span style={{ 
                        background: '#e0f2fe', 
                        color: '#0369a1', 
                        padding: '6px 12px', 
                        borderRadius: '20px', 
                        fontSize: '12px', 
                        fontWeight: '500' 
                      }}>
                        Category {product.category_id || 'N/A'}
                      </span>
                    </td>
                    
                    {/* Column C: Specs */}
                    <td style={styles.tableCell}>
                      <div style={{ fontSize: '14px', color: '#475569' }}>
                        {product.specs || product.spec || 'No specs'}
                      </div>
                    </td>
                    
                    {/* Column D: Files - Only show if exist */}
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
                          <span style={{ color: '#94a3b8', fontStyle: 'italic' }}></span>
                        )}
                      </div>
                    </td>
                    
                    {/* Column E: Actions - Icons only */}
                    <td style={styles.tableCell}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={styles.actionButton} title="View">👁️</button>
                        <button style={styles.actionButton} title="Edit">✏️</button>
                        <button style={{...styles.actionButton, background: '#fee2e2', color: '#dc2626'}} title="Delete">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        body { margin: 0; font-family: 'Montserrat', sans-serif; }
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
  }
};
