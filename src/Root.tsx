import React from "react";
import { Composition, Folder } from "remotion";
import "./marca/fuentes";
import { VideoCanal, calcularMetadatos } from "./video/VideoCanal";
import { PruebaRender } from "./pruebas/PruebaRender";
import { HojaDePoses } from "./personajes/HojaDePoses";
import { CatalogoIlustraciones } from "./ilustraciones/CatalogoIlustraciones";
import { VIDEO_DEMO } from "./demo/videoDemo";
import { HojaPersonajes as HojaJesus } from "./especiales/jesus-12-30/HojaPersonajes";
import { PortadaJesus1230 } from "./especiales/jesus-12-30/Portada";
import { HojaPoses as PosesJesus } from "./especiales/jesus-12-30/HojaPoses";
import { HojaPosesAmen } from "./especiales/amen/HojaPoses";
import { PortadaAmen } from "./especiales/amen/Portada";
import { HojaPosesMisa } from "./especiales/misa/HojaPoses";
import { PortadaMisa } from "./especiales/misa/Portada";
import { HojaPosesRosario } from "./especiales/rosario/HojaPoses";
import { PortadaRosario } from "./especiales/rosario/Portada";
import { PortadaFatima } from "./especiales/fatima/Portada";
import { PortadaSenaquerib } from "./especiales/senaquerib/Portada";
import { PortadaCizana } from "./especiales/cizana/Portada";
import { PortadaPosturas } from "./especiales/posturas/Portada";
import { PortadaManila } from "./especiales/manila/Portada";
import { PortadaRegreso } from "./especiales/regreso/Portada";
import { PortadaPedro } from "./especiales/pedro/Portada";
import { HojaV2 } from "./especiales/referencia/HojaV2";

// VideoCanal recibe cada video con --props=producciones/<carpeta>/.build/props.json
// (lo hacen los scripts `npm run studio` y `npm run render`). Sin props muestra la demo.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VideoCanal"
        component={VideoCanal}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={1650}
        defaultProps={VIDEO_DEMO}
        calculateMetadata={calcularMetadatos}
      />
      <Composition id="PruebaRender" component={PruebaRender} width={1080} height={1920} fps={30} durationInFrames={90} />
      <Folder name="Portadas">
        <Composition id="Portada-san-pedro-boca-abajo" component={PortadaPedro} width={1080} height={1920} fps={30} durationInFrames={1} />
        <Composition id="Portada-regreso-de-jesus" component={PortadaRegreso} width={1080} height={1920} fps={30} durationInFrames={1} />
        <Composition id="Portada-misa-mas-grande-manila" component={PortadaManila} width={1080} height={1920} fps={30} durationInFrames={1} />
        <Composition id="Portada-posturas-en-misa" component={PortadaPosturas} width={1080} height={1920} fps={30} durationInFrames={1} />
        <Composition id="Portada-trigo-y-cizana" component={PortadaCizana} width={1080} height={1920} fps={30} durationInFrames={1} />
        <Composition id="Portada-senaquerib-185000" component={PortadaSenaquerib} width={1080} height={1920} fps={30} durationInFrames={1} />
        <Composition id="Portada-bala-corona-fatima" component={PortadaFatima} width={1080} height={1920} fps={30} durationInFrames={1} />
        <Composition id="Portada-rosario-lepanto" component={PortadaRosario} width={1080} height={1920} fps={30} durationInFrames={1} />
        <Composition id="Portada-biblia-en-misa" component={PortadaMisa} width={1080} height={1920} fps={30} durationInFrames={1} />
        <Composition id="Portada-amen" component={PortadaAmen} width={1080} height={1920} fps={30} durationInFrames={1} />
        <Composition id="Portada-jesus-12-a-30" component={PortadaJesus1230} width={1080} height={1920} fps={30} durationInFrames={1} />
      </Folder>
      <Folder name="Referencias">
        <Composition id="Personajes-V2" component={HojaV2} width={1080} height={1920} fps={30} durationInFrames={60} />
        <Composition id="Lupe-Poses" component={HojaDePoses} width={1080} height={1920} fps={30} durationInFrames={120} />
        <Composition id="Rosario-Poses" component={HojaPosesRosario} width={1080} height={1920} fps={30} durationInFrames={60} />
        <Composition id="Misa-Poses" component={HojaPosesMisa} width={1080} height={1920} fps={30} durationInFrames={60} />
        <Composition id="Amen-Poses" component={HojaPosesAmen} width={1080} height={1920} fps={30} durationInFrames={60} />
        <Composition id="Jesus1230-Poses" component={PosesJesus} width={1080} height={1920} fps={30} durationInFrames={60} />
        <Composition id="Jesus1230-Personajes" component={HojaJesus} width={1080} height={1920} fps={30} durationInFrames={60} />
        <Composition id="Catalogo-Ilustraciones" component={CatalogoIlustraciones} width={1080} height={1920} fps={30} durationInFrames={120} />
      </Folder>
    </>
  );
};
