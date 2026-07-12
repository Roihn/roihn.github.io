# SimLife project page

Interactive landing page for **SimLife** / **SimLife-BP**, hosted at
`https://roihn.github.io/SimLife/`.

It introduces the paper and lets any visitor explore a full 24-minute simulated
day: the daily **schedule is grouped by time of day (6 AM → 10 PM)**, and
**clicking any action seeks the video to that exact moment**. As the video
plays, the schedule highlights the current action and shows the in-game clock.

## Layout

```
SimLife/
├── index.html            # page (no Jekyll front matter → served verbatim)
├── css/site.css
├── js/
│   ├── config.js         # ← EDIT: resource links + hosted video URLs
│   └── demo.js           # loads day JSON, renders schedule, wires seek + live sync
├── data/day_1457.json    # pre-computed action data for the featured day
├── assets/
│   ├── poster.jpg
│   └── simlife_paper.pdf
└── _build/               # tooling (NOT deployed — starts with "_")
    ├── export_demo_day.py   # regenerate data/day_*.json from the simlife DB
    ├── compress_video.sh    # re-encode a day recording to the 720p demo clip
    └── staging/             # local 720p clip lives here (git-ignored)
```

Because the folder has **no YAML front matter**, Jekyll copies it verbatim into
`_site/SimLife/`. Directories beginning with `_` (here `_build/`) are **not**
deployed, so the tooling and the large staged video never ship.

## Deploy

This folder lives inside the `roihn/roihn.github.io` repo. GitHub Pages builds
the site automatically on push — just commit `SimLife/` and it appears at
`https://roihn.github.io/SimLife/`. All asset paths are **relative**, so the
`/SimLife/` sub-path needs no configuration.

## The demo video (hosted on Hugging Face)

GitHub blocks files > 100 MB, so the video is **not** in this repo. Host the
720p clip (`_build/staging/demo_day_1457_720p.mp4`, ~193 MB) anywhere that
supports HTTP range requests + CORS — a Hugging Face dataset `resolve/` URL
works out of the box.

1. Upload the clip (and, if you want the "download original" link, the full
   1080p `video_units/video_001457/video.mp4`):
   ```bash
   huggingface-cli login
   huggingface-cli upload <HF_REPO> _build/staging/demo_day_1457_720p.mp4 \
       demo/demo_day_1457_720p.mp4 --repo-type dataset
   ```
2. Put the resulting URLs into **`js/config.js`** (`video.demoUrl`,
   `video.fullUrl`) and fill in the `links` (arXiv, code, dataset).

## Local preview (before uploading)

```bash
cd SimLife
python3 -m http.server 8000
# open http://localhost:8000/?local=1   (?local=1 plays _build/staging/*.mp4)
```

## Regenerate the day data

```bash
# from the SimLife research repo (has DB access)
PGPASSWORD=... uv run python _build/export_demo_day.py \
    --day 1457 --video-unit 001457 \
    --video-meta /path/to/video_units/video_001457/metadata.json \
    --out data/day_1457.json
```
