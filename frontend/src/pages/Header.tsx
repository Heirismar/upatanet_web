import Logo from '../assets/Logo.svg'
import User from '../assets/USER.svg'

export const Header = () => {
    return (
        <header className="upatanet-header">
            <div className="header-logo">
                <img src={Logo} alt="Logo" width={40} height={40}/>
                <h1>UPATANET</h1>
            </div>
            <div className="header-user">
                <img src={User} alt="USER" width={36} height={36} className="user-avatar"/>
                <div className="user-info">
                    <span className="user-name">HEIRISMAR MARCANO</span>
                    <span className="user-role">KIMIRENAI TERI</span>
                </div>
                <button className="logout-btn" title="Cerrar sesión">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                    </svg>
                </button>
            </div>
        </header>
    )
}