(function(){
"use strict";
var $=function(s,r){return(r||document).querySelector(s)};
var mk=function(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e};
var wrap=function(st){return{get:function(k,d){try{var v=st.getItem(k);return v===null?d:v}catch(e){return d}},set:function(k,v){try{st.setItem(k,v)}catch(e){}}}};
var ls=wrap(window.localStorage||{getItem:function(){return null},setItem:function(){}});
var ss=wrap(window.sessionStorage||{getItem:function(){return null},setItem:function(){}});
var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ===== DEPARTMENTS: pages are detected automatically. Upload a page and it goes live. ===== */
var D=[
["binary","Binary Lab","Say it in 0s and 1s. Sir E will say Ok.....",true],
["resume","Resume Office","Turn nothing into a one-page CV.",false],
["github","GitHub Accounts","Account created. Make sure it is public.....",false],
["teacher","Teacher AI","Ask Sir E anything. Get dots.",true],
["roster","Class Registry","23 coders. 0 working projects.",false],
["vault","The Vault","Escape the computer lab. Bring a charger.",false],
["games","Games Arcade","Squash bugs before they squash you.",false],
["awards","Awards and Certificates","Prizes for things nobody should win.",false],
["timetable","Timetable Office","The class timetable. The real one is worse.",false],
["notice","Notice Board","Important notices, mostly dots.....",false],
["excuse","Excuse Office","Fresh excuses, baked daily.",false],
["exam","Final Exam Hall","Four questions. No pressure. Some pressure.",false],
["shame","Hall of Shame","The most tabs ever opened.",false],
["museum","Cursed Code Museum","Terrible code, displayed with respect.",false],
["bug-of-the-week","Bug of the Week","This week's star bug.",false],
["complaints","Complaints Desk","Wi-Fi, batteries and the class fan.",false],
["canteen","Canteen","Semicolon soup. Tab-hoarder toast.",false],
["lost-found","Lost and Found","One semicolon found inside a div.",false],
["bug-court","Bug Court","Find the guilty line.",false],
["group-chat","Group Chat Archive","Missed voice call: 1 joined.",false],
["library","Library","HTML for Beginners (Chapter 1 of 47).",false],
["graduation","Graduation Hall","Doctor of Almost Working Code.",false],
["clinic","Health Clinic","Debugging your feelings. Drink water.",false]
];
/* ========================================================================= */

var DEFAULTS={banner:{on:true,text:"Sir E has entered the chat....."}};

function toast(m){var t=$("#toast");if(!t){t=mk("div");t.id="toast";t.setAttribute("role","status");document.body.append(t)}
 t.textContent=m;t.style.display="block";clearTimeout(t._h);t._h=setTimeout(function(){t.style.display="none"},3200)}

function setTheme(t){document.documentElement.setAttribute("data-theme",t);ls.set("awc-theme",t)}
function setLite(on){document.documentElement.classList.toggle("lite",on);ls.set("awc-lite",on?"1":"0")}

function link(href,text){var a=mk("a",0,text);a.href=href;if(location.pathname.split("/").pop()===href)a.setAttribute("aria-current","page");return a}

function buildHeader(){
 var host=$("#site-header");if(!host)return;
 var h=mk("header","hdr"),w=mk("div","wrap hdr-in");
 var logo=mk("a","logo","Almost Working Code");logo.href="index.html";
 var nav=mk("nav","nav");nav.setAttribute("aria-label","Main");
 nav.append(link("index.html","Home"));
 D.filter(function(d){return d[3]}).slice(0,5).forEach(function(d){nav.append(link(d[0]+".html",d[1]))});
 nav.append(link("index.html#departments","All departments"));
 var tools=mk("div","tools");
 var fan=mk("button","fan","\uD83C\uDF00");fan.type="button";fan.title="Class fan status";fan.setAttribute("aria-label","Class fan status");
 fan.onclick=function(){toast("Ticket #1: the class fan is still not working.....")};
 var th=mk("button","btn small");th.type="button";
 var lt=mk("button","btn small");lt.type="button";
 function lab(){th.textContent=document.documentElement.getAttribute("data-theme")==="light"?"Dark mode":"Light mode";
  lt.textContent=document.documentElement.classList.contains("lite")?"Lite: on":"Lite: off"}
 th.onclick=function(){setTheme(document.documentElement.getAttribute("data-theme")==="light"?"dark":"light");lab();rainColor()};
 lt.onclick=function(){setLite(!document.documentElement.classList.contains("lite"));lab()};
 lab();tools.append(fan,th,lt);w.append(logo,nav,tools);h.append(w);host.replaceWith(h);
}

function buildFooter(){
 var host=$("#site-footer");if(!host)return;
 var f=mk("footer"),w=mk("div","wrap");
 w.append(mk("p",0,"This is a parody. Not a real department. Nothing here is a real person, and any resemblance is a bug."));
 w.append(mk("p",0,"Made by the Chief Bug Officer. Sir E has been asked to fix the fan....."));
 var nv=mk("p");[["about.html","About"],["privacy.html","Privacy"],["register.html","Sign the Class Register"],["feedback.html","Feedback"],["rival.html","Rival"]].forEach(function(l,i){if(i)nv.append(document.createTextNode(" | "));var a=mk("a",0,l[1]);a.href=l[0];nv.append(a)});w.append(nv);
 f.append(w);host.replaceWith(f);
}

function banner(s){
 var host=$("#banner");if(!host||ss.get("awc-banner")==="x")return;
 var b=s&&s.banner?s.banner:DEFAULTS.banner;if(!b.on||!b.text)return;
 var bar=mk("div","bar",String(b.text)),x=mk("button",0,"\u00D7");x.type="button";x.setAttribute("aria-label","Close announcement");
 x.onclick=function(){bar.remove();ss.set("awc-banner","x")};bar.append(x);host.append(bar);
}
function loadSettings(){
 fetch("settings.json").then(function(r){return r.ok?r.json():DEFAULTS}).catch(function(){return DEFAULTS}).then(banner);
}

function loader(){
 if(reduce||ss.get("awc-loaded"))return;ss.set("awc-loaded","1");
 var L=mk("div");L.id="loader";L.setAttribute("role","status");
 var msg=mk("p"),bar=mk("div","bar"),fill=mk("i"),skip=mk("button","btn alt small","Skip");skip.type="button";
 bar.append(fill);L.append(mk("h2",0,"Laptops assemble....."),bar,msg,skip);document.body.append(L);
 var M=["Counting ready soldiers: 23/23","Searching for the missing semicolon.....","Asking Sir E for permission.....","Pushing to main (do not tell anyone).....","Loading 01001000 01101001"];
 var i=0,p=0,t=setInterval(function(){p+=22;fill.style.width=Math.min(p,100)+"%";msg.textContent=M[i++%M.length];if(p>=110)done()},330);
 function done(){clearInterval(t);L.remove()}skip.onclick=done;skip.focus();
}

function cookie(){
 if(ls.get("awc-biscuit"))return;
 var c=mk("div");c.id="cookie";c.setAttribute("role","dialog");c.setAttribute("aria-label","Cookie notice");
 c.append(mk("p",0,"We use cookies. The biscuit kind. Please bring some. (No tracking cookies here.)"));
 var r=mk("div","row"),a=mk("button","btn small","Accept biscuit"),d=mk("button","btn alt small","Decline biscuit");
 a.type=d.type="button";
 a.onclick=function(){ls.set("awc-biscuit","1");c.remove();toast("Biscuit accepted. Crumbs everywhere.")};
 d.onclick=function(){ls.set("awc-biscuit","1");c.remove();toast("Declined. Sir E is disappointed.....")};
 r.append(a,d);c.append(r);document.body.append(c);
}

var rainCol="#7b3fe4";
function rainColor(){rainCol=getComputedStyle(document.documentElement).getPropertyValue("--violet").trim()||rainCol}
function rain(){
 var cv=$("#rain");if(!cv||reduce)return;var cx=cv.getContext("2d"),cols=[],fs=16;
 function size(){cv.width=innerWidth;cv.height=innerHeight;cols=[];for(var i=0;i<Math.floor(cv.width/fs);i++)cols.push(Math.random()*cv.height/fs)}
 size();addEventListener("resize",size);rainColor();
 setInterval(function(){
  if(document.hidden||document.documentElement.classList.contains("lite"))return;
  cx.fillStyle=document.documentElement.getAttribute("data-theme")==="light"?"rgba(247,243,255,.12)":"rgba(20,10,48,.12)";
  cx.fillRect(0,0,cv.width,cv.height);cx.fillStyle=rainCol;cx.font=fs+"px monospace";
  cols.forEach(function(y,i){cx.fillText(Math.random()<.5?"0":"1",i*fs,y*fs);cols[i]=y*fs>cv.height&&Math.random()>.975?0:y+1});
 },90);
}

function home(){
 var g=$("#grid");if(!g)return;
 D.forEach(function(d,i){
  var a=mk(d[3]?"a":"div","card dept"+(d[3]?"":" soon"));if(d[3])a.href=d[0]+".html";
  a.append(mk("div","n","#"+(i+1)),mk("h3",0,d[1]),mk("p","muted",d[2]));
  if(!d[3])a.append(mk("span","status","Under construction: Sir E is fixing the fan....."));
  g.append(a);
 });
 var oc=$("#oksir"),n=parseInt(ls.get("awc-oksir","0"),10)||0;
 function show(){if(oc)oc.textContent=n}show();
 var ob=$("#oksirbtn");if(ob)ob.onclick=function(){n++;ls.set("awc-oksir",String(n));show()};
 var pm=$("#pollmsg"),pr=$("#pollready"),pn=$("#pollnot");
 if(pr)pr.onclick=function(){pm.textContent="Vote counted. Soldiers are always ready."};
 if(pn)pn.onclick=function(){pm.textContent="Vote rejected: soldiers are always ready....."};
 var tk=$("#ticker");
 if(tk){var H=["Breaking: someone pushed to main again.","Update: the class fan is still not working.....","Missed voice call: 1 joined.","Sir E typed..... then deleted it.","Scientists confirm: it works on my machine."],k=0;
  tk.textContent=H[0];setInterval(function(){k=(k+1)%H.length;tk.textContent=H[k]},4200)}
}

function probe(){
 try{var c=JSON.parse(ss.get("awc-ready","null"));if(c&&Date.now()-c.t<300000){D.forEach(function(d){d[3]=!!c.o[d[0]]});return Promise.resolve()}}catch(e){}
 return Promise.all(D.map(function(d){return fetch(d[0]+".html",{method:"HEAD"}).then(function(r){d[3]=r.ok}).catch(function(){d[3]=true})}))
  .then(function(){var o={};D.forEach(function(d){o[d[0]]=d[3]});ss.set("awc-ready",JSON.stringify({t:Date.now(),o:o}))});
}
var buf="";
function secret(){
 document.addEventListener("keydown",function(e){
  var t=e.target&&e.target.tagName;if(t==="INPUT"||t==="TEXTAREA"||t==="SELECT"||e.ctrlKey||e.metaKey||e.altKey||!e.key||e.key.length!==1)return;
  buf=(buf+e.key.toLowerCase()).slice(-12);
  if(/detention$/.test(buf)){buf="";toast("Sir E: See me after class.....");setTimeout(function(){location.href="detention.html"},900)}
  else if(/binary$/.test(buf)){buf="";var r=$("#rain");toast("01001111 01001011 (OK)");if(r){r.style.opacity="1";setTimeout(function(){r.style.opacity=""},5000)}}
 });
}
function init(){
 if(ls.get("awc-lite")==="1")document.documentElement.classList.add("lite");
 secret();rain();loader();cookie();loadSettings();
 probe().then(function(){buildHeader();buildFooter();home()});
}
window.AWC={D:D,ls:ls,ss:ss,mk:mk,toast:toast};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
