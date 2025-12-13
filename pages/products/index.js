import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeMenu, setActiveMenu] = useState('products');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Get products with category and GSM names
      const response = await fetch(
        `https://enpcdhhfsnmlhlplnycu.supabase.co/rest/v1/products?select=id,sku,product_name,dimension,ink,coating,folding,artwork_pdf,artwork_cdr,category_id,gsm_id,category:category_id(name),gsm:gsm_id(name)&order=sku.asc&limit=100`,
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU'
          }
        }
      );
      
      const data = await response.json();
      console.log('Products loaded:', data.length);
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

  // Menu items for sidebar
  const menuItems = [
    { id: 'products', name: '📦 Products', count: products.length },
    { id: 'production', name: '🏭 Orders in Production' },
    { id: 'artwork', name: '🎨 Artwork' },
    { id: 'paper', name: '📄 Paper Stock' },
    { id: 'completed', name: '✅ Completed Orders' }
  ];

  return (
    <div style={{ 
      display: 'flex',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      background: '#f8fafc'
    }}>
      {/* SIDEBAR */}
      <div style={{
        width: 250,
        background: 'white',
        borderRight: '1px solid #e2e8f0',
        padding: '20px 0',
        boxShadow: '2px 0 10px rgba(0,0,0,0.05)'
      }}>
        <div style={{ padding: '0 20px 20px 20px', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ 
            color: '#2d3748', 
            margin: '0 0 5px 0',
            fontSize: '20px',
            fontWeight: 'bold'
          }}>
            CPack 2025
          </h2>
          <p style={{ color: '#718096', fontSize: '14px', margin: 0 }}>
            Packaging Management
          </p>
        </div>
        
        <div style={{ padding: '20px 0' }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: activeMenu === item.id ? '#ebf8ff' : 'transparent',
                color: activeMenu === item.id ? '#2b6cb0' : '#4a5568',
                border: 'none',
                textAlign: 'left',
                fontSize: '15px',
                fontWeight: activeMenu === item.id ? '600' : '500',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderLeft: activeMenu === item.id ? '4px solid #4299e1' : '4px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              <span>{item.name}</span>
              {item.count !== undefined && (
                <span style={{
                  background: '#4299e1',
                  color: 'white',
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontWeight: 'bold'
                }}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div style={{ 
          padding: '20px', 
          marginTop: 'auto',
          borderTop: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '12px', color: '#a0aec0' }}>
            <p>✅ Database Connected</p>
            <p>Supabase Active</p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ 
        flex: 1,
        padding: '30px',
        overflow: 'auto'
      }}>
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '25px 30px',
          borderRadius: '12px',
          marginBottom: '30px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '28px', margin: '0 0 10px 0' }}>Product Catalog</h1>
              <p style={{ fontSize: '16px', opacity: 0.9 }}>
                {loading ? 'Loading...' : `${products.length} products loaded`}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={fetchProducts}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                ↻ Refresh
              </button>
              <button style={{
                padding: '10px 20px',
                background: 'white',
                color: '#667eea',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}>
                + Add Product
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '30px' }}>
          <input
            type="text"
            placeholder="🔍 Search products by name, SKU, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '15px 20px',
              fontSize: '16px',
              border: '2px solid #e2e8f0',
              borderRadius: '10px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
        </div>

        {/* Products Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{
              display: 'inline-block',
              width: '50px',
              height: '50px',
              border: '4px solid #e2e8f0',
              borderTopColor: '#667eea',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '20px', color: '#666' }}>Loading products from database...</p>
          </div>
        ) : (
          <>
            <div style={{ 
              background: 'white', 
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ 
                padding: '20px', 
                background: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#4a5568', fontSize: '16px' }}>
                    Showing {filteredProducts.length} of {products.length} products
                  </span>
                  {search && (
                    <span style={{ marginLeft: '15px', color: '#718096', fontSize: '14px' }}>
                      Results for: <strong>"{search}"</strong>
                    </span>
                  )}
                </div>
                {search && (
                  <button 
                    onClick={() => setSearch('')}
                    style={{ 
                      color: '#667eea', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Clear search
                  </button>
                )}
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#f8fafc' }}>
                    <tr>
                      <th style={{ padding: '18px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#4a5568', fontWeight: '600' }}>SKU</th>
                      <th style={{ padding: '18px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#4a5568', fontWeight: '600' }}>Product Name</th>
                      <th style={{ padding: '18px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#4a5568', fontWeight: '600' }}>Category</th>
                      <th style={{ padding: '18px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#4a5568', fontWeight: '600' }}>GSM</th>
                      <th style={{ padding: '18px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#4a5568', fontWeight: '600' }}>Specifications</th>
                      <th style={{ padding: '18px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#4a5568', fontWeight: '600' }}>Files</th>
                      <th style={{ padding: '18px', textAlign: 'left', borderBottom: '2px solid #e2e8f0', color: '#4a5568', fontWeight: '600' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.slice(0, 50).map((product) => (
                      <tr 
                        key={product.id} 
                        style={{ 
                          borderBottom: '1px solid #e2e8f0',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                      >
                        <td style={{ padding: '18px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '6px 14px',
                            background: '#ebf8ff',
                            color: '#2b6cb0',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}>
                            {product.sku || 'N/A'}
                          </span>
                        </td>
                        <td style={{ padding: '18px' }}>
                          <div style={{ fontWeight: '600', color: '#2d3748', fontSize: '15px' }}>
                            {product.product_name || 'No description'}
                          </div>
                          <div style={{ fontSize: '14px', color: '#718096', marginTop: '5px' }}>
                            {product.dimension && `📏 ${product.dimension}`}
                            {product.ink && ` • 🎨 ${product.ink}`}
                            {product.coating && ` • 🛡️ ${product.coating}`}
                          </div>
                        </td>
                        <td style={{ padding: '18px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '6px 12px',
                            background: '#f0fff4',
                            color: '#276749',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>
                            {/* Shows category NAME instead of ID */}
                            {product.category?.name || product.category_id || 'Uncategorized'}
                          </span>
                        </td>
                        <td style={{ padding: '18px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '6px 12px',
                            background: '#fffaf0',
                            color: '#d69e2e',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>
                            {/* Shows GSM NAME instead of ID */}
                            {product.gsm?.name || product.gsm_id || 'N/A'}
                          </span>
                        </td>
                        <td style={{ padding: '18px', fontSize: '14px', color: '#4a5568' }}>
                          <div>
                            {product.folding && <div>Folding: {product.folding}</div>}
                            {product.coating && <div>Coating: {product.coating}</div>}
                          </div>
                        </td>
                        <td style={{ padding: '18px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {product.artwork_pdf && (
                              <a 
                                href={product.artwork_pdf} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                  padding: '8px 12px',
                                  background: '#fed7d7',
                                  color: '#c53030',
                                  borderRadius: '6px',
                                  textDecoration: 'none',
                                  fontSize: '13px',
                                  fontWeight: '600'
                                }}
                              >
                                📄 PDF
                              </a>
                            )}
                            {product.artwork_cdr && (
                              <a 
                                href={product.artwork_cdr} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                  padding: '8px 12px',
                                  background: '#bee3f8',
                                  color: '#2b6cb0',
                                  borderRadius: '6px',
                                  textDecoration: 'none',
                                  fontSize: '13px',
                                  fontWeight: '600'
                                }}
                              >
                                🎨 CDR
                              </a>
                            )}
                            {!product.artwork_pdf && !product.artwork_cdr && (
                              <span style={{ color: '#a0aec0', fontSize: '13px' }}>No files</span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '18px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '6px 14px',
                            background: '#f0fff4',
                            color: '#38a169',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: '600'
                          }}>
                            ✅ Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Status Bar */}
            <div style={{ 
              marginTop: '25px', 
              padding: '20px', 
              background: 'linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%)',
              border: '1px solid #c6f6d5',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ 
                  display: 'inline-block',
                  width: '12px',
                  height: '12px',
                  background: '#48bb78',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }}></span>
                <div>
                  <div style={{ color: '#276749', fontWeight: '600' }}>
                    ✅ Database Connection Active
                  </div>
                  <div style={{ color: '#38a169', fontSize: '14px', marginTop: '2px' }}>
                    {products.length} products • Supabase • Real-time data
                  </div>
                </div>
              </div>
              <div style={{ color: '#2f855a', fontSize: '14px' }}>
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
