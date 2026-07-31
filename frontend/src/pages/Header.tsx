import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../assets/Logo.svg'
import User from '../assets/USER.svg'

export const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isAdmin = user?.rol === 'admin';
    const isRepresentante = user?.rol === 'representante';

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleSidebar = () => {
        if (isAdmin || isRepresentante) setSidebarOpen(!sidebarOpen);
    };

    return (
        <>
            <header className="upatanet-header">
                <div className="header-logo">
                    <div className={`logo-wrapper ${(isAdmin || isRepresentante) ? 'logo-wrapper--clickable' : ''}`} onClick={toggleSidebar}>
                        <img src={Logo} alt="Logo" width={40} height={40}/>
                    </div>
                    <h1>UPATANET</h1>
                </div>
                <div className="header-user">
                    <img src={User} alt="USER" width={36} height={36} className="user-avatar"/>
                    <div className="user-info">
                        <span className="user-name">{user?.nombre ? `${user.nombre} ${user.apellido ?? ''}` : 'USUARIO'}</span>
                        <span className="user-role">{user?.rol?.toUpperCase() || '—'}</span>
                    </div>
                    <button className="logout-btn" title="Cerrar sesión" onClick={handleLogout}>
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                        </svg>
                    </button>
                </div>
            </header>

            {(isAdmin || isRepresentante) && (
                <>
                    <div className={`sidebar-overlay ${sidebarOpen ? 'sidebar-overlay--visible' : ''}`} onClick={() => setSidebarOpen(false)} />
                    <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
                        <div className="admin-sidebar-header">
                            <span>{isAdmin ? 'Panel de Administración' : 'Panel de Representante'}</span>
                            <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        <nav className="admin-sidebar-nav">
                            {isAdmin && (
                                <>
                                    <Link to="/admin/jornadas" className="admin-sidebar-link" onClick={() => setSidebarOpen(false)}>
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                            <polyline points="9 22 9 12 15 12 15 22" />
                                        </svg>
                                        Inicio
                                    </Link>
                                    <Link to="/admin/usuarios" className="admin-sidebar-link" onClick={() => setSidebarOpen(false)}>
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                            <circle cx="9" cy="7" r="4" />
                                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                        </svg>
                                        Usuarios
                                    </Link>
                                    <Link to="/admin/centros" className="admin-sidebar-link" onClick={() => setSidebarOpen(false)}>
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                            <polyline points="9 22 9 12 15 12 15 22" />
                                        </svg>
                                        Centros Médicos
                                    </Link>
                                    <Link to="/admin/noticias" className="admin-sidebar-link" onClick={() => setSidebarOpen(false)}>
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9" />
                                            <line x1="10" y1="8" x2="18" y2="8" />
                                            <line x1="12" y1="12" x2="18" y2="12" />
                                            <line x1="12" y1="16" x2="16" y2="16" />
                                        </svg>
                                        Noticias
                                    </Link>
                                </>
                            )}
                            {isRepresentante && (
                                <>
                                    <Link to="/panel/home" className="admin-sidebar-link" onClick={() => setSidebarOpen(false)}>
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                            <polyline points="9 22 9 12 15 12 15 22" />
                                        </svg>
                                        Inicio
                                    </Link>
                                    <Link to="/panel/jornadas" className="admin-sidebar-link" onClick={() => setSidebarOpen(false)}>
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                            <line x1="16" y1="2" x2="16" y2="6" />
                                            <line x1="8" y1="2" x2="8" y2="6" />
                                            <line x1="3" y1="10" x2="21" y2="10" />
                                        </svg>
                                        Jornadas
                                    </Link>
                                    <Link to="/panel/noticias" className="admin-sidebar-link" onClick={() => setSidebarOpen(false)}>
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9" />
                                            <line x1="10" y1="8" x2="18" y2="8" />
                                            <line x1="12" y1="12" x2="18" y2="12" />
                                            <line x1="12" y1="16" x2="16" y2="16" />
                                        </svg>
                                        Noticias
                                    </Link>
                                </>
                            )}
                        </nav>
                    </aside>
                </>
            )}
        </>
    )
}
