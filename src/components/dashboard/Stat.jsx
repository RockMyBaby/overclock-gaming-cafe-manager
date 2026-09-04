export default function Stat({
  icon,
  label,
  value,
  note,
}) {
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