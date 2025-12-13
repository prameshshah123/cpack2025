import { useState } from 'react';

export default function AddProductModal({ onClose, onSuccess, categories, gsmTypes }) {
  const [formData, setFormData] = useState({
    sku: '',
    product_name: '',
    artwork_code: '',
    category_id: '',
    gsm_id: '',
    size: '',
    artwork_cdr: '',
    artwork_pdf: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would make API call to save product
    console.log('Form data:', formData);
    onSuccess();
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Add New Product</h2>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={styles.modalBody}>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>SKU *</label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  style={styles.input}
                  placeholder="e.g., CP-001"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.product_name}
                  onChange={(e) => setFormData({...formData, product_name: e.target.value})}
                  style={styles.input}
                  placeholder="e.g., Premium Box"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Artwork Code</label>
                <input
                  type="text"
                  value={formData.artwork_code}
                  onChange={(e) => setFormData({...formData, artwork_code: e.target.value})}
                  style={styles.input}
                  placeholder="e.g., ART-001"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Category *</label>
                <select
                  required
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
                <label style={styles.label}>GSM</label>
                <select
                  value={formData.gsm_id}
                  onChange={(e) => setFormData({...formData, gsm_id: e.target.value})}
                  style={styles.select}
                >
                  <option value="">Select GSM</option>
                  {Object.entries(gsmTypes).map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
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
            </div>

            <div style={styles.fileUploadSection}>
              <h4 style={styles.sectionTitle}>Artwork Files</h4>
              <div style={styles.fileUploadGrid}>
                <div style={styles.fileUpload}>
                  <label style={styles.fileLabel}>CDR File</label>
                  <input
                    type="text"
                    value={formData.artwork_cdr}
                    onChange={(e) => setFormData({...formData, artwork_cdr: e.target.value})}
                    style={styles.input}
                    placeholder="CDR file URL"
                  />
                </div>
                <div style={styles.fileUpload}>
                  <label style={styles.fileLabel}>PDF File</label>
                  <input
                    type="text"
                    value={formData.artwork_pdf}
                    onChange={(e) => setFormData({...formData, artwork_pdf: e.target.value})}
                    style={styles.input}
                    placeholder="PDF file URL"
                  />
                </div>
              </div>
            </div>
          </div>

          <div style={styles.modalFooter}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" style={styles.submitButton}>
              Save Product
            </button>
          </div>
        </form>
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
    maxWidth: '600px',
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
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '24px'
  },
  formGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    color: '#475569',
    fontSize: '14px',
    fontWeight: 500
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px'
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white'
  },
  fileUploadSection: {
    marginTop: '20px'
  },
  sectionTitle: {
    margin: '0 0 12px 0',
    color: '#1e293b',
    fontSize: '16px'
  },
  fileUploadGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px'
  },
  fileUpload: {
    marginBottom: '16px'
  },
  fileLabel: {
    display: 'block',
    marginBottom: '6px',
    color: '#475569',
    fontSize: '14px'
  },
  modalFooter: {
    padding: '20px',
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end'
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  submitButton: {
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
