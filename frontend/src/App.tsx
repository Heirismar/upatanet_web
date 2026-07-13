import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomeJornadas } from './pages/HomeJornadas';
import { CreacionJornada } from './pages/CreacionJornada';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/HomeJornadas" element={<HomeJornadas />} />
          <Route path="/CreacionJornada" element={<CreacionJornada />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App
