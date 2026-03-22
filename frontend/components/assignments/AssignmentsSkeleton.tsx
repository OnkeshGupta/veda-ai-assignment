const shimmerStyle: React.CSSProperties = {
  background: 'linear-gradient(90deg, #F0F0F0 25%, #E8E8E8 50%, #F0F0F0 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.6s ease-in-out infinite',
};

export default function AssignmentsSkeleton() {
  return (
    <>
      <style>{`
        @keyframes shimmer {
          from { background-position: -200% 0; }
          to   { background-position:  200% 0; }
        }
      `}</style>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)', // Note: 2 columns is desktop-only, as the sidebar hides on mobile
        gap: '12px',
      }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #F0F0F0',
          }}>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>

                <div style={{ height: '16px', width: '60%', borderRadius: '6px', ...shimmerStyle }} />

                <div style={{ height: '12px', width: '25%', borderRadius: '9999px', ...shimmerStyle }} />
              </div>

              <div style={{ width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0, ...shimmerStyle }} />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ height: '12px', width: '45%', borderRadius: '4px', ...shimmerStyle }} />
              <div style={{ height: '12px', width: '40%', borderRadius: '4px', ...shimmerStyle }} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}