"""Voz en off con la voz clonada de Christian (OpenVoice V2 + MeloTTS, licencia MIT).

Uso:
  .venv-voice/Scripts/python social/tools/voice_clone.py social/video-01            # todas las escenas → build/timeline.json
  .venv-voice/Scripts/python social/tools/voice_clone.py --sample "Texto de prueba"  # muestra suelta → social/out/voces/clon-muestra.wav

Necesita la grabación de referencia en social/voz/christian.wav (no se sube al repositorio).
"""
import json
import sys
import unicodedata
from pathlib import Path

import os

import torch

ROOT = Path(__file__).resolve().parents[2]
# Whisper y pydub llaman a "ffmpeg": usamos el binario que ya trae el proyecto (ffmpeg-static).
os.environ["PATH"] = str(ROOT / "node_modules/ffmpeg-static") + os.pathsep + os.environ.get("PATH", "")
CKPT = ROOT / "social/vendor/OpenVoice/checkpoints_v2"
REF = ROOT / "social/voz/christian.wav"
SE_CACHE = ROOT / "social/voz/christian_se.pth"
DEVICE = "cuda:0" if torch.cuda.is_available() else "cpu"
SPEED = 1.08  # un poco más ágil que el ritmo base, mejor para redes


def _norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    return "".join(c for c in s if c.isalnum())


def load():
    from melo.api import TTS
    from openvoice.api import ToneColorConverter
    from openvoice import se_extractor

    tts = TTS(language="ES", device=DEVICE)
    speaker_id = list(tts.hps.data.spk2id.values())[0]
    conv = ToneColorConverter(str(CKPT / "converter/config.json"), device=DEVICE)
    conv.load_ckpt(str(CKPT / "converter/checkpoint.pth"))
    src_se = torch.load(CKPT / "base_speakers/ses/es.pth", map_location=DEVICE)
    if SE_CACHE.exists():
        tgt_se = torch.load(SE_CACHE, map_location=DEVICE)
    else:
        tgt_se, _ = se_extractor.get_se(str(REF), conv, target_dir=str(ROOT / "social/voz/processed"), vad=True)
        torch.save(tgt_se, SE_CACHE)
    return tts, speaker_id, conv, src_se, tgt_se


def say(text, out_wav, models):
    tts, speaker_id, conv, src_se, tgt_se = models
    tmp = out_wav.with_suffix(".base.wav")
    tts.tts_to_file(text, speaker_id, str(tmp), speed=SPEED, quiet=True)
    conv.convert(audio_src_path=str(tmp), src_se=src_se, tgt_se=tgt_se, output_path=str(out_wav), message="@ChristianE")
    tmp.unlink(missing_ok=True)


def word_times(wav, text, whisper):
    """Tiempos por palabra con faster-whisper, reemplazando cada palabra por la del guion (con su puntuación)."""
    segments, info = whisper.transcribe(str(wav), language="es", word_timestamps=True, vad_filter=False)
    words = [w for seg in segments for w in seg.words]
    tokens = text.split()
    out, j = [], 0
    for w in words:
        k = j
        clean = _norm(w.word)
        while k < len(tokens) and clean and clean not in _norm(tokens[k]) and _norm(tokens[k]) not in clean:
            k += 1
        label = tokens[k] if k < len(tokens) else w.word.strip()
        if k < len(tokens):
            j = k + 1
        out.append({"w": label, "t": float(w.start), "d": float(w.end - w.start)})
    # Si Whisper se saltó palabras del guion, las añadimos repartidas al final para que el subtítulo esté completo.
    return out, info.duration


def main():
    if sys.argv[1] == "--sample":
        models = load()
        out = ROOT / "social/out/voces/clon-muestra.wav"
        out.parent.mkdir(parents=True, exist_ok=True)
        say(sys.argv[2], out, models)
        print(out)
        return

    from faster_whisper import WhisperModel

    video_dir = Path(sys.argv[1]).resolve()
    spec = json.loads((video_dir / "script.json").read_text(encoding="utf-8"))
    build = video_dir / "build"
    build.mkdir(exist_ok=True)
    models = load()
    whisper = WhisperModel("small", device="cuda" if DEVICE.startswith("cuda") else "cpu", compute_type="float16" if DEVICE.startswith("cuda") else "int8")
    cursor, gap, scenes = 0.35, spec.get("gapMs", 180) / 1000, []
    for scene in spec["scenes"]:
        wav = build / f"scene-{scene['id']}.wav"
        say(scene["say"], wav, models)
        words, dur = word_times(wav, scene["say"], whisper)
        scenes.append({
            "id": scene["id"], "say": scene["say"], "start": round(cursor, 3), "duration": round(dur, 3),
            "words": [{"w": w["w"], "t": round(cursor + w["t"], 3), "d": round(w["d"], 3)} for w in words],
            "audio": wav.name,
        })
        cursor += dur + gap
    total = round(cursor + 0.9, 3)
    (build / "timeline.json").write_text(json.dumps({"total": total, "scenes": scenes}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"timeline: {total}s")
    for s in scenes:
        print(f"  {s['id']:7s} {s['start']:6.2f}s {s['duration']:5.2f}s  {' '.join(w['w'] for w in s['words'])}")


if __name__ == "__main__":
    main()
