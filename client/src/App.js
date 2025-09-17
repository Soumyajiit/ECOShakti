import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

// --- Recharts & Lucide Icons ---
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Bell, Search, ChevronDown, LayoutDashboard, Settings, Sun, Zap, BatteryCharging, ArrowLeftRight, History, PanelTop, PlusCircle, Menu, LogOut, Info, CalendarDays, AlertTriangle, Power } from 'lucide-react';

// --- Styles ---
import './App.css';


// --- Mock Data ---
const initialPowerData = [
  { time: '00:00', generation: 0, consumption: 300, battery: 85 },
  { time: '02:00', generation: 0, consumption: 250, battery: 80 },
  { time: '04:00', generation: 0, consumption: 200, battery: 75 },
  { time: '06:00', generation: 100, consumption: 400, battery: 70 },
  { time: '08:00', generation: 800, consumption: 500, battery: 78 },
  { time: '10:00', generation: 1500, consumption: 600, battery: 90 },
  { time: '12:00', generation: 2200, consumption: 750, battery: 100 },
  { time: '14:00', generation: 2100, consumption: 800, battery: 100 },
  { time: '16:00', generation: 1600, consumption: 900, battery: 95 },
  { time: '18:00', generation: 500, consumption: 1200, battery: 85 },
  { time: '20:00', generation: 0, consumption: 1000, battery: 70 },
  { time: '22:00', generation: 0, consumption: 600, battery: 60 },
];

const initialEventLog = [
  { id: 1, time: '15:02', event: 'Battery Full', status: 'Charged', icon: <BatteryCharging size={16} />, color: 'green' },
  { id: 2, time: '14:30', event: 'Peak Generation', status: 'Optimal', icon: <Sun size={16} />, color: 'orange' },
  { id: 3, time: '12:15', event: 'Grid Exporting', status: 'Active', icon: <ArrowLeftRight size={16} />, color: 'blue' },
  { id: 4, time: '08:45', event: 'High Consumption', status: 'Warning', icon: <Zap size={16} />, color: 'red' },
  { id: 5, time: '06:00', event: 'Generation Started', status: 'Nominal', icon: <Sun size={16} />, color: 'orange' },
];

const historyData = [
    { date: '2025-09-17', totalGeneration: 25.2, totalConsumption: 18.5, peakGeneration: 2.3, notes: "Clear skies, high production." },
    { date: '2025-09-16', totalGeneration: 22.8, totalConsumption: 20.1, peakGeneration: 2.1, notes: "Partly cloudy in the afternoon." },
    { date: '2025-09-15', totalGeneration: 26.1, totalConsumption: 19.2, peakGeneration: 2.4, notes: "Sunny day, optimal performance." },
    { date: '2025-09-14', totalGeneration: 15.5, totalConsumption: 22.0, peakGeneration: 1.2, notes: "Overcast with heavy rain." },
    { date: '2025-09-13', totalGeneration: 24.9, totalConsumption: 17.8, peakGeneration: 2.2, notes: "Excellent generation." },
    { date: '2025-09-12', totalGeneration: 23.5, totalConsumption: 21.5, peakGeneration: 2.0, notes: "Higher than average consumption." },
    { date: '2025-09-11', totalGeneration: 19.8, totalConsumption: 18.9, peakGeneration: 1.8, notes: "Morning fog, cleared by noon." },
];

const mockNotifications = [
    { id: 1, title: 'High Consumption Alert', message: 'Power consumption has exceeded 1100W.', timestamp: '5m ago', read: false, icon: <AlertTriangle size={20} className="red-icon" /> },
    { id: 2, title: 'Generation Dip', message: 'Solar generation dropped unexpectedly.', timestamp: '2h ago', read: false, icon: <Sun size={20} className="orange-icon" /> },
    { id: 3, title: 'System Nominal', message: 'All systems are running optimally.', timestamp: '8h ago', read: true, icon: <Power size={20} className="green-icon" /> },
];


// --- Main App Router Component ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage setAuth={setAuth} /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <RegisterPage setAuth={setAuth} /> : <Navigate to="/" />} />
        <Route path="/" element={isAuthenticated ? <Dashboard setAuth={setAuth} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}


