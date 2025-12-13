// CACHE-BREAKER VERSION 3.0 - ${Date.now()}
import { useState, useEffect } from 'react';

export default function ProductsPage() {
  console.log('NEW VERSION LOADED - WITH SIDEBAR'); // Debug log
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://enpcdhhfsnmlhlplnycu.supabase.co/rest/v1/products?select=*&limit=20', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU',
        'Cache-Control': 'no-cache' // Prevent caching
      }
    })
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading NEW version...</div>;

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* SIDEBAR - BRIGHT RED CAN'T MISS */}
      <div style={{
        width: '250px',
        background: 'RED',
        color: 'WHITE',
        padding: '20px',
        borderRight: '10px solid black',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        <h2 style={{ color: 'WHITE', border: '2px solid yellow' }}>CREATIVEPACK SIDEBAR</h2>
        <div style={{ color: 'WHITE' }}>📦 PRODUCTS</div>
        <div style={{ color: 'WHITE' }}>📋 ORDERS</div>
        <div style={{ color: 'WHITE' }}>🎨 ARTWORK</div>
        <div style={{ color: 'WHITE' }}>📊 STOCK</div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ 
        flex: 1, 
        padding: '20px',
        background: 'lightblue' 
      }}>
        <h1 style={{ color: 'red' }}>PRODUCTS PAGE - NEW VERSION</h1>
        <p><strong>Total products: {products.length}</strong></p>
        
        <table border="2" style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          background: 'white'
        }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ padding: '10px' }}>SKU</th>
              <th style={{ padding: '10px' }}>NAME</th>
              <th style={{ padding: '10px' }}>ARTWORK CODE</th>
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
        
        <div style={{ marginTop: '20px', padding: '10px', background: 'yellow' }}>
          <strong>If you see RED sidebar and this yellow box, cache is cleared!</strong>
        </div>
      </div>
    </div>
  );
}
