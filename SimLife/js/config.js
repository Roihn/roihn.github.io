/* ============================================================
   SimLife demo config.
   One featured day (1457). To feature another day: add dayEntry(id)
   below, generate data/day_<id>.json via _build/export_demo_day.py,
   upload its 720p to HF demo/, and restore a picker UI.
   ============================================================ */
window.SIMLIFE_CONFIG = {

  /* --- Resource links (hero buttons). Leave "" to grey-out a button. --- */
  links: {
    paper:   "",   // TODO: arXiv/PDF URL when ready
    arxiv:   "",   // TODO
    code:    "",   // TODO
    dataset: ""    // TODO
  },

  /* --- Featured day(s). Each: data JSON + video URLs.
     `demo` is the hosted (Hugging Face) 720p used in production;
     `local` is the staged 720p clip used for local preview. --- */
  days: [
    dayEntry(1457)
  ],

  /* --- Per-character header icons (transparent PNGs). --- */
  characterIcons: {
    father:   "assets/icons/father.png",
    mother:   "assets/icons/mother.png",
    daughter: "assets/icons/daughter.png",
    son:      "assets/icons/son.png",
    servo:    "assets/icons/servo.png"
  }
};

/* helper: build a day entry from its id (video unit = zero-padded id) */
function dayEntry(id) {
  return {
    id: id,
    label: "Day " + id,
    data: "data/day_" + id + ".json",
    local: "_build/staging/demo_day_" + id + "_720p.mp4",
    demo:  "https://huggingface.co/datasets/Roihn/SimLife/resolve/main/demo/demo_day_" + id + "_720p.mp4"
  };
}
