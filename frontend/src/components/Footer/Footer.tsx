import './Footer.css';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content grid grid-4 gap-xl">
                    <div className="footer-section">
                        <h3 className="gradient-text mb-md">ITS Corsi</h3>
                        <p className="text-muted">
                            Piattaforma moderna per la gestione di corsi, studenti e certificazioni ITS.
                        </p>
                    </div>

                    <div className="footer-section">
                        <h4 className="mb-md">Navigazione</h4>
                        <ul className="footer-links">
                            <li><a href="#corsi">Catalogo Corsi</a></li>
                            <li><a href="#studenti">Area Studenti</a></li>
                            <li><a href="#docenti">Area Docenti</a></li>
                            <li><a href="#admin">Amministrazione</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="mb-md">Risorse</h4>
                        <ul className="footer-links">
                            <li><a href="#faq">FAQ</a></li>
                            <li><a href="#supporto">Supporto</a></li>
                            <li><a href="#documentazione">Documentazione</a></li>
                            <li><a href="#contatti">Contatti</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="mb-md">Legale</h4>
                        <ul className="footer-links">
                            <li><a href="#privacy">Privacy Policy</a></li>
                            <li><a href="#termini">Termini di Servizio</a></li>
                            <li><a href="#cookie">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom mt-xl">
                    <p className="text-center text-muted">
                        © {currentYear} ITS Corsi. Tutti i diritti riservati.
                    </p>
                </div>
            </div>
        </footer>
    );
}
