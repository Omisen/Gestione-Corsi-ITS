import { useState, useEffect } from 'react';
import './HomePage.css';

export default function HomePage() {
    const [activeStudents, setActiveStudents] = useState(0);
    const [totalCourses, setTotalCourses] = useState(0);
    const [certifications, setCertifications] = useState(0);

    // Animated counter effect
    useEffect(() => {
        const animateCounter = (setter: (value: number) => void, target: number, duration: number) => {
            let start = 0;
            const increment = target / (duration / 16);
            const timer = setInterval(() => {
                start += increment;
                if (start >= target) {
                    setter(target);
                    clearInterval(timer);
                } else {
                    setter(Math.floor(start));
                }
            }, 16);
        };

        animateCounter(setActiveStudents, 1250, 2000);
        animateCounter(setTotalCourses, 85, 2000);
        animateCounter(setCertifications, 950, 2000);
    }, []);

    return (
        <div className="homepage">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-background"></div>
                <div className="container">
                    <div className="hero-content animate-fade-in-up">
                        <h1 className="hero-title">
                            Gestione Corsi <span className="gradient-text">ITS</span>
                        </h1>
                        <p className="hero-subtitle">
                            La piattaforma moderna per gestire corsi, studenti e certificazioni.
                            Tutto ciò di cui hai bisogno in un unico sistema integrato.
                        </p>
                        <div className="hero-actions flex gap-md">
                            <button className="btn btn-primary">Inizia Ora</button>
                            <button className="btn btn-secondary">Scopri di Più</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats">
                <div className="container">
                    <div className="stats-grid grid grid-3 gap-lg">
                        <div className="stat-card card-glass text-center animate-fade-in">
                            <div className="stat-number gradient-text">{activeStudents}+</div>
                            <div className="stat-label">Studenti Attivi</div>
                        </div>
                        <div className="stat-card card-glass text-center animate-fade-in">
                            <div className="stat-number gradient-text">{totalCourses}+</div>
                            <div className="stat-label">Corsi Disponibili</div>
                        </div>
                        <div className="stat-card card-glass text-center animate-fade-in">
                            <div className="stat-number gradient-text">{certifications}+</div>
                            <div className="stat-label">Certificazioni Rilasciate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <div className="section-header text-center mb-2xl">
                        <h2 className="animate-fade-in-up">Funzionalità Principali</h2>
                        <p className="text-muted animate-fade-in">
                            Tutto ciò di cui hai bisogno per gestire i tuoi corsi ITS
                        </p>
                    </div>

                    <div className="features-grid grid grid-2 gap-xl">
                        <div className="feature-card card-glass animate-fade-in-up">
                            <div className="feature-icon">📚</div>
                            <h3>Catalogo Corsi Completo</h3>
                            <p className="text-muted">
                                Gestisci facilmente tutti i corsi ITS con informazioni dettagliate,
                                programmi didattici e materiali di studio.
                            </p>
                        </div>

                        <div className="feature-card card-glass animate-fade-in-up">
                            <div className="feature-icon">👥</div>
                            <h3>Gestione Studenti</h3>
                            <p className="text-muted">
                                Monitora iscrizioni, presenze e progressi degli studenti in tempo reale
                                con dashboard intuitive.
                            </p>
                        </div>

                        <div className="feature-card card-glass animate-fade-in-up">
                            <div className="feature-icon">📊</div>
                            <h3>Tracciamento Progressi</h3>
                            <p className="text-muted">
                                Visualizza statistiche dettagliate e report personalizzati
                                per ogni studente e corso.
                            </p>
                        </div>

                        <div className="feature-card card-glass animate-fade-in-up">
                            <div className="feature-icon">🎓</div>
                            <h3>Certificazioni</h3>
                            <p className="text-muted">
                                Genera e gestisci certificazioni digitali con validazione
                                automatica e archiviazione sicura.
                            </p>
                        </div>

                        <div className="feature-card card-glass animate-fade-in-up">
                            <div className="feature-icon">👨‍🏫</div>
                            <h3>Area Docenti</h3>
                            <p className="text-muted">
                                Strumenti dedicati per i docenti: gestione lezioni, valutazioni
                                e comunicazione con gli studenti.
                            </p>
                        </div>

                        <div className="feature-card card-glass animate-fade-in-up">
                            <div className="feature-icon">⚙️</div>
                            <h3>Amministrazione</h3>
                            <p className="text-muted">
                                Pannello amministrativo completo per gestire utenti, permessi
                                e configurazioni del sistema.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="container">
                    <div className="cta-card card-glass text-center">
                        <h2 className="mb-md">Pronto per Iniziare?</h2>
                        <p className="text-muted mb-xl">
                            Unisciti a centinaia di istituti che già utilizzano la nostra piattaforma
                            per gestire i loro corsi ITS.
                        </p>
                        <div className="cta-actions flex-center gap-md">
                            <button className="btn btn-primary">Richiedi Demo</button>
                            <button className="btn btn-secondary">Contattaci</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
