import './Navigation.css';

export default function Navigation() {
  return (
    <nav className="navigation glass">
      <div className="container">
        <div className="nav-content flex-between">
          <div className="nav-brand">
            <h2 className="gradient-text">ITS Corsi</h2>
          </div>
          
          <ul className="nav-links flex gap-lg">
            <li><a href="#corsi">Corsi</a></li>
            <li><a href="#studenti">Studenti</a></li>
            <li><a href="#docenti">Docenti</a></li>
            <li><a href="#admin">Admin</a></li>
          </ul>
          
          <div className="nav-actions flex gap-md">
            <button className="btn btn-secondary">Accedi</button>
            <button className="btn btn-primary">Registrati</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
