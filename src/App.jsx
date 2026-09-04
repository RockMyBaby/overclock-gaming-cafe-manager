import { useEffect, useMemo, useState } from "react";

const PRICING = { 1: 100, 2: 180, 3: 250, 4: 300 };

const seedSystems = [
  {
    id: "PS5-01",
    name: "PS5 • System 1",
    type: "PS5",
    status: "Playing",
    players: 2,
    customer: "Walk-in",
    startedAt: "10:30",
    games: ["EA Sports FC 25", "Spider-Man 2", "God of War Ragnarök"],
  },
  {
    id: "PS5-02",
    name: "PS5 • System 2",
    type: "PS5",
    status: "Available",
    players: 0,
    customer: "",
    startedAt: "",
    games: ["Grand Theft Auto V", "Tekken 8", "It Takes Two"],
  },
  {
    id: "PS5-03",
    name: "PS5 • System 3",
    type: "PS5",
    status: "Available",
    players: 0,
    customer: "",
    startedAt: "",
    games: ["Astro Bot", "Horizon Forbidden West", "Ghost of Tsushima"],
  },
  {
    id: "PS4-01",
    name: "PS4 • System 4",
    type: "PS4",
    status: "Playing",
    players: 1,
    customer: "Regular customer",
    startedAt: "11:00",
    games: ["Marvel's Spider-Man", "God of War", "Mortal Kombat 11"],
  },
];

const seedGames = [
  {
    id: 1,
    title: "EA Sports FC 25",
    platform: "PS5 / PS4",
    source: "Purchased",
    ownership: "Owned",
    genre: "Sports",
    installedOn: ["PS5-01", "PS5-02", "PS5-03"],
  },
  {
    id: 2,
    title: "Spider-Man 2",
    platform: "PS5",
    source: "Purchased",
    ownership: "Owned",
    genre: "Action",
    installedOn: ["PS5-01"],
  },
  {
    id: 3,
    title: "God of War Ragnarök",
    platform: "PS5 / PS4",
    source: "PS Plus Catalog",
    ownership: "Owned",
    genre: "Action",
    installedOn: ["PS5-01", "PS5-03"],
  },
  {
    id: 4,
    title: "Grand Theft Auto V",
    platform: "PS5 / PS4",
    source: "Purchased",
    ownership: "Owned",
    genre: "Open World",
    installedOn: ["PS5-01", "PS5-02", "PS5-03"],
  },
  {
    id: 5,
    title: "Tekken 8",
    platform: "PS5",
    source: "Purchased",
    ownership: "Owned",
    genre: "Fighting",
    installedOn: ["PS5-02"],
  },
  {
    id: 6,
    title: "It Takes Two",
    platform: "PS5 / PS4",
    source: "PS Plus Catalog",
    ownership: "Owned",
    genre: "Co-op",
    installedOn: ["PS5-02", "PS5-03"],
  },
  {
    id: 7,
    title: "Astro Bot",
    platform: "PS5",
    source: "Purchased",
    ownership: "Owned",
    genre: "Adventure",
    installedOn: ["PS5-03"],
  },
  {
    id: 8,
    title: "Horizon Forbidden West",
    platform: "PS5 / PS4",
    source: "PS Plus Catalog",
    ownership: "Owned",
    genre: "Adventure",
    installedOn: ["PS5-01", "PS5-03"],
  },
  {
    id: 9,
    title: "Ghost of Tsushima",
    platform: "PS5 / PS4",
    source: "Disc",
    ownership: "Owned",
    genre: "Action",
    installedOn: ["PS5-02"],
  },
  {
    id: 10,
    title: "Marvel's Spider-Man",
    platform: "PS5 / PS4",
    source: "PS Plus Catalog",
    ownership: "Owned",
    genre: "Action",
    installedOn: ["PS4-01"],
  },
  {
    id: 11,
    title: "God of War",
    platform: "PS5 / PS4",
    source: "Purchased",
    ownership: "Owned",
    genre: "Action",
    installedOn: ["PS4-01"],
  },
  {
    id: 12,
    title: "Mortal Kombat 11",
    platform: "PS5 / PS4",
    source: "Disc",
    ownership: "Owned",
    genre: "Fighting",
    installedOn: ["PS4-01"],
  },
  {
    id: 13,
    title: "Black Myth: Wukong",
    platform: "PS5",
    source: "Not Owned",
    ownership: "Not Owned",
    genre: "Action",
    installedOn: [],
  },
  {
    id: 14,
    title: "EA Sports FC 26",
    platform: "PS5 / PS4",
    source: "Not Owned",
    ownership: "Not Owned",
    genre: "Sports",
    installedOn: [],
  },
  {
    id: 15,
    title: "Grand Theft Auto VI",
    platform: "PS5",
    source: "Not Owned",
    ownership: "Not Owned",
    genre: "Open World",
    installedOn: [],
  },
];

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

