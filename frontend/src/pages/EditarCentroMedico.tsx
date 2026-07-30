import { Link, useNavigate, useParams } from 'react-router-dom';
import {Header} from './Header';
import { Modal } from './Modal';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCentroMedicoByIdService, updateCentroMedicoService } from '../services/centro_medico.service';
import './Jornadas.css';

export const EditarCentroMedico = () => {
    const { id } = useParams<{ id: string }>();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [modalAbierto, setModalAbierto] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [rif, setRif] = useState('');
    const [telefono, setTelefono] = useState('');

    useEffect(() => {
        if (!id) return;
        getCentroMedicoByIdService(Number(id))
            .then(c => {
                setNombre(c.nombre || '');
                setCorreo(c.correo || '');
                setUbicacion(c.ubicacion || '');
                setRif(c.rif || '');
                setTelefono(c.telefono || '');
            })
            .catch(() => setError('Error al cargar el centro médico'))
            .finally(() => setFetching(false));
    }, [id]);

    async function handleSubmit() {
        if (!token || !id) return;
        setLoading(true);
        setError('');
        try {
            await updateCentroMedicoService(Number(id), { nombre, correo, ubicacion, rif, telefono }, token);
            navigate('/admin/centros');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error al actualizar el centro médico');
        } finally {
            setLoading(false);
            setModalAbierto(false);
        }
    }

    if (fetching) {
        return (
            <div className="upatanet-container">
                <Header />
                <main className='upatanet-main'>
                    <p className="loading-text">Cargando centro médico...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="upatanet-container">
            <Header />
            <main className='upatanet-main'>
                <h2 className="main-title">EDITAR CENTRO MÉDICO</h2>
                <Link to="/admin/centros" className="btn" style={{ marginBottom: 16 }}>← Volver</Link>
                {error && <p className="error-message">{error}</p>}
                <form className="form-card" onSubmit={e => e.preventDefault()}>
                    <div className="form-group">
                        <label>Nombre del centro</label>
                        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
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
                        <button type="button" onClick={() => setModalAbierto(true)} className="btn" disabled={loading}>Guardar cambios</button>
                        <Link to="/admin/centros" className="btn" style={{ background: '#F2E9D8', border: '1px solid #adaba4', color: 'black', textDecoration: 'none' }}>Cancelar</Link>
                    </div>
                </form>
                {modalAbierto && (
                    <Modal Cerrar={() => setModalAbierto(false)}>
                        <p>¿Guardar los cambios?</p>
                        <div className='form-actions'>
                            <button type="button" className="btn" onClick={handleSubmit} disabled={loading}>{loading ? 'Guardando...' : 'Sí'}</button>
                            <button type="button" onClick={() => setModalAbierto(false)} className="btn" style={{ background: '#3A3A3C', border: '1px solid #3A3A3C', color: 'white'}} disabled={loading}>No</button>
                        </div>
                    </Modal>
                )}
            </main>
        </div>
    );
}
