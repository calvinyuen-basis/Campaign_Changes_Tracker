# Campaign Changes Tracker

The Campaign Changes Tracker is an interactive web interface that helps users track and visualize changes made to advertising campaigns within a specific timeline. The application provides a comprehensive view of all modifications, including a calendar heatmap visualization that displays the frequency of changes over time, allowing users to easily identify when and what changes were made to their campaigns.

## Features


- Track all changes made to a campaign
- Visualize change frequency with a calendar heatmap
- Filter and review changes by date range

## How It Works

The application takes a campaign ID and uses an EVPump API endpoint to extract all changes and states of the campaign. It then parses this data and displays it on the interface for easy readability.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd campaign_changes_tracker
```

2. Install dependencies for both client and server:

**Client:**
```bash
cd client
npm install
```

**Server:**
```bash
cd server
npm install
```

### Running the Application

**Requirement:** You must have your VPN turned on for the API endpoint to work.

The application requires both the client and server to be running simultaneously.

1. **Start the Server:**
```bash
cd server
node server.js
```
The server will start on `http://localhost:5000`

2. **Start the Client** (in a new terminal):
```bash
cd client
npm start
```
The client will start on `http://localhost:3000` and automatically open in your browser.

