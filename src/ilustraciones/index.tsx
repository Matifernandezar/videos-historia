// Registro de ilustraciones. Para sumar una nueva:
// 1) dibujala en un archivo de esta carpeta usando <Lienzo> (viewBox 200×200, mismo estilo plano),
// 2) agregala a REGISTRO con un nombre en minúsculas-con-guiones,
// 3) describila en catalogo.json (lo usa el guion y la verificación).
import React from "react";
import { COLOR } from "../marca/tema";
import { FUENTE_TEXTO } from "../marca/fuentes";
import { Gaseosa, Gota, TazaCafe, VasoAgua } from "./bebidas";
import { Azucar, Huevo, Manzana, Palta, Pan, PlatoSaludable, Salero } from "./alimentos";
import { Cerebro, Corazon, Estomago, Intestino, Pesa } from "./cuerpo";
import { Balanza, Check, Cruz, Interrogacion, Llama, Lupa, Luna, Pastilla, Reloj } from "./objetos";
import { Kefir, Leche, Microbios } from "./fermentados";
import { Monedas, SaldoBaja, Tragamonedas } from "./juego";
import { Copa, RecuerdosIslas, RecuerdosVacio } from "./memoria";
import type { PropsIlustracion } from "./comun";

export const REGISTRO: Record<string, React.FC<PropsIlustracion>> = {
  "vaso-agua": VasoAgua,
  gota: Gota,
  "taza-cafe": TazaCafe,
  gaseosa: Gaseosa,
  manzana: Manzana,
  "plato-saludable": PlatoSaludable,
  pan: Pan,
  azucar: Azucar,
  huevo: Huevo,
  palta: Palta,
  salero: Salero,
  cerebro: Cerebro,
  estomago: Estomago,
  intestino: Intestino,
  corazon: Corazon,
  pesa: Pesa,
  reloj: Reloj,
  lupa: Lupa,
  balanza: Balanza,
  pastilla: Pastilla,
  luna: Luna,
  llama: Llama,
  check: Check,
  cruz: Cruz,
  interrogacion: Interrogacion,
  kefir: Kefir,
  leche: Leche,
  microbios: Microbios,
  tragamonedas: Tragamonedas,
  monedas: Monedas,
  "saldo-baja": SaldoBaja,
  copa: Copa,
  "recuerdos-islas": RecuerdosIslas,
  "recuerdos-vacio": RecuerdosVacio,
};

// Si falta una ilustración se ve un marcador evidente (para detectarlo en la revisión).
export const Ilustracion: React.FC<{ nombre: string; tamano?: number }> = ({ nombre, tamano = 300 }) => {
  const C = REGISTRO[nombre];
  if (C) return <C tamano={tamano} />;
  return (
    <div
      style={{
        width: tamano,
        height: tamano,
        borderRadius: "50%",
        border: `6px dashed ${COLOR.coral}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: COLOR.coral,
        fontFamily: FUENTE_TEXTO,
        fontWeight: 700,
        fontSize: tamano * 0.11,
        padding: 20,
      }}
    >
      falta: {nombre}
    </div>
  );
};
