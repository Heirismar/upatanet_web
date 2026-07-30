"use client"

import { useState } from "react"
import "../App.css"
import logo from '../assets/logo-min-row.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { registerService } from "../services/auth.service"
import { useAuth } from "../contexts/AuthContext"

function Register() {

  const [showPassword, setShowPassword] = useState(false);
  const [rightPassword, setRightPassword] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cedula, setCedula] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ConfirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setConfirmPasswordError(null);

    if (password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const response = await registerService({
        nombre,
        apellido,
        correo: email,
        contrasena: password,
        c_i: cedula || undefined,
      });
      login(response.token);
      navigate('/RegistroCentroMedico');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Ocurrió un error inesperado.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (ConfirmPasswordError) {
      if (value === password) {
        setConfirmPasswordError(null);
      } else {
        setConfirmPasswordError("Las contraseñas aún no coinciden.");
      }
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div className="BG-loginRegister">
      {error && <div className="error-toast">{error}</div>}
      <img id="logo-LR" src={logo} alt="logo" onClick={handleHome} />

      <form className="LIR-container LIR-container--wide" onSubmit={handleSubmit}>
        <h1>Crear cuenta</h1>
        <label>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
            <path d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z" fill="#6B5D4D"/>
          </svg>
          Nombre
        </label>
        <input type="text" name="nombre" placeholder=" " value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <label>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
            <path d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z" fill="#6B5D4D"/>
          </svg>
          Apellido
        </label>
        <input type="text" name="apellido" placeholder=" " value={apellido} onChange={(e) => setApellido(e.target.value)} required />
        <label>
          <svg viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0V29.6691H40V0H0ZM34.0333 3.29657L20 15.9059L5.96667 3.29657H34.0333ZM3.33333 5.37341L9.88333 11.2578L3.33333 22.0705V5.37341ZM4.61667 26.3726L12.4 13.5324L20 20.3563L27.6 13.5324L35.3833 26.3726H4.61667ZM36.6667 22.0705L30.1167 11.2578L36.6667 5.37341V22.0705Z" fill="#6B5D4D"/>
          </svg>
          Correo Electrónico
        </label>
        <input type="email" name="email" placeholder=" " value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>
          <svg viewBox="0 0 24 24" fill="none" stroke="#6B5D4D" strokeWidth="2">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M3 10h18" />
          </svg>
          Teléfono
        </label>
        <input type="tel" name="telefono" placeholder=" " value={telefono} onChange={(e) => setTelefono(e.target.value)} />
        <label>
          <svg viewBox="0 0 24 24" fill="none" stroke="#6B5D4D" strokeWidth="2">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M16 8h.01M12 8h.01M8 8h.01M16 12h.01M12 12h.01M8 12h.01M16 16h.01M12 16h.01M8 16h.01" />
          </svg>
          Cédula
        </label>
        <input type="text" name="cedula" placeholder=" " value={cedula} onChange={(e) => setCedula(e.target.value)} />
        <label>
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3315 10.1724C7.80821 10.1724 3.33154 14.649 3.33154 20.1724C3.33154 25.6957 7.80821 30.1724 13.3315 30.1724C16.8699 30.1724 20.9465 28.1391 22.7899 23.4924L29.9982 23.5057L31.6649 26.8391H36.6649V16.839L22.7766 16.8224C20.9866 12.3057 16.8699 10.1724 13.3315 10.1724ZM13.3315 18.5057C13.7582 18.5057 14.2032 18.6491 14.5299 18.9741C15.1799 19.6257 15.1799 20.719 14.5299 21.3707C13.8782 22.0207 12.7849 22.0207 12.1332 21.3707C11.4832 20.719 11.4832 19.6257 12.1332 18.9741C12.4599 18.6491 12.9049 18.5057 13.3315 18.5057Z" fill="#6B5D4D"/>
          </svg>
          Contraseña
        </label>
        <input type={showPassword ? "text" : "password"} id="password2" name="password" placeholder=" " value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button id="eye-password2" type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}</button>
        <label>
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3315 10.1724C7.80821 10.1724 3.33154 14.649 3.33154 20.1724C3.33154 25.6957 7.80821 30.1724 13.3315 30.1724C16.8699 30.1724 20.9465 28.1391 22.7899 23.4924L29.9982 23.5057L31.6649 26.8391H36.6649V16.839L22.7766 16.8224C20.9866 12.3057 16.8699 10.1724 13.3315 10.1724ZM13.3315 18.5057C13.7582 18.5057 14.2032 18.6491 14.5299 18.9741C15.1799 19.6257 15.1799 20.719 14.5299 21.3707C13.8782 22.0207 12.7849 22.0207 12.1332 21.3707C11.4832 20.719 11.4832 19.6257 12.1332 18.9741C12.4599 18.6491 12.9049 18.5057 13.3315 18.5057Z" fill="#6B5D4D"/>
          </svg>
          Confirma tu Contraseña
        </label>
        <input type={rightPassword ? "text" : "password"} id="password3" name="password" placeholder=" " value={confirmPassword} onChange={(e) => handleConfirmPasswordChange(e.target.value)} required />
        <button id="eye-password3" type="button" onClick={() => setRightPassword(!rightPassword)}>{rightPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}</button>
        {ConfirmPasswordError && <span className="validation-error">{ConfirmPasswordError}</span>}
        <button type="submit" disabled={loading}>{loading ? "Registrando..." : "Registrarse"}</button>
        <span>¿Ya tienes cuenta? <a onClick={handleLogin}>Inicia sesión aquí</a></span>
      </form>
    </div>
  )
}

export default Register
