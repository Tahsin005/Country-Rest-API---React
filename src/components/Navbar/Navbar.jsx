import { Link } from "react-router-dom";
import { Globe } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="nav-glass">
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
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
          onMouseEnter={e => e.currentTarget.style.opacity = '0.82'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Globe
              style={{
                width: '32px',
                height: '32px',
                color: '#1A1A2E',
                transition: 'transform 700ms ease-out',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'rotate(30deg)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'rotate(0deg)'}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span
              style={{
                fontSize: '20px',
                fontWeight: '800',
                letterSpacing: '-0.5px',
                color: '#1A1A2E',
                fontStyle: 'italic',
              }}
            >
              World<span style={{ color: '#3D3D6E', fontStyle: 'normal' }}>Explorer</span>
            </span>
            <span
              className="label-xs"
              style={{ marginTop: '2px', color: 'rgba(60,60,67,0.38)' }}
            >
              Cartographic Systems
            </span>
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
