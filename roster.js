(function(){
"use strict";
var $=function(i){return document.getElementById(i)},A=window.AWC||{};
var ls=A.ls||{get:function(k,d){return d},set:function(){}};
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
var P=[],filt="all",seen=[],LAB={bugs:"Bugs Created",tabs:"Tabs Open",oksir:"Ok Sir Count",excuse:"Excuse Power"},RO={Common:0,Rare:1,Epic:2,Legendary:3,Mythic:4};
try{seen=JSON.parse(ls.get("awc-seen","[]"));if(!Array.isArray(seen))seen=[]}catch(e){seen=[]}
function bits(s){return Array.from(new TextEncoder().encode(s)).map(function(b){return b.toString(2).padStart(8,"0")}).join(" ")}
function say(id,t){$(id).textContent=t}

/* ---------- Cards ---------- */
function card(p,play){
 var a=el("article","pc r-"+String(p.rarity||"Common").toLowerCase());a.id="c-"+p.id;
 if(p.hidden){a.append(el("div","em","\u2753"),el("h3","","Mystery Coder"),el("div","tt","Card loading....."));return a}
 var f=el("div"),k=el("div","bk");k.hidden=true;
 f.append(el("div","em",p.emoji),el("h3","",p.name),el("div","tt",p.title),el("span","rt",p.rarity));
 if(p.publicFirstName)f.append(el("div","aka","aka "+p.publicFirstName));
 if(p.stats)f.append(el("div","st","\uD83D\uDC1B "+p.stats.bugs+"   \uD83D\uDDC2\uFE0F "+p.stats.tabs));
 if(p.grade)k.append(el("div","gr",p.grade));
 k.append(el("p","",p.roast),el("p","","Sir E: "+p.comment));
 if(p.stats)k.append(el("p","st","Bugs "+p.stats.bugs+" | Tabs "+p.stats.tabs+" | Ok sir "+p.stats.oksir+" | Excuses "+p.stats.excuse));
 k.append(el("div","bn",bits(p.name)));
 var acts=el("div","acts"),fl=el("button","btn small alt","Flip"),me=el("button","btn small","This is me");
 fl.type=me.type="button";me.hidden=true;
 fl.onclick=function(){var open=k.hidden;k.hidden=!open;f.hidden=open;me.hidden=!open||!play;fl.textContent=open?"Back":"Flip";
  if(open&&seen.indexOf(p.id)<0){seen.push(p.id);ls.set("awc-seen",JSON.stringify(seen));count()}};
 me.onclick=function(){ls.set("awc-claim",p.id);welcome();mark()};
 acts.append(fl);if(play)acts.append(me);
 a.append(f,k,acts);a._fl=fl;return a;
}
function count(){
 var n=P.filter(function(p){return seen.indexOf(p.id)>=0}).length;
 say("cnt","Flipped: "+n+" of "+P.length+(n===P.length&&n>0?". Gotta catch all the bugs!":"")+"   Showing: "+$("grid").children.length);
}
function mark(){var c=ls.get("awc-claim","");P.forEach(function(p){var e=$("c-"+p.id);if(e)e.classList.toggle("mine",p.id===c)})}
function welcome(){
 var c=ls.get("awc-claim",""),n=ls.get("awc-cname",""),p=P.filter(function(x){return x.id===c})[0];
 say("welcome",p?"Welcome"+(n?", "+n:"")+". You are "+p.name+" ("+p.rarity+")."+" Sir E: Ok.....":"Pick a card, flip it and press This is me. It is saved only on this device.");
}

/* ---------- List, filter, sort ---------- */
var SORT={bugs:"bugs",tabs:"tabs",oksir:"oksir",excuse:"excuse"};
function view(){
 var q=$("q").value.trim().toLowerCase(),s=$("srt").value,L=P.filter(function(p){
  if(filt!=="all"&&p.type!==filt)return false;
  return !q||(p.name+" "+p.title+" "+p.roast).toLowerCase().indexOf(q)>=0});
 if(s==="rarity")L.sort(function(a,b){return RO[b.rarity]-RO[a.rarity]});
 else if(SORT[s])L.sort(function(a,b){return b.stats[s]-a.stats[s]});
 var g=$("grid");g.textContent="";L.forEach(function(p){g.append(card(p,true))});
 if(!L.length)g.append(el("p","muted","No characters found. Sir E: Please read the question again....."));
 count();mark();
}
var F=[["all","All"],["archetype","Archetypes"],["creature","Bug creatures"],["title","Titles"]];
function chips(){var c=$("chips");c.textContent="";F.forEach(function(x){var b=el("button","",x[1]);b.type="button";b.setAttribute("aria-pressed",x[0]===filt);b.onclick=function(){filt=x[0];chips();view()};c.append(b)})}
$("q").addEventListener("input",view);$("srt").onchange=view;

/* ---------- Your name ---------- */
var BAD=/\b(fuck|shit|bitch|idiot|stupid|dumb)\b/i;
$("nm").value=ls.get("awc-cname","");
$("nsave").onclick=function(){var v=$("nm").value.trim().replace(/[<>]/g,"").slice(0,20);
 if(BAD.test(v)){say("welcome","Please keep it respectful.....");return}
 ls.set("awc-cname",v);welcome()};
$("nclr").onclick=function(){ls.set("awc-cname","");ls.set("awc-claim","");$("nm").value="";welcome();mark()};

/* ---------- Battle ---------- */
function battle(){
 var a=P.filter(function(p){return p.id===$("ba").value})[0],b=P.filter(function(p){return p.id===$("bb").value})[0];
 if(!a||!b||a.id===b.id){say("bres","Pick two different fighters. Sir E: Please read the question again.....");return}
 var ks=Object.keys(LAB),k=ks[Math.floor(Math.random()*ks.length)],x=a.stats[k],y=b.stats[k];
 say("bres","Sir E picks "+LAB[k]+".....  "+a.name+": "+x+"  vs  "+b.name+": "+y+".  "+(x===y?"Draw. Ok.....":"Winner: "+(x>y?a:b).name+". Ok....."));
}
$("bgo").onclick=battle;

/* ---------- Load ---------- */
fetch("people.json").then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){
 P=(d.people||[]);
 var st=$("staff");(d.special||[]).forEach(function(p){st.append(card(p,false))});
 P.forEach(function(p){if(!p.hidden){$("ba").append(new Option(p.name,p.id));$("bb").append(new Option(p.name,p.id))}});
 if($("bb").options.length>1)$("bb").selectedIndex=1;
 chips();view();welcome();
 var h=location.hash.slice(1),t=h&&$("c-"+h);if(t){t.scrollIntoView();if(t._fl)t._fl.click()}
}).catch(function(){say("cnt","Could not load people.json. Open this page on the website, not as a local file.")});
})();
