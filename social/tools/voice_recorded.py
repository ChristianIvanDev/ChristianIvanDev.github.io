"""Usa la voz grabada por Christian como voz en off.

Uso: .venv-voice/Scripts/python social/tools/voice_recorded.py social/video-01 social/voz/video-01-raw.wav

1. Limpia el audio (filtro de graves, reducción suave de ruido y compresión).
2. Transcribe con faster-whisper (tiempos por palabra).
3. Localiza cada frase del guion; si hay varias tomas, se queda con la última.
4. Corta un clip por escena y escribe build/timeline.json con el texto realmente dicho.
"""
import json
import os
import subprocess
import sys
import unicodedata
from difflib import SequenceMatcher
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FFMPEG = ROOT / "node_modules/ffmpeg-static/ffmpeg.exe"
os.environ["PATH"] = str(FFMPEG.parent) + os.pathsep + os.environ.get("PATH", "")

# Correcciones de palabras que Whisper suele oír mal o que conviene mostrar distinto en los subtítulos.
FIXES = {"cobra.": "cobro.", "cobra": "cobro", "2.000": "2,000", "enseñale": "enséñale"}


def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    return "".join(c for c in s if c.isalnum() or c == " ").strip()


def merge_numbers(words):
    """Une los trozos de número que Whisper separa ("2" + ".000" → "2,000")."""
    out = []
    for w in words:
        if out and w["w"][:1] in ".," and w["w"][1:2].isdigit():
            prev = out[-1]
            prev["w"] = FIXES.get(prev["w"] + w["w"], prev["w"] + w["w"])
            prev["d"] = round(w["t"] + w["d"] - prev["t"], 3)
        else:
            out.append(w)
    return out


def clean(src, dst):
    subprocess.run([str(FFMPEG), "-v", "error", "-y", "-i", str(src), "-ac", "1", "-ar", "48000",
                    "-af", "highpass=f=80,afftdn=nr=10:nf=-30,acompressor=threshold=0.1:ratio=3:attack=8:release=120:makeup=2",
                    str(dst)], check=True)


def cut(src, dst, start, end):
    subprocess.run([str(FFMPEG), "-v", "error", "-y", "-ss", f"{start:.3f}", "-to", f"{end:.3f}", "-i", str(src),
                    "-af", "afade=t=in:d=0.03,areverse,afade=t=in:d=0.06,areverse", str(dst)], check=True)


def main(video_dir, recording):
    from faster_whisper import WhisperModel

    spec = json.loads((video_dir / "script.json").read_text(encoding="utf-8"))
    build = video_dir / "build"
    build.mkdir(exist_ok=True)
    cleaned = build / "voz-limpia.wav"
    clean(recording, cleaned)

    model = WhisperModel("small", device="cpu", compute_type="int8")
    segments = [s for s in model.transcribe(str(cleaned), language="es", word_timestamps=True)[0]]

    # Para cada escena, el grupo de 1 a 3 segmentos consecutivos que más se parece; ante empate, el más tardío (última toma).
    chosen, after = [], 0
    for scene in spec["scenes"]:
        target = norm(scene["say"])
        best = None
        for i in range(after, len(segments)):
            for n in (1, 2, 3):
                group = segments[i:i + n]
                if len(group) < n:
                    break
                ratio = SequenceMatcher(None, norm(" ".join(g.text for g in group)), target).ratio()
                if best is None or ratio >= best[0] - 0.02:
                    if best is None or ratio > best[0] or i >= best[1]:
                        best = (max(ratio, best[0] if best else 0), i, n, group)
        if best is None:
            raise SystemExit(f"no encontré la frase de la escena {scene['id']}")
        _, i, n, group = best
        chosen.append((scene, group))
        after = i + n

    cursor, gap, scenes = 0.35, spec.get("gapMs", 180) / 1000, []
    for scene, group in chosen:
        words = [w for g in group for w in g.words]
        print(f"  {scene['id']}: toma en {words[0].start:.2f}-{words[-1].end:.2f}s de la grabación")
        start, end = max(0.0, words[0].start - 0.08), words[-1].end + 0.15
        clip = build / f"scene-{scene['id']}.wav"
        cut(cleaned, clip, start, end)
        dur = end - start
        scenes.append({
            "id": scene["id"],
            "say": " ".join(g.text.strip() for g in group),
            "start": round(cursor, 3),
            "duration": round(dur, 3),
            "words": merge_numbers([{"w": FIXES.get(w.word.strip(), w.word.strip()), "t": round(cursor + w.start - start, 3), "d": round(w.end - w.start, 3)} for w in words]),
            "audio": clip.name,
        })
        cursor += dur + gap
    total = round(cursor + 0.9, 3)
    (build / "timeline.json").write_text(json.dumps({"total": total, "scenes": scenes}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"timeline: {total}s")
    for s in scenes:
        print(f"  {s['id']:7s} {s['start']:6.2f}s {s['duration']:5.2f}s  {' '.join(w['w'] for w in s['words'])}")


if __name__ == "__main__":
    main(Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve())
