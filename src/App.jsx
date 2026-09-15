import Navbar from './components/Navbar/Navbar';
import AmbientBackground from './components/AmbientBackground/AmbientBackground';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="relative min-h-screen text-foreground selection:bg-primary/30 selection:text-white">
      <AmbientBackground />
      <Navbar />
      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
