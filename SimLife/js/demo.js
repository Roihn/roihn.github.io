/* ============================================================
   SimLife live-day demo (Nerfies layout) — calendar edition
   - 5 character columns on a shared 6AM-10PM time axis
   - consecutive same-name actions merged into one block (xN)
   - thin blocks: min height + cascade push-down (adapted from the
     user_study calendar), so no block is too thin and none overlap
   - click a block -> seek the video; playback drives the in-game
     clock + each character's current action + a glowing block
   ============================================================ */
(function () {
  "use strict";
  var CFG = window.SIMLIFE_CONFIG || {};

  var CATEGORY_EMOJIS = {
    writing:"✍️", video_games:"🎮", logic:"🧩", comedy:"😂",
    cooking:"🍽️", social:"💬", handiness:"🔧", general:"📋",
    fitness:"💪", mischief:"😈", other:"❓", charisma:"🗣️", piano:"🎹",
    gardening:"🌱", painting:"🎨", photography:"📷", fishing:"🎣",
    programming:"💻", guitar:"🎸", violin:"🎻", dj:"🎧", mentoring:"🧑‍🏫",
    dancing:"💃", singing:"🎤", meditation:"🧘", yoga:"🧘",
    rocket_science:"🚀", robotics:"🤖", archaeology:"🏺", baking:"🥧",
    mixology:"🍸", wellness:"💆", parenting:"👶", pet_training:"🐕",
    knitting:"🧶", cross_stitch:"🪡", flower_arranging:"💐", juice_fizzing:"🧃"
  };
  function emojiFor(cat){ return CATEGORY_EMOJIS[(cat||"").toLowerCase()] || "📌"; }

  function vSecs(hms){ if(!hms) return null; var m=/(\d{2}):(\d{2}):(\d{2})/.exec(hms); return m? (+m[1])*3600+(+m[2])*60+(+m[3]) : null; }
  function gMin(hms){ if(!hms) return null; var p=String(hms).split(":"); return (+p[0])*60+(+p[1])+(p[2]?(+p[2])/60:0); }
  function vLabel(hms){ if(!hms) return "-"; var m=/(\d{2}):(\d{2}):(\d{2})/.exec(hms); if(!m) return hms; var tm=(+m[1])*60+(+m[2]); return pad(tm)+":"+pad(+m[3]); }
  function gLabel(hms){ if(!hms) return "--:--"; var m=/(\d{2}):(\d{2})/.exec(hms); return m? m[1]+":"+m[2] : hms; }
  function fmtName(s){ if(!s) return ""; return String(s).replace(/_/g," ").replace(/\b\w/g,function(c){return c.toUpperCase();}); }
  function pad(n){ return (n<10?"0":"")+n; }
  function esc(s){ return (s==null?"":String(s)).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c];}); }
  function hourLabel(h){ h=((h%24)+24)%24; var ap=h<12?"AM":"PM", hr=h%12||12; return hr+" "+ap; }

  /* ---- layout constants (adapted from user_study/public/js/study.js) ---- */
  var PX_PER_MIN = 2.5;    // vertical scale (each hour = 150px, so blocks fit)
  var MIN_BLOCK  = 12;     // px — minimum rendered height (kept small so the
                           //      cascade barely displaces blocks from real time)
  var COMPACT_AT = 22;     // px — below this, hide the block's time line

  function isPlaceholder(u){ return !u || u.indexOf("<HF_REPO>") !== -1; }
  function wireLinks(){
    var links=CFG.links||{}, vid=CFG.video||{};
    document.querySelectorAll("[data-link]").forEach(function(el){
      var key=el.dataset.link, url=key==="fullvideo"?vid.fullUrl:links[key];
      if(!isPlaceholder(url)){ el.href=url; el.target="_blank"; el.rel="noopener"; }
      else { var b=el.closest(".link-block"); if(b) b.style.display="none"; else el.style.display="none"; }
    });
  }
  function dayVideoSrc(day){
    if(!day) return "";
    var onPages = /\.github\.io$/i.test(location.hostname);
    if(!onPages && day.local) return day.local;   // local preview: staged 720p clip (faststart)
    if(!isPlaceholder(day.demo)) return day.demo;  // deployed site: hosted Hugging Face URL
    if(day.local) return day.local;
    return "";
  }

  var player, scheduleEl, gameClock, nowStrip;
  var charById = {}, perChar = {}, allBlocks = [];

  function seekTo(sec){
    if(sec==null||!player) return;
    var go=function(){ try{ player.currentTime=sec; player.play().catch(function(){}); }catch(e){} };
    if(player.readyState>=1) go();
    else { var h=function(){ player.removeEventListener("loadedmetadata",h); go(); }; player.addEventListener("loadedmetadata",h); }
  }

  /* ---- merge consecutive same-name actions within a character ---- */
  function mergeChar(acts){
    var out=[];
    acts.forEach(function(a){
      var prev=out[out.length-1];
      if(prev && prev.name===a.name){
        prev.count++; prev.gEnd=a.end_time_game||prev.gEnd; prev.vEnd=vSecs(a.end_time_video)||prev.vEnd;
        if(a.visibility!=null){ prev.visSum+=a.visibility; prev.visN++; }
      } else {
        out.push({
          character:a.character, kind:a.kind, name:a.name, category:a.category, sub:a.sub_category,
          gStart:a.start_time_game, gEnd:a.end_time_game, seek:a.seek_seconds,
          vStart:(a.seek_seconds!=null?a.seek_seconds:vSecs(a.start_time_video)),
          vEnd:vSecs(a.end_time_video), count:1,
          visSum:(a.visibility!=null?a.visibility:0), visN:(a.visibility!=null?1:0)
        });
      }
    });
    return out;
  }

  function render(data){
    charById={}; perChar={}; allBlocks=[];    // reset per day
    var dayEl=document.getElementById("day-id"); if(dayEl) dayEl.textContent=data.day_id;
    // character palette matched to the paper figure (header.png): stroke + light fill
    var PALETTE={
      mother:{s:"#f1c232",f:"#fff2cc"}, father:{s:"#e69138",f:"#fce5cd"},
      daughter:{s:"#46828f",f:"#d0e0e3"}, son:{s:"#38761d",f:"#d9ead3"},
      servo:{s:"#8f8f8f",f:"#ececec"}
    };
    (data.characters||[]).forEach(function(c){ var p=PALETTE[c.key]; if(p){ c.color=p.s; c.fill=p.f; } if(!c.fill) c.fill="#eee"; charById[c.key]=c; });

    /* group + merge per character, compute game minutes */
    var byChar={};
    (data.actions||[]).forEach(function(a){ (byChar[a.character]=byChar[a.character]||[]).push(a); });
    var minStart=Infinity, maxEnd=-Infinity;
    (data.characters||[]).forEach(function(c){
      var blocks=mergeChar(byChar[c.key]||[]);
      blocks.forEach(function(b){
        b.startMin=gMin(b.gStart); if(b.startMin==null) b.startMin=0;
        b.endMin=gMin(b.gEnd); if(b.endMin==null||b.endMin<b.startMin) b.endMin=b.startMin+1;
        if(b.vEnd==null||b.vEnd<b.vStart) b.vEnd=(b.vStart||0)+20;
        minStart=Math.min(minStart,b.startMin); maxEnd=Math.max(maxEnd,b.endMin);
      });
      blocks.sort(function(x,y){ return x.startMin-y.startMin; });
      perChar[c.key]=blocks; allBlocks=allBlocks.concat(blocks);
    });
    allBlocks.sort(function(x,y){ return (x.vStart||0)-(y.vStart||0); });

    var axisStart=Math.floor(minStart/60)*60, axisEnd=Math.ceil(maxEnd/60)*60;
    var axisH=(axisEnd-axisStart)*PX_PER_MIN;

    /* --- cascade layout: min height + push follow-ups down (no overlap) --- */
    var globalBottom=axisH;
    (data.characters||[]).forEach(function(c){
      var bottom=0;
      (perChar[c.key]||[]).forEach(function(b){
        var natural=(b.startMin-axisStart)*PX_PER_MIN;
        b._top=Math.max(natural, bottom);
        b._h=Math.max((b.endMin-b.startMin)*PX_PER_MIN, MIN_BLOCK);
        bottom=b._top+b._h;
      });
      globalBottom=Math.max(globalBottom, bottom);
    });
    var H=globalBottom+6;

    /* --- build calendar DOM --- */
    var cols=(data.characters||[]);
    var tmpl="60px repeat("+cols.length+", minmax(150px, 1fr))";

    var cal=document.createElement("div"); cal.className="cal";
    var scroll=document.createElement("div"); scroll.className="cal-scroll";

    var head=document.createElement("div"); head.className="cal-head"; head.style.gridTemplateColumns=tmpl;
    head.appendChild(el("div","cal-corner"));
    var icons=CFG.characterIcons||{};
    cols.forEach(function(c){
      var h=el("div","cal-chhead"); h.style.setProperty("--c",c.color); h.style.setProperty("--fill",c.fill);
      var ic=icons[c.key] ? '<img class="cc-icon" src="'+esc(icons[c.key])+'" alt="">' : '';
      h.innerHTML=ic+'<span class="cc-name">'+esc(c.name)+'</span>'+
                  '<span class="cc-count">'+(perChar[c.key]||[]).length+'</span>';
      head.appendChild(h);
    });

    var body=document.createElement("div"); body.className="cal-body"; body.style.gridTemplateColumns=tmpl;
    /* gutter: an hour label anchored at the top of each hour line */
    var gutter=el("div","cal-gutter"); gutter.style.height=H+"px";
    for(var hh=axisStart/60; hh<=axisEnd/60; hh++){
      var hl=el("div","cal-hour"); hl.style.top=((hh*60-axisStart)*PX_PER_MIN)+"px";
      hl.textContent=hourLabel(hh); gutter.appendChild(hl);
    }
    body.appendChild(gutter);
    /* character columns with dashed hour lines + cascaded blocks */
    cols.forEach(function(c){
      var col=el("div","cal-col"); col.dataset.char=c.key; col.style.height=H+"px";
      for(var hh2=axisStart/60; hh2<=axisEnd/60; hh2++){
        var ln=el("div","cal-line"); ln.style.top=((hh2*60-axisStart)*PX_PER_MIN)+"px"; col.appendChild(ln);
      }
      (perChar[c.key]||[]).forEach(function(b){ col.appendChild(block(b,c)); });
      body.appendChild(col);
    });

    scroll.appendChild(head); scroll.appendChild(body); cal.appendChild(scroll);
    scheduleEl.innerHTML=""; scheduleEl.appendChild(cal);
    buildNowStrip(cols);
  }

  function el(tag,cls){ var d=document.createElement(tag); if(cls) d.className=cls; return d; }

  function block(b,c){
    var bt=document.createElement("button"); bt.type="button";
    bt.className="cal-block"+(b.kind==="meal"?" meal":"")+(b.seek==null?" no-seek":"")+(b._h<COMPACT_AT?" compact":"");
    bt.style.top=b._top+"px"; bt.style.height=b._h+"px";
    bt.style.setProperty("--c",c.color); bt.style.setProperty("--fill",c.fill); bt.dataset.char=b.character;
    var vis=b.visN? b.visSum/b.visN : null;
    var levels=[fmtName(b.category)]; if(b.sub) levels.push(esc(b.sub)); levels.push(esc(b.name));
    bt.title=levels.join(" · ")+"   "+gLabel(b.gStart)+"-"+gLabel(b.gEnd)+(vis!=null?"  · visibility "+Math.round(vis*100)+"%":"");
    var xn=b.count>1?'<span class="b-x">×'+b.count+'</span>':'';
    var visHtml=vis!=null?'<span class="b-vis" title="Visibility '+Math.round(vis*100)+'%"><span style="height:'+Math.round(vis*100)+'%"></span></span>':'';
    bt.innerHTML='<span class="b-inner">'+
        '<span class="b-line"><span class="b-emoji">'+emojiFor(b.category)+'</span>'+
          '<span class="b-name">'+esc(b.name)+'</span>'+xn+visHtml+'</span>'+
        '<span class="b-time">'+gLabel(b.gStart)+'–'+gLabel(b.gEnd)+'</span>'+
      '</span>';
    if(b.seek!=null){ bt.addEventListener("click",function(){ seekTo(b.seek); }); }
    b._el=bt;
    return bt;
  }

  /* ---- "now" strip: current action per character under the video ---- */
  function buildNowStrip(cols){
    if(!nowStrip) return;
    nowStrip.innerHTML="";
    cols.forEach(function(c){
      var card=el("div","np-card"); card.dataset.char=c.key; card.style.setProperty("--c",c.color);
      card.innerHTML='<span class="np-dotc"></span><span class="np-nm">'+esc(c.short||c.name)+'</span>'+
                     '<span class="np-act" data-act="'+c.key+'">—</span>';
      nowStrip.appendChild(card);
    });
  }
  function currentBlock(key,t){
    var arr=perChar[key]||[], cur=null;
    for(var i=0;i<arr.length;i++){ if(arr[i].vStart!=null && arr[i].vStart<=t) cur=arr[i]; else if(arr[i].vStart>t) break; }
    return (cur && t<cur.vEnd)? cur : null;
  }

  var lastGame=null;
  function onTime(){
    var t=player.currentTime, recent=null;
    for(var i=0;i<allBlocks.length;i++){ if((allBlocks[i].vStart||0)<=t) recent=allBlocks[i]; else break; }
    if(recent && recent.gStart!==lastGame){ gameClock.innerHTML=gLabel(recent.gStart)+"<small>in-game</small>"; lastGame=recent.gStart; }
    (CFG._chars||[]).forEach(function(c){
      var cur=currentBlock(c.key,t);
      var slot=nowStrip&&nowStrip.querySelector('[data-act="'+c.key+'"]');
      if(slot){ slot.textContent=cur?cur.name:"—"; slot.classList.toggle("idle",!cur); }
      if(c._now && c._now!==cur && c._now._el) c._now._el.classList.remove("now");
      if(cur && cur._el) cur._el.classList.add("now");
      c._now=cur;
    });
  }

  function wireBib(){
    var pre=document.getElementById("bibtex"); if(!pre) return;
    pre.style.cursor="pointer"; pre.title="Click to copy";
    pre.addEventListener("click",function(){ navigator.clipboard.writeText(pre.textContent).then(function(){
      var o=pre.style.background; pre.style.background="#d7f5dd"; setTimeout(function(){pre.style.background=o;},500);
    }); });
  }

  function loadDay(day){
    if(!day) return;
    var note=player.parentElement.querySelector(".video-note"); if(note) note.remove();
    var src=dayVideoSrc(day);
    if(src){ player.src=src; if(player.load) player.load(); }
    else { var n=el("div","video-note"); n.innerHTML="Video for this day isn’t ready yet (still encoding) or not configured."; player.parentElement.appendChild(n); }
    // per-day "Full 1080p original" download link (hidden until its HF URL is real)
    var fl=document.querySelector('[data-link="fullvideo"]');
    if(fl){
      if(!isPlaceholder(day.full)){ fl.href=day.full; fl.target="_blank"; fl.rel="noopener"; fl.style.display=""; }
      else fl.style.display="none";
    }
    lastGame=null;
    if(gameClock) gameClock.innerHTML="06:00<small>in-game</small>";
    scheduleEl.innerHTML='<div class="loading">Loading day '+esc(day.id)+'&#8230;</div>';
    fetch(day.data).then(function(r){ if(!r.ok) throw new Error("HTTP "+r.status); return r.json(); })
      .then(function(data){ CFG._chars=data.characters||[]; render(data); })
      .catch(function(e){ scheduleEl.innerHTML='<div class="loading">Could not load '+esc(day.data)+' ('+esc(e.message)+').</div>'; });
  }

  function init(){
    player=document.getElementById("player");
    scheduleEl=document.getElementById("schedule");
    gameClock=document.getElementById("game-clock");
    nowStrip=document.getElementById("now-strip");
    wireLinks(); wireBib();
    player.addEventListener("timeupdate",onTime);
    player.addEventListener("error",function(){
      var p=player.parentElement; if(p.querySelector(".video-note")) return;
      var n=el("div","video-note"); n.innerHTML="This day&#8217;s video is still encoding &#8212; reload in a minute (the schedule below already works)."; p.appendChild(n);
    });

    var days=CFG.days||[];
    var picker=document.getElementById("day-picker");
    if(picker){
      days.forEach(function(d,i){ var o=document.createElement("option"); o.value=i; o.textContent=d.label; picker.appendChild(o); });
      picker.addEventListener("change",function(){ loadDay(days[+picker.value]); });
    }
    if(days.length) loadDay(days[0]);
    else scheduleEl.innerHTML='<div class="loading">No days configured.</div>';
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init); else init();
})();
