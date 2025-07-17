import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#232526',
      color: 'white',
      textAlign: 'center',
      padding: '1rem',
      fontSize: '0.9rem',
      marginTop: 'auto',
      width: '100%'
    }}>
      © 2025 CarActif — <Link to="/mentions-legales" style={{ color: 'white' }}>Mentions Légales</Link>
    </footer>
  );
}
