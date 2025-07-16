import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#FFD700',
      color: 'black',
      textAlign: 'center',
      padding: '1rem',
      fontSize: '0.9rem',
      marginTop: 'auto',
      width: '100%'
    }}>
      © 2025 CarActif — <Link to="/mentions-legales" style={{ color: 'black' }}>Mentions Légales</Link>
    </footer>
  );
}
