const BASE = process.env.REACT_APP_API_BASE || '';

export async function fetchMe() {
  const res = await fetch(`${BASE}/auth/me`, { credentials: 'include' });
  return res.json();
}

export async function loginProvider(provider) {
  window.location.href = `${BASE}/auth/${provider}`;
}

export async function logout() {
  const res = await fetch(`${BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
  return res.json();
}

export async function search(term, page = 1, perPage = 20) {
  const res = await fetch(`${BASE}/api/search`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ term, page, perPage })
  });
  return res.json();
}

export async function getTopSearches() {
  const res = await fetch(`${BASE}/api/top-searches`, { credentials: 'include' });
  return res.json();
}

export async function getHistory() {
  const res = await fetch(`${BASE}/api/history`, { credentials: 'include' });
  return res.json();
}

