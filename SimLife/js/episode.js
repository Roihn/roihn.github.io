/* ============================================================
   Episode explorer — instantiated once per `.episode-root`
     vc223  static rule
     vc250  dynamic rule (evolution + dialogue days)
   ============================================================ */
(function () {
  "use strict";
  var COLORCLASS = { orange:"c-orange", blue:"c-blue", green:"c-green", gray:"c-gray", purple:"c-purple" };
  var STROKE = { orange:"#e69138", blue:"#3b82c4", green:"#4a9d5b", gray:"#9aa0a6", purple:"#7c4dbe" };
  var TYPE_ORDER = ["direct","counterfactual","noise_counterfactual","inverse_counterfactual"];
  var TYPE_LABEL = { direct:"Direct Prediction", counterfactual:"Counterfactual",
                     noise_counterfactual:"Noisy Counterfactual", inverse_counterfactual:"Inverse Counterfactual" };
  var HINT_ORDER = ["none","abstract","explicit"];
  var HINT_LABEL = { none:"No Hint", abstract:"Partial Hint", explicit:"Full Hint" };
  var FMT_LABEL = { binary:"Yes / No", choice:"Statement" };
  var ACT_LABEL = { heavy_lifting:"Heavy lifting", running:"Running", piano_playing:"Piano" };
  var SVGNS = "http://www.w3.org/2000/svg";

  function el(t,c){ var d=document.createElement(t); if(c) d.className=c; return d; }
  function svgEl(t){ return document.createElementNS(SVGNS,t); }
  function esc(s){ return (s==null?"":String(s)).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c];}); }
  function mmdd(iso){ var p=iso.split("-"); return p[1]+"/"+p[2]; }
  function gstart(g){ return g?String(g).split("-")[0]:""; }
  function actName(a){ return ACT_LABEL[a] || (a?String(a).replace(/_/g," "):""); }
  function shortSpeaker(s){ return String(s||"").replace(/\s+(Sim|Bot)$/,""); }
  function variantLabel(t){ return t.kind==="history" ? "History · "+String(t.anchor||"").replace(/_/g," ") : "Standard"; }

  /* one audio element for the whole page: only one clip may play */
  var audioEl=null, playingBtn=null;
  function resetAudioBtn(){
    if(!playingBtn) return;
    playingBtn.classList.remove("playing");
    playingBtn.querySelector(".ic").innerHTML="&#9654;";
    playingBtn.querySelector(".tx").textContent="Hear it";
    playingBtn=null;
  }
  function toggleAudio(btn){
    if(!audioEl){ audioEl=new Audio(); audioEl.addEventListener("ended",resetAudioBtn); }
    if(playingBtn===btn && !audioEl.paused){ audioEl.pause(); resetAudioBtn(); return; }
    if(audioEl.pause) audioEl.pause();
    resetAudioBtn();
    audioEl.src=btn.dataset.audio; audioEl.currentTime=0;
    var p=audioEl.play(); if(p&&p.catch) p.catch(function(){});
    playingBtn=btn; btn.classList.add("playing");
    btn.querySelector(".ic").innerHTML="&#10073;&#10073;";
    btn.querySelector(".tx").textContent="Playing…";
  }

  /* ---------------------------------------------------------- */
  function Episode(root){
    var DATA=null, sec=root.closest("section");
    var state={ date:0, variant:0, type:"direct", hint:"none", fmt:"binary" };
    var raf=null, pending=false;
    var q=function(sel){ return root.querySelector(sel); };

    /* ---- task grouping: one tab per date, variants within ---- */
    function dates(){
      var seen={}, out=[];
      DATA.tasks.forEach(function(t,i){
        if(!(t.pos in seen)){ seen[t.pos]=out.length; out.push({pos:t.pos, idxs:[i]}); }
        else out[seen[t.pos]].idxs.push(i);
      });
      return out;
    }
    function group(){ return dates()[state.date]; }
    function curTask(){ var g=group(); return DATA.tasks[g.idxs[Math.min(state.variant,g.idxs.length-1)]]; }
    function availTypes(t){ var s={}; t.questions.forEach(function(x){ s[x.type]=true; }); return s; }

    /* ---- day strip ---- */
    function buildPanel(host){
      var panel=el("div","ep-panel");
      if(DATA.days.some(function(d){return d.dialogue;})) panel.classList.add("has-dialogue");
      var track=el("div","ep-track");
      var brackets=null;
      if((DATA.phases||[]).length>1){ panel.classList.add("has-brackets");
        brackets=el("div","ep-brackets"); track.appendChild(brackets); }
      var cols=el("div","ep-cols");
      cols.appendChild(el("div","ep-elims"));
      DATA.days.forEach(function(d){
        var cls="ep-day "+(COLORCLASS[d.color]||"c-gray");
        cls += d.dialogue ? " has-gif is-dialogue" : (d.target ? " has-gif" : " no-gif");
        if(d.evolution) cls+=" is-evolution";
        // widen the gap after this day so the elimination rule + its label have room
        if((DATA.eliminations||[]).indexOf(d.pos)>=0) cls+=" pre-elim";
        var col=el("div",cls); col.dataset.pos=d.pos;
        if(DATA.tasks.some(function(t){return t.pos===d.pos;})) col.classList.add("is-task");

        var box=el("div","ep-datebox");
        box.innerHTML='<span class="dw">'+esc(d.dow)+'</span><span class="dd">'+esc(mmdd(d.date))+'</span>';
        col.appendChild(box);

        var body=el("div","ep-body"), acts=el("div","ep-acts");
        acts.appendChild(dots());
        var rows=el("div","ep-rows");
        (d.snapshot||[]).forEach(function(b){
          if(b.target) rows.appendChild(d.dialogue?dialogueBlock(d):gifBlock(d,b));
          else rows.appendChild(chip(b));
        });
        acts.appendChild(rows); acts.appendChild(dots());
        body.appendChild(acts); col.appendChild(body);
        cols.appendChild(col);
      });
      track.appendChild(cols); panel.appendChild(track);
      host.appendChild(panel);
      panel.addEventListener("scroll",scheduleConnectors,{passive:true});
      observeVideos(panel);
      fitTranscripts(panel);
      drawBrackets();
    }

    /* show exactly 2 transcript turns, however many lines each wraps to */
    var SHOW_TURNS=2;
    function fitTranscripts(panel){
      panel.querySelectorAll(".ep-dlg-lines").forEach(function(box){
        var ln=box.querySelectorAll(".ln");
        if(ln.length<=SHOW_TURNS) return;
        var last=ln[SHOW_TURNS-1];
        var h=last.offsetTop+last.offsetHeight-ln[0].offsetTop;
        if(h>0) box.style.maxHeight=h+"px";
      });
    }

    /* thin horizontal brackets marking each rule period (days + task tabs) */
    function drawBrackets(){
      var phases=DATA.phases||[]; if(phases.length<2) return;
      var band=q(".ep-brackets");
      if(band){
        band.innerHTML="";
        phases.forEach(function(ph,i){
          var members=DATA.days.filter(function(d){return d.phase===i;})
            .map(function(d){ return root.querySelector('.ep-day[data-pos="'+d.pos+'"]'); }).filter(Boolean);
          if(!members.length) return;
          var a=members[0], z=members[members.length-1];
          var left=a.offsetLeft, w=Math.max(0, z.offsetLeft+z.offsetWidth-left);
          var b=el("div","ep-bracket "+(COLORCLASS[ph.color]||"c-gray"));
          b.style.left=left+"px"; b.style.width=w+"px";
          b.innerHTML='<span class="lb">'+esc(ph.label)+'</span>';
          band.appendChild(b);
        });
      }
      var tband=q(".ep-task-brackets");
      if(tband){
        tband.innerHTML="";
        var ds=dates();
        phases.forEach(function(ph,i){
          var tabs=ds.map(function(g,k){ return {g:g,tab:root.querySelector('.ep-tab[data-i="'+k+'"]')}; })
            .filter(function(x){ return x.tab && DATA.tasks[x.g.idxs[0]].phase===i; }).map(function(x){return x.tab;});
          if(!tabs.length) return;
          var a=tabs[0], z=tabs[tabs.length-1];
          var left=a.offsetLeft, w=Math.max(0, z.offsetLeft+z.offsetWidth-left);
          var b=el("div","ep-bracket "+(COLORCLASS[ph.color]||"c-gray"));
          b.style.left=left+"px"; b.style.width=w+"px";
          b.innerHTML='<span class="lb">'+esc(ph.label)+'</span>';
          tband.appendChild(b);
        });
      }
    }
    /* vertical rule marking the day after which no wrong hypothesis survives */
    function drawElims(){
      var layer=q(".ep-elims"); if(!layer) return;
      layer.innerHTML="";
      (DATA.eliminations||[]).forEach(function(pos){
        var col=root.querySelector('.ep-day[data-pos="'+pos+'"]'); if(!col) return;
        var m=el("div","ep-elim"); m.dataset.pos=pos;
        var next=col.nextElementSibling;   // centre the rule in the widened gap
        var right=col.offsetLeft+col.offsetWidth;
        m.style.left=(next ? (right+next.offsetLeft)/2 : right+4)+"px";
        m.innerHTML='<span class="lb">all wrong hypotheses eliminated</span>';
        layer.appendChild(m);
      });
    }
    function dots(){ var s=el("div","ep-dots"); s.textContent="⁞"; return s; }
    function chip(b){
      var c=el("div","ep-actrow");
      c.innerHTML='<span class="at">'+esc(gstart(b.game))+'</span><span class="an">'+esc(b.name)+'</span>';
      return c;
    }
    function videoTag(src){ return '<video autoplay muted loop playsinline preload="auto" src="'+esc(src)+'"></video>'; }
    function gifBlock(d,b){
      var t=d.target||{}; var box=el("div","ep-gif");
      box.innerHTML=videoTag(t.clip)+'<div class="ep-gcap"><b>'+esc(t.desc||b.name)+'</b>'+
        '<span class="tm">'+esc(gstart(t.game))+'</span></div>';
      box.querySelector("video").muted=true;
      return box;
    }
    function dialogueBlock(d){
      var dl=d.dialogue, box=el("div","ep-gif is-dialogue");
      var lines=dl.transcript.map(function(t){
        return '<div class="ln"><b>'+esc(shortSpeaker(t.speaker))+':</b> '+esc(t.text)+'</div>';
      }).join("");
      box.innerHTML=videoTag(d.target.clip)+
        '<div class="ep-dlg"><div class="ep-dlg-head"><span class="lbl">'+esc(dl.label)+'</span>'+
          '<button class="ep-audio" type="button" data-audio="'+esc(dl.audio)+'">'+
            '<span class="ic">&#9654;</span><span class="tx">Hear it</span></button></div>'+
          '<div class="ep-dlg-lines">'+lines+'</div></div>';
      box.querySelector("video").muted=true;
      box.querySelector(".ep-audio").addEventListener("click",function(e){ e.stopPropagation(); toggleAudio(this); });
      return box;
    }
    function observeVideos(panel){
      var vids=[].slice.call(panel.querySelectorAll(".ep-gif video"));
      var kick=function(v){ var p=v.play(); if(p&&p.catch) p.catch(function(){}); };
      if(typeof IntersectionObserver!=="function"){ vids.forEach(kick); return; }
      var io=new IntersectionObserver(function(es){
        es.forEach(function(e){ if(e.isIntersecting) kick(e.target); else e.target.pause(); });
      },{ root:panel, rootMargin:"200px", threshold:0 });
      vids.forEach(function(v){ io.observe(v); kick(v); });
    }
    function focusDay(pos, smooth){
      var panel=q(".ep-panel"), col=root.querySelector('.ep-day[data-pos="'+pos+'"]');
      if(!panel||!col) return;
      root.querySelectorAll(".ep-day").forEach(function(c){ c.classList.toggle("focused",c===col); });
      var left=Math.max(0, col.offsetLeft-(panel.clientWidth-col.offsetWidth)/2);
      if(panel.scrollTo){ try{ panel.scrollTo({left:left,behavior:smooth?"smooth":"auto"}); }catch(e){ panel.scrollLeft=left; } }
      else panel.scrollLeft=left;
      scheduleConnectors();
    }

    /* ---- connectors ---- */
    function buildConnectors(host){
      var wrap=el("div","ep-connect-wrap");
      var s=svgEl("svg"); s.setAttribute("class","ep-connect");
      wrap.appendChild(s); host.appendChild(wrap);
    }
    function drawConnectors(){
      var s=q(".ep-connect"), panel=q(".ep-panel");
      if(!s||!panel||!DATA) return;
      var box=s.getBoundingClientRect(), pr=panel.getBoundingClientRect();
      var H=box.height||38, mid=H/2;
      while(s.firstChild) s.removeChild(s.firstChild);
      s.setAttribute("viewBox","0 0 "+(box.width||1000)+" "+H);
      dates().forEach(function(g,i){
        var t=DATA.tasks[g.idxs[0]];
        var col=root.querySelector('.ep-day[data-pos="'+g.pos+'"]');
        var tab=root.querySelector('.ep-tab[data-i="'+i+'"]');
        if(!col||!tab) return;
        var cr=col.querySelector(".ep-datebox").getBoundingClientRect();
        var cx=cr.left+cr.width/2;
        if(pr.width && (cx<pr.left+4 || cx>pr.right-4)) return;
        var tr=tab.getBoundingClientRect();
        var x1=cx-box.left, x2=tr.left+tr.width/2-box.left;
        var c=STROKE[t.color]||"#999", sel=(i===state.date);
        var pl=svgEl("polyline");
        pl.setAttribute("points",[x1+",0",x1+","+mid,x2+","+mid,x2+","+H].join(" "));
        pl.setAttribute("fill","none"); pl.setAttribute("stroke",c);
        pl.setAttribute("stroke-width",sel?"2":"1.2");
        pl.setAttribute("stroke-dasharray","2 3"); pl.setAttribute("opacity",sel?"1":".4");
        s.appendChild(pl);
        var dot=svgEl("circle"); dot.setAttribute("cx",x1); dot.setAttribute("cy","1.5");
        dot.setAttribute("r",sel?"3":"2"); dot.setAttribute("fill",c);
        dot.setAttribute("opacity",sel?"1":".45"); s.appendChild(dot);
      });
    }
    function scheduleConnectors(){
      if(typeof requestAnimationFrame!=="function"){ drawConnectors(); return; }
      if(pending) return; pending=true;
      raf=requestAnimationFrame(function(){ pending=false; drawConnectors(); });
    }
    function trackConnectors(ms){
      if(typeof requestAnimationFrame!=="function"){ drawConnectors(); return; }
      var start=(window.performance&&performance.now)?performance.now():0;
      (function step(){ drawConnectors();
        var t=((window.performance&&performance.now)?performance.now():0)-start;
        if(t<ms) requestAnimationFrame(step);
      })();
    }

    /* ---- task explorer ---- */
    function buildTasks(host){
      var box=el("div","ep-tasks");
      var band=el("div","ep-taskband");
      if((DATA.phases||[]).length>1) band.appendChild(el("div","ep-brackets ep-task-brackets"));
      var tabs=el("div","ep-task-tabs");
      dates().forEach(function(g,i){
        var t=DATA.tasks[g.idxs[0]];
        var b=el("button","ep-tab "+(COLORCLASS[t.color]||"c-gray")); b.dataset.i=i;
        var sub = t.activity? actName(t.activity).toLowerCase() : "no target activity";
        b.innerHTML='<span class="tt-date">'+esc(t.dow)+' '+esc(mmdd(t.date))+'</span>'+
          '<span class="tt-sep">&middot;</span><span class="tt-act">'+esc(sub)+'</span>'+
          '<span class="tt-time">&#9201; question asked at '+esc(t.stop_game)+' (in-game)</span>';
        b.addEventListener("click",function(){ selectDate(i,true); });
        tabs.appendChild(b);
      });
      band.appendChild(tabs); box.appendChild(band);
      var body=el("div","ep-task-body"); box.appendChild(body);
      host.appendChild(box);
    }

    function selectDate(i, focus){
      state.date=i; state.variant=0;
      root.querySelectorAll(".ep-tab").forEach(function(b){ b.classList.toggle("active",+b.dataset.i===i); });
      renderTaskBody();
      if(focus){ focusDay(group().pos,true); trackConnectors(700); }
      else scheduleConnectors();
    }

    function renderTaskBody(){
      var t=curTask(), body=q(".ep-task-body");
      body.className="ep-task-body "+(COLORCLASS[t.color]||"c-gray"); body.innerHTML="";

      var left=el("div","ep-shot");
      left.innerHTML='<img src="'+esc(t.screenshot)+'" alt="video frame at stop time" loading="lazy">'+
        '<div class="cap">'+esc(t.dow)+' '+esc(mmdd(t.date))+' &middot; stopped at '+esc(t.stop_game)+' (in-game)</div>';
      body.appendChild(left);

      var right=el("div","ep-controls");
      var g=group();
      if(g.idxs.length>1){
        var vals=g.idxs.map(function(_,k){return String(k);});
        var labels={}; g.idxs.forEach(function(ti,k){ labels[String(k)]=variantLabel(DATA.tasks[ti]); });
        right.appendChild(seg("TASK","variant",vals,labels,body));
      }
      right.appendChild(seg("QUESTION","type",TYPE_ORDER,TYPE_LABEL,body));
      right.appendChild(seg("FORMAT","fmt",["binary","choice"],FMT_LABEL,body));
      var note=el("div","ep-note"); note.textContent="Randomly picked one in the benchmark."; right.appendChild(note);
      right.appendChild(seg("HINT","hint",HINT_ORDER,HINT_LABEL,body));
      var card=el("div","ep-qcard"); right.appendChild(card);
      body.appendChild(right);
      renderCard(false);
    }

    function seg(label, key, values, labels, body){
      var row=el("div","ep-toggle-row");
      row.appendChild(Object.assign(el("span","lbl"),{textContent:label}));
      var s=el("div","ep-seg"+(key==="hint"?" hint":"")); s.dataset.key=key;
      values.forEach(function(v){
        var b=el("button"); b.textContent=labels[v]; b.dataset.val=v;
        b.addEventListener("click",function(){
          if(b.disabled) return;
          if(key==="variant"){ if(state.variant===+v) return; state.variant=+v; renderCard(false); return; }
          if(state[key]===v) return;
          state[key]=v; renderCard(key==="hint");
        });
        s.appendChild(b);
      });
      row.appendChild(s); return row;
    }

    function setDisabled(b, off){
      b.disabled=off; b.classList.toggle("na",off);
      b.style.cursor = off?"not-allowed":"pointer";
    }

    function renderCard(hintChanged){
      var t=curTask(), body=q(".ep-task-body"), card=q(".ep-qcard");
      var avail=availTypes(t);
      var qq=t.questions.find(function(x){return x.type===state.type;});
      var typeOK=!!qq;

      body.querySelectorAll('.ep-seg[data-key="variant"] button').forEach(function(b){
        b.classList.toggle("on",+b.dataset.val===state.variant); });
      // a question type absent from this task variant is disabled (history has no direct prediction)
      body.querySelectorAll('.ep-seg[data-key="type"] button').forEach(function(b){
        setDisabled(b, !avail[b.dataset.val]);
        b.classList.toggle("on",b.dataset.val===state.type);
      });

      if(!typeOK){
        // nothing to ask -> format + hint are meaningless, so make them non-interactable
        body.querySelectorAll('.ep-seg[data-key="fmt"] button, .ep-seg[data-key="hint"] button')
            .forEach(function(b){ setDisabled(b,true); b.classList.remove("on"); });
        card.innerHTML='<div class="ep-qtype">'+esc(TYPE_LABEL[state.type])+' &middot; unavailable</div>'+
          '<div class="ep-qbody ep-na-msg">Not asked for <b>'+esc(variantLabel(t).toLowerCase())+'</b> tasks &#8212; '+
          'pick another question type.</div>';
        return;
      }

      var availF={binary:!!qq.binary, choice:!!qq.choice};
      var fmt=availF[state.fmt]?state.fmt:(availF.choice?"choice":"binary");
      var slot=qq[fmt];
      body.querySelectorAll('.ep-seg[data-key="fmt"] button').forEach(function(b){
        setDisabled(b, !availF[b.dataset.val]); b.classList.toggle("on",b.dataset.val===fmt); });
      body.querySelectorAll('.ep-seg[data-key="hint"] button').forEach(function(b){
        setDisabled(b,false); b.classList.toggle("on",b.dataset.val===state.hint); });

      var H=t.hints||DATA.hints||{};
      var hintTxt = state.hint==="none" ? "" : (H[state.hint]||"");
      var qhtml = esc(slot.q) + (hintTxt ? ' <span class="ep-hintpar">(<span class="htext">'+esc(hintTxt)+'</span>)</span>' : '');
      var opts=(slot.options||[]).map(function(o){
        var ok=(o===slot.answer);
        return '<span class="ep-opt'+(ok?' correct':'')+'">'+(ok?'<span class="chk">&#10003;</span>':'')+esc(o)+'</span>';
      }).join("");
      card.innerHTML='<div class="ep-qtype">'+esc(TYPE_LABEL[state.type])+' &middot; '+(fmt==="binary"?"binary":"statement")+
          (t.kind==="history"?' &middot; history':'')+'</div>'+
        '<div class="ep-qbody">'+qhtml+'</div><div class="ep-options">'+opts+'</div>';
      if(hintChanged){ var h=card.querySelector(".ep-hintpar"); if(h){ h.classList.remove("flash"); void h.offsetWidth; h.classList.add("flash"); } }
    }

    /* ---- boot this instance ---- */
    this.load=function(){
      root.innerHTML='<div class="ep-loading">Loading episode…</div>';
      fetch(root.dataset.episode).then(function(r){ if(!r.ok) throw new Error("HTTP "+r.status); return r.json(); })
        .then(function(d){
          DATA=d; root.innerHTML="";
          var rule=sec&&sec.querySelector(".ep-rule");
          if(rule){
            var evo=(d.evolution&&d.evolution.length)?
              ' <span class="ep-evo">&#8594; then: '+esc(d.evolution[0].evolution_desc)+'</span>':'';
            rule.innerHTML="<b>The hidden rule:</b> "+esc(d.rule)+evo;
          }
          var leg=sec&&sec.querySelector(".ep-legend");
          if(leg){ leg.innerHTML="";
            Object.keys(d.legend).forEach(function(k){
              var s=el("span","lg"); s.innerHTML='<span class="sw '+COLORCLASS[k]+'"></span>'+esc(d.legend[k]); leg.appendChild(s); }); }
          buildPanel(root); buildConnectors(root); buildTasks(root);
          selectDate(0,false); drawConnectors(); drawBrackets(); drawElims();
          window.addEventListener("resize",function(){ scheduleConnectors(); drawBrackets(); drawElims(); });
          setTimeout(function(){ fitTranscripts(root); drawBrackets(); drawElims(); },120);
        })
        .catch(function(e){ root.innerHTML='<p style="text-align:center;color:#999">Could not load episode ('+esc(e.message)+').</p>'; });
    };
  }

  function init(){
    document.querySelectorAll(".episode-root").forEach(function(root){ new Episode(root).load(); });
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",init); else init();
})();
