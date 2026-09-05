import { useEffect, useMemo, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "./config/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query as firestoreQuery,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "./context/AuthContext";
import AdminAccess from "./auth/AdminAccess";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

import Dashboard from "./components/dashboard/Dashboard";
import Systems from "./components/systems/Systems";
import GameLibrary from "./components/games/GameLibrary";
import ImagePicker from "./components/games/ImagePicker";
import Sessions from "./components/sessions/Sessions";
import Pricing from "./components/pricing/Pricing";
import GameForm from "./components/games/GameForm";
import SessionModal from "./components/sessions/SessionModal";
import StopSessionModal from "./components/sessions/StopSessionModal";

import Modal from "./components/common/Modal";

import { PRICING } from "./constants/pricing";
import { seedSystems } from "./data/seedSystems";
import { seedGames } from "./data/seedGames";

import { load } from "./utils/storage";

import { fetchGameImage, searchGameImages } from "./services/rawgApi";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const { user, isAdmin, loading } = useAuth();
  const [showAdminAccess, setShowAdminAccess] = useState(false);

  const [systems, setSystems] = useState([]);
  const [systemsLoading, setSystemsLoading] = useState(true);

  const [games, setGames] = useState(() => load("oc_games", seedGames));

  const [sessions, setSessions] = useState([]);

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

  const [sessionSystem, setSessionSystem] = useState(null);
  const [endingSessionSystem, setEndingSessionSystem] = useState(null);

  // useEffect(() => {
  //   localStorage.setItem("oc_systems", JSON.stringify(systems));
  // }, [systems]); // Systems are now stored in Firestore

  useEffect(() => {
    localStorage.setItem("oc_games", JSON.stringify(games));
  }, [games]);

  // useEffect(() => {
  //   localStorage.setItem("oc_sessions", JSON.stringify(sessions));
  // }, [sessions]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadSessions() {
      try {
        const sessionsRef = collection(db, "sessions");

        const sessionsQuery = firestoreQuery(
          sessionsRef,
          orderBy("endedAt", "desc"),
        );

        const snapshot = await getDocs(sessionsQuery);

        const loadedSessions = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSessions(loadedSessions);

        console.log("Sessions loaded from Firestore:", loadedSessions);
      } catch (error) {
        console.error("Error loading sessions:", error);
      }
    }

    loadSessions();
  }, []);

  useEffect(() => {
    async function checkAndSeedSystems() {
      try {
        const systemsRef = collection(db, "systems");
        const snapshot = await getDocs(systemsRef);

        if (snapshot.empty) {
          console.log("No systems found. Seeding Firestore...");
          await seedSystemsToFirestore();
        }
      } catch (error) {
        console.error("Error checking systems:", error);
      }
    }

    checkAndSeedSystems();
  }, []);

  useEffect(() => {
    const systemsRef = collection(db, "systems");

    const unsubscribe = onSnapshot(
      systemsRef,
      (snapshot) => {
        const loadedSystems = snapshot.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          }))
          .sort((a, b) => {
            const order = ["PS5-01", "PS5-02", "PS5-03", "PS4-01"];

            return order.indexOf(a.id) - order.indexOf(b.id);
          });

        setSystems(loadedSystems);
        setSystemsLoading(false);

        console.log("Realtime systems update:", loadedSystems);
      },
      (error) => {
        console.error("Error listening to systems:", error);

        setSystemsLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  function handleLogout() {
    signOut(auth)
      .then(() => {
        console.log("Admin logged out");
        setPage("dashboard");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  }

  const active = systems.filter((system) => system.status === "Playing");

  const available = systems.filter((system) => system.status === "Available");

  function getISTDateString(dateValue) {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(dateValue));
  }

  const todayIST = getISTDateString(new Date());

  const todaySessions = sessions.filter(
    (session) =>
      session.endedAt && getISTDateString(session.endedAt) === todayIST,
  );

  const todayRevenue = todaySessions.reduce(
    (total, session) => total + Number(session.amount || 0),
    0,
  );

  const revenue = sessions.reduce(
    (total, session) => total + Number(session.amount || 0),
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
    if (!isAdmin) {
      alert("Admin access required to manage gaming sessions.");
      return;
    }

    // SYSTEM IS ALREADY PLAYING → OPEN END SESSION MODAL
    if (system.status === "Playing") {
      setEndingSessionSystem(system);
      return;
    }

    // SYSTEM IS AVAILABLE → OPEN START SESSION MODAL
    setSessionSystem(system);
  }

  async function confirmStartSession({ players, customer }) {
    if (!sessionSystem) return;

    const latestSystem = systems.find((s) => s.id === sessionSystem.id);

    if (latestSystem?.status === "Playing") {
      alert("This system has already been started from another device.");

      setSessionSystem(null);
      return;
    }

    await updateSystemInFirestore(sessionSystem.id, {
      status: "Playing",
      players,
      customer,
      startedAt: new Date().toISOString(),
    });

    setSessionSystem(null);
  }

  const todayCompletedSessions = todaySessions.length;

  async function confirmEndSession({ minutes, amount }) {
    if (!endingSessionSystem) return;

    try {
      const completedSession = {
        system: endingSessionSystem.id,

        systemName: endingSessionSystem.name,

        players: endingSessionSystem.players,

        customer: endingSessionSystem.customer || "Walk-in",

        startedAt: endingSessionSystem.startedAt,

        endedAt: new Date().toISOString(),

        minutes,

        amount,

        completedDate: new Date().toISOString(),
      };

      // SAVE SESSION TO FIRESTORE
      const docRef = await addDoc(collection(db, "sessions"), completedSession);

      console.log("Session saved successfully to Firestore:", docRef.id);

      // ADD FIRESTORE SESSION TO LOCAL STATE
      setSessions((prev) => [
        {
          id: docRef.id,
          ...completedSession,
        },
        ...prev,
      ]);

      // RESET SYSTEM IN FIRESTORE
      await updateSystemInFirestore(endingSessionSystem.id, {
        status: "Available",
        players: 0,
        customer: "",
        startedAt: "",
      });

      setEndingSessionSystem(null);
    } catch (error) {
      console.error("Error saving completed session:", error);

      alert("Unable to save session. Please try again.");
    }
  }

  async function openImagePicker(game) {
    if (!isAdmin) {
      alert("Admin access required.");
      return;
    }
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
    if (!isAdmin) {
      alert("Admin access required.");
      return;
    }

    if (window.confirm("Remove this game from the library?")) {
      setGames((prev) => prev.filter((game) => game.id !== id));
    }
  }

  async function seedSystemsToFirestore() {
    try {
      for (const system of seedSystems) {
        await setDoc(doc(db, "systems", system.id), system);
      }

      console.log("Systems seeded to Firestore successfully!");
    } catch (error) {
      console.error("Error seeding systems:", error);
    }
  }

  async function updateSystemInFirestore(systemId, updates) {
    try {
      const systemRef = doc(db, "systems", systemId);

      await updateDoc(systemRef, updates);
    } catch (error) {
      console.error("Error updating system:", error);

      alert("Failed to update system. Please try again.");
    }
  }

  async function saveGame(gameData) {
    if (!isAdmin) {
      alert("Admin access required.");
      return;
    }

    // EDIT EXISTING GAME
    if (editingGame) {
      setGames((prev) =>
        prev.map((game) =>
          game.id === editingGame.id
            ? {
                ...game,
                ...gameData,
              }
            : game,
        ),
      );
    } else {
      // ADD NEW GAME

      const newGame = {
        ...gameData,
        id: Date.now(),
        image: "",
      };

      // Automatically try to get game image
      try {
        const image = await fetchGameImage(gameData.title);

        if (image) {
          newGame.image = image;
        }
      } catch (error) {
        console.error("Could not automatically fetch game image:", error);
      }

      setGames((prev) => [newGame, ...prev]);
    }

    setShowGameForm(false);
    setEditingGame(null);
  }

  if (loading || systemsLoading) {
    return <div className="app-loading">Loading Overclock Gaming Cafe...</div>;
  }

  if (showAdminAccess) {
    return <AdminAccess onClose={() => setShowAdminAccess(false)} />;
  }

  return (
    <>
      (
        <div className="app-shell">
          <Sidebar
            page={page}
            setPage={setPage}
            isAdmin={isAdmin}
            user={user}
            onAdminLogin={() => setShowAdminAccess(true)}
            handleLogout={handleLogout}
          />

          <main className="main">
            <Header
              page={page}
              now={now}
              onAdminAccess={() => setShowAdminAccess(true)}
              isAdmin={isAdmin}
              user={user}
              handleLogout={handleLogout}
              onAdminLogin={() => setShowAdminAccess(true)}
            />

            {page === "dashboard" && (
              <Dashboard
                systems={systems}
                games={games}
                active={active}
                available={available}
                revenue={revenue}
                todayRevenue={todayRevenue}
                todayCompletedSessions={todayCompletedSessions}
                setPage={setPage}
                startStop={startStopSession}
                setEditingSystem={setEditingSystem}
                isAdmin={isAdmin}
              />
            )}

            {page === "systems" && (
              <Systems
                systems={systems}
                games={games}
                startStop={startStopSession}
                setEditingSystem={setEditingSystem}
                isAdmin={isAdmin}
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
                isAdmin={isAdmin}
                add={() => {
                  if (!isAdmin) return;

                  setEditingGame(null);
                  setShowGameForm(true);
                }}
                edit={(game) => {
                  if (!isAdmin) return;

                  setEditingGame(game);
                  setShowGameForm(true);
                }}
                del={(id) => {
                  if (!isAdmin) return;

                  deleteGame(id);
                }}
                changeImage={(game) => {
                  if (!isAdmin) return;

                  openImagePicker(game);
                }}
              />
            )}

            {page === "sessions" && isAdmin && (
              <Sessions sessions={sessions} revenue={revenue} />
            )}

            {page === "pricing" && isAdmin && <Pricing />}
          </main>
          <SessionModal
            system={sessionSystem}
            onConfirm={confirmStartSession}
            onClose={() => setSessionSystem(null)}
          />
          <StopSessionModal
            system={endingSessionSystem}
            onConfirm={confirmEndSession}
            onClose={() => setEndingSessionSystem(null)}
          />
          <ImagePicker
            game={imagePickerGame}
            options={imageOptions}
            loading={imageSearchLoading}
            onSelect={selectGameImage}
            onClose={() => setImagePickerGame(null)}
          />
          {showGameForm && isAdmin && (
            <GameForm
              game={editingGame}
              systems={systems}
              onSave={saveGame}
              onClose={() => {
                setShowGameForm(false);
                setEditingGame(null);
              }}
            />
          )}
        </div>
      )
    </>
  );
}
