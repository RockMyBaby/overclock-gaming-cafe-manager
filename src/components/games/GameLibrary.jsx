import Badge from "../common/Badge";

export default function GameLibrary({
  games,
  allGames,
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
            Search, add, edit ownership and instantly see
            which console has each game installed.
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
          onChange={(e) =>
            setPlatformFilter(e.target.value)
          }
        >
          <option>All</option>
          <option>PS5</option>
          <option>PS4</option>
        </select>

        <select
          value={ownershipFilter}
          onChange={(e) =>
            setOwnershipFilter(e.target.value)
          }
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
          {
            allGames.filter(
              (game) => game.ownership === "Owned",
            ).length
          }{" "}
          owned
        </span>

        •{" "}

        <span>
          {
            allGames.filter(
              (game) =>
                game.ownership === "Not Owned",
            ).length
          }{" "}
          marked Not Owned
        </span>
      </div>

      <div className="game-grid">
        {games.map((game) => (
          <article
            key={game.id}
            className={`game-card ${
              game.ownership === "Not Owned"
                ? "not-owned"
                : ""
            }`}
          >
            <div className="game-cover">
              {game.image ? (
                <img
                  src={game.image}
                  alt={game.title}
                  loading="lazy"
                />
              ) : (
                <>
                  <span>
                    {game.platform.includes("PS5")
                      ? "PS5"
                      : "PS4"}
                  </span>

                  <strong>
                    {game.title
                      .split(" ")
                      .slice(0, 2)
                      .join(" ")}
                  </strong>
                </>
              )}
            </div>

            <div className="game-body">
              <h3>{game.title}</h3>

              <p>
                {game.genre} • {game.platform}
              </p>

              <div className="badges">
                <Badge value={game.ownership} />
                <Badge value={game.source} />
              </div>

              <div className="installed-on">
                {game.installedOn?.length > 0 ? (
                  <div>
                    <span className="installed-label">
                      🎮 Installed on:
                    </span>

                    <div className="system-tags">
                      {game.installedOn.map((system) => (
                        <span
                          key={system}
                          className="system-tag"
                        >
                          {system}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <span>
                    ○ Not installed on any system
                  </span>
                )}
              </div>

              <div className="game-actions">
                <button onClick={() => edit(game)}>
                  Edit
                </button>

                <button
                  className="change-image"
                  onClick={() =>
                    changeImage(game)
                  }
                >
                  🖼 Change Image
                </button>

                <button
                  className="delete"
                  onClick={() => del(game.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {games.length === 0 && (
        <div className="empty">
          No games found. Try another search or add a new
          game.
        </div>
      )}
    </section>
  );
}