import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch('https://enpcdhhfsnmlhlplnycu.supabase.co/rest/v1/products?select=*&limit=20', {
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
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: '250px',
        background: '#1e3a8a',
        color: 'white',
        padding: '20px'
      }}>
        <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'white', color: '#1e3a8a', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>CP</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px' }}>CreativePack</h2>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>Packaging</p>
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <a href="#" style={styles.menuItemActive}>📦 Products</a>
          <a href="#" style={styles.menuItem}>📋 Orders</a>
          <a href="#" style={styles.menuItem}>🎨 Artwork History</a>
          <a href="#" style={styles.menuItem}>📊 Stock</a>
        </div>
        
        <div>
          <a href="#" style={styles.menuItem}>🏷️ Categories</a>
          <a href="#" style={styles.menuItem}>📄 Specs</a>
          <a href="#" style={styles.menuItem}>👥 Customers</a>
          <a href="#" style={styles.menuItem}>🖨️ Printers</a>
        </div>
      </div>

      {/* Main Content - Your existing table */}
      <div style={{ flex: 1, padding: '20px' }}>
        <h1 style={{ color: '#1e3a8a' }}>Products</h1>
        <p>Total: {products.length}</p>
        
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Artwork Code</th>
              <th>Category</th>
              <th>Specs</th>
              <th>Files</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.product_name}</td>
                <td>{p.artwork_code || 'N/A'}</td>
                <td>{p.category_id ? `Cat ${p.category_id}` : 'None'}</td>
                <td>{p.specs || 'No specs'}</td>
                <td>
                  {p.artwork_cdr && <span>CDR</span>}
                  {p.artwork_pdf && <span>PDF</span>}
                </td>
                <td>
                  <button>👁️</button>
                  <button>✏️</button>
                  <button>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        body { margin: 0; font-family: 'Montserrat', sans-serif; }
        a { text-decoration: none; display: block; padding: 10px; margin: 5px 0; }
      `}</style>
    </div>
  );
}

const styles = {
  menuItem: {
    color: 'rgba(255,255,255,0.7)',
    borderRadius: '5px',
    transition: 'all 0.2s'
  },
  menuItemActive: {
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    borderRadius: '5px',
    fontWeight: '500'
  }
};
