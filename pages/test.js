export default function TestPage() {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '250px', background: 'blue', color: 'white', padding: '20px' }}>
        <h2>SIDEBAR SHOULD BE HERE</h2>
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        <h1>Test Page</h1>
        <p>If you see blue sidebar, then CSS is working</p>
      </div>
    </div>
  );
}
