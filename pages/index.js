import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        'https://enpcdhhfsnmlhlplnycu.supabase.co/rest/v1/products?select=id,sku,product_name,category_id,gsm_id&limit=20',
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU'
          }
        }
      );
      
      const data = await response.json();
      console.log('Products loaded:', data);
      setProducts(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Loading products...</h2>
        <p>Please wait while we fetch data from Supabase</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>Products ({products.length})</h1>
      
      <button 
        onClick={fetchProducts}
        style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', marginBottom: 20 }}
      >
        Refresh Data
      </button>
      
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th>SKU</th>
            <th>Product Name</th>
            <th>Category ID</th>
            <th>GSM ID</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td><strong>{product.sku}</strong></td>
              <td>{product.product_name || 'No description'}</td>
              <td>{product.category_id}</td>
              <td>{product.gsm_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {products.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', background: '#f9f9f9', marginTop: 20 }}>
          <h3>No products loaded</h3>
          <p>Check console for errors</p>
        </div>
      )}
      
      <div style={{ marginTop: 20, padding: 10, background: '#e8f4f8' }}>
        <p><strong>Debug Info:</strong></p>
        <p>Open browser console (F12) to check for errors</p>
      </div>
    </div>
  );
}
