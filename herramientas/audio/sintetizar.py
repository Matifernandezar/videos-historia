"""Música instrumental y efectos de sonido ORIGINALES, sintetizados desde cero (sin muestras de terceros).
Uso:  python3 herramientas/audio/sintetizar.py <carpeta-recursos> [--duracion 110]
Escribe <carpeta>/musica.wav y <carpeta>/sfx/*.wav. Todo el audio es propio del canal (libre de derechos).
"""
import sys, os, wave, math
import numpy as np

SR = 44100
rng = np.random.default_rng(7)

def guardar(ruta, x, estereo=False):
    x = np.asarray(x, dtype=np.float64)
    pico = np.max(np.abs(x)) or 1.0
    x = x / pico * 0.89
    if estereo and x.ndim == 1:
        x = np.stack([x, x], axis=1)
    datos = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    with wave.open(ruta, "wb") as w:
        w.setnchannels(2 if datos.ndim == 2 else 1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(datos.tobytes())

def lp(x, fc):  # paso bajo de un polo
    a = math.exp(-2 * math.pi * fc / SR)
    y = np.empty_like(x); s = 0.0
    for i, v in enumerate(x):
        s = (1 - a) * v + a * s; y[i] = s
    return y

def hp(x, fc):
    return x - lp(x, fc)

def env(n, ataque, caida):
    t = np.arange(n) / SR
    e = np.minimum(1.0, t / max(ataque, 1e-4)) * np.exp(-t / max(caida, 1e-4))
    return e

def ruido(seg):
    return rng.standard_normal(int(SR * seg))

def comb(x, retardo_s, g):
    d = int(retardo_s * SR); y = x.copy()
    for i in range(d, len(y), d):
        fin = min(i + d, len(y))
        y[i:fin] += g * y[i - d:fin - d]
    return y

def reverb(x, mezcla=0.3):
    h = sum(comb(x, r, 0.72) for r in (0.0297, 0.0371, 0.0411, 0.0437)) / 4
    h = lp(h, 5000) if len(h) < SR * 3 else h
    return x * (1 - mezcla) + h * mezcla

# ---------------- efectos ----------------
def sfx_paso():
    n = ruido(0.16); x = lp(hp(n, 120), 900) * env(len(n), 0.004, 0.035)
    return x

def sfx_pagina():
    n = ruido(0.55); t = np.arange(len(n)) / SR
    sweep = np.sin(np.pi * np.minimum(1, t / 0.5)) ** 2
    x = hp(n, 1800) * sweep * 0.6 + lp(n, 2500) * sweep * 0.25
    x += hp(ruido(0.55), 4000) * env(len(n), 0.30, 0.04) * 0.4  # chasquido final
    return x

def sfx_sierra():
    dur = 0.9; n = ruido(dur); t = np.arange(len(n)) / SR
    trazos = 0.5 + 0.5 * np.sin(2 * np.pi * 2.6 * t - np.pi / 2)  # ida y vuelta
    grano = 0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 95 * t))
    x = hp(lp(n, 3800), 700) * trazos * grano
    return x * np.minimum(1, t / 0.05) * np.minimum(1, (dur - t) / 0.08)

def sfx_madera():  # golpe de mazo sobre madera
    n = int(SR * 0.35); t = np.arange(n) / SR
    x = (np.sin(2 * np.pi * 210 * t) * 0.8 + np.sin(2 * np.pi * 470 * t) * 0.4 + np.sin(2 * np.pi * 980 * t) * 0.15) * np.exp(-t / 0.05)
    x += hp(ruido(0.35), 2000) * np.exp(-t / 0.006) * 0.6
    return x

def sfx_cincel():
    n = int(SR * 0.25); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * 1850 * t) * np.exp(-t / 0.03) * 0.5 + hp(ruido(0.25), 3000) * np.exp(-t / 0.012)
    return x

def sfx_marca():  # carbón/punzón que marca la tabla
    n = ruido(0.4); t = np.arange(len(n)) / SR
    return hp(lp(n, 6000), 2500) * np.sin(np.pi * t / 0.4) * (0.7 + 0.3 * np.sin(2 * np.pi * 30 * t))

