import { Link, useNavigate } from 'react-router-dom';
import {Header} from './Header'
import { Modal } from './Modal';
import { useState, useEffect } from 'react';
import { listJornadasService, deleteJornadaService, type JornadaResponse } from '../services/jornada.service';
import { useAuth } from '../contexts/AuthContext';
import './Jornadas.css';

export const HomeJornadas = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [jornadas, setJornadas] = useState<JornadaResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [detalleJornada, setDetalleJornada] = useState<JornadaResponse | null>(null);

    const fetchJornadas = () => {
        listJornadasService()
            .then(res => setJornadas(res.data))
            .catch(() => setJornadas([]))
            .finally(() => setLoading(false));
    };

    useEffect(fetchJornadas, []);

    const handleDelete = async () => {
        if (!token || deleteId === null) return;
        try {
            await deleteJornadaService(deleteId, token);
            setDeleteId(null);
            fetchJornadas();
        } catch {
            alert('Error al eliminar la jornada');
        }
    };

    return (
        <div className="upatanet-container">
            <Header />

            <main className="upatanet-main">
                <h2 className="main-title">JORNADAS MÉDICAS</h2>

                <Link to="/CreacionJornada" className="btn" style={{ marginBottom: 8, display: 'inline-block' }}>
                    Crear nueva jornada
                </Link>

                {loading ? (
                    <p className="loading-text">Cargando jornadas...</p>
                ) : jornadas.length === 0 ? (
                    <p className="empty-text">No hay jornadas registradas.</p>
                ) : (
                    <div className="jornadas-list">
                        {jornadas.map(j => (
                            <div key={j.id} className="jornada-card" onClick={() => setDetalleJornada(j)}>
                                <div className="jornada-left">
                                    <span className={`status-dot ${j.datetime_fin ? 'completed' : 'pending'}`} />
                                    <div className="jornada-details">
                                        <p className="jornada-titulo">{j.titulo || 'Sin título'}</p>
                                        <p className="jornada-lugar">{j.ubicacion || 'Sin ubicación'}</p>
                                    </div>
                                </div>
                                <div className="jornada-right">
                                    {j.datetime_inicio && (
                                        <span className="jornada-fecha">{j.datetime_inicio.slice(0, 10)}</span>
                                    )}
                                    <button className="jornada-action" onClick={() => navigate(`/EditarJornada/${j.id}`)} title="Editar">
                                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                    </button>
                                    <button className="jornada-action jornada-action--delete" onClick={() => setDeleteId(j.id)} title="Eliminar">
                                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            <line x1="10" y1="11" x2="10" y2="17" />
                                            <line x1="14" y1="11" x2="14" y2="17" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {detalleJornada && (
                <Modal Cerrar={() => setDetalleJornada(null)}>
                    <div className="detalle-contenido">
                        <h3>Detalles de la Jornada</h3>
                        <div className="detalle-row"><span className="detalle-label">Título</span><span className="detalle-value">{detalleJornada.titulo || '-'}</span></div>
                        <div className="detalle-row"><span className="detalle-label">Descripción</span><span className="detalle-value">{detalleJornada.descripcion || '-'}</span></div>
                        <div className="detalle-row"><span className="detalle-label">Ubicación</span><span className="detalle-value">{detalleJornada.ubicacion || '-'}</span></div>
                        <div className="detalle-row"><span className="detalle-label">Inicio</span><span className="detalle-value">{detalleJornada.datetime_inicio ? new Date(detalleJornada.datetime_inicio).toLocaleDateString() : '-'}</span></div>
                        <div className="detalle-row"><span className="detalle-label">Fin</span><span className="detalle-value">{detalleJornada.datetime_fin ? new Date(detalleJornada.datetime_fin).toLocaleDateString() : '-'}</span></div>
                    </div>
                </Modal>
            )}

            {deleteId !== null && (
                <Modal Cerrar={() => setDeleteId(null)}>
                    <p>¿Está seguro de que desea eliminar esta jornada?</p>
                    <div className='form-actions'>
                        <button type="button" className="btn" onClick={handleDelete}>Sí</button>
                        <button type="button" className="btn" style={{ background: '#3A3A3C', border: '1px solid #3A3A3C', color: 'white'}} onClick={() => setDeleteId(null)}>No</button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
