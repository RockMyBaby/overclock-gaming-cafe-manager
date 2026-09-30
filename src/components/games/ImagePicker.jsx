export default function ImagePicker({
  game,
  options,
  loading,
  onSelect,
  onClose,
}) {
  if (!game) return null;

  return (
    <div
      className="modal-backdrop"
      onMouseDown={onClose}
    >
      <div
        className="modal image-picker-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="image-picker-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <div>
            <h2 id="image-picker-title">Choose Game Image</h2>
            <p>{game.title}</p>
          </div>

          <button type="button" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>

        {loading ? (
          <div className="image-loading">
            🔎 Searching for game artwork...
          </div>
        ) : options.length > 0 ? (
          <div className="image-options">
            {options.map((option) => (
              <button
                type="button"
                key={option.id}
                className="image-option"
                onClick={() =>
                  onSelect(option.image)
                }
              >
                <img
                  src={option.image}
                  alt={option.title}
                />

                <span>{option.title}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="image-loading">
            No alternative images found.
          </div>
        )}
      </div>
    </div>
  );
}