// --- DASHBOARD COMPONENT ---
const Dashboard = ({ setAuth }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [powerData, setPowerData] = useState(initialPowerData);
  const [eventLog, setEventLog] = useState(initialEventLog);
  const [activeView, setActiveView] = useState('dashboard');
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isNotificationOpen, setNotificationOpen] = useState(false);

  const navigate = useNavigate();

  const handleAddData = (newDataPoint) => {
    const formattedData = {
      ...newDataPoint,
      generation: Number(newDataPoint.generation) || 0,
      consumption: Number(newDataPoint.consumption) || 0,
      battery: Number(newDataPoint.battery) || 0,
    };
    
    const updatedData = [...powerData, formattedData].sort((a, b) => a.time.localeCompare(b.time));
    setPowerData(updatedData);

    const newEvent = {
      id: eventLog.length + 1,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: 'Manual Entry',
      status: 'Logged',
      icon: <PlusCircle size={16} />,
      color: 'gray',
    };
    setEventLog([newEvent, ...eventLog]);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
    navigate('/login');
  };
  
  const handleMarkAllAsRead = () => {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="app-container">
      <Sidebar 
        isOpen={sidebarOpen} 
        activeView={activeView}
        setActiveView={setActiveView} 
      />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
      <div className="content-wrapper">
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          onLogout={handleLogout}
          onNotificationClick={() => setNotificationOpen(!isNotificationOpen)}
          unreadCount={unreadCount}
        />
        {isNotificationOpen && (
            <NotificationPanel 
                notifications={notifications} 
                onMarkAllRead={handleMarkAllAsRead}
                onClose={() => setNotificationOpen(false)}
            />
        )}
        <main className="main-content">
          <DashboardContent
            activeView={activeView}
            powerData={powerData}
            eventLog={eventLog}
            onAddData={handleAddData}
          />
        </main>
      </div>
    </div>
  );
}

// --- Smaller Reusable Components ---

const Sidebar = ({ isOpen, activeView, setActiveView }) => (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header"><h1 className="sidebar-title">ECOSHAKTI</h1></div>
      <nav className="sidebar-nav">
        <a href="#" className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveView('dashboard')}><LayoutDashboard className="nav-item-icon" /><span>Dashboard</span></a>
        <a href="#" className={`nav-item ${activeView === 'history' ? 'active' : ''}`} onClick={() => setActiveView('history')}><History className="nav-item-icon" /><span>History</span></a>
        <a href="#" className={`nav-item ${activeView === 'settings' ? 'active' : ''}`} onClick={() => setActiveView('settings')}><Settings className="nav-item-icon" /><span>Settings</span></a>
        <a href="#" className={`nav-item ${activeView === 'about' ? 'active' : ''}`} onClick={() => setActiveView('about')}><Info className="nav-item-icon" /><span>About</span></a>
      </nav>
      <div className="sidebar-footer"><div className="support-box"><p>Need help?</p><a href="#">Contact Support</a></div></div>
    </aside>
);

const Header = ({ onMenuClick, onLogout, onNotificationClick, unreadCount }) => (
  <header className="header">
    <div className="header-content">
       <button className="menu-button" onClick={onMenuClick}><Menu /></button>
      <div className="search-bar-container"><Search className="search-icon" size={20} /><input type="text" placeholder="Search..." className="search-input" /></div>
      <div className="header-right">
        <button className="notification-button" onClick={onNotificationClick}>
          <Bell />
          {unreadCount > 0 && (
            <span className="notification-dot-container">
                <span className="notification-dot-ping"></span>
                <span className="notification-dot"></span>
            </span>
          )}
        </button>
        <div className="user-menu"><img src="https://placehold.co/40x40/F97316/FFFFFF/png?text=S" alt="User" className="user-avatar" /><span className="user-name">Soumya</span><ChevronDown size={16} /></div>
        <button onClick={onLogout} className="logout-button"><LogOut size={20} /></button>
      </div>
    </div>
  </header>
);

