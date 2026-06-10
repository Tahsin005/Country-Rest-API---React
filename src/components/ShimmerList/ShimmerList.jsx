const ShimmerList = () => {
  const skeletons = Array.from({ length: 8 });

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '60px',
      }}
    >
      {skeletons.map((_, index) => (
        <div
          key={index}
          className="glass"
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: '20px',
            opacity: 0.7,
          }}
        >
          <div
            className="shimmer"
            style={{ height: '170px', borderRadius: '16px 16px 0 0', flexShrink: 0 }}
          />

          <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="shimmer" style={{ height: '18px', width: '65%', borderRadius: '8px' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div className="shimmer" style={{ height: '10px', width: '50%', borderRadius: '6px' }} />
              <div className="shimmer" style={{ height: '10px', width: '38%', borderRadius: '6px' }} />
              <div className="shimmer" style={{ height: '10px', width: '55%', borderRadius: '6px' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShimmerList;
