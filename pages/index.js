export default function Home() {
  return (
    <div style={{ padding: 40, textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>🚀 CPack 2025</h1>
      <p>Product Management System</p>
      <div style={{ marginTop: 30 }}>
        <a 
          href="/products" 
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: '#0070f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold'
          }}
        >
          View Products →
        </a>
      </div>
      <div style={{ marginTop: 20, fontSize: '14px', color: '#666' }}>
        <p>✅ Fresh setup | ✅ Supabase connected | ✅ Ready to deploy</p>
      </div>
    </div>
  );
}