def sfx_tabla():  # tabla que se apoya
    n = int(SR * 0.4); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * 120 * t) * np.exp(-t / 0.07) + lp(ruido(0.4), 600) * np.exp(-t / 0.03) * 0.8
    return x

def sfx_piedra():
    n = int(SR * 0.45); t = np.arange(n) / SR
    x = lp(ruido(0.45), 400) * np.exp(-t / 0.06) + np.sin(2 * np.pi * 70 * t) * np.exp(-t / 0.09) * 0.7
    return x

def sfx_whoosh():
    n = ruido(0.7); t = np.arange(len(n)) / SR
    x = lp(hp(n, 300), 2200) * np.sin(np.pi * t / 0.7) ** 3
    return x

def sfx_brillo():  # campanitas suaves para la revelación del título
    dur = 2.4; n = int(SR * dur); t = np.arange(n) / SR; x = np.zeros(n)
    for k, f in enumerate([1174.66, 1567.98, 1760.0, 2349.32]):
        d = int(k * 0.11 * SR); tt = t[: n - d]
        x[d:] += (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * f * 2.01 * tt)) * np.exp(-tt / 0.7) * 0.4
    return reverb(x, 0.35)

def sfx_tela():  # roce de túnica / gesto
    n = ruido(0.3); t = np.arange(len(n)) / SR
    return lp(hp(n, 500), 1800) * np.sin(np.pi * t / 0.3) ** 2 * 0.6

def sfx_coro():  # textura coral SIN palabras ("aah"), muy suave, para acompañar el Santo
    dur = 12.0; n = int(SR * dur); t = np.arange(n) / SR; x = np.zeros(n)
    formantes = [(730, 1.0, 90), (1090, 0.5, 110), (2440, 0.25, 160)]  # vocal "a"
    for f0 in (146.83, 220.0, 293.66, 369.99):  # re mayor, voces graves a agudas
        for voz in range(3):
            fv = f0 * (1 + (voz - 1) * 0.004)
            vib = 1 + 0.006 * np.sin(2 * np.pi * (5.0 + voz * 0.3) * t + voz)
            fase = 2 * np.pi * np.cumsum(fv * vib) / SR
            for h in range(1, 28):
                fh = fv * h
                g = sum(a * np.exp(-((fh - fc) ** 2) / (2 * bw ** 2)) for fc, a, bw in formantes) + 0.02 / h
                x += g * np.sin(h * fase) * 0.06
    x *= np.minimum(1, t / 2.5) * np.minimum(1, (dur - t) / 3.0)
    return reverb(x, 0.45)

def sfx_canon():  # cañonazo LEJANO y breve (moderado)
    n = int(SR * 2.2); t = np.arange(n) / SR
    x = lp(ruido(2.2), 300) * np.exp(-t / 0.35) + np.sin(2 * np.pi * 48 * t) * np.exp(-t / 0.25) * 0.8
    return reverb(lp(x, 900), 0.5)

def sfx_mar():  # ambiente marítimo: olas suaves
    dur = 10.0; n = int(SR * dur); t = np.arange(n) / SR
    olas = 0.55 + 0.45 * np.sin(2 * np.pi * 0.18 * t) * np.sin(2 * np.pi * 0.07 * t + 1)
    x = lp(hp(ruido(dur), 120), 1100) * olas
    return x * np.minimum(1, t / 1.5) * np.minimum(1, (dur - t) / 2)

def sfx_remo():  # remo que entra al agua
    n = ruido(0.5); t = np.arange(len(n)) / SR
    return lp(hp(n, 400), 2600) * np.exp(-t / 0.12) * np.minimum(1, t / 0.03)

def sfx_cuenta():  # clic de una cuenta de madera
    n = int(SR * 0.12); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 2300 * t) * np.exp(-t / 0.012) * 0.6 + hp(ruido(0.12), 3000) * np.exp(-t / 0.004)


def sfx_disparo():  # un único disparo LEJANO y breve (sin estridencia), con eco de plaza
    n = int(SR * 1.6); t = np.arange(n) / SR
    x = hp(ruido(1.6), 300) * np.exp(-t / 0.018) + lp(ruido(1.6), 500) * np.exp(-t / 0.09) * 0.6
    return reverb(lp(x, 3500), 0.55)

