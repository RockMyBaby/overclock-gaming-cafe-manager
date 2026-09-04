const pageTitles = {
  dashboard: "Gaming Cafe Dashboard",
  systems: "Console Management",
  games: "Game Library",
  sessions: "Sessions & Revenue",
  pricing: "Pricing Setup",
};

export default function Header({ page, now }) {
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

      <div className="live">
        ● LIVE

        <span>
          {now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </header>
  );
}