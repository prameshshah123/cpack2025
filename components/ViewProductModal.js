// components/ViewProductModal.js
export default function ViewProductModal({ product, onClose, categories, gsmTypes }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Product Details</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="modal-body">
          <div className="product-detail">
            <h3>{product.product_name}</h3>
            <p><strong>SKU:</strong> {product.sku}</p>
            <p><strong>Artwork Code:</strong> {product.artwork_code || 'N/A'}</p>
            <p><strong>Category:</strong> {categories[product.category_id] || 'N/A'}</p>
            <p><strong>GSM:</strong> {gsmTypes[product.gsm_id] || 'N/A'}</p>
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn-close">Close</button>
        </div>
        
        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          .modal {
            background: white;
            border-radius: 12px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }
          .modal-header {
            padding: 20px;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .modal-header h2 {
            margin: 0;
            color: #1e293b;
          }
          .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #64748b;
          }
          .modal-body {
            padding: 20px;
            flex: 1;
            overflow-y: auto;
          }
          .product-detail {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .modal-footer {
            padding: 20px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            justify-content: flex-end;
          }
          .btn-close {
            padding: 10px 20px;
            background: #1e3a8a;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
          }
        `}</style>
      </div>
    </div>
  );
}
