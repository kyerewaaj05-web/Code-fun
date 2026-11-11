(function(){
"use strict";
var $=function(i){return document.getElementById(i)};
var mode="fake",chaos=0,R={};
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
function shuffle(a){return a.slice().sort(function(){return Math.random()-.5})}
function split(v,re){return v.split(re).map(function(s){return s.trim()}).filter(Boolean)}

var OBJ=["To find a job where nobody checks my commits.","To become a programmer someday. Ok.....","To work somewhere with a working fan.","To fix one bug without creating three.","To centre a div on the first try."];
var SK=["Googling (advanced)","Ctrl+C, Ctrl+V","Centering divs (sometimes)","Saying it works on my machine","Closing 40 tabs","Reading error messages (second try)","Pushing to main at midnight","Naming variables x"];
var EXP=["Chief Excuse Officer, Department of Almost Working Code: fixed 3 bugs, created 9.","Intern, Semicolon Search Team: found 1 semicolon.","Volunteer tester: broke the demo on purpose, once.","Head of Tabs: kept 37 open at all times.","Consultant, Wi-Fi Complaints Desk: complained loudly."];
var PR=["final-final-v2 (still not final)","works-on-my-machine (only on one machine)","my-first-website-REAL (the real one)","test123 (nobody knows)"];
var AW=["Best Use of console.log, 2026","Most Tabs Opened, three years running","Employee of the Month at the Canteen","Fastest to Say Ok sir","Certificate in Turning It Off and On Again"];
var WK=["Too many tabs","Cannot centre a div on the first try","Says five minutes and means three days","Forgets to save"];
var HB=["Collecting final-final-v2 folders","Staring at error messages","Waiting for the Wi-Fi","Counting semicolons"];

function roll(){R={obj:shuffle(OBJ),sk:shuffle(SK),exp:shuffle(EXP),pr:shuffle(PR),aw:shuffle(AW),wk:shuffle(WK),hb:shuffle(HB)}}

function data(){return{name:$("f-name").value.trim(),role:$("f-role").value.trim(),skills:split($("f-skills").value,/[\n,]+/).slice(0,10),proj:split($("f-proj").value,/\n+/).slice(0,5),edu:$("f-edu").value.trim(),gh:$("f-gh").value.trim()}}
function sec(p,title,items){var s=el("div");s.append(el("h3","",title));var u=el("ul");items.forEach(function(x){u.append(el("li","",x))});s.append(u);p.append(s)}

function fake(cv,d){
 sec(cv,"Objective",[chaos?R.obj[0]+" "+R.obj[1]:R.obj[0]]);
 sec(cv,"Skills",d.skills.concat(R.sk.slice(0,2+chaos)));
 sec(cv,"Experience",R.exp.slice(0,Math.min(2+chaos,R.exp.length)));
 sec(cv,"Projects",d.proj.concat(R.pr.slice(0,2)));
 sec(cv,"Education",[d.edu||"Department of Almost Working Code (Honours in Excuses)"]);
 if(chaos)sec(cv,"Awards",R.aw.slice(0,Math.min(1+chaos,R.aw.length)));
 sec(cv,"Weaknesses",R.wk.slice(0,2));
 sec(cv,"Hobbies",R.hb.slice(0,2));
 sec(cv,"References",["Sir E (he will say Ok.....)"]);
}
function serious(cv,d){
 if(d.skills.length)sec(cv,"Skills",d.skills);
 if(d.proj.length)sec(cv,"Projects",d.proj);
 if(d.edu)sec(cv,"Education",[d.edu]);
 if(d.gh)sec(cv,"GitHub",[d.gh]);
 if(!d.skills.length&&!d.proj.length&&!d.edu)sec(cv,"Start here",["Fill in the boxes above and your resume builds itself."]);
}
function checks(d){
 var c=$("checks");c.textContent="";
 if(mode!=="serious"){c.hidden=true;return}
 c.hidden=false;
 var txt=[d.name,d.role,d.skills.join(" "),d.proj.join(" "),d.edu,d.gh].join(" ");
 [[!!d.name,"Has a name or nickname"],[d.skills.length>=3,"At least 3 skills"],[d.proj.length>=2,"At least 2 projects"],[/github/i.test(d.gh),"Has a GitHub link (make sure it is public)"],[txt.length<1800,"Fits on one page"],[!/(\d[\d\s\-]{7,}\d|\S+@\S+\.\S+)/.test(txt),"No phone number or email (keep it private for practice)"]]
 .forEach(function(x){c.append(el("li","",(x[0]?"\u2705 ":"\u26A0\uFE0F ")+x[1]))});
}
function render(){
 var d=data(),cv=$("cv");cv.className="cv t-"+$("tpl").value;cv.textContent="";
 var h=el("div","ch");
 h.append(el("h2","",d.name||(mode==="fake"?"Captain Semicolon":"Your Name")),el("p","",d.role||(mode==="fake"?"Junior Bug Creator":"Aspiring web developer")));
 cv.append(h);
 if(mode==="fake")fake(cv,d);else serious(cv,d);
 checks(d);
}
function setMode(m){
 mode=m;chaos=0;roll();
 $("mfake").setAttribute("aria-pressed",m==="fake");$("mser").setAttribute("aria-pressed",m==="serious");
 $("worse").hidden=$("shuf").hidden=m!=="fake";$("ghw").hidden=m!=="serious";
 $("mnote").textContent=m==="fake"?"Funny sections are added for you. Your own lines are mixed in.":"A clean one-page resume from your own lines. Use a nickname and no phone number. This is practice.";
 render();
}
$("mfake").onclick=function(){setMode("fake")};$("mser").onclick=function(){setMode("serious")};
["f-name","f-role","f-skills","f-proj","f-edu","f-gh"].forEach(function(i){$(i).addEventListener("input",render)});
$("tpl").onchange=render;
$("shuf").onclick=function(){roll();render()};
$("worse").onclick=function(){chaos=Math.min(chaos+1,4);roll();render()};
$("prt").onclick=function(){window.print()};

/* Help desk */
$("helpbtn").onclick=function(){
 var o=$("helpout");o.textContent="";
 o.append(el("div","","\uD83D\uDE02....."),
  el("div","","A resume is a one-page summary of you."),
  el("div","","1. Your story on paper: name, skills, projects, education."),
  el("div","","2. Your quick advert: someone should get you in 30 seconds."),
  el("div","","3. Your ticket to an interview: many places ask for one first."),
  el("div","","Sir E: Keep it to one page. Make sure it is public.....\uD83D\uDE4F"));
};

/* Bullet Roaster */
var WEAK=/^(responsible for|worked on|helped with|helped|duties included|tasked with|in charge of)/i;
var VERB=/^(built|made|created|designed|fixed|wrote|launched|improved|published|tested|learned|solved|organised|organized|developed|added)\b/i;
$("rb-btn").onclick=function(){
 var t=$("rb-in").value.trim().slice(0,200),o=$("rb-out"),m=[];
 if(!t){o.textContent="Type a line first.";return}
 if(WEAK.test(t))m.push("That opening is weak. So who actually did the work?.....");
 else if(!VERB.test(t))m.push("No strong action word at the start. Try Built, Fixed, Created or Designed.");
 if(t.length>110)m.push("Too long. One line, one idea.");
 if(!/\d/.test(t))m.push("No numbers. How many pages, bugs or users?");
 if(/\betc\b/i.test(t))m.push("Never write etc. List the things or cut it.");
 o.textContent=m.length?m.join(" "):"Strong action word, short, with a number. Not bad. Suspicious.....";
};

setMode("fake");
})();
