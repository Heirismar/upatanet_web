import { useState } from "react"
import "../App.css"
import logo from '../assets/logo-min-row.svg';
import { useNavigate } from 'react-router-dom';
import { createCentroMedicoService, updateRepresentanteCentroMedicoService } from "../services/centro_medico.service"
import { useAuth } from "../contexts/AuthContext"

function RegistroCentroMedico() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [rif, setRif] = useState("");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const centroMedico = await createCentroMedicoService({
        nombre,
        correo,
        ubicacion,
        rif,
        telefono,
      }, token ?? undefined);

      if (token && centroMedico.id) {
        await updateRepresentanteCentroMedicoService(centroMedico.id, token);
      }

      logout();
      navigate('/login');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Ocurrió un error inesperado.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="BG-loginRegister">
      {error && <div className="error-toast">{error}</div>}
      <img id="logo-LR" src={logo} alt="logo" onClick={handleSkip} />

      <form className="LIR-container LIR-container--wide" onSubmit={handleSubmit}>
        <h1>Registrar Centro Médico</h1>
        <p className="form-subtitle">Completa los datos de tu centro médico para continuar</p>

        <label>
          <svg viewBox="0 0 24 24" fill="none" stroke="#6B5D4D" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Nombre del centro
        </label>
        <input type="text" name="nombre" placeholder=" " value={nombre} onChange={(e) => setNombre(e.target.value)} required />

        <label>
          <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0V29.6691H40V0H0ZM34.0333 3.29657L20 15.9059L5.96667 3.29657H34.0333ZM3.33333 5.37341L9.88333 11.2578L3.33333 22.0705V5.37341ZM4.61667 26.3726L12.4 13.5324L20 20.3563L27.6 13.5324L35.3833 26.3726H4.61667ZM36.6667 22.0705L30.1167 11.2578L36.6667 5.37341V22.0705Z" fill="#6B5D4D"/>
          </svg>
          Correo electrónico
        </label>
        <input type="email" name="correo" placeholder=" " value={correo} onChange={(e) => setCorreo(e.target.value)} />

        <label>
          <svg viewBox="0 0 24 24" fill="none" stroke="#6B5D4D" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Ubicación
        </label>
        <input type="text" name="ubicacion" placeholder=" " value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />

        <label>
          <svg viewBox="0 0 24 24" fill="none" stroke="#6B5D4D" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          </svg>
          RIF
        </label>
        <input type="text" name="rif" placeholder=" " value={rif} onChange={(e) => setRif(e.target.value)} />

        <label>
          <svg viewBox="0 0 24 24" fill="none" stroke="#6B5D4D" strokeWidth="2">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M3 10h18" />
          </svg>
          Teléfono
        </label>
        <input type="tel" name="telefono" placeholder=" " value={telefono} onChange={(e) => setTelefono(e.target.value)} />

        <button type="submit" disabled={loading}>{loading ? "Guardando..." : "Registrar Centro Médico"}</button>
        <span>¿Ya tienes un centro? <a onClick={handleSkip}>Ir al inicio</a></span>
      </form>
    </div>
  )
}

export default RegistroCentroMedico
