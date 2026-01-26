import { Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';

export default function Navbar() {
  const location = useLocation();

  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar>
        <Button 
          color="inherit" 
          component={Link} 
          to="/CampaignChangesTracker"
          sx={{ 
            fontWeight: location.pathname === '/CampaignChangesTracker' ? 'bold' : 'normal',
            textDecoration: location.pathname === '/CampaignChangesTracker' ? 'underline' : 'none'
          }}
        >
          Campaign Changes Tracker
        </Button>
        <Button 
          color="inherit" 
          component={Link} 
          to="/CampaignTroubleshooter"
          sx={{ 
            fontWeight: location.pathname === '/CampaignTroubleshooter' ? 'bold' : 'normal',
            textDecoration: location.pathname === '/CampaignTroubleshooter' ? 'underline' : 'none'
          }}
        >
          Campaign Troubleshooter
        </Button>
      </Toolbar>
    </AppBar>
  );
}
