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
