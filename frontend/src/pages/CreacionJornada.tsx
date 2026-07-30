import { Link, useNavigate } from 'react-router-dom';
import {Header} from './Header';
import { Modal } from './Modal';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createJornadaService } from '../services/jornada.service';
import './Jornadas.css';

type TipoModal = 'crear' | 'cancelar' | null;

export const CreacionJornada = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [modalAbierto, setModalAbierto] = useState<TipoModal>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [titulo, setTitulo] = useState('');
    const [datetimeInicio, setDatetimeInicio] = useState('');
    const [datetimeFin, setDatetimeFin] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [ubicacion, setUbicacion] = useState('');

    const today = () => new Date().toISOString().slice(0, 10);

    function validar() {
        if (!datetimeInicio) { setError('La fecha inicial es obligatoria.'); return false; }
        if (!datetimeFin) { setError('La fecha final es obligatoria.'); return false; }
        if (datetimeInicio < today()) { setError('La fecha inicial no puede ser anterior a hoy.'); return false; }
        if (datetimeFin <= datetimeInicio) { setError('La fecha final debe ser posterior a la fecha inicial.'); return false; }
        return true;
    }

    async function handleSubmit() {
        if (!token) return;
        if (!user?.centro_medico_id) {
            setError('Debes registrar un centro médico antes de crear una jornada.');
            return;
        }
        if (!validar()) return;
        setLoading(true);
        setError('');
        try {
            await createJornadaService({
                centro_medico_id: user.centro_medico_id,
                titulo,
                descripcion,
                datetime_inicio: `${datetimeInicio}T00:00:00`,
                datetime_fin: `${datetimeFin}T00:00:00`,
                ubicacion,
            }, token);
            navigate('/HomeJornadas');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error al crear la jornada');
        } finally {
            setLoading(false);
            setModalAbierto(null);
        }
    }

    return (
        <div className="upatanet-container">
            <Header />

            <main className='upatanet-main'>
                <h2 className="main-title">CREAR NUEVA JORNADA</h2>
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
                            <input type="date" min={today()} value={datetimeInicio} onChange={e => setDatetimeInicio(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Fecha final</label>
                            <input type="date" min={datetimeInicio ? new Date(new Date(datetimeInicio).getTime() + 86400000).toISOString().slice(0, 10) : today()} value={datetimeFin} onChange={e => setDatetimeFin(e.target.value)} />
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
                        <button type="button" onClick={() => setModalAbierto('crear')} className="btn" style={{ border: '1px solid #C43B26'}} disabled={loading}>Guardar</button>
                        <button type="button" onClick={() => setModalAbierto('cancelar')} className="btn" style={{ background: '#F2E9D8', border: '1px solid #adaba4', color: 'black'}} disabled={loading}>Cancelar</button>
                    </div>
                </form>

                {modalAbierto==='crear' && (
                    <Modal Cerrar={() => setModalAbierto(null)}>
                        <p>¿Está seguro de que desea hacer pública esta jornada?</p>
                        <div className='form-actions'>
                            <button type="button" className="btn" style={{ border: '1px solid #C43B26'}} onClick={handleSubmit} disabled={loading}>{loading ? 'Creando...' : 'Sí'}</button>
                            <button type="button" onClick={() => setModalAbierto(null)} className="btn" style={{ background: '#3A3A3C', border: '1px solid #3A3A3C', color: 'white'}} disabled={loading}>No</button>
                        </div>
                    </Modal>
                )}
                {modalAbierto==='cancelar' && (
                    <Modal Cerrar={() => setModalAbierto(null)}>
                        <p>¿Está seguro de que desea cancelar la publicación de esta jornada?</p>
                        <div className='form-actions'>
                            <button type="button" className="btn" style={{ border: '1px solid #C43B26'}} onClick={() => navigate('/HomeJornadas')}>Sí</button>
                            <button type="button" onClick={() => setModalAbierto(null)} className="btn" style={{ background: '#3A3A3C', border: '1px solid #3A3A3C', color: 'white'}}>No</button>
                        </div>
                    </Modal>
                )}
            </main>
        </div>
    );
}
