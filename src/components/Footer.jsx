import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{
      background: "linear-gradient(180deg, #F7FCF7 10%, #05A820 60%)",
      color: 'black',
      textAlign: 'center',
      padding: '2rem',
      fontSize: '0.9rem',
      marginTop: 'auto',
      width: '100%'
    }}>
      © 2025 CarActif — <Link to="/mentions-legales" style={{ color: 'black' }}>Mentions Légales</Link>
    </footer>
  );
}

