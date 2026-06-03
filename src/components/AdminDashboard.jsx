import { useNavigate } from "react-router-dom";
import {
  FaUserShield, FaUsers, FaShoppingCart, FaCarSide,
  FaBolt, FaSignOutAlt, FaChartLine, FaBoxOpen
} from "react-icons/fa";
import "./AdminDashboard.css";

const stats = [
  { icon: <FaUsers />,       label: "Total Users",    value: "1,24,580", trend: "+8.2%",  color: "#3b82f6" },
  { icon: <FaShoppingCart />, label: "Orders Today",  value: "3,842",    trend: "+12.4%", color: "#16a34a" },
  { icon: <FaCarSide />,     label: "Active Rides",   value: "921",      trend: "+3.1%",  color: "#f59e0b" },
  { icon: <FaBolt />,        label: "Quick Deliveries", value: "5,210",  trend: "+19.7%", color: "#8b5cf6" },
];

const recentOrders = [
  { id: "#OC-8821", user: "Ravi Kumar",    service: "Quick Commerce", amount: "₹349",  status: "Delivered" },
  { id: "#OC-8820", user: "Priya Sharma",  service: "E-Commerce",     amount: "₹2,199", status: "Processing" },
  { id: "#OC-8819", user: "Anil Reddy",    service: "Rides",          amount: "₹120",  status: "Completed" },
  { id: "#OC-8818", user: "Meena Nair",    service: "Quick Commerce", amount: "₹580",  status: "Delivered" },
  { id: "#OC-8817", user: "Suresh Patel",  service: "E-Commerce",     amount: "₹4,599", status: "Pending" },
];

const statusColor = {
  Delivered:  { bg: "#dcfce7", text: "#16a34a" },
  Processing: { bg: "#fef9c3", text: "#b45309" },
  Completed:  { bg: "#dbeafe", text: "#1d4ed8" },
  Pending:    { bg: "#fee2e2", text: "#dc2626" },
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="adminPage">
      {/* SIDEBAR */}
      <aside className="adminSidebar">
        <div className="sidebarLogo">
          <span>⚡</span>
          <span>Octadecent</span>
        </div>

        <nav className="sidebarNav">
          <a href="#" className="sideNavItem sideNavActive">
            <FaChartLine /> Dashboard
          </a>
          <a href="#" className="sideNavItem">
            <FaUsers /> Users
          </a>
          <a href="#" className="sideNavItem">
            <FaBoxOpen /> Orders
          </a>
          <a href="#" className="sideNavItem">
            <FaCarSide /> Rides
          </a>
          <a href="#" className="sideNavItem">
            <FaBolt /> Deliveries
          </a>
        </nav>

        <button className="sideLogout" onClick={() => navigate("/login")}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="adminMain">
        {/* HEADER */}
        <header className="adminHeader">
          <div>
            <h1 className="adminTitle">Admin Dashboard</h1>
            <p className="adminSubtitle">Welcome back, Admin</p>
          </div>
          <div className="adminAvatar">
            <FaUserShield />
          </div>
        </header>

        {/* STATS GRID */}
        <div className="statsGrid">
          {stats.map((s, i) => (
            <div className="statCard" key={i}>
              <div className="statIcon" style={{ background: s.color + "1a", color: s.color }}>
                {s.icon}
              </div>
              <div className="statInfo">
                <p className="statLabel">{s.label}</p>
                <p className="statValue">{s.value}</p>
              </div>
              <span className="statTrend" style={{ color: "#16a34a" }}>{s.trend}</span>
            </div>
          ))}
        </div>

        {/* RECENT ORDERS TABLE */}
        <div className="ordersCard">
          <h2 className="ordersTitle">Recent Orders</h2>
          <div className="tableWrapper">
            <table className="ordersTable">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o, i) => (
                  <tr key={i}>
                    <td className="orderId">{o.id}</td>
                    <td>{o.user}</td>
                    <td>{o.service}</td>
                    <td className="orderAmount">{o.amount}</td>
                    <td>
                      <span
                        className="orderStatus"
                        style={{
                          background: statusColor[o.status].bg,
                          color:      statusColor[o.status].text,
                        }}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
