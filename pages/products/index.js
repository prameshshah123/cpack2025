// VERSION 2.0 - With Dark Blue Sidebar
import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen] = useState(true); // Always show sidebar

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

  if (loading) return <div style={{ padding: 50, textAlign: 'center' }}>Loading Products...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* DARK BLUE SIDEBAR - FIXED POSITION */}
      <div style={{
        width: '250px',
        background: '#1e3a8a',
        color: 'white',
        padding: '20px',
        position: 'fixed',
        height: '100vh',
        left: 0,
        top: 0,
        zIndex: 1000
      }}>
        <h2 style={{ color: 'white', marginTop: 0 }}>CreativePack</h2>
        <div style={{ marginBottom: '20px' }}>
          <p style={{ color: 'white', fontWeight: 'bold' }}>📦 Products</p>
          <p style={{ color: '#ccc' }}>📋 Orders</p>
          <p style={{ color: '#ccc' }}>🎨 Artwork History</p>
          <p style={{ color: '#ccc' }}>📊 Stock</p>
        </div>
      </div>

      {/* MAIN CONTENT - PUSHED RIGHT */}
      <div style={{ 
        flex: 1, 
        padding: '20px',
        marginLeft: '250px'  // This pushes content right
      }}>
        <h1 style={{ color: '#1e3a8a' }}>Products</h1>
        <p>Total: {products.length}</p>
        
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9' }}>
              <th style={{ padding: '10px' }}>SKU</th>
              <th style={{ padding: '10px' }}>Product Name</th>
              <th style={{ padding: '10px' }}>Artwork Code</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td style={{ padding: '10px' }}>{p.sku}</td>
                <td style={{ padding: '10px' }}>{p.product_name}</td>
                <td style={{ padding: '10px' }}>{p.artwork_code || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
