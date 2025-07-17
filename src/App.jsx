import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AgentPage from './pages/AgentPage';
import VehiclePage from "./pages/VehiclePage";
import './index.css';
import Footer from './components/Footer';
import MentionsLegales from './pages/MentionsLegales';

import Home from './pages/Home';
import Vendre from './pages/Vendre';
import Vehicules from './pages/Vehicules';
import Equipe from "./pages/Equipe"; 
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vendre" element={<Vendre />} />
        <Route path="/vehicules" element={<Vehicules />} />
        <Route path="/equipe" element={<Equipe />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/agent/:id" element={<AgentPage />} />
        <Route path="/vehicle/:id" element={<VehiclePage />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
