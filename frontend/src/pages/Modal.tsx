import './Jornadas.css';

interface ModalProps {
    Cerrar: () => void;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps>=({ Cerrar,children }) => {
    return (
        <div className='fondo' onClick={Cerrar}>
            <div className='contenido' onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};
