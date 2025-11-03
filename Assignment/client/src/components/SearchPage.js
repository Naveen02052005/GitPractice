import React, { useState } from 'react';
import { search } from '../api';
import ImageGrid from './ImageGrid';

export default function SearchPage({ user }) {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState(new Set());
  const [status, setStatus] = useState('');

  const doSearch = async (e) => {
    e && e.preventDefault();
    if (!user) return alert('Please login to search');
    if (!term.trim()) return;
    setStatus('Searching...');
    const res = await search(term.trim());
    if (res && res.results) {
      setResults(res.results);
      setTotal(res.total || res.results.length || 0);
      setSelected(new Set());
      setStatus('');
    } else {
      setResults([]);
      setTotal(0);
      setStatus('No results or error');
    }
  };

  const toggleSelect = (id) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelected(s);
  };

  return (
    <div>
      <form className="search-bar" onSubmit={doSearch}>
        <input value={term} onChange={e => setTerm(e.target.value)} placeholder="Search images..." />
        <button type="submit">Search</button>
      </form>

      <div className="results-info">
        {status || (total ? `You searched for '${term}' — ${total} results.` : '')}
      </div>

      <div className="selected-counter">Selected: {selected.size} images</div>

      <ImageGrid results={results} selected={selected} toggleSelect={toggleSelect} />
    </div>
  );
}
