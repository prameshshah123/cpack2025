import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar - Simple */}
      <div style={{
        width: '250px',
        background: '#1e3a8a',
        color: 'white',
        padding: '20px'
      }}>
        <h2 style={{ color: 'white' }}>CreativePack</h2>
        <p style={{ color: '#ccc' }}>📦 Products</p>
        <p style={{ color: '#ccc' }}>📋 Orders</p>
        <p style={{ color: '#ccc' }}>🎨 Artwork</p>
        <p style={{ color: '#ccc' }}>📊 Stock</p>
      </div>

      {/* Your existing table */}
      <div style={{ flex: 1, padding: '20px' }}>
        <h1>Products</h1>
        <p>Total: {products.length}</p>
        <table border="1" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Artwork Code</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.sku}</td>
                <td>{p.product_name}</td>
                <td>{p.artwork_code || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
