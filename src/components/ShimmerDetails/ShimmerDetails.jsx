const ShimmerBlock = ({ width = '100%', height, radius = '10px', style = {} }) => (
  <div
    className="shimmer"
    style={{ width, height, borderRadius: radius, flexShrink: 0, ...style }}
  />
);

const ShimmerDetails = () => {
  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '400px',
          overflow: 'hidden',
          background: 'rgba(255,252,245,0.4)',
        }}
      >
        <div
          className="shimmer"
          style={{ position: 'absolute', inset: 0, borderRadius: 0, opacity: 0.4 }}
        />

        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '40px 48px',
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '60px' }}>
            <ShimmerBlock width="90px" height="36px" radius="100px" />
            <ShimmerBlock width="70px" height="36px" radius="100px" />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '48px', flexWrap: 'wrap' }}>
            <div
              className="glass"
              style={{ padding: '12px', borderRadius: '24px', flexShrink: 0 }}
            >
              <ShimmerBlock width="220px" height="140px" radius="16px" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '10px' }}>
              <ShimmerBlock width="120px" height="12px" radius="6px" />
              <ShimmerBlock width="320px" height="60px" radius="12px" />
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1280px',
          margin: '24px auto 0',
          padding: '0 48px',
        }}
      >
        {/* Stats strip */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '48px' }}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="glass-pill"
              style={{
                flex: '1 1 auto',
                padding: '14px 28px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
              }}
            >
              <ShimmerBlock width="18px" height="18px" radius="50%" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <ShimmerBlock width="60px" height="10px" radius="6px" />
                <ShimmerBlock width="100px" height="18px" radius="8px" />
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '32px',
          }}
        >
          <div className="glass glass-lg" style={{ padding: '32px', gridRow: 'span 2', minHeight: '280px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.4)' }}>
              <ShimmerBlock width="15px" height="15px" radius="50%" />
              <ShimmerBlock width="80px" height="10px" radius="6px" />
            </div>
            <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}>
              <ShimmerBlock width="80px" height="64px" radius="10px" />
              <ShimmerBlock width="200px" height="36px" radius="10px" />
              <ShimmerBlock width="140px" height="12px" radius="6px" />
            </div>
          </div>

          <div className="glass glass-lg" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.4)' }}>
              <ShimmerBlock width="15px" height="15px" radius="50%" />
              <ShimmerBlock width="80px" height="10px" radius="6px" />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <ShimmerBlock width="16px" height="16px" radius="50%" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <ShimmerBlock width="60px" height="10px" radius="5px" />
                  <ShimmerBlock width="140px" height="16px" radius="7px" />
                </div>
              </div>
            ))}
          </div>

          <div className="glass glass-lg" style={{ padding: '32px', gridRow: 'span 2', minHeight: '280px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.4)' }}>
              <ShimmerBlock width="15px" height="15px" radius="50%" />
              <ShimmerBlock width="140px" height="10px" radius="6px" />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', paddingTop: '8px' }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ShimmerBlock key={i} width={`${60 + (i * 17) % 50}px`} height="38px" radius="100px" />
              ))}
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <ShimmerBlock height="52px" radius="12px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShimmerDetails;
