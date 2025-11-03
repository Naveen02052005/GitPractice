import React, { useEffect, useState } from 'react';
import { fetchMe, loginProvider, logout, getTopSearches } from './api';
import LoginButtons from './components/LoginButtons';
import SearchPage from './components/SearchPage';
import TopSearches from './components/TopSearches';
import HistorySidebar from './components/HistorySidebar';

export default function App() {
  const [user, setUser] = useState(null);
  const [top, setTop] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetchMe();
        if (r && r.user) setUser(r.user);
      } catch (err) { /* ignore */ }

      const t = await getTopSearches();
      if (t && t.top) setTop(t.top);
    })();
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>Image Search</h1>
        <div>
          {user ? (
            <div className="userbox">
              <span>{user.displayName || user.email}</span>
              <button onClick={async () => { await logout(); setUser(null); }}>Logout</button>
            </div>
          ) : (
            <LoginButtons onLogin={loginProvider} />
          )}
        </div>
      </header>

      <TopSearches top={top} />

      <div className="main">
        <div className="content">
          <SearchPage user={user} />
        </div>
        <aside className="sidebar">
          <HistorySidebar user={user} />
        </aside>
      </div>
    </div>
  );
}
