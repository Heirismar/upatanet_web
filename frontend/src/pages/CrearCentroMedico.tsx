import { Link, useNavigate } from 'react-router-dom';
import {Header} from './Header';
import { Modal } from './Modal';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createCentroMedicoService } from '../services/centro_medico.service';
import './Jornadas.css';

export const CrearCentroMedico = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [modalAbierto, setModalAbierto] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [rif, setRif] = useState('');
    const [telefono, setTelefono] = useState('');

    async function handleSubmit() {
        if (!token) return;
        setLoading(true);
        setError('');
        try {
            await createCentroMedicoService({ nombre, correo, ubicacion, rif, telefono }, token);
            navigate('/admin/centros');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error al crear el centro médico');
        } finally {
            setLoading(false);
            setModalAbierto(false);
        }
    }

    return (
        <div className="upatanet-container">
            <Header />
            <main className='upatanet-main'>
                <h2 className="main-title">CREAR CENTRO MÉDICO</h2>
                <Link to="/admin/centros" className="btn" style={{ marginBottom: 16 }}>← Volver</Link>
                {error && <p className="error-message">{error}</p>}
                <form className="form-card" onSubmit={e => e.preventDefault()}>
                    <div className="form-group">
                        <label>Nombre del centro</label>
                        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Correo electrónico</label>
                        <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Ubicación</label>
                        <input type="text" value={ubicacion} onChange={e => setUbicacion(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>RIF</label>
                        <input type="text" value={rif} onChange={e => setRif(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Teléfono</label>
                        <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} />
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={() => setModalAbierto(true)} className="btn" disabled={loading}>Crear centro médico</button>
                        <Link to="/admin/centros" className="btn" style={{ background: '#F2E9D8', border: '1px solid #adaba4', color: 'black', textDecoration: 'none' }}>Cancelar</Link>
                    </div>
                </form>
                {modalAbierto && (
                    <Modal Cerrar={() => setModalAbierto(false)}>
                        <p>¿Crear este centro médico?</p>
                        <div className='form-actions'>
                            <button type="button" className="btn" onClick={handleSubmit} disabled={loading}>{loading ? 'Creando...' : 'Sí'}</button>
                            <button type="button" onClick={() => setModalAbierto(false)} className="btn" style={{ background: '#3A3A3C', border: '1px solid #3A3A3C', color: 'white'}} disabled={loading}>No</button>
                        </div>
                    </Modal>
                )}
            </main>
        </div>
    );
}
