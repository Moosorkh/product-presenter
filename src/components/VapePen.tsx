import { useId } from "react";

type VapePenProps = {
  color: string;
  accent: string;
  name: string;
  className?: string;
};

function idFor(name: string, suffix: string, instance: string) {
  return `pen-${suffix}-${name.replace(/\s+/g, "-").toLowerCase()}-${instance}`;
}

export default function VapePen({ color, accent, name, className }: VapePenProps) {
  const instanceId = useId().replace(/:/g, "");
  const bodyId = idFor(name, "body", instanceId);
  const goldId = idFor(name, "gold", instanceId);
  const sheenId = idFor(name, "sheen", instanceId);
  const capSheenId = idFor(name, "cap-sheen", instanceId);
  const shadowId = idFor(name, "shadow", instanceId);
  const labelClipId = idFor(name, "label-clip", instanceId);
  const filterId = idFor(name, "filter", instanceId);
  const words = name.toUpperCase().split(/\s+/);
  const splitAt =
    words.length > 2
      ? words.reduce(
          (best, _, index) => {
            if (index === 0) return best;
            const left = words.slice(0, index).join(" ").length;
            const right = words.slice(index).join(" ").length;
            return Math.abs(left - right) < best.difference
              ? { index, difference: Math.abs(left - right) }
              : best;
          },
          { index: 1, difference: Number.POSITIVE_INFINITY }
        ).index
      : words.length;
  const labelLines =
    words.join(" ").length <= 13
      ? [words.join(" ")]
      : [words.slice(0, splitAt).join(" "), words.slice(splitAt).join(" ")];

  return (
    <svg
      viewBox="0 0 160 540"
      className={className}
      role="img"
      aria-label={`${name} vape pen`}
    >
      <defs>
        <linearGradient id={bodyId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
          <stop offset="10%" stopColor="#000000" stopOpacity="0.15" />
          <stop offset="22%" stopColor="#ffffff" stopOpacity="0.35" />
          {[34, 50, 66].map((offset) => (
            <stop
              key={offset}
              offset={`${offset}%`}
              stopColor={color}
              style={{
                transition:
                  "stop-color 650ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />
          ))}
          <stop offset="80%" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="92%" stopColor="#000000" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.6" />
        </linearGradient>

        {/* soft vertical sheen overlay for a glossy cylinder feel */}
        <linearGradient id={sheenId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="12%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
        </linearGradient>

        <linearGradient id={goldId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5f4620" />
          <stop offset="12%" stopColor="#a37b3d" />
          <stop offset="28%" stopColor="#f6e0a5" />
          <stop offset="45%" stopColor="#e3bd72" />
          <stop offset="55%" stopColor="#cba05a" />
          <stop offset="72%" stopColor="#f6e0a5" />
          <stop offset="88%" stopColor="#a37b3d" />
          <stop offset="100%" stopColor="#5f4620" />
        </linearGradient>

        <linearGradient id={capSheenId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="30%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
        </linearGradient>

        <radialGradient id={shadowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        <filter id={filterId} x="-50%" y="-10%" width="200%" height="130%">
          <feDropShadow dx="0" dy="14" stdDeviation="12" floodOpacity="0.35" />
        </filter>
        <clipPath id={labelClipId}>
          <rect x="46" y="218" width="68" height="88" rx="10" />
        </clipPath>
      </defs>

      {/* ground contact shadow */}
      <ellipse cx="80" cy="518" rx="42" ry="10" fill={`url(#${shadowId})`} />

      <g filter={`url(#${filterId})`}>
        {/* mouthpiece */}
        <path d="M 68 4 L 92 4 L 84 44 L 76 44 Z" fill={`url(#${goldId})`} />
        <path d="M 68 4 L 92 4 L 89 14 L 71 14 Z" fill={`url(#${capSheenId})`} opacity="0.8" />

        {/* upper collar */}
        <rect x="47" y="42" width="66" height="17" rx="7" fill={`url(#${goldId})`} />
        <rect x="47" y="42" width="66" height="5" rx="2.5" fill="#000000" opacity="0.2" />

        {/* body */}
        <path
          d="M62 57H98C111 57 120 70 120 84V398C120 410 111 418 99 418H61C49 418 40 410 40 398V84C40 70 49 57 62 57Z"
          fill={`url(#${bodyId})`}
        />
        <path
          d="M62 57H98C111 57 120 70 120 84V398C120 410 111 418 99 418H61C49 418 40 410 40 398V84C40 70 49 57 62 57Z"
          fill={`url(#${sheenId})`}
        />
        <path
          d="M62 57H98C111 57 120 70 120 84V398C120 410 111 418 99 418H61C49 418 40 410 40 398V84C40 70 49 57 62 57Z"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.08"
        />

        {/* label plate — glossy sticker look */}
        <rect x="46" y="218" width="68" height="88" rx="10" fill="#0a0a0a" opacity="0.66" />
        <rect
          x="46"
          y="218"
          width="68"
          height="88"
          rx="10"
          fill="none"
          stroke={accent}
          strokeOpacity="0.75"
          strokeWidth="1.7"
          style={{
            transition: "stroke 650ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
        <path
          d="M48 222H112V234L48 250Z"
          fill="#ffffff"
          opacity="0.06"
        />
        <text
          x="80"
          y="250"
          textAnchor="middle"
          fontSize="10.5"
          fontWeight="800"
          letterSpacing="2"
          fill={accent}
          fontFamily="var(--font-geist-sans), sans-serif"
          style={{
            transition: "fill 650ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          DIME
        </text>
        <g clipPath={`url(#${labelClipId})`}>
          {labelLines.map((line, index) => (
          <text
            key={line}
            x="80"
            y={labelLines.length === 1 ? 272 : 268 + index * 12}
            textAnchor="middle"
            fontSize="6.2"
            fontWeight="700"
            letterSpacing="0.35"
            fill="#f3ede1"
            fontFamily="var(--font-geist-sans), sans-serif"
          >
            {line}
          </text>
          ))}
        </g>

        {/* lower collar */}
        <rect x="47" y="412" width="66" height="15" rx="6" fill={`url(#${goldId})`} />
        <rect x="47" y="422" width="66" height="5" rx="2.5" fill="#000000" opacity="0.2" />

        {/* battery base */}
        <rect x="44" y="427" width="72" height="85" rx="16" fill="#131313" />
        <rect x="44" y="427" width="72" height="85" rx="16" fill="none" stroke="#343434" strokeWidth="1" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x="56" y={444 + i * 9} width="48" height="2" rx="1" fill="#000000" opacity="0.45" />
        ))}
        <circle cx="80" cy="490" r="10" fill={`url(#${goldId})`} />
        <circle cx="80" cy="490" r="10" fill="none" stroke="#5f4620" strokeWidth="1" opacity="0.6" />
        <circle cx="77" cy="487" r="3" fill="#ffffff" opacity="0.5" />

        {/* highlight streak */}
        <rect x="51" y="72" width="8" height="326" rx="4" fill="#ffffff" opacity="0.16" />
        <rect x="102" y="72" width="5" height="326" rx="2.5" fill="#000000" opacity="0.12" />
      </g>
    </svg>
  );
}
