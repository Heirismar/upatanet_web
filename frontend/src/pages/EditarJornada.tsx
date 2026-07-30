import { Link, useNavigate, useParams } from 'react-router-dom';
import {Header} from './Header';
import { Modal } from './Modal';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getJornadaByIdService, updateJornadaService } from '../services/jornada.service';
import './Jornadas.css';

export const EditarJornada = () => {
    const { id } = useParams<{ id: string }>();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [modalAbierto, setModalAbierto] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');
    const [titulo, setTitulo] = useState('');
    const [datetimeInicio, setDatetimeInicio] = useState('');
    const [datetimeFin, setDatetimeFin] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [ubicacion, setUbicacion] = useState('');

    useEffect(() => {
        if (!id) return;
        getJornadaByIdService(Number(id))
            .then(j => {
                setTitulo(j.titulo || '');
                setDatetimeInicio(j.datetime_inicio ? j.datetime_inicio.slice(0, 10) : '');
                setDatetimeFin(j.datetime_fin ? j.datetime_fin.slice(0, 10) : '');
                setDescripcion(j.descripcion || '');
                setUbicacion(j.ubicacion || '');
            })
            .catch(() => setError('Error al cargar la jornada'))
            .finally(() => setFetching(false));
    }, [id]);

    async function handleSubmit() {
        if (!token || !id) return;
        setLoading(true);
        setError('');
        try {
            await updateJornadaService(Number(id), {
                titulo,
                descripcion,
                datetime_inicio: datetimeInicio ? `${datetimeInicio}T00:00:00` : undefined,
                datetime_fin: datetimeFin ? `${datetimeFin}T00:00:00` : undefined,
                ubicacion,
            }, token);
            navigate('/HomeJornadas');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error al actualizar la jornada');
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
                    <p className="loading-text">Cargando jornada...</p>
                </main>
            </div>
        );
    }

    return (
        <div className="upatanet-container">
            <Header />

            <main className='upatanet-main'>
                <h2 className="main-title">EDITAR JORNADA</h2>
                <Link to="/HomeJornadas" className="btn" style={{ marginBottom: 16 }}>
                    ← Volver
                </Link>

                {error && <p className="error-message">{error}</p>}

                <form className="form-card" onSubmit={e => e.preventDefault()}>
                    <div className="form-group">
                        <label>Nombre de la jornada</label>
                        <input type="text" placeholder="Ej. Jornada de vacunación infantil" value={titulo} onChange={e => setTitulo(e.target.value)} />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Fecha inicial</label>
                            <input type="date" value={datetimeInicio} onChange={e => setDatetimeInicio(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Fecha final</label>
                            <input type="date" value={datetimeFin} onChange={e => setDatetimeFin(e.target.value)} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea placeholder="Cuenta lo necesario para que las comunidades sepan qué hacer." value={descripcion} onChange={e => setDescripcion(e.target.value)}></textarea>
                    </div>

                    <div className="form-group">
                        <label>Ubicación</label>
                        <input type="text" placeholder="Ambulatorio Ocamo, Río Ocamo" value={ubicacion} onChange={e => setUbicacion(e.target.value)} />
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={() => setModalAbierto(true)} className="btn" disabled={loading}>Guardar cambios</button>
                        <Link to="/HomeJornadas" className="btn" style={{ background: '#F2E9D8', border: '1px solid #adaba4', color: 'black', textDecoration: 'none' }}>Cancelar</Link>
                    </div>
                </form>

                {modalAbierto && (
                    <Modal Cerrar={() => setModalAbierto(false)}>
                        <p>¿Está seguro de que desea guardar los cambios?</p>
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
