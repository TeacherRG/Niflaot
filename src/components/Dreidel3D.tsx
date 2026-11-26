import './dreidel3d.css';

export type DreidelFace = 'נ' | 'ג' | 'ה' | 'ש';

type Dreidel3DProps = {
  /** The face selected by the server. */
  face?: DreidelFace;
  /** The parent owns the game state and toggles this to start the animation. */
  spinning?: boolean;
  onSpinEnd?: () => void;
  className?: string;
};

/** Lightweight CSS/SVG dreidel: no canvas, WebGL, textures or 3D dependency. */
export function Dreidel3D({ face, spinning = false, onSpinEnd, className = '' }: Dreidel3DProps) {
  return (
    <div className={'dreidel3d-stage ' + className} aria-label="Вращающийся дрейдл">
      <div className={'dreidel3d-shadow' + (spinning ? ' is-spinning' : '')} />
      <svg
        className={'dreidel3d-object' + (spinning ? ' is-spinning' : '')}
        viewBox="0 0 320 410"
        role="img"
        aria-label={face ? 'Дрейдл, выпала буква ' + face : 'Объёмный дрейдл с четырьмя гранями'}
        onAnimationEnd={(event) => {
          if (event.currentTarget === event.target) onSpinEnd?.();
        }}
      >
        <defs>
          <linearGradient id="dreidel-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FFF0B6" />
            <stop offset=".28" stopColor="#DDBB68" />
            <stop offset=".58" stopColor="#A9782D" />
            <stop offset=".82" stopColor="#F2D88D" />
            <stop offset="1" stopColor="#8A5A1E" />
          </linearGradient>
          <linearGradient id="dreidel-blue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#4269B0" />
            <stop offset=".45" stopColor="#142D61" />
            <stop offset="1" stopColor="#071735" />
          </linearGradient>
          <linearGradient id="dreidel-blue-light" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#6F91D1" />
            <stop offset=".5" stopColor="#294B89" />
            <stop offset="1" stopColor="#0C2049" />
          </linearGradient>
          <linearGradient id="dreidel-blue-dark" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0A1B3D" />
            <stop offset="1" stopColor="#27477E" />
          </linearGradient>
          <radialGradient id="dreidel-glow" cx=".35" cy=".18" r=".8">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity=".48" />
            <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Gold handle and collar */}
        <ellipse cx="160" cy="55" rx="23" ry="9" fill="#8C642B" opacity=".55" />
        <path d="M147 20 Q160 8 173 20 L170 69 Q160 80 150 69Z" fill="url(#dreidel-gold)" stroke="#8D6428" strokeWidth="2" />
        <ellipse cx="160" cy="21" rx="13" ry="7" fill="#FFF0B8" stroke="#A9782D" strokeWidth="2" />
        <path d="M149 65 Q160 73 171 65 L181 91 Q160 105 139 91Z" fill="url(#dreidel-gold)" stroke="#8D6428" strokeWidth="2" />
        <ellipse cx="160" cy="91" rx="27" ry="10" fill="#E8C779" stroke="#8D6428" strokeWidth="2" />
        {/* Six faceted sides */}
        <path d="M160 96 L270 143 L270 258 L160 310Z" fill="url(#dreidel-blue-dark)" stroke="#D6B66A" strokeWidth="3" />
        <path d="M270 143 L305 122 L305 236 L270 258Z" fill="#091A39" stroke="#A77A36" strokeWidth="2" />
        <path d="M305 122 L270 143 L160 96 L194 76Z" fill="#27477D" stroke="#D6B66A" strokeWidth="2" />
        <path d="M160 96 L194 76 L84 123 L50 143Z" fill="#4569A8" stroke="#D6B66A" strokeWidth="2" />
        <path d="M50 143 L160 96 L160 310 L50 258Z" fill="url(#dreidel-blue-light)" stroke="#D6B66A" strokeWidth="3" />
        <path d="M50 143 L15 122 L15 236 L50 258Z" fill="#10264D" stroke="#A77A36" strokeWidth="2" />
        <path d="M15 122 L50 143 L160 96 L126 76Z" fill="#34558F" stroke="#D6B66A" strokeWidth="2" />
        {/* Tapered lower point */}
        <path d="M50 258 L160 310 L270 258 L160 379Z" fill="url(#dreidel-blue)" stroke="#D6B66A" strokeWidth="3" />
        <path d="M50 258 L160 310 L160 379Z" fill="#5277B8" opacity=".55" />
        <path d="M270 258 L160 310 L160 379Z" fill="#06142E" opacity=".7" />
        <path d="M160 310 L160 379" stroke="#E9CC83" strokeWidth="2" opacity=".7" />
        {/* Hebrew letters */}
        <g fill="#F8E7B0" stroke="#8A642B" strokeWidth="1.4" paintOrder="stroke" fontFamily="Frank Ruhl Libre, serif" fontSize="68" fontWeight="700" textAnchor="middle">
          <text x="105" y="226">נ</text>
          <text x="216" y="226">ג</text>
          <text x="160" y="286" fontSize="42">ה</text>
          <text x="160" y="139" fontSize="35">ש</text>
        </g>
        <path d="M62 153 Q95 130 136 113" fill="none" stroke="#FFFFFF" strokeWidth="5" opacity=".2" strokeLinecap="round" />
        <path d="M181 112 Q225 129 257 148" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity=".16" strokeLinecap="round" />
        <path d="M64 250 L158 294 L255 250" fill="none" stroke="#F6D98E" strokeWidth="2" opacity=".42" />
        <ellipse cx="160" cy="202" rx="118" ry="122" fill="url(#dreidel-glow)" pointerEvents="none" />
      </svg>
      <span className="dreidel3d-base" aria-hidden="true" />
    </div>
  );
}
