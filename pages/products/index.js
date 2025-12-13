import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching products with category names...');
      
      // ✅ FIXED: Get category and gsm NAMES, not just IDs
      const response = await fetch(
        'https://enpcdhhfsnmlhlplnycu.supabase.co/rest/v1/products?select=id,sku,product_name,category_id,gsm_id,category:category_id(name),gsm:gsm_id(name)&limit=20',
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Products with category names:', data);
      setProducts(data || []);
      
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div style={{ padding: 40, fontFamily: 'Arial' }}>
        <h1 style={{ color: 'red' }}>Error Loading Products</h1>
        <p>Error: {error}</p>
        <button 
          onClick={fetchProducts}
          style={{ padding: '10px 20px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: 'Arial' }}>
        <div style={{
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #0070f3',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <h2>Loading products with category names...</h2>
        <p>Fetching from Supabase database</p>
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
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0070f3 0%, #0056cc 100%)',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: '0 0 10px 0' }}>Product Catalog</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>
          {products.length} products • Now showing CATEGORY NAMES
        </p>
        <button
          onClick={fetchProducts}
          style={{
            marginTop: '15px',
            padding: '8px 16px',
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh Data
        </button>
      </div>

      {/* Products Table */}
      <div style={{ 
        background: 'white', 
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          padding: '15px', 
          background: '#f8f9fa',
          borderBottom: '1px solid #e9ecef'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: '#495057' }}>
            Showing {products.length} products with category names
          </p>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>SKU</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Product Name</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Category Name</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>GSM Name</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    background: '#e7f1ff',
                    color: '#0d6efd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {product.sku || 'N/A'}
                  </span>
                </td>
                <td style={{ padding: '12px', fontWeight: '500' }}>
                  {product.product_name || 'No description'}
                </td>
                <td style={{ padding: '12px' }}>
                  {/* ✅ Shows CATEGORY NAME, not ID */}
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    background: '#d1e7dd',
                    color: '#0f5132',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {product.category?.name || product.category_id || 'Uncategorized'}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  {/* ✅ Shows GSM NAME, not ID */}
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    background: '#fff3cd',
                    color: '#856404',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {product.gsm?.name || product.gsm_id || 'N/A'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Debug Info */}
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        background: '#e7f1ff',
        border: '1px solid #cfe2ff',
        borderRadius: '8px',
        color: '#084298'
      }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>
          🔍 Debug Information:
        </p>
        <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
          First product data: {JSON.stringify(products[0] || {})}
        </p>
        <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
          Category field: {products[0]?.category ? 'Exists' : 'Missing'}
        </p>
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
