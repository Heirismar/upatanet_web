import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Home from './index';
import Register from './pages/Register';
import LogIn from './pages/LogIn';
import { HomeJornadas } from './pages/HomeJornadas';
import { CreacionJornada } from './pages/CreacionJornada';
import { EditarJornada } from './pages/EditarJornada';
import { EditarUsuario } from './pages/EditarUsuario';
import { EditarCentroMedico } from './pages/EditarCentroMedico';
import { CrearUsuario } from './pages/CrearUsuario';
import { CrearCentroMedico } from './pages/CrearCentroMedico';
import { CrearNoticia } from './pages/CrearNoticia';
import { EditarNoticia } from './pages/EditarNoticia';
import { AdminPage } from './pages/AdminPage';
import { RepresentantePanel } from './pages/RepresentantePanel';
import RegistroCentroMedico from './pages/RegistroCentroMedico';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/HomeJornadas" element={<ProtectedRoute><HomeJornadas /></ProtectedRoute>} />
          <Route path="/CreacionJornada" element={<ProtectedRoute><CreacionJornada /></ProtectedRoute>} />
          <Route path="/RegistroCentroMedico" element={<ProtectedRoute><RegistroCentroMedico /></ProtectedRoute>} />
          <Route path="/EditarJornada/:id" element={<ProtectedRoute><EditarJornada /></ProtectedRoute>} />
          <Route path="/admin/editar/usuario/:id" element={<ProtectedRoute><EditarUsuario /></ProtectedRoute>} />
          <Route path="/admin/editar/centro/:id" element={<ProtectedRoute><EditarCentroMedico /></ProtectedRoute>} />
          <Route path="/admin/crear/usuario" element={<ProtectedRoute><CrearUsuario /></ProtectedRoute>} />
          <Route path="/admin/crear/centro" element={<ProtectedRoute><CrearCentroMedico /></ProtectedRoute>} />
          <Route path="/admin/crear/noticia" element={<ProtectedRoute><CrearNoticia /></ProtectedRoute>} />
          <Route path="/admin/editar/noticia/:id" element={<ProtectedRoute><EditarNoticia /></ProtectedRoute>} />
          <Route path="/panel/crear/noticia" element={<ProtectedRoute><CrearNoticia /></ProtectedRoute>} />
          <Route path="/panel/editar/noticia/:id" element={<ProtectedRoute><EditarNoticia /></ProtectedRoute>} />
          <Route path="/admin/:section" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/panel/home" element={<ProtectedRoute><RepresentantePanel /></ProtectedRoute>} />
          <Route path="/panel/jornadas" element={<ProtectedRoute><RepresentantePanel /></ProtectedRoute>} />
          <Route path="/panel/noticias" element={<ProtectedRoute><RepresentantePanel /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
