import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    product_name: '',
    artwork_code: '',
    category_id: '',
    specs: '',
    size: '',
    artwork_cdr: '',
    artwork_pdf: ''
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const headers = {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVucGNkaGhmc25tbGhscGxueWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODIzMTEsImV4cCI6MjA4MDA1ODMxMX0.AW0m2SailxdtoIqNvLAZ7iVA0elWp0AoCAq5FpedDVU'
      };

      const [productsRes, categoriesRes] = await Promise.all([
        fetch('https://enpcdhhfsnmlhlplnycu.supabase.co/rest/v1/products?select=*&order=id.asc', { headers }),
        fetch('https://enpcdhhfsnmlhlplnycu.supabase.co/rest/v1/category?select=id,name', { headers })
      ]);

      const productsData = await productsRes.json();
      setProducts(productsData);

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        const categoryMap = {};
        categoriesData.forEach(cat => {
          categoryMap[cat.id] = cat.name;
        });
        setCategories(categoryMap);
      }

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate auto SKU (removed from form, auto-generated)
  const generateAutoSKU = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `CP-${timestamp.toString(36).toUpperCase()}-${random}`;
  };

  const getCategoryName = (categoryId) => {
    return categories[categoryId] || `Category ${categoryId || 'N/A'}`;
  };

  const filteredProducts = products.filter(product => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    
    switch(searchColumn) {
      case 'name':
        return product.product_name?.toLowerCase().includes(term);
      case 'artwork':
        return product.artwork_code?.toLowerCase().includes(term);
      case 'specs':
        return product.specs?.toLowerCase().includes(term);
      case 'all':
      default:
        return (
          product.product_name?.toLowerCase().includes(term) ||
          product.artwork_code?.toLowerCase().includes(term) ||
          product.specs?.toLowerCase().includes(term)
        );
    }
  });

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setFormData({
      product_name: product.product_name || '',
      artwork_code: product.artwork_code || '',
      category_id: product.category_id || '',
      specs: product.specs || '',
      size: product.size || '',
      artwork_cdr: product.artwork_cdr || '',
      artwork_pdf: product.artwork_pdf || ''
    });
    setShowEditModal(true);
  };

  const handleAddProduct = () => {
    setFormData({
      product_name: '',
      artwork_code: '',
      category_id: '',
      specs: '',
      size: '',
      artwork_cdr: '',
      artwork_pdf: ''
    });
    setShowAddForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      // In real app, make API delete call
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    const newProduct = {
      id: Date.now(), // Temporary ID
      product_name: formData.product_name,
      artwork_code: formData.artwork_code,
      category_id: formData.category_id || null,
      specs: formData.specs,
      size: formData.size,
      artwork_cdr: formData.artwork_cdr,
      artwork_pdf: formData.artwork_pdf,
      created_at: new Date().toISOString()
    };
    
    // In real app: POST to Supabase
    setProducts([newProduct, ...products]);
    setShowAddForm(false);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    // In real app: PATCH to Supabase
    setProducts(products.map(p => 
      p.id === selectedProduct.id 
        ? { ...p, ...formData }
        : p
    ));
    setShowEditModal(false);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Mobile Header */}
      <div style={styles.mobileHeader}>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={styles.mobileMenuButton}
        >
          ☰
        </button>
        <h1 style={styles.mobileTitle}>CreativePack</h1>
        <button 
          onClick={handleAddProduct}
          style={styles.mobileAddButton}
        >
          +
        </button>
      </div>

      {/* Sidebar */}
      <div style={{
        ...styles.sidebar,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'
      }}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>CP</div>
          <div>
            <h2 style={styles.brandName}>CreativePack</h2>
            <p style={styles.brandSub}>Packaging Solutions</p>
          </div>
        </div>
        
        <div style={styles.sidebarMenu}>
          <div style={styles.menuItemActive}>
            <span style={styles.menuIcon}>📦</span> Products
          </div>
          <div style={styles.menuItem}>
            <span style={styles.menuIcon}>📋</span> Orders
          </div>
          <div style={styles.menuItem}>
            <span style={styles.menuIcon}>🎨</span> Artwork
          </div>
          <div style={styles.menuItem}>
            <span style={styles.menuIcon}>📊</span> Stock
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Desktop Header */}
        <div style={styles.desktopHeader}>
          <div>
            <h1 style={styles.title}>Product Catalog</h1>
            <p style={styles.subtitle}>
              {filteredProducts.length} of {products.length} products
            </p>
          </div>
          <button 
            onClick={handleAddProduct}
            style={styles.addButton}
          >
            + Add Product
          </button>
        </div>

        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <div style={styles.searchBox}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            <span style={styles.searchIcon}>🔍</span>
          </div>
          
          <select
            value={searchColumn}
            onChange={(e) => setSearchColumn(e.target.value)}
            style={styles.searchSelect}
          >
            <option value="all">All Columns</option>
            <option value="name">Product Name</option>
            <option value="artwork">Artwork Code</option>
            <option value="specs">Specifications</option>
          </select>

          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={styles.clearButton}
            >
              Clear
            </button>
          )}
        </div>

        {/* Products Table - Mobile Cards / Desktop Table */}
        <div style={styles.productsContainer}>
          {filteredProducts.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📭</div>
              <h3>No products found</h3>
              <p>Try adjusting your search or add a new product</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div style={styles.desktopTable}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeader}>
                      <th style={styles.th}>Product Details</th>
                      <th style={styles.th}>Category</th>
                      <th style={styles.th}>Specs</th>
                      <th style={styles.th}>Files</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} style={styles.tableRow}>
                        <td style={styles.td}>
                          <div style={styles.productName}>{product.product_name}</div>
                          {product.artwork_code && (
                            <div style={styles.artworkCode}>🎨 {product.artwork_code}</div>
                          )}
                        </td>
                        <td style={styles.td}>
                          <span style={styles.categoryBadge}>
                            {getCategoryName(product.category_id)}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.specsText}>
                            {product.specs || 'No specs'}
                          </div>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.fileIcons}>
                            {product.artwork_cdr && <span style={styles.cdrIcon}>CDR</span>}
                            {product.artwork_pdf && <span style={styles.pdfIcon}>PDF</span>}
                          </div>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.actionButtons}>
                            <button onClick={() => handleViewProduct(product)} style={styles.iconButton}>👁️</button>
                            <button onClick={() => handleEditProduct(product)} style={styles.iconButton}>✏️</button>
                            <button onClick={() => handleDeleteProduct(product.id)} style={styles.deleteButton}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div style={styles.mobileCards}>
                {filteredProducts.map((product) => (
                  <div key={product.id} style={styles.card}>
                    <div style={styles.cardHeader}>
                      <div style={styles.cardTitle}>{product.product_name}</div>
                      <div style={styles.cardActions}>
                        <button onClick={() => handleViewProduct(product)} style={styles.smallIconButton}>👁️</button>
                        <button onClick={() => handleEditProduct(product)} style={styles.smallIconButton}>✏️</button>
                        <button onClick={() => handleDeleteProduct(product.id)} style={styles.smallDeleteButton}>🗑️</button>
                      </div>
                    </div>
                    
                    {product.artwork_code && (
                      <div style={styles.cardArtwork}>🎨 {product.artwork_code}</div>
                    )}
                    
                    <div style={styles.cardDetails}>
                      <div style={styles.cardDetail}>
                        <span style={styles.detailLabel}>Category:</span>
                        <span style={styles.categoryBadgeSmall}>{getCategoryName(product.category_id)}</span>
                      </div>
                      
                      <div style={styles.cardDetail}>
                        <span style={styles.detailLabel}>Specs:</span>
                        <span>{product.specs || 'None'}</span>
                      </div>
                      
                      <div style={styles.cardDetail}>
                        <span style={styles.detailLabel}>Files:</span>
                        <div style={styles.mobileFileIcons}>
                          {product.artwork_cdr && <span style={styles.cdrIconSmall}>CDR</span>}
                          {product.artwork_pdf && <span style={styles.pdfIconSmall}>PDF</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddForm && (
        <ProductForm
          title="Add New Product"
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          onSubmit={handleSubmitAdd}
          onClose={() => setShowAddForm(false)}
          mode="add"
        />
      )}

      {showViewModal && selectedProduct && (
        <ViewProductModal
          product={selectedProduct}
          categories={categories}
          onClose={() => setShowViewModal(false)}
        />
      )}

      {showEditModal && selectedProduct && (
        <ProductForm
          title="Edit Product"
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          onSubmit={handleSubmitEdit}
          onClose={() => setShowEditModal(false)}
          mode="edit"
        />
      )}
    </div>
  );
}

// Product Form Component
function ProductForm({ title, formData, setFormData, categories, onSubmit, onClose, mode }) {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{title}</h2>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>
        
        <form onSubmit={onSubmit}>
          <div style={styles.formContent}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Product Name *</label>
              <input
                type="text"
                required
                value={formData.product_name}
                onChange={(e) => setFormData({...formData, product_name: e.target.value})}
                style={styles.input}
                placeholder="Enter product name"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Artwork Code</label>
              <input
                type="text"
                value={formData.artwork_code}
                onChange={(e) => setFormData({...formData, artwork_code: e.target.value})}
                style={styles.input}
                placeholder="Enter artwork code"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Category</label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                style={styles.select}
              >
                <option value="">Select Category</option>
                {Object.entries(categories).map(([id, name]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Specifications</label>
              <textarea
                value={formData.specs}
                onChange={(e) => setFormData({...formData, specs: e.target.value})}
                style={styles.textarea}
                placeholder="Enter product specifications"
                rows="3"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Size</label>
              <input
                type="text"
                value={formData.size}
                onChange={(e) => setFormData({...formData, size: e.target.value})}
                style={styles.input}
                placeholder="e.g., 10x10 cm"
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroupHalf}>
                <label style={styles.label}>CDR File URL</label>
                <input
                  type="text"
                  value={formData.artwork_cdr}
                  onChange={(e) => setFormData({...formData, artwork_cdr: e.target.value})}
                  style={styles.input}
                  placeholder="https://..."
                />
              </div>
              
              <div style={styles.formGroupHalf}>
                <label style={styles.label}>PDF File URL</label>
                <input
                  type="text"
                  value={formData.artwork_pdf}
                  onChange={(e) => setFormData({...formData, artwork_pdf: e.target.value})}
                  style={styles.input}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div style={styles.modalFooter}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" style={styles.submitButton}>
              {mode === 'add' ? 'Add Product' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// View Product Modal Component
function ViewProductModal({ product, categories, onClose }) {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Product Details</h2>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>
        
        <div style={styles.viewContent}>
          <div style={styles.viewGroup}>
            <label style={styles.viewLabel}>Product Name:</label>
            <div style={styles.viewValue}>{product.product_name}</div>
          </div>

          <div style={styles.viewGroup}>
            <label style={styles.viewLabel}>Artwork Code:</label>
            <div style={styles.viewValue}>{product.artwork_code || 'N/A'}</div>
          </div>

          <div style={styles.viewGroup}>
            <label style={styles.viewLabel}>Category:</label>
            <div style={styles.viewValue}>
              <span style={styles.categoryBadge}>
                {categories[product.category_id] || `Category ${product.category_id || 'N/A'}`}
              </span>
            </div>
          </div>

          <div style={styles.viewGroup}>
            <label style={styles.viewLabel}>Specifications:</label>
            <div style={styles.viewValue}>{product.specs || 'No specifications'}</div>
          </div>

          <div style={styles.viewGroup}>
            <label style={styles.viewLabel}>Size:</label>
            <div style={styles.viewValue}>{product.size || 'N/A'}</div>
          </div>

          <div style={styles.viewGroup}>
            <label style={styles.viewLabel}>Files:</label>
            <div style={styles.viewValue}>
              <div style={styles.fileIcons}>
                {product.artwork_cdr && (
                  <a href=
                
