import { Link, useNavigate, useLocation } from 'react-router-dom';
import {Header} from './Header';
import { Modal } from './Modal';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createNoticiaService } from '../services/noticia.service';
import './Jornadas.css';

export const CrearNoticia = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const returnPath = location.pathname.startsWith('/panel') ? '/panel/noticias' : '/admin/noticias';
    const [modalAbierto, setModalAbierto] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [categoria, setCategoria] = useState('');

    async function handleSubmit() {
        if (!token || !user?.id) return;
        setLoading(true);
        setError('');
        try {
            await createNoticiaService({ usuario_id: user.id, titulo, descripcion, categoria }, token);
            navigate(returnPath);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error al crear la noticia');
        } finally {
            setLoading(false);
            setModalAbierto(false);
        }
    }

    return (
        <div className="upatanet-container">
            <Header />
            <main className='upatanet-main'>
                <h2 className="main-title">CREAR NOTICIA</h2>
                <Link to={returnPath} className="btn" style={{ marginBottom: 16 }}>← Volver</Link>
                {error && <p className="error-message">{error}</p>}
                <form className="form-card" onSubmit={e => e.preventDefault()}>
                    <div className="form-group">
                        <label>Título</label>
                        <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={5} />
                    </div>
                    <div className="form-group">
                        <label>Categoría</label>
                        <input type="text" value={categoria} onChange={e => setCategoria(e.target.value)} placeholder="Ej. Salud, Comunidad, Alertas" />
                    </div>
                    <div className="form-actions">
                        <button type="button" onClick={() => setModalAbierto(true)} className="btn" disabled={loading}>Crear noticia</button>
                        <Link to={returnPath} className="btn" style={{ background: '#F2E9D8', border: '1px solid #adaba4', color: 'black', textDecoration: 'none' }}>Cancelar</Link>
                    </div>
                </form>
                {modalAbierto && (
                    <Modal Cerrar={() => setModalAbierto(false)}>
                        <p>¿Crear esta noticia?</p>
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