def sfx_monitor():  # pitido suave de monitor de hospital (3 pulsos)
    n = int(SR * 3.0); t = np.arange(n) / SR; x = np.zeros(n)
    for k in range(3):
        s = int(SR * k * 1.0); m = int(SR * 0.12); tt = np.arange(m) / SR
        x[s:s + m] += np.sin(2 * np.pi * 980 * tt) * np.minimum(1, tt / 0.01) * np.minimum(1, (0.12 - tt) / 0.02)
    return x * 0.5

def sfx_multitud():  # murmullo de multitud, lejano
    dur = 8.0; t = np.arange(int(SR * dur)) / SR
    x = lp(hp(ruido(dur), 200), 1400) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.3 * t))
    return x * np.minimum(1, t / 1.0) * np.minimum(1, (dur - t) / 1.5)


def sfx_viento():  # viento nocturno lejano
    dur = 9.0; t = np.arange(int(SR * dur)) / SR
    x = lp(hp(ruido(dur), 80), 700) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.13 * t) * np.sin(2 * np.pi * 0.05 * t + 1))
    return x * np.minimum(1, t / 1.5) * np.minimum(1, (dur - t) / 2)

def sfx_fuego():  # chisporroteo suave de antorchas
    dur = 8.0; n = int(SR * dur); t = np.arange(n) / SR
    x = lp(ruido(dur), 900) * 0.4
    for k in range(70):
        s = int(rng.uniform(0, dur - 0.05) * SR); m = int(0.012 * SR)
        x[s:s + m] += hp(ruido(0.012), 2000) * np.exp(-np.arange(m) / SR / 0.003) * rng.uniform(0.5, 1.5)
    return x * np.minimum(1, t / 0.8) * np.minimum(1, (dur - t) / 1.5)

def sfx_apagar():  # soplo suave: las antorchas se apagan en silencio
    n = int(SR * 1.6); t = np.arange(n) / SR
    x = lp(hp(ruido(1.6), 300), 2500) * np.sin(np.pi * np.minimum(1, t / 1.6)) ** 2
    return reverb(x, 0.4)

def sfx_tension():  # nota grave sostenida (tensión suave)
    n = int(SR * 6.0); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * 55 * t) * 0.6 + np.sin(2 * np.pi * 82.4 * t) * 0.3 + lp(ruido(6.0), 120) * 0.3
    return x * np.minimum(1, t / 1.5) * np.minimum(1, (6.0 - t) / 2)

def sfx_tambor():  # tambores de marcha lejanos
    n = int(SR * 3.0); x = np.zeros(n)
    for k in range(6):
        s = int(k * 0.5 * SR); m = int(0.35 * SR); tt = np.arange(m) / SR
        golpe = np.sin(2 * np.pi * 70 * tt) * np.exp(-tt / 0.12) + lp(ruido(0.35), 400) * np.exp(-tt / 0.05) * 0.5
        x[s:s + m] += golpe[: max(0, min(m, n - s))] * (0.8 if k % 2 else 1)
    return reverb(lp(x, 900), 0.4)


def sfx_semillas():  # puñado de semillas que caen sobre la tierra
    n = int(SR * 1.2); x = np.zeros(n)
    for k in range(40):
        s = int(rng.uniform(0.05, 0.9) * SR); m = int(0.01 * SR)
        x[s:s + m] += hp(ruido(0.01), 2500) * np.exp(-np.arange(m) / SR / 0.002) * rng.uniform(0.3, 1)
    return x

def sfx_grillos():  # grillos nocturnos suaves
    dur = 6.0; n = int(SR * dur); t = np.arange(n) / SR
    pulso = (np.sin(2 * np.pi * 18 * t) > 0.6).astype(float) * (np.sin(2 * np.pi * 0.9 * t) > 0).astype(float)
    x = np.sin(2 * np.pi * 4300 * t) * pulso * 0.3
    return lp(x, 6000) * np.minimum(1, t / 0.8) * np.minimum(1, (dur - t) / 1.2)

