import React from "react";
import { AbsoluteFill } from "remotion";
import { Fondo } from "../componentes/Fondo";
import { TextoDestacado } from "../componentes/TextoDestacado";
import { Insignia } from "../componentes/Insignia";
import { Etiqueta } from "../componentes/Etiqueta";
import { Aparecer } from "../componentes/Aparecer";
import { COLOR } from "../marca/tema";
import { FUENTE_TEXTO } from "../marca/fuentes";
import canal from "../../config/canal.json";
import type { EscenaCierre } from "../video/tipos";
import { useDisposicion } from "./disposicion";
import { PersonajeColocado } from "./PersonajeColocado";

// CIERRE: conclusión en una frase, llamado a la acción y aviso opcional del canal (config/canal.json → aviso).
export const Cierre: React.FC<{ escena: EscenaCierre }> = ({ escena }) => {
  const d = useDisposicion();
  return (
    <AbsoluteFill>
      <Fondo acento="lima" brillo={0.18} />
      <div
        style={{
          position: "absolute",
          left: d.lateral,
          right: d.lateral,
          top: d.titulo.top,
          display: "flex",
          flexDirection: "column",
          alignItems: d.vertical ? "center" : "flex-start",
          gap: 30 * d.k,
        }}
      >
        <TextoDestacado texto={escena.texto} tamano={d.tamTitulo * 0.92} acento="lima" alineacion={d.titulo.alineacion} anchoMax={d.titulo.anchoMax} />
        <Aparecer desde={14} tipo="pop">
          <Insignia tamano={36 * d.k} conUsuario />
        </Aparecer>
        {escena.cta ? (
          <Aparecer desde={22} tipo="subir">
            <Etiqueta texto={escena.cta} acento="lima" solida tamano={44 * d.k} />
          </Aparecer>
        ) : null}
        {escena.mostrarAviso !== false && canal.aviso ? (
          <Aparecer desde={28} tipo="fundido">
            <div style={{ fontFamily: FUENTE_TEXTO, fontWeight: 600, fontSize: 32 * d.k, color: COLOR.tintaSuave, textAlign: "center", maxWidth: d.titulo.anchoMax, lineHeight: 1.25 }}>
              {canal.aviso}
            </div>
          </Aparecer>
        ) : null}
      </div>
      <PersonajeColocado conf={escena.personaje} defecto={{ pose: "pulgar", expresion: "feliz", lado: "centro" }} />
    </AbsoluteFill>
  );
};
