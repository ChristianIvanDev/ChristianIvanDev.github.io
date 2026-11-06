"""Genera la voz en off de un video con edge-tts y guarda los tiempos de cada palabra.

Uso: .venv-social/Scripts/python social/tools/voice.py social/video-01
Salida en <video>/build/: scene-<id>.mp3 y timeline.json (inicio de cada escena y de cada palabra, en segundos).
"""
import asyncio
import json
import subprocess
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[2]
FFPROBE_FALLBACK = ROOT / "node_modules" / "ffmpeg-static" / "ffmpeg.exe"


def duration(path: Path) -> float:
    """Duración en segundos usando ffmpeg (sin ffprobe)."""
    out = subprocess.run([str(FFPROBE_FALLBACK), "-i", str(path), "-f", "null", "-"], capture_output=True, text=True).stderr
    for line in out.splitlines():
        line = line.strip()
        if line.startswith("Duration:"):
            h, m, s = line.split()[1].rstrip(",").split(":")
            return int(h) * 3600 + int(m) * 60 + float(s)
    raise RuntimeError(f"sin duración para {path}")


async def synth(text: str, voice: str, rate: str, pitch: str, out: Path):
    words = []
    comm = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch, boundary="WordBoundary")
    with out.open("wb") as f:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append({"w": chunk["text"], "t": chunk["offset"] / 1e7, "d": chunk["duration"] / 1e7})
    return words


def _norm(s: str) -> str:
    import unicodedata
    s = unicodedata.normalize("NFD", s.lower())
    return "".join(c for c in s if c.isalnum())


def with_punctuation(words, text):
    """Sustituye cada palabra de edge-tts por la del guion (con su puntuación), en orden."""
    tokens = text.split()
    out, j = [], 0
    for w in words:
        k = j
        while k < len(tokens) and _norm(w["w"]) not in _norm(tokens[k]):
            k += 1
        if k < len(tokens):
            out.append({**w, "w": tokens[k]})
            j = k + 1
        else:
            out.append(w)
    return out


async def main(video_dir: Path):
    spec = json.loads((video_dir / "script.json").read_text(encoding="utf-8"))
    build = video_dir / "build"
    build.mkdir(exist_ok=True)
    cursor = 0.35  # pequeño margen inicial antes de la primera palabra
    gap = spec.get("gapMs", 180) / 1000
    scenes = []
    for scene in spec["scenes"]:
        mp3 = build / f"scene-{scene['id']}.mp3"
        words = with_punctuation(await synth(scene["say"], spec["voice"], spec.get("rate", "+0%"), scene.get("pitch", "+0Hz"), mp3), scene["say"])
        dur = duration(mp3)
        scenes.append({
            "id": scene["id"],
            "say": scene["say"],
            "start": round(cursor, 3),
            "duration": round(dur, 3),
            "words": [{"w": w["w"], "t": round(cursor + w["t"], 3), "d": round(w["d"], 3)} for w in words],
            "audio": mp3.name,
        })
        cursor += dur + gap
    total = round(cursor + 0.9, 3)  # cola para la campanita final
    (build / "timeline.json").write_text(json.dumps({"total": total, "scenes": scenes}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"timeline: {total}s, {len(scenes)} escenas")
    for s in scenes:
        print(f"  {s['id']:7s} {s['start']:6.2f}s  {s['duration']:5.2f}s  {len(s['words'])} palabras")


if __name__ == "__main__":
    asyncio.run(main(Path(sys.argv[1]).resolve()))
