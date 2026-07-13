import { Link } from 'react-router-dom';
import {Header} from './Header'
import './Jornadas.css';

export const HomeJornadas = () => {
    // Datos dinámicos para renderizar las filas de la interfaz
    const jornadas = [
        {
        id: 1,
        titulo: 'Jornada de vacunación infantil',
        lugar: 'Ambulatorio Ocamo - Río Ocamo',
        fecha: '18–20 jul',
        completada: false,
        },
        {
        id: 2,
        titulo: 'Control prenatal y chequeo',
        lugar: 'Centro de Salud Mavaca - Río Mavaca',
        fecha: '25 jul',
        completada: false,
        },
        {
        id: 3,
        titulo: 'Brigada contra el paludismo',
        lugar: 'Ambulatorio Parima - Sierra Parima',
        fecha: '2 ago',
        completada: true, // Cambia el color del círculo indicador
        },
    ];

    return (
        <div className="upatanet-container">
            <Header />

            {/* Contenido Principal */}
            <main className="upatanet-main">
                <h2 className="main-title">JORNADAS MÉDICAS</h2>

                {/* Lista de Jornadas */}
                <div className="jornadas-list">
                {jornadas.map((jornada) => (
                    <div key={jornada.id} className="jornada-card">
                    <div className="jornada-left">
                        <span className={`status-dot ${jornada.completada ? 'completed' : 'pending'}`}></span>
                        <div className="jornada-details">
                        <h3 className="jornada-titulo">{jornada.titulo}</h3>
                        <p className="jornada-lugar">{jornada.lugar}</p>
                        </div>
                    </div>
                    <div className="jornada-right">
                        <span className="jornada-fecha">{jornada.fecha}</span>
                        <Link to='/CreacionJornada' className="btn-editar">Editar</Link>
                    </div>
                    </div>
                ))}
                </div>

                {/* Botón de Acción Inferior */}
                <Link to="/CreacionJornada" className="btn" style={{ display: 'flex', justifySelf: 'flex-end' }}>
                    Crear nueva jornada
                </Link>
            </main>
        </div>
    );
}