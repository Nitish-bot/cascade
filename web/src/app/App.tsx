import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import '@/app/App.css';
import Home from '@/pages/Home';
import Raise from '@/pages/Raise';
import Donate from '@/pages/Donate';
import { useEffect } from 'react';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if a redirect path was stored by 404.html
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      sessionStorage.removeItem('redirectPath');

      const relativePath = redirectPath.replace(/^\/cascade/, '');
      
      // Navigate to the correct route, replacing the current history entry
      if (location.pathname !== relativePath) {
        navigate(relativePath, { replace: true });
      }
    }
  }, [navigate, location]);

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/raise' element={<Raise />} />
        <Route path='/donate' element={<Donate />} />
      </Routes>
    </>
  );
}

export default App;
