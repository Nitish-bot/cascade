import { Routes, Route } from 'react-router-dom';
import '@/app/App.css';
import Home from '@/pages/Home';
import Raise from '@/pages/Raise';

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
