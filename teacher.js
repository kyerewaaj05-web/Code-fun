(function(){
"use strict";
var $=function(i){return document.getElementById(i)};
var A=window.AWC||{},ls=A.ls||{get:function(k,d){return d},set:function(){}};
var log=$("log"),inp=$("msg"),send=$("send"),stat=$("stat"),busy=false,last="",used={},chipsEl=$("chips"),mode="";
var HI="\uD83D\uDE4F",LOL="\uD83D\uDE02";

/* ===== Sir E's brain: edit the replies here ===== */
var I=[
{id:"ok",re:/^ok( sir)?\W*$/,r:["Ok.....","Good.....","Sit down....."]},
{id:"who",re:/(who are you|are you real|are you ai|are you a robot|are you sir)/,r:["I am a parody of a teacher, written for fun. Not the real Sir E, and not a real AI.....","I only know scripted answers. Please read the footer....."+HI]},
{id:"wc",re:/(which coder|coder am i|what coder|personality)/,go:{href:"quiz.html",label:"Take the quiz"},r:["Take the quiz. Do not overthink it.....","Eight questions. Ok.....","Find your fictional self....."]},
{id:"quiz",re:/(pop quiz|quiz|test me)/,r:["Pop quiz. Three questions. No phones.....","Close your books. Quiz time....."],fn:quiz},
{id:"roll",re:/(roll call|attendance|register)/,r:["Everyone sit down....."],fn:roll},
{id:"call",re:/(call sir e|voice call|call you|\bring\b)/,r:["Calling Sir E....."],fn:call},
{id:"bye",re:/(goodbye|\bbye\b|\bleave\b|\bexit\b|see you)/,r:["Class dismissed....."],fn:bye},
{id:"hi",re:/^(hi|hello|hey|morning|evening|good (morning|afternoon|evening))\b/,r:["Good morning class.....","Hello. Did you bring your laptop?.....","Welcome. Sit down....."]},
{id:"resume",re:/\b(resume|cv)\b/,go:"resume",r:[[LOL+".....","A resume is one page that shows who you are, what you can do and why someone should pick you. Name, skills, projects....."],"Put your best project first. Add your GitHub link. Make sure it is public....."+HI,"Keep it to one page. No spelling mistakes....."]},
{id:"git",re:/\b(github|git hub|repo|repository|commit|pages|publish|public)\b/,go:"github",r:["Make sure your repository is public....."+HI,"Upload your index.html. Then open Settings, then Pages.....","Commit small. Commit often.....","Never put passwords or private details in a repository....."]},
{id:"bin",re:/(binary|bits|byte|\b01)/,go:"binary",r:["Eight bits make one byte.....","Use the Binary Lab. Translate, then explain it to me.....","01001000 01101001. Ok....."]},
{id:"web",re:/(website or app|web or app|app or web|which is best|website)/,r:["Both work. I recommend website first.....","Start with a website. Every phone opens it.....","HTML first. App later....."]},
{id:"hw",re:/(homework|assignment|try work|task|project)/,gen:function(){var n=3+Math.floor(Math.random()*7);return["Try work-"+n+":","Build "+pick("hwt",TASKS)+".....",pick("hwx",TWISTS)]}},
{id:"lost",re:/(\blost\b|lost and found|where is my)/,go:"lost-found",r:["Check Lost and Found.....","One semicolon is waiting to be claimed.....","Not yours. Probably....."]},
{id:"lap",re:/(laptop|charger|charged|battery)/,r:["Hands up if your laptop is ready.....","Charge it before class.....","No charger, no code....."]},
{id:"fan",re:/(\bfan\b|\bhot\b|\bheat\b)/,r:["I will report the fan.....","Noted. Ticket number one.....","The fan is on my list....."]},
{id:"excuse",re:/(excuse|alibi)/,go:"excuse",r:["An excuse? Visit the Excuse Office.....","Fresh excuses are baked daily.....","Do not make excuses. Make branches....."+HI]},
{id:"food",re:/(hungry|canteen|\beat\b|lunch|soup|toast|food)/,go:"canteen",r:["Hungry? The canteen has semicolon soup.....","Eat. Then code.....","Order failed: out of memory..... Ok....."]},
{id:"clinic",re:/(tired|sleepy|sleep|stress|stressed|health|water|break|eyes|headache)/,go:"clinic",r:["Take a break. Drink water.....","Rest your eyes. Look far away for 20 seconds.....","If it feels like too much, talk to a teacher or someone you trust....."+HI]},
{id:"exam",re:/(\bexam\b|marks|\bgrade\b)/,go:"exam",r:["Exams are coming.....","Four questions. No pressure. Some pressure.....","Revise. Then relax....."]},
{id:"vault",re:/(vault|escape|puzzle|riddle)/,go:"vault",r:["Escape the lab. Bring a charger.....","Eight doors. Read each puzzle twice.....","The last door has a surprise about the fan....."]},
{id:"games",re:/(\bgames?\b|arcade|\bplay\b|\bfun\b)/,go:"games",r:["Play after you finish your work.....","Bug Squash first. Then homework.....","Sir E Is Coming is a very realistic game....."]},
{id:"roster",re:/(characters|\bcards?\b|roster|registry)/,go:"roster",r:["Meet the class. Everyone is fictional.....","Flip a card. Find yourself.....","Cards are rare. Like working code....."]},
{id:"awards",re:/(award|prize|certificate|trophy)/,go:"awards",r:["Awards are given for things nobody should win.....","Print your certificate. Frame it.....","Ok. You may have a prize....."]},
{id:"tt",re:/(timetable|schedule|period|lesson)/,go:"timetable",r:["The timetable is on the timetable page.....","The real one is worse.....","Check which lesson is today....."]},
{id:"notice",re:/(notice|announcement)/,go:"notice",r:["Read the notice board. Then dismiss the notices.....","Ticket number one is pinned.....","All notices are important. Mostly dots....."]},
{id:"shame",re:/(shame|worst|\brecords?\b)/,go:"shame",r:["The Hall of Shame has records.....","Most tabs open: 400. Do not ask.....","Do not try to beat the records....."]},
{id:"museum",re:/(museum|cursed|terrible code|bad code)/,go:"museum",r:["The museum shows terrible code with respect.....","Every exhibit teaches one lesson.....","Do not copy the exhibits....."]},
{id:"lib",re:/(\bbooks?\b|library)/,go:"library",r:["Read a book. Then read the error message.....","The library has one real tip in every book.....","Page 1 is always a joke....."]},
{id:"complain",re:/(complain|complaint|wifi|wi-fi|internet|network)/,go:"complaints",r:["File a ticket at the Complaints Desk.....","Ticket number one is still open.....","The Wi-Fi is in a meeting....."]},
{id:"chat",re:/(group chat|chat archive)/,go:"group-chat",r:["The group chat archive is fictional.....","Missed voice call: 1 joined.....","Tap the binary messages. Decode them....."]},
{id:"court",re:/(\bcourt\b|judge|guilty|trial)/,go:"bug-court",r:["Order in court.....","Find the guilty line.....","The evidence is the error message....."]},
{id:"botw",re:/(bug of the week|wanted)/,go:"bug-of-the-week",r:["A new bug is wanted every week.....","Reward: one Ok.....","Catch it with the tip on the poster....."]},
{id:"grad",re:/(graduat|diploma|degree|doctor)/,go:"graduation",r:["Doctor of Almost Working Code. Congratulations.....","Print your diploma. Frame it.....","Honours in Excuses. Ok....."]},
{id:"fb",re:/(feedback|rating|suggest)/,go:{href:"feedback.html",label:"Open Feedback"},r:["Tell us what is almost working.....","Please do not include names or personal details.....","Ideas are welcome. Ok....."]},
{id:"reg",re:/(sign in|login|log in|nickname)/,go:{href:"register.html",label:"Sign the Class Register"},r:["Sign the class register.....","A nickname is enough.....","It is not a secure login. Never use it for passwords....."+HI]},
{id:"privpage",re:/(privacy|is it safe)/,go:{href:"privacy.html",label:"Read the Privacy page"},r:["Nothing you type is sent anywhere.....","Never type phone numbers or emails.....","Clear everything on the Privacy page....."]},
{id:"rival",re:/(rival|competitor|other site)/,go:{href:"rival.html",label:"Visit the Rival Department"},r:["A friendly rival is healthy.....","Be kind to our rival.....","May the best bugs win....."]},
{id:"time",re:/(time|late|busy|favour|favor|cannot come|can't come|cant come|absent)/,r:["Ok.....","Ok. Send the work when you are ready.....","Time is a bug. Manage it....."+HI]},
{id:"bug",re:/(bug|error|not working|doesn't work|doesnt work|broken|crash|blank)/,r:["Did you save the file?.....","Check your brackets and your closing tags.....","Read the error message from the top.....","Refresh with Ctrl+F5 before you panic....."]},
{id:"stuck",re:/(stuck|help|confused|understand|how do i|how to)/,r:["Which line? Start from line 1.....","Break the problem into small parts.....","Search the exact error message. Then try again.....","Explain the problem out loud. Often you find the answer yourself....."]},
{id:"thx",re:/(thank|thanks|thx)/,r:["Ok.....","You are welcome. Now go and code....."+HI]}
];
var FB=["Please read the question again.....","Which part did you not understand?.....","Ask it in a different way.....","See me after class.....","Ok. Next question....."];
var CHIPS=["What's a resume?","Website or app?","The time doesn't favour me","I made a GitHub account","My code is not working","Is the fan working?","Pop quiz","Roll call","Give me homework","Call Sir E","Which coder am I?","I am hungry","Ok sir","Goodbye"];
var TASKS=["a timetable with a table and borders","a notice board with a list and a link","a page about your favourite food","a page with a heading, a list and a link","a button that changes the page colour","a simple resume page"];
var TWISTS=["Make sure it is public.....","Use at least one heading and one link.....","Do not copy and paste everything.....","Use a nickname, not your full name.....","Test it on a phone.....","Close every tag....."];
var QZ=[["Which tag makes the biggest heading?",["<h1>","<h6>","<p>"],0],["What does Ctrl + S do?",["Saves your file","Sends it to Sir E","Deletes the bug"],0],["How many bits are in one byte?",["4","8","16"],1]];
var PRIV=/(\d[\d\s\-]{6,}\d|\S+@\S+\.\S+)/;
var SAFE=/(suicide|kill myself|hurt myself|self.?harm|want to die|end my life|no reason to live)/;
var BAD=/\b(fuck|shit|bitch|idiot|stupid|dumb|hate you)\b/;
/* ================================================= */

function norm(s){return s.toLowerCase().replace(/[\u2019]/g,"'").replace(/\s+/g," ").trim()}
function ready(s){return(A.D||[]).some(function(d){return d[0]===s&&d[3]})}
function dname(s){var d=(A.D||[]).filter(function(x){return x[0]===s})[0];return d?d[1]:s}
function pick(id,arr){var u=used[id];if(!u||!u.length){u=used[id]=arr.map(function(_,i){return i}).sort(function(){return Math.random()-.5})}return arr[u.pop()]}

function bubble(text,cls,link){
 var b=document.createElement("div");b.className="b "+cls;b.textContent=text;
 if(link){b.append(document.createElement("br"));var a=document.createElement("a");a.href=link.href;a.textContent=link.label;b.append(a)}
 log.append(b);log.scrollTop=log.scrollHeight;return b}

function respond(t){
 var n=norm(t);
 if(PRIV.test(t))return{m:["Please do not type phone numbers or emails here. Nothing is saved, but keep your details private....."+HI],id:"priv"};
 if(SAFE.test(n))return{m:["I am only a parody chat, but how you feel matters.","Please talk to a trusted adult, a teacher or a counsellor today.","If you are in danger, contact your local emergency number or go to someone near you right now."],id:"safe"};
 if(BAD.test(n))return{m:["Please keep it respectful....."],id:"bad"};
 for(var i=0;i<I.length;i++){if(I[i].re.test(n)){
  var r=I[i].gen?I[i].gen():pick(I[i].id,I[i].r);r=Array.isArray(r)?r.slice():[r];
  if(last===I[i].id&&I[i].id!=="ok"&&!I[i].fn&&!I[i].gen)r.unshift("You asked this before.....");
  return{m:r,id:I[i].id,go:I[i].go,fn:I[i].fn}}}
 return{m:[pick("fb",FB)],id:"fb"};
}

function say(msgs,go,done){
 var i=0;
 (function next(){
  if(i>=msgs.length){var lk=!go?null:typeof go==="string"?(ready(go)?{href:go+".html",label:"Go to "+dname(go)}:null):go;if(lk)bubble("Open it here:","e",lk);if(done)done();return}
  var m=msgs[i];stat.textContent="typing.....";var tb=bubble("typing.....","e t");
  setTimeout(function(){tb.remove();bubble(m,"e");if(!mode&&Math.random()<.07)bubble("This message was deleted","e del");stat.textContent="online.....";i++;next()},500+Math.min(m.length*18,1100));
 })();
}

var oks=parseInt(ls.get("awc-oksir","0"),10)||0;$("oks").textContent=oks;
function submit(t){
 t=t.trim().slice(0,200);if(!t||busy)return;busy=true;send.disabled=true;
 bubble(PRIV.test(t)?"(hidden to protect your privacy)":t,"u");inp.value="";
 if(/^ok( sir)?\W*$/.test(norm(t))){oks++;ls.set("awc-oksir",String(oks));$("oks").textContent=oks}
 var r=respond(t);last=r.id;
 say(r.m,r.go,function(){if(r.fn)r.fn();else{busy=false;send.disabled=false;inp.focus()}});
}

function setChips(list,fn){chipsEl.textContent="";list.forEach(function(c){var b=document.createElement("button");b.type="button";b.textContent=c;b.onclick=function(){fn(c)};chipsEl.append(b)})}
function mainChips(){setChips(CHIPS,submit)}
function unlock(){busy=false;send.disabled=false;inp.disabled=false;inp.placeholder="Ask Sir E something.....";mode="";mainChips()}

function quiz(){
 var i=0,s=0;mode="quiz";inp.disabled=true;inp.placeholder="Tap an option.....";ask();
 function ask(){var q=QZ[i];
  say(["Question "+(i+1)+": "+q[0]],null,function(){
   setChips(q[1],function(c){var ok=q[1].indexOf(c)===q[2];bubble(c,"u");if(ok)s++;setChips([],function(){});
    say([ok?"Correct.....":"Not quite. The answer is "+q[1][q[2]]+"....."],null,function(){i++;if(i<QZ.length)ask();else finish()})})})}
 function finish(){var v=["Please read the question again.....","See me after class.....","Not bad. Suspicious.....","Perfect. Who did you copy from?....."][s];
  say(["Score: "+s+" out of "+QZ.length+".",v],null,unlock)}
}
function roll(){
 mode="roll";
 say(["Roll call. Say Ready.....","Captain Semicolon?.....","Null Pointer Pigeon?..... .....","Heisenbug Hippo?..... Maybe present.....","Midnight Pusher?..... Pushed to main at midnight. Absent at 8.....","Class attendance: 1 joined, 22 on the way (Wi-Fi).....","Hands up if your laptop is ready....."],null,function(){
  setChips(["Ready","Not ready this week"],function(c){bubble(c,"u");setChips([],function(){});
   say([c==="Ready"?"Ready counted. Soldiers are always ready.....":"Vote rejected: soldiers are always ready....."],null,unlock)})})}
function call(){
 mode="call";
 bubble("Missed voice call. 1 joined.","e del");
 say(["I will call you back....."],null,unlock)}
function bye(){
 mode="bye";
 say(["Sir E has left the chat. Make sure it is public....."+HI],null,function(){
  bubble("Sir E left the chat","e del");inp.disabled=true;
  setChips(["Restart chat"],function(){inp.disabled=false;start();unlock()})})}

function start(){log.textContent="";last="";bubble("Hello. I am Sir E, a parody teacher. Ask me anything.....","e")}
mainChips();
$("form").addEventListener("submit",function(e){e.preventDefault();submit(inp.value)});
$("clear").onclick=function(){if(!busy)start()};
var chatbox=$("chatbox"),look=$("look");
function setLook(v){if(["neon","terminal","retro"].indexOf(v)<0)v="neon";chatbox.setAttribute("data-look",v);look.value=v;ls.set("awc-look",v)}
look.onchange=function(){setLook(look.value)};setLook(ls.get("awc-look","neon"));
A.respond=respond;
start();
})();