def sfx_campanilla():  # campanilla de altar: tres toques breves y claros
    dur = 2.6; n = int(SR * dur); t = np.arange(n) / SR; x = np.zeros(n)
    for k in range(3):
        d = int(k * 0.24 * SR); tt = t[: n - d]
        for f, a, c in ((2093.0, 1.0, 0.9), (2637.0, 0.55, 0.7), (4186.0, 0.3, 0.35), (5588.0, 0.16, 0.2)):
            x[d:] += a * np.sin(2 * np.pi * f * tt * (1 + 0.0015 * k)) * np.exp(-tt / c) * (0.8 if k else 1.0)
    return reverb(x, 0.3)

def sfx_banco():  # crujido suave de banco de madera + apoyo
    n = ruido(0.5); t = np.arange(len(n)) / SR
    cruj = lp(hp(n, 250), 1400) * (0.5 + 0.5 * np.sin(2 * np.pi * 38 * t)) ** 4 * np.sin(np.pi * t / 0.5) ** 2 * 0.5
    golpe = np.sin(2 * np.pi * 95 * t) * np.exp(-t / 0.05) * 0.8
    return cruj + golpe

def sfx_apagon():  # luces de estadio que se apagan: golpe grave + zumbido que decae
    n = int(SR * 1.8); t = np.arange(n) / SR
    zum = (np.sin(2 * np.pi * 100 * t) * np.exp(-t / 0.5) * 0.5 + np.sin(2 * np.pi * 200 * t) * np.exp(-t / 0.35) * 0.3)
    clunk = lp(ruido(1.8), 600) * env(n, 0.002, 0.07) * 1.2
    return clunk * 0.8 + zum

def sfx_expansion():  # barrido de expansión espacial: aire que se abre + tono ascendente suave
    dur = 2.6; n = int(SR * dur); t = np.arange(n) / SR
    x = lp(hp(ruido(dur), 200), 3500) * np.sin(np.pi * t / dur) ** 2 * 0.5
    fr = 300 + 800 * (t / dur) ** 2
    x += np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.sin(np.pi * t / dur) ** 2 * 0.25
    return reverb(x, 0.35)

def sfx_lluvia():  # lluvia suave y pareja
    dur = 4.0; n = int(SR * dur); t = np.arange(n) / SR
    x = hp(lp(ruido(dur), 7000), 1800) * 0.5 * (0.8 + 0.2 * np.sin(2 * np.pi * 0.4 * t))
    return x * np.minimum(1, t / 0.6) * np.minimum(1, (dur - t) / 0.6)

def sfx_aplauso():  # aplauso lejano de multitud, suave
    dur = 2.6; n = int(SR * dur); x = np.zeros(n)
    for _ in range(260):
        s0 = int(rng.uniform(0.0, dur - 0.1) * SR); ln = int(0.03 * SR)
        x[s0:s0 + ln] += rng.standard_normal(ln) * np.exp(-np.arange(ln) / SR / 0.008) * rng.uniform(0.2, 1.0)
    x = lp(hp(x, 900), 6000)
    t = np.arange(n) / SR
    return reverb(x, 0.25) * np.sin(np.pi * np.minimum(1, t / dur)) ** 0.6

def sfx_trueno():  # trueno lejano y breve: retumbo grave que decae
    dur = 3.0; n = int(SR * dur); t = np.arange(n) / SR
    x = lp(ruido(dur), 160) * np.exp(-t / 0.9) * (0.6 + 0.4 * np.sin(2 * np.pi * 7 * t) ** 2)
    x += lp(ruido(dur), 500) * env(n, 0.01, 0.12) * 0.7
    return reverb(x, 0.3)

def sfx_trompeta():  # eco profundo de bronce: una nota grave y larga, con mucho espacio
    dur = 3.6; n = int(SR * dur); t = np.arange(n) / SR
    f0 = 196.0; x = np.zeros(n)
    for h in range(1, 9):
        x += np.sin(2 * np.pi * f0 * h * t + 0.3 * h) / (h ** 1.15)
    a = np.minimum(1, t / 0.35) * np.exp(-np.maximum(0, t - 1.6) / 0.8)
    x = lp(x * a, 1800)
    return reverb(x, 0.5)

