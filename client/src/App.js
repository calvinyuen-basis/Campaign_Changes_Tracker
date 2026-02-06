import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
// import Home from './Pages/Home';
import CampaignChangesTracker from './pages/changesTracker';
import CampaignTroubleshooter from './pages/troubleshooter';
import './App.css';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<CampaignChangesTracker />} />
        <Route path="/CampaignTroubleshooter" element={<CampaignTroubleshooter />} />
      </Routes>
    </Router>
  );
}
