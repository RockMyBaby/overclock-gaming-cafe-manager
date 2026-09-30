import { useEffect, useState } from "react";
import Icon from "../common/Icon";
import { load } from "../../utils/storage";
import "./Sidebar.css";

const NAV_KEY = "oc_nav_collapsed";
const NARROW_QUERY = "(max-width: 1100px)";

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
          icon: "dashboard",
        },
        {
          id: "systems",
          label: "Systems",
          icon: "gamepad",
        },
        {
          id: "games",
          label: "Game Library",
          icon: "library",
        },
        {
          id: "sessions",
          label: "Sessions & Billing",
          icon: "clock",
        },
        {
          id: "pricing",
          label: "Pricing",
          icon: "rupee",
        },
      ]
    : [
        {
          id: "dashboard",
          label: "Home",
          icon: "dashboard",
        },
        {
          id: "systems",
          label: "Systems",
          icon: "gamepad",
        },
        {
          id: "games",
          label: "Game Library",
          icon: "library",
        },
      ];

  // Presentation-only state: the rail is remembered per browser and forced on
  // narrower screens. It never affects which pages are reachable.
  const [collapsed, setCollapsed] = useState(() => load(NAV_KEY, false));
  const [narrow, setNarrow] = useState(
    () => window.matchMedia(NARROW_QUERY).matches,
  );
  const rail = collapsed || narrow;

  useEffect(() => {
    const query = window.matchMedia(NARROW_QUERY);
    const onChange = (event) => setNarrow(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.nav = rail ? "rail" : "full";
  }, [rail]);

  function toggleRail() {
    setCollapsed((prev) => {
      localStorage.setItem(NAV_KEY, JSON.stringify(!prev));
      return !prev;
    });
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="bolt">
          <Icon name="bolt" size={22} />
        </div>

        <div className="brand-text">
          <b>OVERCLOCK</b>
          <span>GAMING CAFE</span>
        </div>
      </div>

      <div className="tagline">
        WHERE GAMERS GO BEYOND
      </div>

      <nav>
        {menuItems.map((item) => (
          <div key={item.id} className="nav-item">
            {item.id === "sessions" && (
              <span className="nav-divider" aria-hidden="true" />
            )}

            <button
              className={page === item.id ? "active" : ""}
              aria-current={page === item.id ? "page" : undefined}
              title={item.label}
              onClick={() => setPage(item.id)}
            >
              <Icon name={item.icon} />
              <span className="nav-label">{item.label}</span>
            </button>
          </div>
        ))}
      </nav>

      {/* ADMIN / VISITOR ACTION */}
      <div className="sidebar-auth">
        {isAdmin ? (
          <>
            <div className="admin-status">
              <span className="admin-dot" />
              <span className="nav-label">Admin Mode</span>
            </div>

            <button
              className="sidebar-logout-btn"
              title="Logout"
              onClick={handleLogout}
            >
              <Icon name="logout" size={16} />
              <span className="nav-label">Logout</span>
            </button>
          </>
        ) : (
          <button
            className="sidebar-admin-login"
            title="Admin Login"
            onClick={onAdminLogin}
          >
            <Icon name="lock" size={16} />
            <span className="nav-label">Admin Login</span>
          </button>
        )}
      </div>

      <div className="sidebar-footer">
        <div>
          <Icon name="pin" size={15} />
          <span className="nav-label">Virar West</span>
        </div>
        <small className="nav-label">Open All Days</small>
      </div>

      {!narrow && (
        <button
          type="button"
          className="rail-toggle"
          aria-label={rail ? "Expand navigation" : "Collapse navigation"}
          aria-pressed={rail}
          onClick={toggleRail}
        >
          <Icon name={rail ? "chevrons-right" : "chevrons-left"} size={14} />
        </button>
      )}
    </aside>
  );
}
