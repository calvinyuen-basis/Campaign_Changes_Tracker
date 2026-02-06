import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
// import Home from './Pages/Home';
import CampaignChangesTracker from './pages/CampaignChangesTracker';
import CampaignTroubleshooter from './pages/CampaignTroubleshooter';
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
