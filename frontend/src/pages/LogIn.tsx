"use client"

import { useState } from "react"
import "../App.css"
import logo from '../assets/logo-min-row.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { loginService, getProfileService } from "../services/auth.service"
import { useAuth } from "../contexts/AuthContext"

import { useNavigate } from 'react-router-dom';

function LogIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginService({
        correo: email,
        contrasena: password,
      });
      login(response.token);
      const profile = await getProfileService(response.token);
      navigate(profile?.rol === 'representante' ? '/panel/home' : profile?.rol === 'admin' ? '/admin/jornadas' : '/HomeJornadas');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Ocurrió un error inesperado.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="BG-loginRegister">
      {error && <div className="error-toast">{error}</div>}
      <img id="logo-LR" src={logo} alt="logo" onClick={handleHome} />
      <form className="LIR-container" onSubmit={handleSubmit}>
        <div>
          <svg id="Layer_1" viewBox="0 0 140 171" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M54.0642 21.4645C50.8725 25.0193 48.709 30.6164 48.709 38.75C48.709 48.7637 51.7401 58.9049 56.2383 66.4198C60.9389 74.273 66.0651 77.5 69.584 77.5C73.1029 77.5 78.2291 74.273 82.9297 66.4198C87.4279 58.9049 90.459 48.7637 90.459 38.75C90.459 30.6164 88.2955 25.0193 85.1038 21.4645C81.9121 17.9096 76.8867 15.5 69.584 15.5C62.2813 15.5 57.2559 17.9096 54.0642 21.4645ZM91.1213 80.0379C92.3439 78.431 93.476 76.7436 94.5091 75.0177C100.448 65.0951 104.376 51.9863 104.376 38.75C104.376 27.5086 101.32 17.6057 94.9444 10.5043C88.5684 3.40289 79.6771 0 69.584 0C59.4909 0 50.5996 3.40289 44.2236 10.5043C37.8476 17.6057 34.7923 27.5086 34.7923 38.75C34.7923 51.9863 38.7196 65.0951 44.6589 75.0177C45.692 76.7436 46.8241 78.431 48.0467 80.0379C40.5052 81.8002 32.8541 84.5562 25.942 88.5382C11.936 96.607 0.00125385 110.422 0.00103859 131.749C0.00103859 131.749 0.00103859 131.75 0.00103859 131.749L5.9371e-08 147.248C-0.00086013 160.09 9.34545 170.5 20.875 170.5H118.293C129.822 170.5 139.168 160.091 139.168 147.25V131.75C139.168 110.422 127.233 96.607 113.226 88.5382C106.314 84.5562 98.6629 81.8001 91.1213 80.0379ZM69.584 93C58.19 93 43.7034 95.7567 32.3357 102.306C21.1181 108.768 13.9177 118.203 13.9177 131.75L13.9167 147.249C13.9164 151.53 17.0318 155 20.875 155H118.293C122.136 155 125.251 151.53 125.251 147.25V131.75C125.251 118.203 118.051 108.768 106.833 102.306C95.4648 95.7567 80.978 93 69.584 93Z" fill="url(#paint0_linear_180_49)" fillOpacity="0.988235"/>
            <defs>
              <linearGradient id="paint0_linear_180_49" x1="69.5839" y1="0" x2="69.5839" y2="170.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#C43B26"/>
                <stop offset="0.480769" stopColor="#c43b26bd"/>
                <stop offset="1" stopColor="#C43B26"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1>¡Bienvenido de vuelta!</h1>
        <label>
          <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0V29.6691H40V0H0ZM34.0333 3.29657L20 15.9059L5.96667 3.29657H34.0333ZM3.33333 5.37341L9.88333 11.2578L3.33333 22.0705V5.37341ZM4.61667 26.3726L12.4 13.5324L20 20.3563L27.6 13.5324L35.3833 26.3726H4.61667ZM36.6667 22.0705L30.1167 11.2578L36.6667 5.37341V22.0705Z" fill="#6B5D4D"/>
          </svg>
          Correo Electrónico
        </label>
        <input type="email" name="email" placeholder=" " value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3315 10.1724C7.80821 10.1724 3.33154 14.649 3.33154 20.1724C3.33154 25.6957 7.80821 30.1724 13.3315 30.1724C16.8699 30.1724 20.9465 28.1391 22.7899 23.4924L29.9982 23.5057L31.6649 26.8391H36.6649V16.839L22.7766 16.8224C20.9866 12.3057 16.8699 10.1724 13.3315 10.1724ZM13.3315 18.5057C13.7582 18.5057 14.2032 18.6491 14.5299 18.9741C15.1799 19.6257 15.1799 20.719 14.5299 21.3707C13.8782 22.0207 12.7849 22.0207 12.1332 21.3707C11.4832 20.719 11.4832 19.6257 12.1332 18.9741C12.4599 18.6491 12.9049 18.5057 13.3315 18.5057Z" fill="#6B5D4D"/>
          </svg>
          Contraseña
        </label>
        <input type={showPassword ? "text" : "password"} id="password" name="password" placeholder=" " value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button id="eye-password" type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}</button>
        <button type="submit" disabled={loading}>{loading ? "Entrando..." : "INICIAR SESIÓN"}</button>
        <span>¿No tienes cuenta? <a onClick={handleRegister}>Regístrate aquí</a></span>
      </form>
    </div>
  )
}

export default LogIn
