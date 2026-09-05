import "./Header.css";

const pageTitles = {
  dashboard: "Gaming Cafe Dashboard",
  systems: "Console Management",
  games: "Game Library",
  sessions: "Sessions & Revenue",
  pricing: "Pricing Setup",
};

export default function Header({ page, now, onAdminAccess, isAdmin, user, handleLogout,onAdminLogin }) {
  return (
    <header>
      <div>
        <p className="eyebrow">
          {page === "games"
            ? "MASTER GAME CATALOG"
            : "OVERCLOCK CONTROL CENTER"}
        </p>

        <h1>{pageTitles[page]}</h1>
      </div>

      <div className="header-actions">
        <div className="live">
          ● LIVE
          <span>
            {now.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        {isAdmin ? (
          <div className="admin-user-panel">
            <div className="admin-user-info">
              <span className="admin-status-dot" />

              <div>
                <strong>Admin Mode</strong>
                <small>{user?.phoneNumber || "Authenticated"}</small>
              </div>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="admin-login-btn" onClick={onAdminLogin}>
            🔐 Admin Login
          </button>
        )}
      </div>
    </header>
  );
}
