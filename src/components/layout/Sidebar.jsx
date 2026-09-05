import "./Sidebar.css";

export default function Sidebar({
  page,
  setPage,
  isAdmin,
  user,
  onAdminLogin,
  handleLogout,
}) {
  const menuItems = isAdmin
    ? [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: "⌂",
        },
        {
          id: "systems",
          label: "Systems",
          icon: "🎮",
        },
        {
          id: "games",
          label: "Game Library",
          icon: "▣",
        },
        {
          id: "sessions",
          label: "Sessions & Billing",
          icon: "◷",
        },
        {
          id: "pricing",
          label: "Pricing",
          icon: "₹",
        },
      ]
    : [
        {
          id: "dashboard",
          label: "Home",
          icon: "⌂",
        },
        {
          id: "systems",
          label: "Systems",
          icon: "🎮",
        },
        {
          id: "games",
          label: "Game Library",
          icon: "▣",
        },
      ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="bolt">ϟ</div>

        <div>
          <b>OVERCLOCK</b>
          <span>GAMING CAFE</span>
        </div>
      </div>

      <div className="tagline">
        WHERE GAMERS GO BEYOND
      </div>

      <nav>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={page === item.id ? "active" : ""}
            onClick={() => setPage(item.id)}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>

      {/* ADMIN / VISITOR ACTION */}
      <div className="sidebar-auth">
        {isAdmin ? (
          <>
            <div className="admin-status">
              <span className="admin-dot">●</span>
              Admin Mode
            </div>

            <button
              className="sidebar-logout-btn"
              onClick={handleLogout}
            >
              ↪ Logout
            </button>
          </>
        ) : (
          <button
            className="sidebar-admin-login"
            onClick={onAdminLogin}
          >
            🔐 Admin Login
          </button>
        )}
      </div>

      <div className="sidebar-footer">
        <div>📍 Virar West</div>
        <small>Open All Days</small>
      </div>
    </aside>
  );
}