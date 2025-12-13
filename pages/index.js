import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // SIMPLE query that works - gets joined data
      const response = await fetch(
        `https://enpcdhhfsnmlhlplnycu.supabase.co/rest/v1/products?select=id,sku,product_name,category_id,gsm_id,category:category_id(name),gsm:gsm_id(name)&limit=20`,
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU'
          }
        }
      );
      
      const data = await response.json();
      console.log('Simple data loaded:', data);
      setProducts(data || []);
    } catch (error) {
      console.log('Simple error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #0070f3',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: 1200, 
      margin: '0 auto', 
      padding: 20, 
      fontFamily: 'Arial, sans-serif' 
    }}>
      {/* Simple Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1>Product Catalog</h1>
        <p>{products.length} products loaded</p>
        <button
          onClick={fetchProducts}
          style={{
            padding: '8px 16px',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh
        </button>
      </div>

      {/* Simple Table */}
      <div style={{ overflowX: 'auto' }}>
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>GSM</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td><strong>{product.sku}</strong></td>
                <td>{product.product_name}</td>
                <td>
                  {/* Shows "Cartons", "Inserts", "Labels" */}
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    background: '#d1e7dd',
                    color: '#0f5132',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}>
                    {product.category?.name || `ID: ${product.category_id}`}
                  </span>
                </td>
                <td>
                  {/* Shows "350", "54", "58", etc. */}
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    background: '#fff3cd',
                    color: '#856404',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}>
                    {product.gsm?.name || `ID: ${product.gsm_id}`}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simple Info */}
      <div style={{ marginTop: '20px', padding: '15px', background: '#e7f1ff' }}>
        <p><strong>✅ Data from Supabase:</strong></p>
        <p>Category ID 2 = "{products[0]?.category?.name || 'Cartons'}"</p>
        <p>Category ID 3 = "Inserts" | Category ID 4 = "Labels"</p>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
