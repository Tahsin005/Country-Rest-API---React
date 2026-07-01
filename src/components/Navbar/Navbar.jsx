import { Link } from "react-router-dom";
import { Globe } from 'lucide-react';

const Navbar = () => {
  return (
    <div style={{ position: 'sticky', top: '24px', zIndex: 100, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
      <nav 
        className="glass-pill"
        style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          padding: '12px 24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            transition: 'opacity 200ms ease-out',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.04)',
              borderRadius: '50%',
              padding: '6px'
            }}
          >
            <Globe
              style={{
                width: '24px',
                height: '24px',
                color: '#1C1C1E',
                transition: 'transform 700ms ease-out',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'rotate(45deg)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0deg)'}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span
              style={{
                fontSize: '18px',
                fontWeight: '800',
                letterSpacing: '-0.5px',
                color: '#1C1C1E',
              }}
            >
              World<span style={{ color: 'rgba(60,60,67,0.5)', fontWeight: '600' }}>Atlas</span>
            </span>
          </div>
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
