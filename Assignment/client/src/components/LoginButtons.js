import React from 'react';

export default function LoginButtons({ onLogin }) {
  return (
    <div style={{ display:'flex', gap:8 }}>
      <button onClick={() => onLogin('google')}>Login with Google</button>
      <button onClick={() => onLogin('github')}>Login with GitHub</button>
      <button onClick={() => onLogin('facebook')}>Login with Facebook</button>
    </div>
  );
}
