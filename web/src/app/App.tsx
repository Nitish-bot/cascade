import { Routes, Route } from 'react-router-dom';
import '@/app/App.css';
import Home from '@/pages/Home';
import Raise from '@/pages/Raise';
import Donate from '@/pages/Donate';

function App() {
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
