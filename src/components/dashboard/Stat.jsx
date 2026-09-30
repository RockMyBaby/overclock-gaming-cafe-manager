import Icon from "../common/Icon";

export default function Stat({
  icon,
  label,
  value,
  note,
  tone = "neutral",
  meter,
}) {
  return (
    <div className={`stat stat-${tone}`}>
      <div className="stat-head">
        <span>{label}</span>

        <div className="stat-icon">
          <Icon name={icon} />
        </div>
      </div>

      <strong>{value}</strong>
      <small>{note}</small>

      {meter}
    </div>
  );
}
