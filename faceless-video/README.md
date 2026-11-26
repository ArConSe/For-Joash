# Faceless Video Studio

Make 30 to 45 second faceless videos (no person on camera) for ArConSe products,
nursing lessons, and social media, by asking Claude in plain words.

## What is set up

This repo now turns on two video plugins automatically: **Lemo-Opuscar** and
**HyperFrames**. Any Claude Code session opened on the `For-Joash` repo (on
claude.ai/code in the cloud, or on your computer) loads both. You do not
install anything by hand.

Lemo-Opuscar has 99 drawn, animated styles (whiteboard, blueprint, watercolor,
neon, product render and more). Claude writes the script, draws every frame in
code, adds a voice-over and music, and gives you an MP4. No stock footage, no
face, no camera.

The setting lives in `.claude/settings.json` at the top of the repo.

## How to make a video (3 steps)

1. Go to [claude.ai/code](https://claude.ai/code) and start a session on the
   **For-Joash** repo.
2. Type `/effort high` and press Enter (the styles need it).
3. Ask for your video in one sentence. Copy one of these and change the topic:

```text
Make a 40-second vertical (1080x1920) Blueprint style video about how
rainwater harvesting saves water for a house in Cavite. Calm male narrator,
English. Save it in faceless-video/films/rainwater.
```

```text
Make a 35-second vertical Whiteboard Explainer video teaching nursing students
the 10 rights of medication administration. Warm female narrator.
Save it in faceless-video/films/med-rights.
```

```text
Make a 45-second vertical Glass Product Render video for a portable power
station for brownouts: silent, quiet, powers a fridge and fan all night.
Save it in faceless-video/films/power-station.
```

Not sure what to ask? Type `/lemo-opuscar:lemo-opuscar` alone and it will ask
you questions step by step.

Browse all styles with demos: https://lemomo-ai.github.io/lemo-opuscar/

## Styles that fit your work

| Topic | Good styles |
|---|---|
| STP, rainwater harvesting, water dispenser | Blueprint, Isometric Infographic, Line-Art Cutaway |
| Power station, composter, waterproofing | Glass Product Render, Exploded Teardown, Dark Tech Keynote |
| Nursing lessons | Whiteboard Explainer, Sketchnote, Tablet Sketch Explainer |
| Quick social posts | Caption News, Swiss Motion Graphics, Neon Tubes |

## Good to know

- **Time:** one video takes Claude about 30 to 60 minutes and uses a fair
  amount of your Claude usage. Start it and come back later.
- **Vertical vs wide:** say "vertical (1080x1920)" for Reels, TikTok and
  Shorts. Otherwise you get a wide 1920x1080 video.
- **Getting the video:** ask Claude at the end to "commit the finished MP4 to
  this branch" and then download it from GitHub, or ask it to attach the file.
  Keep finished videos small (under about 50 MB) for GitHub.
- **FFmpeg:** the plugin needs FFmpeg version 7 or newer. The cloud machine
  has version 6.1, so tell Claude on the first try: "install FFmpeg 7 or newer
  first". If it cannot download it, run the video on your computer instead.
- **Your own material:** you can give it your logo, product photos, or your
  own voice recording or music. Upload them into `faceless-video/assets/`.
- **Licence:** the plugin's own part of your videos is yours to use, including
  for business ads. But music, sound samples and fonts inside a video keep
  their own rules, and some need a credit. Before posting an ad, open the
  video's CREDITS file (or ask Claude "what credits does this video need?").
  Do not resell the plugin's style guides themselves.

## HyperFrames (also turned on)

HyperFrames (https://github.com/heygen-com/hyperframes) turns animated web
pages into MP4 videos. It is quicker than Lemo-Opuscar and good for text
animations, product intros, captions and slideshows. Start your ask with
`/hyperframes`, for example:

```text
/hyperframes Make a 30-second vertical product intro for an automated
composter: bold title, 3 benefit lines, our logo at the end, upbeat music.
Save it in faceless-video/films/composter.
```

Rule of thumb: Lemo-Opuscar for a drawn, story-style film; HyperFrames for a
fast, clean promo with text and your own photos.

## Earshot: sound effects (also turned on)

Earshot (https://github.com/Leonxlnx/earshot) makes sound effects from plain
words: whooshes, clicks, rain, a drill, a water splash, a "ding" for a price
reveal. It builds each sound in code, so there is no music licence to worry
about, and you can use the sounds in business ads. It is free and works on a
normal computer (no graphics card needed).

Claude has to install the Earshot tool once per session. Ask like this:

```text
Install earshot first, then make a soft water-splash sound and a "ding" for
my rainwater harvesting video. Save them in faceless-video/assets/sfx.
```

## Blender skills: 3D product scenes (turned on, but needs your computer)

Blender Skills (https://github.com/arjun988/blender-skills) adds 94 skills for
3D modelling, lighting, materials, camera moves and rendering in Blender, for
example a 3D turntable of a power station or a cutaway of an STP tank.

This one only works on your own computer, not on claude.ai in the cloud,
because Claude has to control a Blender window that is open on your screen.
To use it:

1. Install Blender (free, version 3.0 or newer) from https://www.blender.org.
2. Ask Claude Code on your computer: "set up Blender MCP for blender-skills".
   It will add the Blender add-on and connect it.
3. In Blender press N, open the BlenderMCP tab and click "Connect to Claude".
4. Save your Blender file first, then ask, for example: "Make a 10-second 3D
   turntable of a portable power station on a table, soft studio light,
   vertical 1080x1920".

The project's own setup guide is written for Windows. 3D rendering is faster
with a good graphics card, but you can render short clips without one.

## Other tools from our research

Not turned on here. Ask Claude if you want it added later.

- **FFmpeg skill** (https://github.com/kajisho5/ffmpeg-skill): lets Claude cut,
  trim, add captions and reframe videos you already have (for example, turn a
  site video into a vertical clip with subtitles).
