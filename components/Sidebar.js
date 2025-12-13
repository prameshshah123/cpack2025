// components/Sidebar.js
import { useState } from 'react';
import Link from 'next/link';

export default function Sidebar({ isOpen, onClose }) {
  const menuItems = [
    { icon: '📦', label: 'Products', href: '/products' },
    { icon: '📋', label: 'Orders', href: '/orders' },
    { icon: '🎨', label: 'Artwork History', href: '/artwork-history' },
    { icon: '📊', label: 'Stock', href: '/stock' },
    { icon: '📄', label: 'Paper Types', href: '/paper-types' },
    { icon: '🏷️', label: 'Categories', href: '/categories' },
    { icon: '📐', label: 'Sizes', href: '/sizes' },
    { icon: '🏗️', label: 'Constructions', href: '/constructions' },
    { icon: '✨', label: 'Special Effects', href: '/special-effects' },
    { icon: '👥', label: 'Customers', href: '/customers' },
    { icon: '🖨️', label: 'Printers', href: '/printers' },
    { icon: '📦', label: 'Paperwala', href: '/paperwala' },
    { icon: '📈', label: 'Reports', href: '/reports' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="mobile-overlay"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="logo-section">
          <div className="logo">
            <span className="logo-text">CP</span>
          </div>
          <div className="brand">
            <h1 className="brand-name">CreativePack</h1>
            <p className="brand-subtitle">Packaging Solutions</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="nav-menu">
          <ul className="menu-list">
            {menuItems.map((item) => (
              <li key={item.label} className="menu-item">
                <Link href={item.href}>
                  <a className="menu-link">
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-label">{item.label}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info */}
        <div className="user-section">
          <div className="user-avatar">
            <span>AD</span>
          </div>
          <div className="user-info">
            <p className="user-name">Admin User</p>
            <p className="user-email">admin@creativepack.com</p>
          </div>
        </div>

        <style jsx>{`
          .mobile-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 40;
            display: none;
          }

          .sidebar {
            width: 280px;
            background: linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%);
            color: white;
            height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
            z-index: 50;
            display: flex;
            flex-direction: column;
            transition: transform 0.3s ease;
          }

          .logo-section {
            padding: 24px 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .logo {
            width: 40px;
            height: 40px;
            background: white;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .logo-text {
            color: #1e3a8a;
            font-size: 18px;
            font-weight: 700;
          }

          .brand-name {
            margin: 0;
            font-size: 20px;
            font-weight: 700;
            color: white;
          }

          .brand-subtitle {
            margin: 2px 0 0 0;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.7);
          }

          .nav-menu {
            flex: 1;
            overflow-y: auto;
            padding: 20px 0;
          }

          .menu-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .menu-item {
            margin: 4px 0;
          }

          .menu-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 20px;
            color: rgba(255, 255, 255, 0.8);
            text-decoration: none;
            transition: all 0.2s;
          }

          .menu-link:hover {
            background: rgba(255, 255, 255, 0.1);
            color: white;
          }

          .menu-icon {
            font-size: 18px;
            width: 24px;
            text-align: center;
          }

          .menu-label {
            font-size: 14px;
            font-weight: 500;
          }

          .user-section {
            padding: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .user-avatar {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 14px;
          }

          .user-info {
            flex: 1;
            min-width: 0;
          }

          .user-name {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
            color: white;
          }

          .user-email {
            margin: 2px 0 0 0;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.7);
          }

          @media (max-width: 768px) {
            .mobile-overlay {
              display: block;
            }
            
            .sidebar {
              transform: translateX(-100%);
            }
            
            .sidebar.open {
              transform: translateX(0);
            }
          }

          @media (min-width: 769px) {
            .sidebar {
              transform: translateX(0);
              position: sticky;
            }
            
            .main-content {
              margin-left: 280px;
            }
          }
        `}</style>
      </div>
    </>
  );
}
