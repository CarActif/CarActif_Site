import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import PageTransition from "./components/PageTransition";
import AgentPage from "./pages/AgentPage";
import VehiclePage from "./pages/VehiclePage";
import "./index.css";
import Footer from "./components/Footer";
import MentionsLegales from "./pages/MentionsLegales";
import PolitiqueConfidentialite from "./pages/PolitiqueConfidentialite";
import CommentCaMarche from "./pages/CommentCaMarche";
import Recrutement from "./pages/Recrutement";
import Home from "./pages/Home";
import Vendre from "./pages/Vendre";
import Vehicules from "./pages/Vehicules";
import Equipe from "./pages/Equipe";
import Contact from "./pages/Contact";
import Estimation from "./pages/Estimation";
import Faq from "./pages/Faq";
import Garantie from "./pages/Garantie";

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/vendre"
          element={
            <PageTransition>
              <Vendre />
            </PageTransition>
          }
        />
        <Route
          path="/estimation"
          element={
            <PageTransition>
              <Estimation />
            </PageTransition>
          }
        />
        <Route
          path="/vehicules"
          element={
            <PageTransition>
              <Vehicules />
            </PageTransition>
          }
        />
        <Route
          path="/vehicules/:id"
          element={
            <PageTransition>
              <VehiclePage />
            </PageTransition>
          }
        />
        <Route
          path="/equipe"
          element={
            <PageTransition>
              <Equipe />
            </PageTransition>
          }
        />
        <Route
          path="/comment-ca-marche"
          element={
            <PageTransition>
              <CommentCaMarche />
            </PageTransition>
          }
        />
        <Route
          path="/contact"
          element={
            <PageTransition>
              <Contact />
            </PageTransition>
          }
        />
        <Route
          path="/recrutement"
          element={
            <PageTransition>
              <Recrutement />
            </PageTransition>
          }
        />
        <Route
          path="/agent/:id"
          element={
            <PageTransition>
              <AgentPage />
            </PageTransition>
          }
        />
        <Route
          path="/vehicle/:id"
          element={
            <PageTransition>
              <VehiclePage />
            </PageTransition>
          }
        />
        <Route
          path="/faq"
          element={
            <PageTransition>
              <Faq />
            </PageTransition>
          }
        />
        <Route
          path="/garantie"
          element={
            <PageTransition>
              <Garantie />
            </PageTransition>
          }
        />
        <Route
          path="/mentions-legales"
          element={
            <PageTransition>
              <MentionsLegales />
            </PageTransition>
          }
        />
        <Route
          path="/politique-confidentialite"
          element={
            <PageTransition>
              <PolitiqueConfidentialite />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function Layout() {
  const { pathname } = useLocation();
  // Fiche véhicule : page immersive, sans barre de navigation
  const immersive = /^\/(vehicules|vehicle)\/[^/]+$/.test(pathname);
  return (
    <>
      {!immersive && <Navbar />}
      <AppRoutes />
      <Footer />
    </>
  );
}

function App() {
  return (
    <div className="liquid-bg min-h-screen">
      <div className="bg-orb-teal" aria-hidden="true" />
      <Router>
        <Layout />
      </Router>
    </div>
  );
}

export default App;