const RAWG_API_KEY = import.meta.env.VITE_RAWG_API_KEY;

async function fetchGameImage(gameTitle) {
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(gameTitle)}&page_size=1`,
    );

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0].background_image || "";
    }

    return "";
  } catch (error) {
    console.error("Could not fetch game image:", error);
    return "";
  }
}

async function searchGameImages(gameTitle) {
  try {
    const response = await fetch(
      `https://api.rawg.io/api/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(gameTitle)}&page_size=8`,
    );

    const data = await response.json();

    if (!data.results) return [];

    return data.results
      .filter((game) => game.background_image)
      .map((game) => ({
        id: game.id,
        title: game.name,
        image: game.background_image,
      }));
  } catch (error) {
    console.error("Could not search game images:", error);
    return [];
  }
}

async function openImagePicker(game) {
  setImagePickerGame(game);
  setImageOptions([]);
  setImageSearchLoading(true);

  const results = await searchGameImages(game.title);

  setImageOptions(results);
  setImageSearchLoading(false);
}

function selectGameImage(image) {
  setGames((prev) =>
    prev.map((game) =>
      game.id === imagePickerGame.id
        ? {
            ...game,
            image,
          }
        : game,
    ),
  );

  setImagePickerGame(null);
  setImageOptions([]);
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [systems, setSystems] = useState(() => load("oc_systems", seedSystems));
  const [games, setGames] = useState(() => load("oc_games", seedGames));
  const [sessions, setSessions] = useState(() => load("oc_sessions", []));
  const [query, setQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [ownershipFilter, setOwnershipFilter] = useState("All");
  const [editingSystem, setEditingSystem] = useState(null);
  const [editingGame, setEditingGame] = useState(null);
  const [showGameForm, setShowGameForm] = useState(false);

  // Image picker states
  const [imagePickerGame, setImagePickerGame] = useState(null);
  const [imageOptions, setImageOptions] = useState([]);
  const [imageSearchLoading, setImageSearchLoading] = useState(false);

  const [now, setNow] = useState(new Date());

  useEffect(
    () => localStorage.setItem("oc_systems", JSON.stringify(systems)),
    [systems],
  );
  useEffect(
    () => localStorage.setItem("oc_games", JSON.stringify(games)),
    [games],
  );
  useEffect(
    () => localStorage.setItem("oc_sessions", JSON.stringify(sessions)),
    [sessions],
  );
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const active = systems.filter((s) => s.status === "Playing");
  const available = systems.filter((s) => s.status === "Available");
  const revenue = sessions.reduce((a, s) => a + s.amount, 0);

  async function openImagePicker(game) {
    setImagePickerGame(game);
    setImageOptions([]);
    setImageSearchLoading(true);

    const results = await searchGameImages(game.title);

    setImageOptions(results);
    setImageSearchLoading(false);
  }

  function selectGameImage(image) {
    setGames((prev) =>
      prev.map((game) =>
        game.id === imagePickerGame.id
          ? {
              ...game,
              image,
            }
          : game,
      ),
    );

    setImagePickerGame(null);
    setImageOptions([]);
  }

  const filteredGames = useMemo(
    () =>
      games.filter((g) => {
        const q = `${g.title} ${g.genre} ${g.platform}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const p =
          platformFilter === "All" || g.platform.includes(platformFilter);
        const o =
          ownershipFilter === "All" ||
          g.ownership === ownershipFilter ||
          g.source === ownershipFilter;
        return q && p && o;
      }),
    [games, query, platformFilter, ownershipFilter],
  );

  function saveSystem(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const updated = {
      ...editingSystem,
      name: fd.get("name"),
      status: fd.get("status"),
      players: Number(fd.get("players")),
      customer: fd.get("customer"),
      startedAt: fd.get("startedAt"),
      games: (fd.get("games") || "")
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    };
    setSystems((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setEditingSystem(null);
  }

  function startStopSession(system) {
    if (system.status === "Playing") {
      const mins = Math.max(
        30,
        Number(prompt("How many minutes was the session?", "60")) || 60,
      );
      const rate = PRICING[system.players] || 100;
      const amount = Math.round((rate * mins) / 60);
      setSessions((prev) => [
        {
          id: Date.now(),
          system: system.id,
          players: system.players,
          minutes: mins,
          amount,
          date: new Date().toLocaleDateString(),
        },
        ...prev,
      ]);
      setSystems((prev) =>
        prev.map((s) =>
          s.id === system.id
            ? {
                ...s,
                status: "Available",
                players: 0,
                customer: "",
                startedAt: "",
              }
            : s,
        ),
      );
    } else {
      const players = Number(prompt("How many players? (1-4)", "1")) || 1;
      const customer =
        prompt("Customer / group name (optional)", "") || "Walk-in";
      setSystems((prev) =>
        prev.map((s) =>
          s.id === system.id
            ? {
                ...s,
                status: "Playing",
                players: Math.min(4, Math.max(1, players)),
                customer,
                startedAt: now.toTimeString().slice(0, 5),
              }
            : s,
        ),
      );
    }
  }

  async function saveGame(e) {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);

    const title = fd.get("title");
    const installedOn = fd.getAll("installedOn");

    // If editing and image already exists, keep it.
    // Otherwise automatically search for the game's image.
    let image = editingGame?.image || "";

    if (!image) {
      image = await fetchGameImage(title);
    }

    const game = {
      id: editingGame?.id || Date.now(),
      title,
      platform: fd.get("platform"),
      source: fd.get("source"),
      ownership: fd.get("ownership"),
      genre: fd.get("genre"),
      installedOn,
      image,
    };

    setGames((prev) =>
      editingGame
        ? prev.map((g) => (g.id === game.id ? game : g))
        : [game, ...prev],
    );

    setShowGameForm(false);
    setEditingGame(null);
  }

  function deleteGame(id) {
    if (confirm("Remove this game from the library?"))
      setGames((prev) => prev.filter((g) => g.id !== id));
  }

  async function openImagePicker(game) {
    setImagePickerGame(game);
    setImageOptions([]);
    setImageSearchLoading(true);

    const results = await searchGameImages(game.title);

    setImageOptions(results);
    setImageSearchLoading(false);
  }

  function selectGameImage(image) {
    if (!imagePickerGame) return;

    setGames((prev) =>
      prev.map((game) =>
        game.id === imagePickerGame.id ? { ...game, image } : game,
      ),
    );

    setImagePickerGame(null);
    setImageOptions([]);
  }

  const sourceClass = (v) => v.toLowerCase().replaceAll(" ", "-");

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="bolt">ϟ</div>
          <div>
            <b>OVERCLOCK</b>
            <span>GAMING CAFE</span>
          </div>
        </div>
        <div className="tagline">WHERE GAMERS GO BEYOND</div>
        <nav>
          <button
            className={page === "dashboard" ? "active" : ""}
            onClick={() => setPage("dashboard")}
          >
            ⌂ Dashboard
          </button>
          <button
            className={page === "systems" ? "active" : ""}
            onClick={() => setPage("systems")}
          >
            🎮 Systems
          </button>
          <button
            className={page === "games" ? "active" : ""}
            onClick={() => setPage("games")}
          >
            ▣ Game Library
          </button>
          <button
            className={page === "sessions" ? "active" : ""}
            onClick={() => setPage("sessions")}
          >
            ◷ Sessions & Billing
          </button>
          <button
            className={page === "pricing" ? "active" : ""}
            onClick={() => setPage("pricing")}
          >
            ₹ Pricing
          </button>
        </nav>
        <div className="sidebar-footer">
          <div>📍 Virar West</div>
          <small>Open All Days</small>
        </div>
      </aside>

      <main className="main">
        <header>
          <div>
            <p className="eyebrow">
              {page === "games"
                ? "MASTER GAME CATALOG"
                : "OVERCLOCK CONTROL CENTER"}
            </p>
            <h1>
              {page === "dashboard"
                ? "Gaming Cafe Dashboard"
                : page === "systems"
                  ? "Console Management"
                  : page === "games"
                    ? "Game Library"
                    : page === "sessions"
                      ? "Sessions & Revenue"
                      : "Pricing Setup"}
            </h1>
          </div>
          <div className="live">
            ● LIVE{" "}
            <span>
              {now.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </header>

        {page === "dashboard" && (
          <Dashboard
            systems={systems}
            games={games}
            active={active}
            available={available}
            revenue={revenue}
            setPage={setPage}
            startStop={startStopSession}
            setEditingSystem={setEditingSystem}
          />
        )}
        {page === "systems" && (
          <Systems
            systems={systems}
            games={games}
            startStop={startStopSession}
            setEditingSystem={setEditingSystem}
          />
        )}
        {page === "games" && (
          <GameLibrary
            games={filteredGames}
            allGames={games}
            systems={systems}
            query={query}
            setQuery={setQuery}
            platformFilter={platformFilter}
            setPlatformFilter={setPlatformFilter}
            ownershipFilter={ownershipFilter}
            setOwnershipFilter={setOwnershipFilter}
            add={() => {
              setEditingGame(null);
              setShowGameForm(true);
            }}
            edit={(g) => {
              setEditingGame(g);
              setShowGameForm(true);
            }}
            del={deleteGame}
            changeImage={openImagePicker}
          />
        )}
        {page === "sessions" && (
          <Sessions sessions={sessions} revenue={revenue} />
        )}
        {page === "pricing" && <Pricing />}
      </main>

      {editingSystem && (
        <Modal
          title={`Edit ${editingSystem.name}`}
          close={() => setEditingSystem(null)}
        >
          <form onSubmit={saveSystem} className="form-grid">
            <label>
              System Name
              <input name="name" defaultValue={editingSystem.name} />
            </label>
            <label>
              Status
              <select name="status" defaultValue={editingSystem.status}>
                <option>Available</option>
                <option>Playing</option>
                <option>Maintenance</option>
              </select>
            </label>
            <label>
              Players
              <select name="players" defaultValue={editingSystem.players}>
                {[0, 1, 2, 3, 4].map((n) => (
                  <option key={n}>{n}</option>
                ))}
              </select>
            </label>
            <label>
              Customer / Group
              <input name="customer" defaultValue={editingSystem.customer} />
            </label>
            <label>
              Started At
              <input
                name="startedAt"
                type="time"
                defaultValue={editingSystem.startedAt}
              />
            </label>
            <label className="full">
              Installed Games{" "}
              <small>Comma separated — edit directly from the front-end</small>
              <textarea
                name="games"
                defaultValue={editingSystem.games.join(", ")}
                rows="4"
              />
            </label>
            <div className="full form-actions">
              <button
                type="button"
                className="ghost"
                onClick={() => setEditingSystem(null)}
              >
                Cancel
              </button>
              <button className="primary">Save System</button>
            </div>
          </form>
        </Modal>
      )}

      {showGameForm && (
        <Modal
          title={editingGame ? "Edit Game" : "Add Game to Library"}
          close={() => {
            setShowGameForm(false);
            setEditingGame(null);
          }}
        >
          <form onSubmit={saveGame} className="form-grid">
            <label>
              Game Title
              <input name="title" required defaultValue={editingGame?.title} />
            </label>
            <label>
              Platform
              <select
                name="platform"
                defaultValue={editingGame?.platform || "PS5"}
              >
                <option>PS5</option>
                <option>PS4</option>
                <option>PS5 / PS4</option>
              </select>
            </label>
            <label>
              Source
              <select
                name="source"
                defaultValue={editingGame?.source || "Purchased"}
              >
                <option>Purchased</option>
                <option>PS Plus Catalog</option>
                <option>Disc</option>
                <option>Not Owned</option>
              </select>
            </label>
            <label>
              Ownership
              <select
                name="ownership"
                defaultValue={editingGame?.ownership || "Owned"}
              >
                <option>Owned</option>
                <option>Not Owned</option>
              </select>
            </label>
            <label>
              Genre
              <input
                name="genre"
                placeholder="Action, Racing..."
                defaultValue={editingGame?.genre}
              />
            </label>
            <div className="full">
              <label>
                Installed On
                <small>Select all systems where this game is installed</small>
              </label>

              <div className="system-checkboxes">
                {systems.map((system) => (
                  <label key={system.id} className="system-checkbox">
                    <input
                      type="checkbox"
                      name="installedOn"
                      value={system.id}
                      defaultChecked={editingGame?.installedOn?.includes(
                        system.id,
                      )}
                    />

                    <span>🎮 {system.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="full form-actions">
              <button
                type="button"
                className="ghost"
                onClick={() => {
                  setShowGameForm(false);
                  setEditingGame(null);
                }}
              >
                Cancel
              </button>
              <button className="primary">
                {editingGame ? "Update Game" : "Add Game"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {imagePickerGame && (
        <div
          className="modal-backdrop"
          onMouseDown={() => setImagePickerGame(null)}
        >
          <div
            className="modal image-picker-modal"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <div>
                <h2>Choose Game Image</h2>
                <p>{imagePickerGame.title}</p>
              </div>

              <button type="button" onClick={() => setImagePickerGame(null)}>
                ×
              </button>
            </div>

            {imageSearchLoading ? (
              <div className="image-loading">
                🔎 Searching for game artwork...
              </div>
            ) : imageOptions.length > 0 ? (
              <div className="image-options">
                {imageOptions.map((option) => (
                  <button
                    type="button"
                    key={option.id}
                    className="image-option"
                    onClick={() => selectGameImage(option.image)}
                  >
                    <img src={option.image} alt={option.title} />

                    <span>{option.title}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="image-loading">No alternative images found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Dashboard({
  systems,
  games,
  active,
  available,
  revenue,
  setPage,
  startStop,
  setEditingSystem,
}) {
  return (
    <section>
      <div className="stats">
        <Stat
          icon="🎮"
          label="Total Systems"
          value={systems.length}
          note="3 PS5 + 1 PS4"
        />
        <Stat
          icon="⚡"
          label="Currently Playing"
          value={active.length}
          note={`${available.length} systems available`}
        />
        <Stat
          icon="👥"
          label="Players Right Now"
          value={active.reduce((a, s) => a + s.players, 0)}
          note="Live occupancy"
        />
        <Stat
          icon="₹"
          label="Today's Recorded Revenue"
          value={`₹${revenue}`}
          note="Completed sessions"
        />
      </div>
      <div className="section-head">
        <div>
          <h2>System Status</h2>
          <p>Start, stop and manage every console from one place.</p>
        </div>
        <button className="primary" onClick={() => setPage("systems")}>
          Manage Systems →
        </button>
      </div>
      <div className="system-grid">
        {systems.map((s) => (
          <SystemCard
            key={s.id}
            system={s}
            games={games}
            startStop={startStop}
            edit={setEditingSystem}
          />
        ))}
      </div>
      <div className="two-col">
        <div className="panel">
          <div className="panel-title">
            <h3>Game Library Snapshot</h3>
            <button className="text-btn" onClick={() => setPage("games")}>
              Open Library →
            </button>
          </div>
          <div className="library-summary">
            <div>
              <b>{games.filter((g) => g.ownership === "Owned").length}</b>
              <span>Owned</span>
            </div>
            <div>
              <b>
                {games.filter((g) => g.source === "PS Plus Catalog").length}
              </b>
              <span>PS Plus Catalog</span>
            </div>
            <div>
              <b>{games.filter((g) => g.source === "Disc").length}</b>
              <span>Disc</span>
            </div>
            <div>
              <b>{games.filter((g) => g.ownership === "Not Owned").length}</b>
              <span>Not Owned / Wishlist</span>
            </div>
          </div>
        </div>
        <div className="panel purple-panel">
          <h3>Quick Tip</h3>
          <p>
            When a game is uninstalled from PS5-01 and installed on PS5-03,
            simply edit the game from <b>Game Library</b> and change “Installed
            On”. No code changes needed.
          </p>
          <div className="tip-line">✓ Data automatically saved in browser</div>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, label, value, note }) {
  return (
    <div className="stat">
      <div className="stat-icon">{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{note}</small>
      </div>
    </div>
  );
}

function SystemCard({ system, games, startStop, edit }) {
  const installedGames = games.filter((game) =>
    game.installedOn?.includes(system.id),
  );

  return (
    <article className={`system-card ${system.status.toLowerCase()}`}>
      <div className="card-top">
        <div>
          <span className={`status-dot ${system.status.toLowerCase()}`}></span>
          {system.status}
        </div>
        <button className="icon-btn" onClick={() => edit(system)}>
          ✎
        </button>
      </div>
      <div className="console-title">
        <div className="console-icon">{system.type === "PS5" ? "5" : "4"}</div>
        <div>
          <h3>{system.name}</h3>
          <p>{system.id}</p>
        </div>
      </div>
      <div className="session-info">
        {system.status === "Playing" ? (
          <>
            <span>👤 {system.customer}</span>
            <span>
              👥 {system.players} player{system.players > 1 ? "s" : ""}
            </span>
            <span>◷ Started {system.startedAt}</span>
          </>
        ) : (
          <span>Ready for the next squad</span>
        )}
      </div>
      <div className="installed">
        <span>INSTALLED GAMES</span>

        {installedGames.length > 0 ? (
          <>
            {installedGames.slice(0, 3).map((game) => (
              <div key={game.id}>• {game.title}</div>
            ))}

            {installedGames.length > 3 && (
              <div>+ {installedGames.length - 3} more</div>
            )}
          </>
        ) : (
          <div>No games installed</div>
        )}
      </div>
      <button
        className={system.status === "Playing" ? "stop-btn" : "start-btn"}
        onClick={() => startStop(system)}
      >
        {system.status === "Playing"
          ? "■ End & Bill Session"
          : "▶ Start Session"}
      </button>
    </article>
  );
}

function Systems({ systems, games, startStop, setEditingSystem }) {
  return (
    <section>
      <div className="notice">
        💡 <b>Easy management:</b> Click Edit to change players, customer,
        installed games or system status without touching code.
      </div>
      <div className="system-grid">
        {systems.map((s) => (
          <SystemCard
            key={s.id}
            system={s}
            games={games}
            startStop={startStop}
            edit={setEditingSystem}
          />
        ))}
      </div>
      <div className="panel system-map">
        <h3>Installed Game Distribution</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Game</th>
                <th>Platform</th>
                <th>Source</th>
                <th>Installed On</th>
              </tr>
            </thead>
            <tbody>
              {games
                .filter((g) => g.installedOn && g.installedOn.length > 0)
                .map((g) => (
                  <tr key={g.id}>
                    <td>{g.title}</td>
                    <td>{g.platform}</td>
                    <td>
                      <Badge value={g.source} />
                    </td>
                    <td>
                      {g.installedOn.map((system) => (
                        <span key={system} className="system-tag">
                          {system}
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function GameLibrary({
  games,
  allGames,
  systems,
  query,
  setQuery,
  platformFilter,
  setPlatformFilter,
  ownershipFilter,
  setOwnershipFilter,
  add,
  edit,
  del,
  changeImage,
}) {
  return (
    <section>
      <div className="library-hero">
        <div>
          <h2>Your complete game catalog</h2>
          <p>
            Search, add, edit ownership and instantly see which console has each
            game installed.
          </p>
        </div>
        <button className="primary big" onClick={add}>
          ＋ Add Game
        </button>
      </div>
      <div className="filters">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔎 Search any game..."
        />
        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
        >
          <option>All</option>
          <option>PS5</option>
          <option>PS4</option>
        </select>
        <select
          value={ownershipFilter}
          onChange={(e) => setOwnershipFilter(e.target.value)}
        >
          <option>All</option>
          <option>Owned</option>
          <option>Not Owned</option>
          <option>Purchased</option>
          <option>PS Plus Catalog</option>
          <option>Disc</option>
        </select>
      </div>
      <div className="catalog-count">
        <b>{games.length}</b> games shown •{" "}
        <span>
          {allGames.filter((g) => g.ownership === "Owned").length} owned
        </span>{" "}
        •{" "}
        <span>
          {allGames.filter((g) => g.ownership === "Not Owned").length} marked
          Not Owned
        </span>
      </div>
      <div className="game-grid">
        {games.map((g) => (
          <article
            className={`game-card ${g.ownership === "Not Owned" ? "not-owned" : ""}`}
            key={g.id}
          >
            <div className="game-cover">
              {g.image ? (
                <img src={g.image} alt={g.title} loading="lazy" />
              ) : (
                <>
                  <span>{g.platform.includes("PS5") ? "PS5" : "PS4"}</span>
                  <strong>{g.title.split(" ").slice(0, 2).join(" ")}</strong>
                </>
              )}
            </div>
            <div className="game-body">
              <h3>{g.title}</h3>
              <p>
                {g.genre} • {g.platform}
              </p>
              <div className="badges">
                <Badge value={g.ownership} />
                <Badge value={g.source} />
              </div>
              <div className="installed-on">
                {g.installedOn && g.installedOn.length > 0 ? (
                  <div>
                    <span className="installed-label">🎮 Installed on:</span>

                    <div className="system-tags">
                      {g.installedOn.map((system) => (
                        <span key={system} className="system-tag">
                          {system}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <span>○ Not installed on any system</span>
                )}
              </div>
              <div className="game-actions">
                <button onClick={() => edit(g)}>Edit</button>

                <button className="change-image" onClick={() => changeImage(g)}>
                  🖼 Change Image
                </button>

                <button className="delete" onClick={() => del(g.id)}>
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {games.length === 0 && (
        <div className="empty">
          No games found. Try another search or add a new game.
        </div>
      )}
    </section>
  );
}

function Badge({ value }) {
  return (
    <span
      className={`badge ${String(value).toLowerCase().replaceAll(" ", "-")}`}
    >
      {value}
    </span>
  );
}

function Sessions({ sessions, revenue }) {
  return (
    <section>
      <div className="stats">
        <Stat
          icon="₹"
          label="Recorded Revenue"
          value={`₹${revenue}`}
          note="From completed sessions"
        />
        <Stat
          icon="✓"
          label="Completed Sessions"
          value={sessions.length}
          note="Stored locally"
        />
        <Stat
          icon="⏱"
          label="Average Session"
          value={
            sessions.length
              ? `${Math.round(sessions.reduce((a, s) => a + s.minutes, 0) / sessions.length)} min`
              : "—"
          }
          note="Based on recorded sessions"
        />
      </div>
      <div className="panel">
        <h2>Session History</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>System</th>
                <th>Players</th>
                <th>Duration</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {sessions.length ? (
                sessions.map((s) => (
                  <tr key={s.id}>
                    <td>{s.date}</td>
                    <td>{s.system}</td>
                    <td>{s.players}</td>
                    <td>{s.minutes} min</td>
                    <td className="money">₹{s.amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-cell">
                    No completed sessions yet. End a live session to create a
                    bill.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section>
      <div className="pricing-banner">
        <span>OVERCLOCK GAMING CAFE</span>
        <h2>Pricing Per Hour</h2>
        <p>Based on the rates from your cafe brochure.</p>
      </div>
      <div className="price-grid">
        {Object.entries(PRICING).map(([players, price]) => (
          <div className="price-card" key={players}>
            <span>
              {players} PLAYER{players > 1 ? "S" : ""}
            </span>
            <strong>₹{price}</strong>
            <small>PER HOUR</small>
            <p>Effective per-person total: ₹{Math.round(price / players)}</p>
          </div>
        ))}
      </div>
      <div className="panel">
        <h3>Current Rate Card</h3>
        <p>
          1 Player ₹100/hour • 2 Players ₹180/hour • 3 Players ₹250/hour • 4
          Players ₹300/hour
        </p>
        <p className="muted">
          The session billing feature automatically uses these rates.
        </p>
      </div>
    </section>
  );
}

function Modal({ title, children, close }) {
  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button onClick={close}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
