import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User,
  LogOut,
  LayoutDashboard,
  LineChart,
  Settings,
  Users,
} from "lucide-react";
import NurseryDistributionTable from "./DistributionTable";
import Progressive from "./Progress";
import { logout } from "../../store/auth/authSlice";
import "./Dashboard.css";


interface MenuItem {
  icon: React.FC<{ size?: number }>;
  text: string;
  path: string;
}

interface RootState {
  auth: {
    user: {
      fullname: string;
    };
  };
}

const MENU_ITEMS: MenuItem[] = [
  { icon: LayoutDashboard, text: "Dashboard", path: "#" },
  { icon: LineChart, text: "Análises", path: "#" },
  { icon: Users, text: "Equipe", path: "#" },
  { icon: Settings, text: "Configurações", path: "#" },
];

const UserProfile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="user-info">
      <div className="user-avatar">
        <User size={45} />
      </div>
      <h2>{user?.fullname || "Usuário"}</h2>
      <p>Bem-vindo!</p>
    </div>
  );
};

const SidebarNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="sidebar-nav">
      {MENU_ITEMS.map((item, index) => (
        <button
          key={index}
          className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
          onClick={() => navigate(item.path)}
        >
          <item.icon size={20} />
          <span>{item.text}</span>
        </button>
      ))}
    </nav>
  );
};

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      <LogOut size={20} />
      <span>Sair</span>
    </button>
  );
};

const Sidebar: React.FC = () => (
  <div className="sidebar">
    <UserProfile />
    <SidebarNavigation />
    <LogoutButton />
  </div>
);

const DashboardContent: React.FC = () => (
  <main className="dashboard-content">
    <NurseryDistributionTable />
    <Progressive />
  </main>
);

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <DashboardContent />
    </div>
  );
};

export default Dashboard;