import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Raise from '@/pages/Raise';
import '@/App.css';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/raise' element={<Raise />} />
      </Routes>
    </>
  );
}

export default App;
