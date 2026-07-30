import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Modal } from './Modal';
import { listJornadasService, deleteJornadaService, type JornadaResponse } from '../services/jornada.service';
import { listNoticiasService, toggleReactionService, deleteNoticiaService, type NoticiaResponse } from '../services/noticia.service';
import { useAuth } from '../contexts/AuthContext';
import './Jornadas.css';

type Section = 'home' | 'jornadas' | 'noticias';

const sectionTitle: Record<Section, string> = {
  home: 'Mis Jornadas',
  jornadas: 'Todas las Jornadas',
  noticias: 'Noticias',
};

export const RepresentantePanel = () => {
  const { token, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const section = (location.pathname.split('/').pop() || 'home') as Section;

  const [jornadas, setJornadas] = useState<JornadaResponse[]>([]);
  const [noticias, setNoticias] = useState<NoticiaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [detalleJornada, setDetalleJornada] = useState<JornadaResponse | null>(null);
  const [detalleNoticia, setDetalleNoticia] = useState<NoticiaResponse | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteNoticiaId, setDeleteNoticiaId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    if (section === 'home' || section === 'jornadas') {
      listJornadasService(1, 100).then(r => setJornadas(r.data)).catch(() => setJornadas([])).finally(() => setLoading(false));
    } else if (section === 'noticias') {
      listNoticiasService(1, 50).then(r => setNoticias(r.data)).catch(() => setNoticias([])).finally(() => setLoading(false));
    }
  }, [section]);

  async function handleToggleReaction(noticia: NoticiaResponse, tipo: 'like' | 'dislike') {
    if (!token) return;
    try {
      const updated = await toggleReactionService(noticia.id, tipo, token);
      setNoticias(prev => prev.map(n => n.id === updated.id ? updated : n));
    } catch {
      alert('Error al actualizar la reacción');
    }
  }

  async function handleDelete() {
    if (!token || deleteId === null) return;
    try {
      await deleteJornadaService(deleteId, token);
      setJornadas(prev => prev.filter(j => j.id !== deleteId));
      setDeleteId(null);
    } catch {
      alert('Error al eliminar la jornada');
    }
  }

  async function handleDeleteNoticia() {
    if (!token || deleteNoticiaId === null) return;
    try {
      await deleteNoticiaService(deleteNoticiaId, token);
      setNoticias(prev => prev.filter(n => n.id !== deleteNoticiaId));
      setDeleteNoticiaId(null);
    } catch {
      alert('Error al eliminar la noticia');
    }
  }

  const misJornadas = jornadas.filter(j => j.centro_medico_id === user?.centro_medico_id);

  return (
    <div className="upatanet-container">
      <Header />

      <main className="upatanet-main">
        <h2 className="main-title">{sectionTitle[section]}</h2>

        {section === 'home' && (
          <>
            <Link to="/CreacionJornada" className="btn" style={{ marginBottom: 8, display: 'inline-block' }}>Crear nueva jornada</Link>
            {loading ? (
              <p className="loading-text">Cargando jornadas...</p>
            ) : misJornadas.length === 0 ? (
              <p className="empty-text">No hay jornadas registradas para tu centro médico.</p>
            ) : (
              <div className="jornadas-list">
                {misJornadas.map(j => (
                  <div key={j.id} className="jornada-card" onClick={() => setDetalleJornada(j)}>
                    <div className="jornada-left">
                      <span className={`status-dot ${j.datetime_fin ? 'completed' : 'pending'}`} />
                      <div className="jornada-details">
                        <p className="jornada-titulo">{j.titulo || 'Sin título'}</p>
                        <p className="jornada-lugar">{j.ubicacion || 'Sin ubicación'}</p>
                      </div>
                    </div>
                    <div className="jornada-right">
                      {j.datetime_inicio && <span className="jornada-fecha">{j.datetime_inicio.slice(0, 10)}</span>}
                      <div className="jornada-actions" onClick={e => e.stopPropagation()}>
                        <button className="jornada-icon-btn" onClick={() => navigate(`/EditarJornada/${j.id}`)} title="Editar">
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button className="jornada-icon-btn jornada-icon-btn--danger" onClick={() => setDeleteId(j.id)} title="Eliminar">
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {section === 'jornadas' && (
          <>
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
                      {j.datetime_inicio && <span className="jornada-fecha">{j.datetime_inicio.slice(0, 10)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {section === 'noticias' && (
          <>
            <Link to="/panel/crear/noticia" className="btn" style={{ marginBottom: 8, display: 'inline-block' }}>Crear nueva noticia</Link>
            {loading ? (
              <p className="loading-text">Cargando noticias...</p>
            ) : noticias.length === 0 ? (
              <p className="empty-text">No hay noticias.</p>
            ) : (
              <div className="jornadas-list">
                {noticias.map(n => (
                  <div key={n.id} className="jornada-card" onClick={() => setDetalleNoticia(n)}>
                    <div className="jornada-left">
                      <span className={`status-dot ${n.categoria === 'alerta' ? 'pending' : 'completed'}`} />
                      <div className="jornada-details">
                        <p className="jornada-titulo">{n.titulo || 'Sin título'}</p>
                        <p className="jornada-lugar">{n.categoria ? `#${n.categoria}` : ''}{n.datetime ? ` · ${n.datetime.slice(0, 10)}` : ''}</p>
                      </div>
                    </div>
                    <div className="jornada-right" onClick={e => e.stopPropagation()}>
                      {n.usuario_id === user?.id && (
                        <div className="jornada-actions">
                          <button className="jornada-icon-btn" onClick={() => navigate(`/panel/editar/noticia/${n.id}`)} title="Editar">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button className="jornada-icon-btn jornada-icon-btn--danger" onClick={() => setDeleteNoticiaId(n.id)} title="Eliminar">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      )}
                      <button className={`jornada-action ${n.userReaction === 'like' ? 'jornada-action--active-like' : ''}`} onClick={() => handleToggleReaction(n, 'like')} title="Like">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill={n.userReaction === 'like' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                        </svg>
                        <span>{n.likes ?? 0}</span>
                      </button>
                      <button className={`jornada-action ${n.userReaction === 'dislike' ? 'jornada-action--active-dislike' : ''}`} onClick={() => handleToggleReaction(n, 'dislike')} title="Dislike">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill={n.userReaction === 'dislike' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10zM17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
                        </svg>
                        <span>{n.dislikes ?? 0}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

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
            <div className="detalle-contenido" style={{ textAlign: 'center' }}>
              <h3>Confirmar eliminación</h3>
              <p style={{ margin: '16px 0' }}>¿Estás seguro de que deseas eliminar esta jornada?</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button className="btn btn--secondary" onClick={() => setDeleteId(null)}>Cancelar</button>
                <button className="btn" onClick={handleDelete}>Eliminar</button>
              </div>
            </div>
          </Modal>
        )}

        {deleteNoticiaId !== null && (
          <Modal Cerrar={() => setDeleteNoticiaId(null)}>
            <div className="detalle-contenido" style={{ textAlign: 'center' }}>
              <h3>Confirmar eliminación</h3>
              <p style={{ margin: '16px 0' }}>¿Estás seguro de que deseas eliminar esta noticia?</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button className="btn btn--secondary" onClick={() => setDeleteNoticiaId(null)}>Cancelar</button>
                <button className="btn" onClick={handleDeleteNoticia}>Eliminar</button>
              </div>
            </div>
          </Modal>
        )}

        {detalleNoticia && (
          <Modal Cerrar={() => setDetalleNoticia(null)}>
            <div className="detalle-contenido">
              <h3>Detalles de la Noticia</h3>
              <div className="detalle-row"><span className="detalle-label">Título</span><span className="detalle-value">{detalleNoticia.titulo || '-'}</span></div>
              <div className="detalle-row"><span className="detalle-label">Descripción</span><span className="detalle-value">{detalleNoticia.descripcion || '-'}</span></div>
              <div className="detalle-row"><span className="detalle-label">Categoría</span><span className="detalle-value">{detalleNoticia.categoria || '-'}</span></div>
              <div className="detalle-row"><span className="detalle-label">Fecha</span><span className="detalle-value">{detalleNoticia.datetime ? new Date(detalleNoticia.datetime).toLocaleDateString() : '-'}</span></div>
              <div className="detalle-row">
                <span className="detalle-label">Reacciones</span>
                <span className="detalle-value" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                    </svg>
                    {detalleNoticia.likes ?? 0}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10zM17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
                    </svg>
                    {detalleNoticia.dislikes ?? 0}
                  </span>
                </span>
              </div>
            </div>
          </Modal>
        )}
      </main>
    </div>
  );
};
