import { useNavigate } from "react-router-dom";
import { Globe } from 'lucide-react';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        textAlign: 'center',
      }}
    >
      <Globe
        style={{ width: '48px', height: '48px', color: 'rgba(60,60,67,0.20)', marginBottom: '24px' }}
      />
      <h1
        style={{
          fontSize: '72px',
          fontWeight: '800',
          letterSpacing: '-3px',
          color: 'rgba(60,60,67,0.12)',
          margin: '0 0 8px',
          lineHeight: 1,
        }}
      >
        404
      </h1>
      <p style={{ fontSize: '16px', fontWeight: '500', color: 'rgba(60,60,67,0.40)', margin: '0 0 36px' }}>
        Page not found
      </p>
      <button className="btn-accent-solid" onClick={() => navigate('/')}>
        Return to Atlas
      </button>
    </div>
  );
};

export default ErrorPage;