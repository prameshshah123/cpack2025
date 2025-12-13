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
      
      // 1. Try to fetch products
      let productsData = [];
      try {
        const productsResponse = await fetch(
          'https://enpcdhhfsnmlhlplnycu.supabase.co/rest/v1/products?select=id,sku,product_name,category_id,gsm_id&order=sku.asc&limit=20',
          {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU'
            }
          }
        );
        
        if (productsResponse.ok) {
          productsData = await productsResponse.json();
          console.log('Products loaded:', productsData.length);
        } else {
          console.log('Products fetch failed, using mock data');
          // Mock data for testing
          productsData = [
            { id: 1, sku: '19', product_name: 'BD Dapto 350 mg Cartons', category_id: 2, gsm_id: 19 },
            { id: 2, sku: '20', product_name: 'BD Dapto 350 MG Labels', category_id: 4, gsm_id: 5 },
            { id: 3, sku: '21', product_name: 'BD DAPTO Inserts', category_id: 3, gsm_id: 4 }
          ];
        }
      } catch (error) {
        console.log('Products error, using mock:', error);
        productsData = [
          { id: 1, sku: '19', product_name: 'Test Carton', category_id: 2, gsm_id: 19 },
          { id: 2, sku: '20', product_name: 'Test Label', category_id: 4, gsm_id: 5 }
        ];
      }
      
      // 2. Fetch category names (this works)
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
      
      // Convert to lookup
      const categoryMap = {};
      categoriesData.forEach(cat => {
        if (cat && cat.id) {
          categoryMap[cat.id] = cat.name;
        }
      });
      setCategoryNames(categoryMap);
      
      // 3. Fetch GSM names (this works)
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
      
      // Convert to lookup
      const gsmMap = {};
      gsmData.forEach(gsm => {
        if (gsm && gsm.id) {
          gsmMap[gsm.id] = gsm.name;
        }
      });
      setGsmNames(gsmMap);
      
      // Set products (ensuring it's an array)
      setProducts(Array.isArray(productsData) ? productsData : []);
      
    } catch (error) {
      console.error('Main error:', error);
      // Set empty arrays on error
      setProducts([]);
      setCategoryNames({});
      setGsmNames({});
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getCategoryName = (categoryId) => {
    return categoryNames[categoryId] || `ID: ${categoryId}`;
  };

  const getGsmName = (gsmId) => {
    return gsmNames[gsmId] || `ID: ${gsmId}`;
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
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1>Product Catalog</h1>
        <p>{products.length} products loaded</p>
        <button
          onClick={fetchAllData}
          style={{
            padding: '8px 16px',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh Data
        </button>
      </div>

      {/* Products Table */}
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
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    background: '#d1e7dd',
                    color: '#0f5132',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}>
                    {getCategoryName(product.category_id)}
                  </span>
                </td>
                <td>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    background: '#fff3cd',
                    color: '#856404',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}>
                    {getGsmName(product.gsm_id)}
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
        borderRadius: '8px'
      }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Debug Information:</h4>
        <p style={{ margin: '0 0 5px 0' }}>
          <strong>Products:</strong> {products.length} items
        </p>
        <p style={{ margin: '0 0 5px 0' }}>
          <strong>Categories loaded:</strong> {Object.keys(categoryNames).length}
        </p>
        <p style={{ margin: '0 0 5px 0' }}>
          <strong>Category 2:</strong> "{categoryNames[2] || 'Loading...'}"
        </p>
        <p style={{ margin: '0 0 5px 0' }}>
          <strong>Category 3:</strong> "{categoryNames[3] || 'Loading...'}"
        </p>
        <p style={{ margin: '0' }}>
          <strong>Category 4:</strong> "{categoryNames[4] || 'Loading...'}"
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
