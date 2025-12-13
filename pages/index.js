import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // ✅ FIXED QUERY: Gets category and gsm NAMES, not just IDs
      const response = await fetch(
        `https://enpcdhhfsnmlhlplnycu.supabase.co/rest/v1/products?select=id,sku,product_name,dimension,ink,coating,artwork_pdf,artwork_cdr,category_id,gsm_id,category:category_id(name),gsm:gsm_id(name)&order=sku.asc&limit=50`,
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU'
          }
        }
      );
      
      const data = await response.json();
      console.log('Products with category names:', data);
      setProducts(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.product_name?.toLowerCase().includes(search.toLowerCase()) ||
    product.sku?.toLowerCase().includes(search.toLowerCase()) ||
    product.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          width: '40px',
          height: '40px',
          border: '4px solid #e2e8f0',
          borderTopColor: '#0070f3',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <h2>Loading products...</h2>
        <p>Fetching category and GSM names from database</p>
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
        padding: '25px 30px',
        borderRadius: '10px',
        marginBottom: '30px'
      }}>
        <h1 style={{ fontSize: '28px', margin: '0 0 10px 0' }}>Product Catalog</h1>
        <p style={{ fontSize: '16px', opacity: 0.9 }}>
          {products.length} products • Showing category and GSM names
        </p>
        <button
          onClick={fetchProducts}
          style={{
            marginTop: '15px',
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Refresh Data
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 15px',
            fontSize: '16px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px'
          }}
        />
      </div>

      {/* Products Table */}
      <div style={{ 
        background: 'white', 
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          padding: '15px 20px', 
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <p style={{ fontWeight: 'bold', color: '#4a5568' }}>
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#4a5568' }}>SKU</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#4a5568' }}>Product Name</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#4a5568' }}>Category</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#4a5568' }}>GSM</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#4a5568' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  {/* SKU */}
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '5px 10px',
                      background: '#ebf8ff',
                      color: '#2b6cb0',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {product.sku || 'N/A'}
                    </span>
                  </td>
                  
                  {/* Product Name */}
                  <td style={{ padding: '15px' }}>
                    <div style={{ fontWeight: '600', color: '#2d3748' }}>
                      {product.product_name || 'No description'}
                    </div>
                    <div style={{ fontSize: '14px', color: '#718096', marginTop: '5px' }}>
                      {product.dimension && `📏 ${product.dimension}`}
                      {product.ink && ` • 🎨 ${product.ink}`}
                    </div>
                  </td>
                  
                  {/* Category - NOW SHOWS NAME */}
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      background: '#f0fff4',
                      color: '#276749',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {product.category?.name || product.category_id || 'Uncategorized'}
                    </span>
                  </td>
                  
                  {/* GSM - NOW SHOWS NAME */}
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      background: '#fffaf0',
                      color: '#d69e2e',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {product.gsm?.name || product.gsm_id || 'N/A'}
                    </span>
                  </td>
                  
                  {/* Details */}
                  <td style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {product.artwork_pdf && (
                        <a 
                          href={product.artwork_pdf} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            padding: '6px 10px',
                            background: '#fed7d7',
                            color: '#c53030',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '12px'
                          }}
                        >
                          PDF
                        </a>
                      )}
                      {product.artwork_cdr && (
                        <a 
                          href={product.artwork_cdr} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            padding: '6px 10px',
                            background: '#bee3f8',
                            color: '#2b6cb0',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '12px'
                          }}
                        >
                          CDR
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info Box */}
      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        background: '#f0fff4',
        border: '1px solid #c6f6d5',
        borderRadius: '8px'
      }}>
        <p style={{ color: '#276749', fontWeight: '600' }}>
          ✅ Database Connected • Category and GSM names now displayed • {products.length} products loaded
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
