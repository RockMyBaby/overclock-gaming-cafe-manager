import { useEffect, useState } from "react";
import "./GameForm.css";

export default function GameForm({ game, systems, onSave, onClose }) {
  const [form, setForm] = useState({
    title: "",
    genre: "",
    platform: "PS4 PS5",
    ownership: "Owned",
    source: "Purchased",
    installedOn: [],
  });

  useEffect(() => {
    if (game) {
      setForm({
        title: game.title || "",
        genre: game.genre || "",
        platform: game.platform || "PS5",
        ownership: game.ownership || "Owned",
        source: game.source || "Purchased",
        installedOn: game.installedOn || [],
      });
    }
  }, [game]);

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function toggleSystem(systemId) {
    setForm((prev) => ({
      ...prev,
      installedOn: prev.installedOn.includes(systemId)
        ? prev.installedOn.filter((id) => id !== systemId)
        : [...prev.installedOn, systemId],
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Please enter a game title.");
      return;
    }

    onSave({
      ...game,
      ...form,
      title: form.title.trim(),
    });
  }

  return (
    <div className="game-form-overlay">
      <div className="game-form-modal">
        <div className="game-form-header">
          <div>
            <p className="eyebrow">GAME MANAGEMENT</p>

            <h2>{game ? "Edit Game" : "Add New Game"}</h2>
          </div>

          <button type="button" className="game-form-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>GAME TITLE *</label>

            <input
              type="text"
              value={form.title}
              placeholder="e.g. GTA V"
              onChange={(e) => updateField("title", e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>GENRE</label>

            <input
              type="text"
              value={form.genre}
              placeholder="e.g. Action, Racing, Sports"
              onChange={(e) => updateField("genre", e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>PLATFORM</label>

              <select
                value={form.platform}
                onChange={(e) => {
                  const newPlatform = e.target.value;

                  setForm((prev) => ({
                    ...prev,
                    platform: newPlatform,

                    // Remove systems incompatible with selected platform
                    installedOn: prev.installedOn.filter((systemId) => {
                      const system = systems.find(
                        (item) => item.id === systemId,
                      );

                      return system && newPlatform.includes(system.type);
                    }),
                  }));
                }}
              >
                <option value="PS5">PS5</option>
                <option value="PS4">PS4</option>
                <option value="PS4 PS5">PS4 + PS5</option>
              </select>
            </div>

            <div className="form-group">
              <label>OWNERSHIP</label>

              <select
                value={form.ownership}
                onChange={(e) => updateField("ownership", e.target.value)}
              >
                <option value="Owned">Owned</option>
                <option value="Not Owned">Not Owned</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>GAME SOURCE</label>

            <select
              value={form.source}
              onChange={(e) => updateField("source", e.target.value)}
            >
              <option value="Purchased">Purchased</option>

              <option value="PS Plus Catalog">PS Plus Catalog</option>

              <option value="Disc">Disc</option>
            </select>
          </div>

          <div className="form-group">
            <label>INSTALLED ON SYSTEMS</label>

            <div className="system-checkboxes">
              {systems
                .filter((system) => {
                  const systemPlatform = system.type;

                  return form.platform.includes(systemPlatform);
                })
                .map((system) => (
                  <label key={system.id} className="system-checkbox">
                    <input
                      type="checkbox"
                      checked={form.installedOn.includes(system.id)}
                      onChange={() => toggleSystem(system.id)}
                    />

                    <span>{system.name}</span>
                  </label>
                ))}
            </div>
          </div>

          <div className="game-form-actions">
            <button type="button" className="secondary" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="primary">
              {game ? "Save Changes" : "Add Game"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
