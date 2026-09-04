const menuItems = [
  {
    id: "dashboard",
    icon: "⌂",
    label: "Dashboard",
  },
  {
    id: "systems",
    icon: "🎮",
    label: "Systems",
  },
  {
    id: "games",
    icon: "▣",
    label: "Game Library",
  },
  {
    id: "sessions",
    icon: "◷",
    label: "Sessions & Billing",
  },
  {
    id: "pricing",
    icon: "₹",
    label: "Pricing",
  },
];

export default function Sidebar({ page, setPage }) {
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
            className={
              page === item.id ? "active" : ""
            }
            onClick={() => setPage(item.id)}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div>📍 Virar West</div>
        <small>Open All Days</small>
      </div>
    </aside>
  );
}