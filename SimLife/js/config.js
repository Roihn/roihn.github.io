/* ============================================================
   SimLife demo config.
   Picker shows two featured days (1457 + 1417). To add a day, list
   its dayEntry(id) below, generate data/day_<id>.json via
   _build/export_demo_day.py, and upload its 720p to HF demo/.
   ============================================================ */
window.SIMLIFE_CONFIG = {

  /* --- Resource links (hero buttons). Leave "" to grey-out a button. --- */
  links: {
    paper:   "assets/simlife_paper.pdf",
    arxiv:   "",   // TODO
    code:    "",   // TODO
    dataset: ""    // TODO
  },

  /* --- Candidate days. Each: data JSON + video URLs.
     demo/full are the hosted (Hugging Face) URLs used in production;
     `local` is the staged 720p clip used for local preview. --- */
  days: [
    dayEntry(1457), dayEntry(1417)
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
  var u = String(id).padStart(6, "0");
  return {
    id: id,
    label: "Day " + id,
    data: "data/day_" + id + ".json",
    local: "_build/staging/demo_day_" + id + "_720p.mp4",
    demo:  "https://huggingface.co/datasets/Roihn/SimLife/resolve/main/demo/demo_day_" + id + "_720p.mp4",
    full:  "https://huggingface.co/datasets/Roihn/SimLife/resolve/main/video_units/video_" + u + "/video.mp4"
  };
}