const DashboardContent = ({ activeView, powerData, eventLog, onAddData }) => {
  const latestData = powerData.length > 0 ? powerData[powerData.length - 1] : {};
  const batteryStatus = latestData.battery || 0;
  const gridStatus = (latestData.generation > latestData.consumption) ? "Exporting" : "Importing";
  const gridColor = (gridStatus === "Exporting") ? "green" : "red";

  return (
    <>
      {activeView === 'dashboard' && (
        <>
          <h2 className="page-title">Dashboard</h2>
          <div className="stat-cards-grid">
            <StatCard icon={<Zap size={24} />} title="Live Generation" value={`${latestData.generation || 0} W`} trend="+5%" color="orange" />
            <StatCard icon={<Zap size={24} />} title="Consumption" value={`${latestData.consumption || 0} W`} trend="-2%" color="blue" />
            <StatCard icon={<BatteryCharging size={24} />} title="Battery Status" value={`${batteryStatus}%`} trend={`${batteryStatus > 99 ? 'Full' : 'Charging'}`} color="green" />
            <StatCard icon={<ArrowLeftRight size={24} />} title="Grid Status" value={gridStatus} trend="" color={gridColor} />
          </div>
          <div className="chart-container">
            <h3 className="chart-title">Today's Power Metrics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={powerData}><defs><linearGradient id="colorGeneration" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/><stop offset="95%" stopColor="#F97316" stopOpacity={0}/></linearGradient><linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/><stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /><XAxis dataKey="time" /><YAxis /><Tooltip /><Legend /><Area type="monotone" dataKey="generation" stroke="#F97316" fillOpacity={1} fill="url(#colorGeneration)" name="Generation (W)" /><Area type="monotone" dataKey="consumption" stroke="#3B82F6" fillOpacity={1} fill="url(#colorConsumption)" name="Consumption (W)" /></AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="bottom-grid">
            <div className="event-log-container"><h3 className="event-log-title">Recent Events</h3><table className="event-log-table"><thead><tr><th>Time</th><th>Event</th><th>Status</th></tr></thead><tbody>{eventLog.map(item => (<tr key={item.id}><td>{item.time}</td><td><div className="event-cell">{item.icon} {item.event}</div></td><td><span className={`status-badge ${item.color}`}>{item.status}</span></td></tr>))}</tbody></table></div>
            <DataEntryForm onAddData={onAddData} />
          </div>
        </>
      )}
      {activeView === 'history' && <HistoryView />}
      {activeView === 'about' && <AboutSection />}
      {activeView === 'settings' && <h2 className="page-title">Settings</h2>}
    </>
  );
};

const StatCard = ({ icon, title, value, trend, color }) => (
  <div className="stat-card"><div className={`stat-card-icon ${color}`}>{icon}</div><div className="stat-card-info"><p className="stat-card-title">{title}</p><h4 className="stat-card-value">{value}</h4></div>{trend && <p className={`stat-card-trend ${trend.includes('+') ? 'positive' : 'negative'}`}>{trend}</p>}</div>
);

const DataEntryForm = ({ onAddData }) => {
  const [time, setTime] = useState('');
  const [generation, setGeneration] = useState('');
  const [consumption, setConsumption] = useState('');
  const [battery, setBattery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!time) { alert("Please enter a time."); return; }
    onAddData({ time, generation, consumption, battery });
    setTime(''); setGeneration(''); setConsumption(''); setBattery('');
  };

  return (
    <div className="data-entry-container"><h3 className="data-entry-title">Add New Data Point</h3><form onSubmit={handleSubmit} className="data-entry-form"><div className="form-group"><label htmlFor="time">Time (HH:MM)</label><input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required /></div><div className="form-group"><label htmlFor="generation">Generation (W)</label><input id="generation" type="number" value={generation} onChange={(e) => setGeneration(e.target.value)} placeholder="e.g., 1500" /></div><div className="form-group"><label htmlFor="consumption">Consumption (W)</label><input id="consumption" type="number" value={consumption} onChange={(e) => setConsumption(e.target.value)} placeholder="e.g., 600" /></div><div className="form-group"><label htmlFor="battery">Battery (%)</label><input id="battery" type="number" value={battery} onChange={(e) => setBattery(e.target.value)} placeholder="e.g., 90" /></div><button type="submit" className="submit-button">Add Data Point</button></form></div>
  );
};

