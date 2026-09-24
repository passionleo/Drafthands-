import React from 'react';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#38bdf8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '12px' }}>DraftHands Build Test</h1>
      <p style={{ color: '#94a3b8', fontSize: '16px', marginBottom: '24px' }}>The build and deployment pipeline is working cleanly.</p>
      <button 
        onClick={() => alert('DraftHands is responding!')}
        style={{ padding: '12px 24px', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' }}
      >
        Click to Test Interaction
      </button>
    </div>
  );
          }
    
