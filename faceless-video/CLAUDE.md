# Faceless video folder

Joash is not a developer. Explain in plain words, no jargon.

- Videos are faceless, 30-45 s. Default to vertical 1080x1920 unless asked for wide.
- Use the `lemo-opuscar` plugin (enabled in the repo's `.claude/settings.json`).
- Put each film in `faceless-video/films/<short-name>/`. Commit only the final MP4
  (and its .srt), not frames, caches or `node_modules`.
- Lemo-Opuscar needs ffmpeg 7+. If `ffmpeg -version` shows an older one, install a
  static ffmpeg 7+ into `~/bin` and put it first on PATH before rendering.
- User-provided logos, photos, voice or music go in `faceless-video/assets/`.
- Topics: ArConSe products (Bluetti power stations, Innobiit waterproofing,
  automated composter, STP, rainwater harvesting, inline water dispenser) and
  nursing education. Check facts; do not invent product specs or medical claims.
