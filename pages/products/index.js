import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryNames, setCategoryNames] = useState({});
  const [gsmNames, setGsmNames] = useState({});

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching all data...');
      
      // 1. Fetch ALL products
      const productsResponse = await fetch(
        'https://enpcdhhfsnmlhlplnycu.supabase.co/rest/v1/products?select=id,sku,product_name,category_id,gsm_id,dimension,ink&order=sku.asc&limit=50',
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU'
          }
        }
      );
      
      const productsData = await productsResponse.json();
      console.log('Products loaded:', productsData.length);
      
      // 2. Fetch ALL category names
      const categoriesResponse = await fetch(
        'https://enpcdhhfsnmlhlplnycu.supabase.co/rest/v1/category?select=id,name',
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU'
          }
        }
      );
      
      const categoriesData = await categoriesResponse.json();
      console.log('Categories loaded:', categoriesData);
      
      // Convert to lookup object: {1: "Carton", 2: "Label", 3: "Insert"}
      const categoryMap = {};
      categoriesData.forEach(cat => {
        categoryMap[cat.id] = cat.name;
      });
      setCategoryNames(categoryMap);
      
      // 3. Fetch ALL GSM names
      const gsmResponse = await fetch(
        'https://enpcdhhfsnmlhlplnycu.supabase.co/rest/v1/gsm?select=id,name',
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU'
          }
        }
      );
      
      const gsmData = await gsmResponse.json();
      console.log('GSM loaded:', gsmData);
      
      // Convert to lookup object
      const gsmMap = {};
      gsmData.forEach(gsm => {
        gsmMap[gsm.id] = gsm.name;
      });
      setGsmNames(gsmMap);
      
      // Set products
      setProducts(productsData || []);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get category name
  const getCategoryName = (categoryId) => {
    return categoryNames[categoryId] || `ID: ${categoryId}`;
  };

  // Helper function to get GSM name
  const getGsmName = (gsmId) => {
    return gsmNames[gsmId] || `ID: ${gsmId}`;
  };

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
        <p>Fetching: Products • Categories • GSM</p>
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
          onClick={fetchAllData}
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
          Refresh All Data
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
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Details</th>
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
                  {/* ✅ NOW SHOWS CATEGORY NAME */}
                  <span style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    background: '#d1e7dd',
                    color: '#0f5132',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {getCategoryName(product.category_id)}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  {/* ✅ NOW SHOWS GSM NAME */}
                  <span style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    background: '#fff3cd',
                    color: '#856404',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {getGsmName(product.gsm_id)}
                  </span>
                </td>
                <td style={{ padding: '12px', fontSize: '14px', color: '#6c757d' }}>
                  {product.dimension && <div>📏 {product.dimension}</div>}
                  {product.ink && <div>🎨 {product.ink}</div>}
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
        <h4 style={{ margin: '0 0 10px 0' }}>🔍 Data Loaded:</h4>
        <div style={{ display: 'flex', gap: '20px', fontSize: '14px' }}>
          <div>
            <p style={{ margin: '0 0 5px 0' }}><strong>Products:</strong> {products.length}</p>
            <p style={{ margin: '0 0 5px 0' }}><strong>Categories:</strong> {Object.keys(categoryNames).length}</p>
            <p style={{ margin: '0' }}><strong>GSM:</strong> {Object.keys(gsmNames).length}</p>
          </div>
          <div>
            <p style={{ margin: '0 0 5px 0' }}><strong>Example Category IDs → Names:</strong></p>
            <p style={{ margin: '0 0 5px 0' }}>2 → {categoryNames[2] || 'Loading...'}</p>
            <p style={{ margin: '0 0 5px 0' }}>3 → {categoryNames[3] || 'Loading...'}</p>
            <p style={{ margin: '0' }}>4 → {categoryNames[4] || 'Loading...'}</p>
          </div>
        </div>
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
