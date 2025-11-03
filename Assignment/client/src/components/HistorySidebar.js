
import React, { useEffect, useState } from 'react';
import { getHistory } from '../api';

export default function HistorySidebar({ user }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!user) return setHistory([]);
    (async () => {
      const r = await getHistory();
      if (r && r.history) setHistory(r.history);
    })();
  }, [user]);

  return (
    <div className="history">
      <h3>Search History</h3>
      {!user && <div>Login to see your history</div>}
      {user && history.length === 0 && <div>No history yet</div>}
      {history.map(h => (
        <div key={h._id} className="item">
          <div><strong>{h.term}</strong></div>
          <div style={{ fontSize: 12, color: '#666' }}>{new Date(h.timestamp).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}
