import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {Header} from './Header';
import { Modal } from './Modal';
import { listUsuariosService, getUsuarioByIdService, deleteUsuarioService, type UsuarioResponse } from '../services/usuario.service';
import { listCentrosMedicosService, deleteCentroMedicoService, getCentroMedicoByIdService, type CentroMedicoResponse } from '../services/centro_medico.service';
import { listJornadasService, deleteJornadaService, type JornadaResponse } from '../services/jornada.service';
import { listNoticiasService, deleteNoticiaService, toggleReactionService, type NoticiaResponse } from '../services/noticia.service';
import { useAuth } from '../contexts/AuthContext';
import './Jornadas.css';

type Section = 'usuarios' | 'centros' | 'jornadas' | 'noticias';

const sectionTitle: Record<Section, string> = {
  usuarios: 'Usuarios',
  centros: 'Centros Médicos',
  jornadas: 'Inicio',
  noticias: 'Noticias',
};

export const AdminPage = () => {
  const { token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const section = (location.pathname.split('/').pop() || 'usuarios') as Section;

  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const [centros, setCentros] = useState<CentroMedicoResponse[]>([]);
  const [jornadas, setJornadas] = useState<JornadaResponse[]>([]);
  const [noticias, setNoticias] = useState<NoticiaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<'usuario' | 'centro' | 'jornada' | 'noticia' | null>(null);

  const [detalleUsuario, setDetalleUsuario] = useState<UsuarioResponse | null>(null);
  const [detalleCentro, setDetalleCentro] = useState<CentroMedicoResponse | null>(null);
  const [detalleJornada, setDetalleJornada] = useState<JornadaResponse | null>(null);
  const [detalleNoticia, setDetalleNoticia] = useState<NoticiaResponse | null>(null);
  const [centroNombre, setCentroNombre] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchJornadas = (p: number) => listJornadasService(p, 10).then(r => { setJornadas(r.data); setTotalPages(r.totalPages); setPage(r.page); }).catch(() => {});
  const fetchUsuarios = (p: number) => listUsuariosService(p, 10).then(r => { setUsuarios(r.data); setTotalPages(r.totalPages); setPage(r.page); }).catch(() => {});
  const fetchCentros = (p: number) => listCentrosMedicosService(p, 10).then(r => { setCentros(r.data); setTotalPages(r.totalPages); setPage(r.page); }).catch(() => {});
  const fetchNoticias = (p: number) => listNoticiasService(p, 10).then(r => { setNoticias(r.data); setTotalPages(r.totalPages); setPage(r.page); }).catch(() => {});

  useEffect(() => {
    setLoading(true);
    setPage(1);
    if (section === 'usuarios') {
      fetchUsuarios(1).finally(() => setLoading(false));
    } else if (section === 'centros') {
      fetchCentros(1).finally(() => setLoading(false));
    } else if (section === 'jornadas') {
      fetchJornadas(1).finally(() => setLoading(false));
    } else if (section === 'noticias') {
      fetchNoticias(1).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [section]);

  function goToPage(p: number) {
    if (p < 1 || p > totalPages) return;
    setLoading(true);
    if (section === 'usuarios') fetchUsuarios(p).finally(() => setLoading(false));
    else if (section === 'centros') fetchCentros(p).finally(() => setLoading(false));
    else if (section === 'jornadas') fetchJornadas(p).finally(() => setLoading(false));
    else if (section === 'noticias') fetchNoticias(p).finally(() => setLoading(false));
  }

  async function handleToggleReaction(noticia: NoticiaResponse, tipo: 'like' | 'dislike') {
    if (!token) return;
    try {
      const updated = await toggleReactionService(noticia.id, tipo, token);
      setNoticias(prev => prev.map(n => n.id === updated.id ? updated : n));
    } catch {
      alert('Error al actualizar la reacción');
    }
  }

  const handleDelete = async () => {
    if (!token || deleteId === null || !deleteTarget) return;
    try {
      if (deleteTarget === 'jornada') await deleteJornadaService(deleteId, token);
      else if (deleteTarget === 'usuario') await deleteUsuarioService(deleteId, token);
      else if (deleteTarget === 'centro') await deleteCentroMedicoService(deleteId, token);
      else if (deleteTarget === 'noticia') await deleteNoticiaService(deleteId, token);
      setDeleteId(null);
      setDeleteTarget(null);
      if (deleteTarget === 'jornada') fetchJornadas(page);
      else if (deleteTarget === 'usuario') fetchUsuarios(page);
      else if (deleteTarget === 'centro') fetchCentros(page);
      else if (deleteTarget === 'noticia') fetchNoticias(page);
    } catch {
      alert('Error al eliminar');
    }
  };

  return (
    <div className="upatanet-container">
      <Header />
      <main className="upatanet-main">
        <h2 className="main-title">{sectionTitle[section]}</h2>

        {section === 'usuarios' && <Link to="/admin/crear/usuario" className="btn" style={{ marginBottom: 24, display: 'inline-block' }}>Crear usuario</Link>}
        {section === 'centros' && <Link to="/admin/crear/centro" className="btn" style={{ marginBottom: 24, display: 'inline-block' }}>Crear centro médico</Link>}
        {section === 'noticias' && <Link to="/admin/crear/noticia" className="btn" style={{ marginBottom: 24, display: 'inline-block' }}>Crear noticia</Link>}

        {loading ? <p className="loading-text">Cargando...</p> : section === 'usuarios' && (
          <div className="jornadas-list">
            {usuarios.map(u => (
              <div key={u.id} className="jornada-card" onClick={() => {
                getUsuarioByIdService(u.id).then(usr => {
                  setDetalleUsuario(usr);
                  if (usr.centro_medico_id) {
                    getCentroMedicoByIdService(usr.centro_medico_id).then(c => setCentroNombre(c.nombre)).catch(() => setCentroNombre(null));
                  } else {
                    setCentroNombre(null);
                  }
                }).catch(() => {});
              }}>
                <div className="jornada-left">
                  <span className={`status-dot ${u.rol === 'admin' ? 'completed' : 'pending'}`} />
                  <div className="jornada-details">
                    <p className="jornada-titulo">{u.nombre || ''} {u.apellido || ''}</p>
                  </div>
                </div>
                <div className="jornada-right" onClick={e => e.stopPropagation()}>
                  <span className="jornada-fecha">{u.rol === 'admin' ? 'Administrador' : 'Representante'}</span>
                  <button className="jornada-action" onClick={() => navigate(`/admin/editar/usuario/${u.id}`)} title="Editar">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button className="jornada-action jornada-action--delete" onClick={() => { setDeleteId(u.id); setDeleteTarget('usuario'); }} title="Eliminar">
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

        {!loading && section === 'centros' && (
          <div className="jornadas-list">
            {centros.map(c => (
              <div key={c.id} className="jornada-card" onClick={() => setDetalleCentro(c)}>
                <div className="jornada-left">
                  <span className="status-dot completed" />
                  <div className="jornada-details">
                    <p className="jornada-titulo">{c.nombre || 'Sin nombre'}</p>
                    <p className="jornada-lugar">{c.ubicacion || 'Sin ubicación'}{c.telefono ? ` · ${c.telefono}` : ''}</p>
                  </div>
                </div>
                <div className="jornada-right" onClick={e => e.stopPropagation()}>
                  <span className="jornada-fecha">{c.correo || '—'}</span>
                  <button className="jornada-action" onClick={() => navigate(`/admin/editar/centro/${c.id}`)} title="Editar">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button className="jornada-action jornada-action--delete" onClick={() => { setDeleteId(c.id); setDeleteTarget('centro'); }} title="Eliminar">
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

        {!loading && section === 'jornadas' && (
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
                <div className="jornada-right" onClick={e => e.stopPropagation()}>
                  {j.datetime_inicio && (
                    <span className="jornada-fecha">{j.datetime_inicio.slice(0, 10)}</span>
                  )}
                  <button className="jornada-action" onClick={() => navigate(`/EditarJornada/${j.id}`)} title="Editar">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button className="jornada-action jornada-action--delete" onClick={() => { setDeleteId(j.id); setDeleteTarget('jornada'); }} title="Eliminar">
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

        {!loading && section === 'noticias' && (
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
                  <button className="jornada-action" onClick={() => navigate(`/admin/editar/noticia/${n.id}`)} title="Editar">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button className="jornada-action jornada-action--delete" onClick={() => { setDeleteId(n.id); setDeleteTarget('noticia'); }} title="Eliminar">
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
            {noticias.length === 0 && <p className="empty-text">No hay noticias</p>}
          </div>
        )}

        {totalPages > 1 && (
          <div className="paginacion">
            <button className="btn pag-btn" disabled={page <= 1} onClick={() => goToPage(page - 1)}>← Anterior</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`btn pag-btn ${p === page ? 'pag-activo' : ''}`} onClick={() => goToPage(p)}>{p}</button>
            ))}
            <button className="btn pag-btn" disabled={page >= totalPages} onClick={() => goToPage(page + 1)}>Siguiente →</button>
          </div>
        )}
      </main>

      {deleteId !== null && (
        <Modal Cerrar={() => { setDeleteId(null); setDeleteTarget(null); }}>
          <p>¿Está seguro de que desea eliminar este {deleteTarget === 'usuario' ? 'usuario' : deleteTarget === 'centro' ? 'centro médico' : deleteTarget === 'jornada' ? 'jornada' : 'noticia'}?</p>
          <div className='form-actions'>
            <button type="button" className="btn" onClick={handleDelete}>Sí</button>
            <button type="button" className="btn" style={{ background: '#3A3A3C', border: '1px solid #3A3A3C', color: 'white'}} onClick={() => { setDeleteId(null); setDeleteTarget(null); }}>No</button>
          </div>
        </Modal>
      )}

      {detalleUsuario && (
        <Modal Cerrar={() => { setDetalleUsuario(null); setCentroNombre(null); }}>
          <div className="detalle-contenido">
            <h3>Detalles del Usuario</h3>
            <div className="detalle-row"><span className="detalle-label">Nombre</span><span className="detalle-value">{detalleUsuario.nombre || '-'} {detalleUsuario.apellido || '-'}</span></div>
            <div className="detalle-row"><span className="detalle-label">Rol</span><span className="detalle-value">{detalleUsuario.rol === 'admin' ? 'Administrador' : detalleUsuario.rol === 'representante' ? 'Representante' : 'Indígena'}</span></div>
            <div className="detalle-row"><span className="detalle-label">Correo</span><span className="detalle-value">{detalleUsuario.correo || '-'}</span></div>
            {detalleUsuario.rol === 'admin' && <div className="detalle-row"><span className="detalle-label">Teléfono</span><span className="detalle-value">{detalleUsuario.telefono || '-'}</span></div>}
            {detalleUsuario.rol === 'admin' && <div className="detalle-row"><span className="detalle-label">Cédula</span><span className="detalle-value">{detalleUsuario.cedula || '-'}</span></div>}
            {detalleUsuario.rol === 'representante' && <div className="detalle-row"><span className="detalle-label">C.I.</span><span className="detalle-value">{detalleUsuario.c_i || '-'}</span></div>}
            {detalleUsuario.rol === 'representante' && <div className="detalle-row"><span className="detalle-label">Centro Médico</span><span className="detalle-value">{centroNombre || '-'}</span></div>}
          </div>
        </Modal>
      )}

      {detalleCentro && (
        <Modal Cerrar={() => setDetalleCentro(null)}>
          <div className="detalle-contenido">
            <h3>Detalles del Centro Médico</h3>
            <div className="detalle-row"><span className="detalle-label">Nombre</span><span className="detalle-value">{detalleCentro.nombre || '-'}</span></div>
            <div className="detalle-row"><span className="detalle-label">Correo</span><span className="detalle-value">{detalleCentro.correo || '-'}</span></div>
            <div className="detalle-row"><span className="detalle-label">Ubicación</span><span className="detalle-value">{detalleCentro.ubicacion || '-'}</span></div>
            <div className="detalle-row"><span className="detalle-label">RIF</span><span className="detalle-value">{detalleCentro.rif || '-'}</span></div>
            <div className="detalle-row"><span className="detalle-label">Teléfono</span><span className="detalle-value">{detalleCentro.telefono || '-'}</span></div>
          </div>
        </Modal>
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
    </div>
  );
}
