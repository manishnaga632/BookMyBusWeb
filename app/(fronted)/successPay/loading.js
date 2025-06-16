"use client"; // Add this at the very top

export default function Loading() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '300px'
    }}>
      <div style={{
        animation: 'spin 1s linear infinite',
        borderRadius: '50%',
        height: '48px',
        width: '48px',
        border: '3px solid #3b82f6',
        borderTopColor: 'transparent',
        marginBottom: '16px'
      }}></div>
      <p style={{ color: '#4b5563' }}>Verifying your payment...</p>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}