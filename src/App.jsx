import { useEffect, useMemo, useState } from "react";
import { auth, db } from "./config/firebase";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

import Dashboard from "./components/dashboard/Dashboard";
import Systems from "./components/systems/Systems";
import GameLibrary from "./components/games/GameLibrary";
import ImagePicker from "./components/games/ImagePicker";
import Sessions from "./components/sessions/Sessions";
import Pricing from "./components/pricing/Pricing";

import Modal from "./components/common/Modal";
import AdminAccess from "./auth/AdminAccess";

import { PRICING } from "./constants/pricing";
import { seedSystems } from "./data/seedSystems";
import { seedGames } from "./data/seedGames";

import { load } from "./utils/storage";

import { fetchGameImage, searchGameImages } from "./services/rawgApi";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [showAdminAccess, setShowAdminAccess] = useState(false);

  const [systems, setSystems] = useState(() => load("oc_systems", seedSystems));

  const [games, setGames] = useState(() => load("oc_games", seedGames));

  const [sessions, setSessions] = useState(() => load("oc_sessions", []));

  const [query, setQuery] = useState("");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [ownershipFilter, setOwnershipFilter] = useState("All");

  const [editingSystem, setEditingSystem] = useState(null);

  const [editingGame, setEditingGame] = useState(null);

  const [showGameForm, setShowGameForm] = useState(false);

  const [imagePickerGame, setImagePickerGame] = useState(null);

  const [imageOptions, setImageOptions] = useState([]);

  const [imageSearchLoading, setImageSearchLoading] = useState(false);

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    localStorage.setItem("oc_systems", JSON.stringify(systems));
  }, [systems]);

  useEffect(() => {
    localStorage.setItem("oc_games", JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem("oc_sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);

    return () => clearInterval(timer);
  }, []);

  const active = systems.filter((system) => system.status === "Playing");

  const available = systems.filter((system) => system.status === "Available");

  const revenue = sessions.reduce(
    (total, session) => total + session.amount,
    0,
  );

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesSearch = `${game.title} ${game.genre} ${game.platform}`
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchesPlatform =
        platformFilter === "All" || game.platform.includes(platformFilter);

      const matchesOwnership =
        ownershipFilter === "All" ||
        game.ownership === ownershipFilter ||
        game.source === ownershipFilter;

      return matchesSearch && matchesPlatform && matchesOwnership;
    });
  }, [games, query, platformFilter, ownershipFilter]);

  function startStopSession(system) {
    if (system.status === "Playing") {
      const minutes = Math.max(
        30,
        Number(prompt("How many minutes was the session?", "60")) || 60,
      );

      const rate = PRICING[system.players] || 100;

      const amount = Math.round((rate * minutes) / 60);

      setSessions((prev) => [
        {
          id: Date.now(),
          system: system.id,
          players: system.players,
          minutes,
          amount,
          date: new Date().toLocaleDateString(),
        },
        ...prev,
      ]);

      setSystems((prev) =>
        prev.map((item) =>
          item.id === system.id
            ? {
                ...item,
                status: "Available",
                players: 0,
                customer: "",
                startedAt: "",
              }
            : item,
        ),
      );

      return;
    }

    const players = Number(prompt("How many players? (1-4)", "1")) || 1;

    const customer =
      prompt("Customer / group name (optional)", "") || "Walk-in";

    setSystems((prev) =>
      prev.map((item) =>
        item.id === system.id
          ? {
              ...item,
              status: "Playing",
              players: Math.min(4, Math.max(1, players)),
              customer,
              startedAt: now.toTimeString().slice(0, 5),
            }
          : item,
      ),
    );
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

  function deleteGame(id) {
    if (window.confirm("Remove this game from the library?")) {
      setGames((prev) => prev.filter((game) => game.id !== id));
    }
  }

  return (
    <>
      {showAdminAccess ? (
        <AdminAccess onClose={() => setShowAdminAccess(false)} />
      ) : (
        <div className="app-shell">
          <Sidebar page={page} setPage={setPage} />

          <main className="main">
            <Header
              page={page}
              now={now}
              onAdminAccess={() => setShowAdminAccess(true)}
            />

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
                edit={(game) => {
                  setEditingGame(game);
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

          <ImagePicker
            game={imagePickerGame}
            options={imageOptions}
            loading={imageSearchLoading}
            onSelect={selectGameImage}
            onClose={() => setImagePickerGame(null)}
          />
        </div>
      )}
    </>
  );
}
