import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import CampaignChangesTracker from './Pages/CampaignChangesTracker';
import CampaignTroubleshooter from './Pages/CampaignTroubleshooter';
import './App.css';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/CampaignChangesTracker" element={<CampaignChangesTracker />} />
        <Route path="/CampaignTroubleshooter" element={<CampaignTroubleshooter />} />
      </Routes>
    </Router>
  );
}