def sfx_agua():  # agua que sube: murmullo filtrado que crece, con burbujeo
    dur = 3.2; n = int(SR * dur); t = np.arange(n) / SR
    x = lp(hp(ruido(dur), 150), 1400) * (t / dur) ** 1.4 * 0.7
    for _ in range(40):
        s0 = int(rng.uniform(0.2, dur - 0.3) * SR); ln = int(0.05 * SR); tt = np.arange(ln) / SR
        x[s0:s0 + ln] += np.sin(2 * np.pi * rng.uniform(300, 900) * tt) * np.exp(-tt / 0.012) * 0.25
    return x * np.minimum(1, (dur - t) / 0.5)

def sfx_llama():  # encendido de una llama: chasquido breve y soplo cálido
    dur = 1.2; n = int(SR * dur); t = np.arange(n) / SR
    x = lp(hp(ruido(dur), 800), 5000) * env(n, 0.002, 0.04) * 0.9
    x += lp(ruido(dur), 900) * np.sin(np.pi * np.minimum(1, t / dur)) ** 2 * 0.35
    return x

def sfx_gallo():  # canto de gallo estilizado: tres notas que suben y una que cae, con vibrato
    dur = 2.3; n = int(SR * dur); t = np.arange(n) / SR; x = np.zeros(n)
    segs = [(0.00, 0.24, 420, 640), (0.32, 0.86, 540, 940), (1.0, 1.62, 900, 720), (1.62, 2.1, 720, 430)]
    for a, b, f1, f2 in segs:
        i0 = int(a * SR); i1 = int(b * SR); tt = np.arange(i1 - i0) / SR
        fr = (f1 + (f2 - f1) * (tt / (b - a))) * (1 + 0.025 * np.sin(2 * np.pi * 15 * tt))
        ph = 2 * np.pi * np.cumsum(fr) / SR
        w = sum(np.sin(h * ph) / h ** 1.2 for h in range(1, 7))
        x[i0:i1] += w * np.sin(np.pi * tt / (b - a)) ** 0.6
    x = lp(x, 4200) * np.minimum(1, t / 0.02)
    return reverb(x, 0.22)

# ---------------- música ----------------
NOTAS = {"D2": 73.42, "A2": 110.0, "F2": 87.31, "C3": 130.81, "D3": 146.83, "E3": 164.81, "F3": 174.61, "G3": 196.0, "A3": 220.0,
         "Bb2": 116.54, "Bb3": 233.08, "C4": 261.63, "D4": 293.66, "E4": 329.63, "F4": 349.23, "G4": 392.0, "A4": 440.0, "C5": 523.25, "D5": 587.33}

def pulsada(f, dur, brillo=0.5):  # cuerda pulsada tipo lira (Karplus-Strong)
    n = int(SR * dur); p = max(2, int(SR / f))
    buf = rng.uniform(-1, 1, p); buf = lp(buf, 1500 + 3000 * brillo); out = np.empty(n)
    for i in range(n):
        out[i] = buf[i % p]
        j = (i + 1) % p
        buf[i % p] = 0.996 * 0.5 * (buf[i % p] + buf[j])
    return out * np.exp(-np.arange(n) / SR / (dur * 0.45))

def colchon(fs, dur):  # acorde sostenido, cálido
    n = int(SR * dur); t = np.arange(n) / SR; x = np.zeros(n)
    for f in fs:
        for det in (-0.6, 0.0, 0.7):
            ff = f * (1 + det / 1200 * 8)
            x += np.sin(2 * np.pi * ff * t + rng.uniform(0, 6)) * 0.33 + np.sin(2 * np.pi * 2 * ff * t) * 0.06
    a = np.minimum(1, t / 1.6) * np.minimum(1, (dur - t) / 1.6)
    trem = 0.85 + 0.15 * np.sin(2 * np.pi * 0.18 * t)
    return x * a * trem / len(fs)

