// components/AddProductModal.js
export default function AddProductModal({ onClose, onSuccess, categories, gsmTypes }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Add New Product</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="modal-body">
          <p>Add product form will go here</p>
          <p>This is a placeholder - you'll need to implement the full form</p>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="btn-cancel">Cancel</button>
          <button onClick={onSuccess} className="btn-save">Save Product</button>
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
          .modal-footer {
            padding: 20px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            gap: 10px;
            justify-content: flex-end;
          }
          .btn-cancel, .btn-save {
            padding: 10px 20px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-weight: 600;
          }
          .btn-cancel {
            background: #f1f5f9;
            color: #64748b;
          }
          .btn-save {
            background: #1e3a8a;
            color: white;
          }
        `}</style>
      </div>
    </div>
  );
}
