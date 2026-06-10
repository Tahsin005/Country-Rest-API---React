import './App.css'
import './index.css'
import Navbar from './components/Navbar/Navbar'
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div style={{ isolation: 'isolate', minHeight: '100vh' }}>
      <div className="page-vignette" aria-hidden="true" />
      <Navbar />
      <Outlet />
    </div>
  )
}

export default App
