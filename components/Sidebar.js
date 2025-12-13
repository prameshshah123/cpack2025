export default function Sidebar({ isOpen, onClose }) {
  const menuItems = [
    { icon: '📦', label: 'Products', href: '/products' },
    { icon: '📋', label: 'Orders', href: '/orders' },
    { icon: '🎨', label: 'Artwork History', href: '/artwork-history' },
    { icon: '📊', label: 'Stock', href: '/stock' },
    { icon: '🏷️', label: 'Categories', href: '/categories' },
    { icon: '📄', label: 'GSM Types', href: '/gsm' },
    { icon: '👥', label: 'Customers', href: '/customers' },
    { icon: '🖨️', label: 'Printers', href: '/printers' },
    { icon: '📈', label: 'Reports', href: '/reports' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          style={styles.mobileOverlay}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div style={{
        ...styles.sidebar,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
      }}>
        {/* Logo */}
        <div style={styles.logoSection}>
          <div style={styles.logo}>
            <span style={styles.logoText}>CP</span>
          </div>
          <div style={styles.brand}>
            <h1 style={styles.brandName}>CreativePack</h1>
            <p style={styles.brandSubtitle}>Packaging Solutions</p>
          </div>
        </div>

        {/* Navigation */}
        <nav style={styles.navMenu}>
          <ul style={styles.menuList}>
            {menuItems.map((item) => (
              <li key={item.label} style={styles.menuItem}>
                <a href={item.href} style={styles.menuLink}>
                  <span style={styles.menuIcon}>{item.icon}</span>
                  <span style={styles.menuLabel}>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info */}
        <div style={styles.userSection}>
          <div style={styles.userAvatar}>
            <span>AD</span>
          </div>
          <div style={styles.userInfo}>
            <p style={styles.userName}>Admin User</p>
            <p style={styles.userEmail}>admin@creativepack.com</p>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  mobileOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 40,
    display: 'none'
  },
  sidebar: {
    width: '280px',
    background: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)',
    color: 'white',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 50,
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease'
  },
  logoSection: {
    padding: '24px 20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  logo: {
    width: '40px',
    height: '40px',
    backgroundColor: 'white',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoText: {
    color: '#1e3a8a',
    fontSize: '18px',
    fontWeight: 700
  },
  brandName: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 700,
    color: 'white'
  },
  brandSubtitle: {
    margin: '2px 0 0 0',
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.7)'
  },
  navMenu: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 0'
  },
  menuList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  menuItem: {
    margin: '4px 0'
  },
  menuLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none',
    transition: 'all 0.2s'
  },
  menuIcon: {
    fontSize: '18px',
    width: '24px',
    textAlign: 'center'
  },
  menuLabel: {
    fontSize: '14px',
    fontWeight: 500
  },
  userSection: {
    padding: '20px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    fontSize: '14px'
  },
  userInfo: {
    flex: 1,
    minWidth: 0
  },
  userName: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 600,
    color: 'white'
  },
  userEmail: {
    margin: '2px 0 0 0',
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.7)'
  }
};
