import { Link } from 'react-router-dom';
import {Header} from './Header';
import { Modal } from './Modal';
import { useState } from 'react';
import './Jornadas.css';

type TipoModal = 'crear' | 'cancelar' | null;

export const CreacionJornada = () => {
    const [modalAbierto,setModalAbierto]=useState<TipoModal>(null);
    return (
        <div className="upatanet-container">
            <Header />

            <main className='upatanet-main'>
                {/* Botón Volver */}
                <Link to="/HomeJornadas" className="btn">
                    ← Volver
                </Link>

                <h2 className="main-title">CREAR NUEVA JORNADA</h2>

                {/* Formulario Estructurado */}
                <form className="form-card">
                    <div className="form-group">
                        <label>Nombre de la jornada</label>
                        <input type="text" placeholder="Ej. Jornada de vacunación infantil" />
                    </div>

                    <div className="form-group">
                        <label>Tipo de jornada</label>
                        <select>
                            <option value="medica">Jornada médica</option>
                            <option value="vacunacion">Vacunación</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Fecha inicial</label>
                            <input type="text" placeholder="18/07/2026" />
                        </div>
                        <div className="form-group">
                            <label>Fecha final</label>
                            <input type="text" placeholder="20/07/2026" />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea placeholder="Cuenta lo necesario para que las comunidades sepan qué hacer."></textarea>
                    </div>

                    <div className="form-group">
                        <label>Ubicación</label>
                        <input type="text" placeholder="Ambulatorio Ocamo, Río Ocamo" />
                    </div>

                    {/* Botones de acción del formulario */}
                    <div className="form-actions">
                        <button type="button" onClick={() => setModalAbierto('crear')} className="btn" style={{ border: '1px solid #C43B26'}}>Guardar</button>
                        <button type="button" onClick={() => setModalAbierto('cancelar')} className="btn" style={{ background: '#F2E9D8', border: '1px solid #adaba4', color: 'black'}}>Cancelar</button>
                    </div>
                </form>

                {/* Modal crear y modal cancelar */}
                {modalAbierto==='crear' && (
                    <Modal Cerrar={() => setModalAbierto(null)}>
                        <p>¿Está seguro de que desea hacer pública esta jornada?</p>
                        <div className='form-actions'>
                            <button type="button" className="btn" style={{ border: '1px solid #C43B26'}}>Sí</button>
                            <button type="button" onClick={() => setModalAbierto(null)} className="btn" style={{ background: '#3A3A3C', border: '1px solid #3A3A3C', color: 'white'}}>No</button>
                        </div>
                    </Modal>
                )}
                {modalAbierto==='cancelar' && (
                    <Modal Cerrar={() => setModalAbierto(null)}>
                        <p>¿Está seguro de que desea cancelar la publicación de esta jornada?</p>
                        <div className='form-actions'>
                            <button type="button" className="btn" style={{ border: '1px solid #C43B26'}}>Sí</button>
                            <button type="button" onClick={() => setModalAbierto(null)} className="btn" style={{ background: '#3A3A3C', border: '1px solid #3A3A3C', color: 'white'}}>No</button>
                        </div>
                    </Modal>
                )}
            </main>
        </div>
    );
}