def musica(dur, calma=None):  # calma: segundo desde el que la música se vuelve más serena
    n = int(SR * dur); mezcla = np.zeros(n)
    # progresión modal (re dórico): Dm - Bb - F - C, 6 s por acorde
    acordes = [["D3", "F3", "A3"], ["Bb2", "D3", "F3"], ["F2", "A2", "C3", "F3"], ["C3", "E3", "G3"],
               ["D3", "F3", "A3"], ["G3", "Bb3", "D4"], ["Bb2", "F3", "D4"], ["A2", "E3", "A3"]]
    paso = 6.0; t0 = 0.0; k = 0
    while t0 < dur:
        ac = acordes[k % len(acordes)]
        c = colchon([NOTAS[a] for a in ac], paso + 1.6)
        i = int(t0 * SR); fin = min(n, i + len(c)); mezcla[i:fin] += c[: fin - i] * 0.55
        # bajo
        b = colchon([NOTAS[ac[0]] / 2], paso + 1.0) * 0.5
        fin = min(n, i + len(b)); mezcla[i:fin] += b[: fin - i]
        # arpegio de lira, suave y espaciado (se escucha poco: deja lugar a la voz)
        arp = [NOTAS[a] * 2 for a in ac] + [NOTAS[ac[1]] * 4]
        sereno = calma is not None and t0 >= calma - 1
        if sereno:  # colchón agudo cálido en la parte de oración
            alto = colchon([NOTAS[ac[-1]] * 2], paso + 1.6) * 0.25
            fin = min(n, i + len(alto)); mezcla[i:fin] += alto[: fin - i]
        for j in range(6):
            if (k % 2 == 1 and j % 2 == 1) or (sereno and j % 2 == 1):
                continue
            f = arp[(j * 2 + k) % len(arp)]
            nota = pulsada(f, 2.2, 0.35) * (0.18 if sereno else 0.32)
            s = max(0, int((t0 + j * 1.0 + 0.02 * rng.standard_normal()) * SR))
            if s < n:
                fin = min(n, s + len(nota)); mezcla[s:fin] += nota[: fin - s]
        t0 += paso; k += 1
    mezcla = reverb(mezcla, 0.28)
    t = np.arange(n) / SR
    mezcla *= np.minimum(1, t / 3) * np.minimum(1, (dur - t) / 4)
    # estéreo leve: retardo de 11 ms en un canal
    d = int(0.011 * SR); der = np.concatenate([np.zeros(d), mezcla[:-d]])
    return np.stack([mezcla, der * 0.96], axis=1)

if __name__ == "__main__":
    carpeta = sys.argv[1]
    dur = float(sys.argv[sys.argv.index("--duracion") + 1]) if "--duracion" in sys.argv else 110.0
    os.makedirs(os.path.join(carpeta, "sfx"), exist_ok=True)
    efectos = {"paso": sfx_paso, "pagina": sfx_pagina, "sierra": sfx_sierra, "madera": sfx_madera, "cincel": sfx_cincel,
               "marca": sfx_marca, "tabla": sfx_tabla, "piedra": sfx_piedra, "whoosh": sfx_whoosh, "brillo": sfx_brillo, "tela": sfx_tela, "coro": sfx_coro, "canon": sfx_canon, "mar": sfx_mar, "remo": sfx_remo, "cuenta": sfx_cuenta, "disparo": sfx_disparo, "monitor": sfx_monitor, "multitud": sfx_multitud, "viento": sfx_viento, "fuego": sfx_fuego, "apagar": sfx_apagar, "tension": sfx_tension, "tambor": sfx_tambor, "semillas": sfx_semillas, "grillos": sfx_grillos, "campanilla": sfx_campanilla, "banco": sfx_banco, "apagon": sfx_apagon, "expansion": sfx_expansion, "lluvia": sfx_lluvia, "aplauso": sfx_aplauso, "trueno": sfx_trueno, "trompeta": sfx_trompeta, "agua": sfx_agua, "llama": sfx_llama, "gallo": sfx_gallo}
    for nombre, fn in efectos.items():
        guardar(os.path.join(carpeta, "sfx", nombre + ".wav"), fn())
    calma = float(sys.argv[sys.argv.index("--calma-desde") + 1]) if "--calma-desde" in sys.argv else None
    guardar(os.path.join(carpeta, "musica.wav"), musica(dur, calma))
    print("ok:", ", ".join(efectos), "+ musica.wav", f"({dur:.0f} s)")
