# Faceless video folder

Joash is not a developer. Explain in plain words, no jargon.

- Videos are faceless, 30-45 s. Default to vertical 1080x1920 unless asked for wide.
- Plugins `lemo-opuscar` (drawn story films) and `hyperframes` (fast HTML-to-MP4
  promos, captions), `earshot` (code-made sound effects) and `blender-skills`
  (3D in Blender via MCP) are enabled in the repo's `.claude/settings.json`.
- Earshot: before first use in a session run
  `pip install "earshot[mcp] @ git+https://github.com/Leonxlnx/earshot"`
  (not `pip install earshot`: that PyPI name is another project). CPU only.
- Blender skills only work where Blender is open locally with the BlenderMCP
  add-on connected (not in cloud sessions). Its bundled `.mcp.json` uses a
  Windows `cmd /c` command. Ask Joash to save the .blend file before running.
- Put each film in `faceless-video/films/<short-name>/`. Commit only the final MP4
  (and its .srt), not frames, caches or `node_modules`.
- Lemo-Opuscar needs ffmpeg 7+. If `ffmpeg -version` shows an older one, install a
  static ffmpeg 7+ into `~/bin` and put it first on PATH before rendering.
- User-provided logos, photos, voice or music go in `faceless-video/assets/`.
- Topics: ArConSe products (Bluetti power stations, Innobiit waterproofing,
  automated composter, STP, rainwater harvesting, inline water dispenser) and
  nursing education. Check facts; do not invent product specs or medical claims.
