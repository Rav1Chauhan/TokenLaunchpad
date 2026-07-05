import "./AnimatedButton.css";

export default function AnimatedButton({
  text = "Bitcoin",
  color = "#f1643f",
  icon,
  onClick,
  type = "button",
}) {
  return (
    <button
      type={type}
      className="button"
      style={{ "--clr": color }}
      onClick={onClick}
    >
      <span className="button-decor" />

      <div className="button-content">
        <div className="button__icon">
          {icon || (
            <svg
              width="24"
              height="24"
              viewBox="0 0 397.7 311.7"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="solana-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#9945FF" />
                  <stop offset="50%" stopColor="#14F195" />
                  <stop offset="100%" stopColor="#00FFA3" />
                </linearGradient>
              </defs>

              <path
                fill="url(#solana-gradient)"
                d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h314.7c5.8 0 8.7 7 4.6 11.1l-62.2 62.2c-2.4 2.4-5.7 3.8-9.2 3.8H7c-5.8 0-8.7-7-4.6-11.1l62.2-62.2z"
              />

              <path
                fill="url(#solana-gradient)"
                d="M64.6 2.4C67 0 70.3-1.4 73.8-1.4h314.7c5.8 0 8.7 7 4.6 11.1l-62.2 62.2c-2.4 2.4-5.7 3.8-9.2 3.8H7c-5.8 0-8.7-7-4.6-11.1L64.6 2.4z"
              />

              <path
                fill="url(#solana-gradient)"
                d="M330.9 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H7c-5.8 0-8.7 7-4.6 11.1l62.2 62.2c2.4 2.4 5.7 3.8 9.2 3.8h314.7c5.8 0 8.7-7 4.6-11.1l-62.2-62.2z"
              />
            </svg>
          )}
        </div>

        <span className="button__text">{text}</span>
      </div>
    </button>
  );
}
