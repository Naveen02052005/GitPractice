import React from 'react';

export default function TopSearches({ top = [] }) {
  if (!top || top.length === 0) return null;
  return (
    <div className="banner">
      Top Searches: {top.map(t => `${t.term} (${t.count})`).join(' • ')}
    </div>
  );
}
