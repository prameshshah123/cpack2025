import { useState, useEffect } from 'react';

const SUPABASE_URL = 'https://enpcdhhfsnmlhlplnycu.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=id.asc`, {
        headers: { 'apikey': SUPABASE_KEY }
      });
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 50, textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Montserrat, Arial' }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        background: '#1e3a8a',
        color: 'white',
        padding: '20px',
        display: sidebarOpen ? 'block' : 'none',
        position: 'fixed',
        height: '100vh',
        zIndex: 100
      }}>
        <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'white', color: '#1e3a8a', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>CP</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px' }}>CreativePack</h2>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>Packaging Solutions</p>
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>MAIN MENU</h3>
          <a href="#" style={styles.menuItemActive}>📦 Products</a>
          <a href="#" style={styles.menuItem}>📋 Orders</a>
          <a href="#" style={styles.menuItem}>🎨 Artwork History</a>
          <a href="#" style={styles.menuItem}>📊 Stock</a>
        </div>

        <div>
          <h3 style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>MASTER DATA</h3>
          <a href="#" style={styles.menuItem}>🏷️ Categories</a>
          <a href="#" style={styles.menuItem}>📄 Specifications</a>
          <a href="#" style={styles.menuItem}>👥 Customers</a>
          <a href="#" style={styles.menuItem}>🖨️ Printers</a>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: sidebarOpen ? '250px' : '0', transition: 'margin-left 0.3s' }}>
        {/* Top Bar */}
        <div style={{ background: 'white', padding: '15px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: '#1e3a8a', color: 'white', border: 'none', width: '40px', height: '40px', borderRadius: '8px', cursor: 'pointer', fontSize: '20px' }}
            >
              ☰
            </button>
            <h1 style={{ margin: 0, color: '#1e3a8a' }}>CreativePack</h1>
          </div>
          <button style={{ background: '#1e3a8a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            + Add Product
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '30px' }}>
          <div style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#1e3a8a' }}>Products ({products.length})</h2>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={styles.tableHeader}>Product Name</th>
                  <th style={styles.tableHeader}>Artwork Code</th>
                  <th style={styles.tableHeader}>Category</th>
                  <th style={styles.tableHeader}>Specs</th>
                  <th style={styles.tableHeader}>Files</th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={styles.tableCell}>
                      <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{product.product_name}</div>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={{ color: '#666', fontSize: '14px' }}>{product.artwork_code || 'N/A'}</div>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '5px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
                        {product.category_id ? `Category ${product.category_id}` : 'None'}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={{ fontSize: '14px', color: '#475569' }}>
                        {product.specs || product.spec || 'No specs'}
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {product.artwork_cdr && <span style={{ background: '#dbeafe', color: '#1e40af', padding: '5px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold' }}>CDR</span>}
                        {product.artwork_pdf && <span style={{ background: '#fee2e2', color: '#dc2626', padding: '5px 10px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold' }}>PDF</span>}
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button style={styles.actionBtn}>👁️</button>
                        <button style={styles.actionBtn}>✏️</button>
                        <button style={{...styles.actionBtn, background: '#fee2e2', color: '#dc2626'}}>🗑️</button>
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
        a { text-decoration: none; }
      `}</style>
    </div>
  );
}

const styles = {
  menuItem: {
    display: 'block',
    padding: '10px 15px',
    color: 'rgba(255,255,255,0.8)',
    borderRadius: '5px',
    marginBottom: '5px',
    transition: 'all 0.2s'
  },
  menuItemActive: {
    display: 'block',
    padding: '10px 15px',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    borderRadius: '5px',
    marginBottom: '5px',
    fontWeight: '500'
  },
  tableHeader: {
    padding: '15px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#475569',
    fontSize: '14px'
  },
  tableCell: {
    padding: '15px',
    verticalAlign: 'top'
  },
  actionBtn: {
    width: '35px',
    height: '35px',
    borderRadius: '5px',
    border: 'none',
    background: '#f1f5f9',
    color: '#475569',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
