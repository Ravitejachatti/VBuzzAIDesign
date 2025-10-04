import React from 'react';

const DocumentModal = ({ docUrl, onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h4>Document Preview</h4>
        <iframe src={docUrl} width="100%" height="400px" title="Document Preview" />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default DocumentModal;