const AboutSection = () => (
  <div className="about-container">
    <h3 className="about-title">About Eco Shakti</h3>
    <p className="about-description">
      Eco Shakti is more than just an app—it's your command center for a sustainable energy future. Our mission is to put the power of renewable energy management directly in your hands, transforming complex data from your Eco Shakti sensors into clear, actionable insights.
    </p>
    <p className="about-description">
      By connecting seamlessly with your hardware, the app provides a dynamic, real-time overview of your entire energy ecosystem. The intuitive dashboard visualizes every watt generated by your solar panels, every unit of energy stored in your batteries, and every bit of power consumed by your home. Track your energy flow with detailed charts and see your system's performance at a glance.
    </p>
    <p className="about-description">
      Go beyond simple monitoring. Eco Shakti analyzes your historical data to reveal patterns in your energy usage. Understand your peak consumption times, identify opportunities to reduce waste, and make smarter decisions to maximize your savings and minimize your environmental impact. With intelligent alerts about your system's health, you can stay ahead of any issues and ensure your setup is always running at peak efficiency. Eco Shakti empowers you on your journey toward greater energy independence.
    </p>
  </div>
);

const RingChart = ({ size, strokeWidth, percentage, color }) => {
    const viewBox = `0 0 ${size} ${size}`; const radius = (size - strokeWidth) / 2; const circumference = radius * 2 * Math.PI; const offset = circumference - (percentage / 100) * circumference;
    return (<svg width={size} height={size} viewBox={viewBox} className="ring-chart-svg"><circle className="ring-chart-background" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} /><circle className="ring-chart-progress" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} stroke={color} /><text className="ring-chart-text" x="50%" y="50%" dy=".3em" textAnchor="middle">{`${Math.round(percentage)}%`}</text></svg>);
};

const HistoryView = () => {
    const [selectedDay, setSelectedDay] = useState(historyData[0]); const netEnergy = selectedDay.totalGeneration - selectedDay.totalConsumption; const selfSufficiency = Math.min(100, (selectedDay.totalGeneration / selectedDay.totalConsumption) * 100);
    return (<><h2 className="page-title">Weekly History</h2><div className="history-container"><div className="day-selector">{historyData.map(day => (<button key={day.date} className={`day-selector-item ${selectedDay.date === day.date ? 'active' : ''}`} onClick={() => setSelectedDay(day)}><span>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</span><strong>{new Date(day.date).toLocaleDateString('en-US', { day: '2-digit' })}</strong></button>))}</div><div className="day-details"><div className="day-details-header"><CalendarDays size={24} /><h3>{new Date(selectedDay.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3></div><div className="day-details-body"><div className="day-stats"><div className="stat-item"><Sun size={20} className="orange-icon" /><div><span>Total Generation</span><strong>{selectedDay.totalGeneration} kWh</strong></div></div><div className="stat-item"><Zap size={20} className="blue-icon" /><div><span>Total Consumption</span><strong>{selectedDay.totalConsumption} kWh</strong></div></div><div className="stat-item"><ArrowLeftRight size={20} className={netEnergy >= 0 ? 'green-icon' : 'red-icon'} /><div><span>Net Energy</span><strong className={netEnergy >= 0 ? 'positive' : 'negative'}>{netEnergy.toFixed(1)} kWh</strong></div></div></div><div className="day-chart"><RingChart size={140} strokeWidth={12} percentage={selfSufficiency} color="var(--tangerine-primary)" /><h4>Self-Sufficiency</h4><p>You generated {Math.round(selfSufficiency)}% of the energy you consumed.</p></div></div><div className="day-details-footer"><p><strong>Notes:</strong> {selectedDay.notes}</p></div></div></div></>);
};

const NotificationPanel = ({ notifications, onMarkAllRead, onClose }) => {
    const panelRef = useRef();

    // Close panel if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target) && !event.target.closest('.notification-button')) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div className="notification-panel" ref={panelRef}>
            <div className="notification-header">
                <h3>Notifications</h3>
                <button onClick={onMarkAllRead}>Mark all as read</button>
            </div>
            <div className="notification-list">
                {notifications.map(n => (
                    <div key={n.id} className={`notification-item ${!n.read ? 'unread' : ''}`}>
                        <div className="notification-icon">{n.icon}</div>
                        <div className="notification-content">
                            <h4>{n.title}</h4>
                            <p>{n.message}</p>
                            <span>{n.timestamp}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};