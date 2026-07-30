import { Link, useNavigate, useParams } from 'react-router-dom';
import {Header} from './Header';
import { Modal } from './Modal';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUsuarioByIdService, updateUsuarioService } from '../services/usuario.service';
import { listCentrosMedicosService, type CentroMedicoResponse } from '../services/centro_medico.service';
import './Jornadas.css';

export const EditarUsuario = () => {
    const { id } = useParams<{ id: string }>();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [modalAbierto, setModalAbierto] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [rol, setRol] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [cedula, setCedula] = useState('');
    const [c_i, setC_i] = useState('');
    const [centroMedicoId, setCentroMedicoId] = useState<number | ''>('');
    const [centros, setCentros] = useState<CentroMedicoResponse[]>([]);

    useEffect(() => {
        if (!id) return;
        getUsuarioByIdService(Number(id))
            .then(u => {
                setNombre(u.nombre || '');
                setApellido(u.apellido || '');
                setRol(u.rol || '');
                setCorreo(u.correo || '');
                setTelefono(u.telefono || '');
                setCedula(u.cedula || '');
                setC_i(u.c_i || '');
                setCentroMedicoId(u.centro_medico_id ?? '');
            })
            .catch(() => setError('Error al cargar el usuario'))
            .finally(() => setFetching(false));
    }, [id]);

    useEffect(() => {
        listCentrosMedicosService()
            .then(r => setCentros(r.data))
            .catch(() => {});
    }, []);

    async function handleSubmit() {
        if (!token || !id) return;
        setLoading(true);
        setError('');
        try {
            const body: Record<string, unknown> = { nombre, apellido, rol };
            if (correo) body.correo = correo;
            if (rol === 'admin') {
                if (telefono) body.telefono = telefono;
                if (cedula) body.cedula = cedula;
            } else if (rol === 'representante') {
                if (c_i) body.c_i = c_i;
                if (centroMedicoId !== '') body.centro_medico_id = centroMedicoId;
            }
            await updateUsuarioService(Number(id), body as Parameters<typeof updateUsuarioService>[1], token);
            navigate('/admin/usuarios');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error al actualizar el usuario');
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
                    <p className="loading-text">Cargando usuario...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="upatanet-container">
            <Header />
            <main className='upatanet-main'>
                <h2 className="main-title">EDITAR USUARIO</h2>
                <Link to="/admin/usuarios" className="btn" style={{ marginBottom: 16 }}>← Volver</Link>
                {error && <p className="error-message">{error}</p>}
                <form className="form-card" onSubmit={e => e.preventDefault()}>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Apellido</label>
                        <input type="text" value={apellido} onChange={e => setApellido(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label>Rol</label>
                        <select value={rol} onChange={e => setRol(e.target.value)}>
                            <option value="admin">Admin</option>
                            <option value="representante">Representante</option>
                            <option value="indigena">Indígena</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Correo</label>
                        <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} />
                    </div>
                    {rol === 'admin' && (
                        <>
                            <div className="form-group">
                                <label>Teléfono</label>
                                <input type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Cédula</label>
                                <input type="text" value={cedula} onChange={e => setCedula(e.target.value)} />
                            </div>
                        </>
                    )}
                    {rol === 'representante' && (
                        <>
                            <div className="form-group">
                                <label>C.I.</label>
                                <input type="text" value={c_i} onChange={e => setC_i(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label>Centro Médico</label>
                                <select value={centroMedicoId} onChange={e => setCentroMedicoId(e.target.value ? Number(e.target.value) : '' as unknown as number)}>
                                    <option value="">Seleccionar...</option>
                                    {centros.map(c => (
                                        <option key={c.id} value={c.id}>{c.nombre || `ID ${c.id}`}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}
                    <div className="form-actions">
                        <button type="button" onClick={() => setModalAbierto(true)} className="btn" disabled={loading}>Guardar cambios</button>
                        <Link to="/admin/usuarios" className="btn" style={{ background: '#F2E9D8', border: '1px solid #adaba4', color: 'black', textDecoration: 'none' }}>Cancelar</Link>
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
