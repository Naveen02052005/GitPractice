import React from 'react';

export default function ImageGrid({ results = [], selected, toggleSelect }) {
  return (
    <div className="grid">
      {results.map(img => {
        const isSel = selected.has(img.id);
        return (
          <div className="grid-item" key={img.id}>
            <img src={img.small} alt={img.alt || img.id} />
            <div className="checkbox-overlay">
              <label>
                <input type="checkbox" checked={isSel} onChange={() => toggleSelect(img.id)} /> Select
              </label>
            </div>
          </div>
        );
      })}
    </div>
  );
}
