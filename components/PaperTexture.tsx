import React from "react";
import Svg, {
  Defs,
  FeColorMatrix,
  FeTurbulence,
  Filter,
  Rect,
} from "react-native-svg";

/**
 * Genera “grain” tipo papel sin imágenes.
 * - baseFrequency controla tamaño del grano
 * - opacity controla intensidad
 */
export default function PaperTexture({
  borderRadius = 12,
  opacity = 0.18,
}: {
  borderRadius?: number;
  opacity?: number;
}) {
  return (
    <Svg
      pointerEvents="none"
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <Defs>
        <Filter id="noise">
          <FeTurbulence
            type="fractalNoise"
            baseFrequency="0.9" // 0.6–1.2 = grano fino
            numOctaves="2"
            seed="3"
          />
          {/* Ajusta contraste del ruido */}
          <FeColorMatrix
            type="matrix"
            values={`
              0 0 0 0 0
              0 0 0 0 0
              0 0 0 0 0
              0 0 0 0 ${opacity}
            `}
          />
        </Filter>
      </Defs>

      {/* capa de ruido */}
      <Rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        rx={borderRadius}
        ry={borderRadius}
        filter="url(#noise)"
        fill="#000"
      />
    </Svg>
  );
}
