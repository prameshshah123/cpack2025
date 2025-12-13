export default function ViewProductModal({ product, onClose, categories, gsmTypes }) {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Product Details</h2>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>
        
        <div style={styles.modalBody}>
          <div style={styles.productHeader}>
            <h3 style={styles.productName}>{product.product_name}</h3>
            <span style={styles.productSku}>SKU: {product.sku}</span>
          </div>

          <div style={styles.detailsGrid}>
            <div style={styles.detailSection}>
              <h4 style={styles.sectionTitle}>Basic Information</h4>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Artwork Code:</span>
                <span style={styles.detailValue}>{product.artwork_code || 'N/A'}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Category:</span>
                <span style={styles.detailValue}>{categories[product.category_id] || 'N/A'}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>GSM:</span>
                <span style={styles.detailValue}>{gsmTypes[product.gsm_id] || 'N/A'}</span>
              </div>
            </div>

            <div style={styles.detailSection}>
              <h4 style={styles.sectionTitle}>Specifications</h4>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Size:</span>
                <span style={styles.detailValue}>{product.size || 'N/A'}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>UPS:</span>
                <span style={styles.detailValue}>{product.ups || 'N/A'}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Dimension:</span>
                <span style={styles.detailValue}>{product.dimension || 'N/A'}</span>
              </div>
            </div>

            <div style={styles.detailSection}>
              <h4 style={styles.sectionTitle}>Artwork Files</h4>
              <div style={styles.fileSection}>
                {product.artwork_cdr ? (
                  <div style={styles.fileItem}>
                    <div style={styles.fileIconCdr}>CDR</div>
                    <a href={product.artwork_cdr} target="_blank" rel="noopener noreferrer" style={styles.fileLink}>
                      Download CorelDRAW File
                    </a>
                  </div>
                ) : (
                  <div style={styles.fileItem}>
                    <div style={styles.fileIconDisabled}>CDR</div>
                    <span style={styles.noFile}>No CDR file</span>
                  </div>
                )}
                
                {product.artwork_pdf ? (
                  <div style={styles.fileItem}>
                    <div style={styles.fileIconPdf}>PDF</div>
                    <a href={product.artwork_pdf} target="_blank" rel="noopener noreferrer" style={styles.fileLink}>
                      Download PDF File
                    </a>
                  </div>
                ) : (
                  <div style={styles.fileItem}>
                    <div style={styles.fileIconDisabled}>PDF</div>
                    <span style={styles.noFile}>No PDF file</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.modalFooter}>
          <button onClick={onClose} style={styles.closeModalButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '700px',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  modalHeader: {
    padding: '20px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalTitle: {
    margin: 0,
    color: '#1e293b'
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#64748b'
  },
  modalBody: {
    padding: '20px',
    flex: 1,
    overflowY: 'auto'
  },
  productHeader: {
    marginBottom: '24px'
  },
  productName: {
    margin: '0 0 8px 0',
    color: '#1e293b',
    fontSize: '20px'
  },
  productSku: {
    color: '#64748b',
    fontSize: '14px',
    backgroundColor: '#f1f5f9',
    padding: '4px 8px',
    borderRadius: '4px',
    display: 'inline-block'
  },
  detailsGrid: {
    display: 'grid',
    gap: '24px'
  },
  detailSection: {
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px'
  },
  sectionTitle: {
    margin: '0 0 12px 0',
    color: '#1e293b',
    fontSize: '16px',
    fontWeight: 600
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    paddingBottom: '8px',
    borderBottom: '1px solid #e2e8f0'
  },
  detailLabel: {
    color: '#64748b',
    fontSize: '14px'
  },
  detailValue: {
    color: '#1e293b',
    fontSize: '14px',
    fontWeight: 500
  },
  fileSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  fileItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  fileIconCdr: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '12px'
  },
  fileIconPdf: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '12px'
  },
  fileIconDisabled: {
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    color: '#94a3b8',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '12px'
  },
  fileLink: {
    color: '#3b82f6',
    textDecoration: 'none',
    fontSize: '14px'
  },
  noFile: {
    color: '#94a3b8',
    fontSize: '14px',
    fontStyle: 'italic'
  },
  modalFooter: {
    padding: '20px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  closeModalButton: {
    padding: '10px 20px',
    backgroundColor: '#1e3a8a',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500
  }
};
