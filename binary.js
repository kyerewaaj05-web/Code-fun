(function(){
"use strict";
var $=function(i){return document.getElementById(i)};
var A=window.AWC||{};
var ls=A.ls||{get:function(k,d){return d},set:function(){}};
var mode="t2b";

/* ---------- Chaos mode ---------- */
var chaos=$("chaos");
function setChaos(on){document.documentElement.classList.toggle("chaos",on);document.body.classList.toggle("chaos",on);chaos.checked=on;ls.set("awc-chaos",on?"1":"0");if(!on)$("sire").textContent=""}
chaos.onchange=function(){setChaos(chaos.checked);run()};
setChaos(ls.get("awc-chaos","0")==="1");
var OK=["Ok.....","Please read the output again.....","Good. Now do it without looking.....","I will check it tomorrow.....","Ok sir. I mean, Ok.....","Make sure it is public.....\uD83D\uDE4F"];
var BAD=["Please read the question again.....","Missing bits. Sir E is disappointed.....","Count again.....","This is why we check our work.....","I have seen worse. Not today.....\uD83D\uDE4F"];
function sire(good){if(!chaos.checked){$("sire").textContent="";return}var p=good?OK:BAD;$("sire").textContent="Sir E: "+p[Math.floor(Math.random()*p.length)]}

/* ---------- Translator ---------- */
function msg(t,withSwitch){var m=$("msg");m.textContent=t||"";
 if(t&&withSwitch){var b=document.createElement("button");b.type="button";b.className="btn small";b.style.marginLeft="10px";b.textContent="Switch to UTF-8";b.onclick=function(){$("enc").value="utf8";run()};m.append(b)}}

function stats(text,bits){var enc=new TextEncoder().encode(text);
 $("s-ch").textContent="Characters: "+Array.from(text).length;
 $("s-by").textContent="Bytes: "+enc.length;
 $("s-bi").textContent="Bits: "+(bits!==undefined?bits:enc.length*8)}

function lines(parts,per,sp){if(!per)return parts.join(sp?" ":"");var o=[];for(var i=0;i<parts.length;i+=per)o.push(parts.slice(i,i+per).join(sp?" ":""));return o.join("\n")}

function toBin(s){
 var ascii=$("enc").value==="ascii";
 if(ascii&&/[^\x00-\x7F]/.test(s)){return{err:"ASCII only covers characters up to 127. Your text has emoji or accented letters.",sw:true}}
 var by=new TextEncoder().encode(s),parts=[];
 by.forEach(function(b){parts.push(b.toString(2).padStart(8,"0"))});
 return{val:lines(parts,parseInt($("lb").value,10),$("sp").checked)};
}
function fromBin(s){
 var c=s.replace(/[\s,]+/g,"");if(!c)return{val:"",bits:0};
 if(/[^01]/.test(c))return{err:"Only 0 and 1 are allowed. Remove the other characters."};
 if(c.length%8!==0)return{err:"The length is "+c.length+" bits. It must be a multiple of 8, so "+(8-c.length%8)+" bit(s) are missing."};
 var by=new Uint8Array(c.length/8);for(var i=0;i<by.length;i++)by[i]=parseInt(c.substr(i*8,8),2);
 if($("enc").value==="ascii"&&by.some(function(b){return b>127})){return{err:"Some bytes are above 127, which ASCII cannot read.",sw:true}}
 try{return{val:new TextDecoder("utf-8",{fatal:true}).decode(by),bits:c.length}}
 catch(e){return{val:new TextDecoder("latin1").decode(by),bits:c.length,note:"These bytes are not valid UTF-8, so they were read as Latin-1."}}
}
function run(){
 var out=$("out"),v=$("inp").value;msg("");
 if(mode==="t2b"){var r=toBin(v);stats(v);
  if(r.err){out.value="";msg(r.err,r.sw);sire(false);return}
  out.value=r.val;sire(true);
 }else{var d=fromBin(v);
  if(d.err){out.value="";stats("",v.replace(/[\s,]+/g,"").length);msg(d.err,d.sw);sire(false);return}
  out.value=d.val;stats(d.val,d.bits);if(d.note)msg(d.note);sire(true);
 }
}
function setMode(m){mode=m;
 $("t2b").setAttribute("aria-pressed",m==="t2b");$("b2t").setAttribute("aria-pressed",m==="b2t");
 $("inl").textContent=m==="t2b"?"Text":"Binary";$("outl").textContent=m==="t2b"?"Binary":"Text";
 $("inp").placeholder=m==="t2b"?"Type something, like: Hello":"Paste binary, like: 01001000 01101001";
 $("spw").hidden=$("lbw").hidden=m!=="t2b";run()}
$("t2b").onclick=function(){setMode("t2b")};$("b2t").onclick=function(){setMode("b2t")};
["inp"].forEach(function(i){$(i).addEventListener("input",run)});
["enc","sp","lb"].forEach(function(i){$(i).addEventListener("change",run)});
$("clr").onclick=function(){$("inp").value="";run();$("inp").focus()};
$("swap").onclick=function(){var r=$("out").value;setMode(mode==="t2b"?"b2t":"t2b");$("inp").value=r;run()};
$("copy").onclick=function(){var o=$("out");if(!o.value){msg("Nothing to copy yet.");return}
 var ok=function(){msg("Copied.")};
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(o.value).then(ok,function(){o.select();document.execCommand("copy");ok()});
 else{o.select();document.execCommand("copy");ok()}};
$("open").onclick=function(){$("file").click()};
$("file").onchange=function(){var f=this.files[0];if(!f)return;
 if(f.size>200000){msg("That file is too big. Please use one under 200 KB.");return}
 var r=new FileReader();r.onload=function(){$("inp").value=String(r.result);run()};r.readAsText(f);this.value=""};
$("dl").onclick=function(){var v=$("out").value;if(!v){msg("Nothing to download yet.");return}
 var a=document.createElement("a"),u=URL.createObjectURL(new Blob([v],{type:"text/plain"}));
 a.href=u;a.download=mode==="t2b"?"binary-result.txt":"text-result.txt";document.body.append(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},500)};
setMode("t2b");

/* ---------- Number converter ---------- */
var busy=false;
function conv(from){if(busy)return;busy=true;var m=$("nmsg");m.textContent="";
 var raw=$("n-"+from).value.trim(),n;
 try{
  if(!raw){["dec","bin","hex"].forEach(function(k){if(k!==from)$("n-"+k).value=""});busy=false;return}
  if(raw.length>200)throw new Error("That number is too long.");
  if(from==="dec"){if(!/^\d+$/.test(raw))throw new Error("Decimal uses digits 0 to 9 only.");n=BigInt(raw)}
  else if(from==="bin"){var b=raw.replace(/\s+/g,"");if(!/^[01]+$/.test(b))throw new Error("Binary uses 0 and 1 only.");n=BigInt("0b"+b)}
  else{var h=raw.replace(/^0x/i,"");if(!/^[0-9a-fA-F]+$/.test(h))throw new Error("Hex uses 0 to 9 and A to F only.");n=BigInt("0x"+h)}
  if(from!=="dec")$("n-dec").value=n.toString(10);
  if(from!=="bin"){var s=n.toString(2);s=s.padStart(Math.ceil(s.length/4)*4,"0").replace(/(.{4})/g,"$1 ").trim();$("n-bin").value=s}
  if(from!=="hex")$("n-hex").value=n.toString(16).toUpperCase();
 }catch(e){m.textContent=(e&&e.message)||"That does not look right.";if(chaos.checked)m.textContent+=" Sir E: Please read the question again....."}
 busy=false}
["dec","bin","hex"].forEach(function(k){$("n-"+k).addEventListener("input",function(){conv(k)})});

/* ---------- Shared ---------- */
function utf8Bits(s){return Array.from(new TextEncoder().encode(s)).map(function(b){return b.toString(2).padStart(8,"0")})}
function el(t,x){var e=document.createElement(t);if(x!==undefined)e.textContent=x;return e}

/* ---------- Name badge ---------- */
function badge(){
 var cv=$("bd-cv"),c=cv.getContext("2d"),name=($("bd-name").value.trim()||"Your Name").slice(0,20);
 var g=c.createLinearGradient(0,0,800,420);g.addColorStop(0,"#7b3fe4");g.addColorStop(.55,"#ff4fa3");g.addColorStop(1,"#ff9a3c");
 c.fillStyle=g;c.fillRect(0,0,800,420);c.fillStyle="rgba(20,10,48,.9)";c.fillRect(16,16,768,388);
 c.textAlign="center";c.fillStyle="#ff9a3c";c.font="700 22px monospace";c.fillText("CODER BADGE | ALMOST WORKING CODE",400,64);
 var size=76;c.fillStyle="#f4f0ff";do{size-=4;c.font="800 "+size+"px Arial, sans-serif"}while(c.measureText(name).width>700&&size>24);
 c.fillText(name,400,170);
 var bits=utf8Bits(name),rows=[];for(var i=0;i<bits.length;i+=6)rows.push(bits.slice(i,i+6).join(" "));
 c.font="16px monospace";c.fillStyle="#38e1ff";rows.slice(0,4).forEach(function(r,k){c.fillText(r,400,232+k*26)});
 if(rows.length>4)c.fillText("...",400,336);
 c.fillStyle="#b9acd9";c.font="18px monospace";c.fillText("Sir E says: Ok.....",400,386);
}
$("bd-name").addEventListener("input",badge);
$("bd-dl").onclick=function(){badge();$("bd-cv").toBlob(function(b){if(!b)return;var a=document.createElement("a"),u=URL.createObjectURL(b);a.href=u;a.download="my-binary-badge.png";document.body.append(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},500)})};

/* ---------- Binary clock ---------- */
var cols=[],maxBits=[2,4,3,4,3,4];
(function(){var host=$("clock");for(var i=0;i<6;i++){var col=el("div");col.className="col";var dots=[];
 for(var r=0;r<4;r++){var d=el("div");d.className="dot";col.append(d);dots.push(d)}
 var n=el("div");n.className="dn";col.append(n);host.append(col);cols.push({dots:dots,n:n});
 if(i===1||i===3){var g=el("div");g.className="gap";host.append(g)}}})();
function tick(){
 if(document.hidden||$("ck").hidden)return;
 var t=new Date(),s=[t.getHours(),t.getMinutes(),t.getSeconds()].map(function(x){return(x<10?"0":"")+x}).join("");
 cols.forEach(function(c,i){var dgt=parseInt(s.charAt(i),10);
  c.dots.forEach(function(d,r){var w=8>>r,used=r>=4-maxBits[i];d.className="dot"+(used?(dgt&w?" on":""):" x")});
  c.n.textContent=$("ck-num").checked?s.charAt(i):""});
 $("ck-time").textContent="Time now: "+s.slice(0,2)+":"+s.slice(2,4)+":"+s.slice(4,6)+" (24-hour)";
}
setInterval(tick,1000);$("ck-num").addEventListener("change",tick);

/* ---------- Cheat sheet ---------- */
function csTable(title,chars){
 var t=el("table");t.className="pv cs";var cap=el("caption",title);t.append(cap);
 var h=el("tr");["Char","Dec","Binary"].forEach(function(x){h.append(el("th",x))});t.append(h);
 chars.forEach(function(ch){var code=ch.charCodeAt(0),tr=el("tr");
  [ch===" "?"space":ch,String(code),code.toString(2).padStart(8,"0")].forEach(function(x){tr.append(el("td",x))});t.append(tr)});
 return t}
(function(){var U="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),L=U.map(function(x){return x.toLowerCase()}),
 N="0123456789".split(""),P=" !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~".split("");
 $("cs-body").append(csTable("Capital letters",U),csTable("Small letters",L),csTable("Digits",N),csTable("Space and symbols",P))})();
$("cs-print").onclick=function(){window.print()};

/* ---------- Daily message ---------- */
var MSG=["One bug at a time, coder.","Your code will run one day.","Small steps still compile.","Mistakes mean you are trying.","Ask for help. Coders do.","Take a break. Drink water.","Great job. Now save your work.","Every expert wrote bad code.","Today you learn something new.","Keep going. The bug is near.","Check line 12. And line 13.","Did you save the file?","It works. Do not touch it.","Close your tags, please.","Ctrl plus S is free.","Too many tabs. Close three.","The semicolon was never lost.","Final final v2 is not a plan.","Read the error message first.","It was a typo. It is always a typo."];
function dayNum(){var t=new Date();return Math.floor(Date.UTC(t.getFullYear(),t.getMonth(),t.getDate())/86400000)}
function norm(s){return s.toLowerCase().replace(/[^a-z0-9 ]+/g," ").replace(/\s+/g," ").trim()}
var dm=MSG[dayNum()%MSG.length],dmBin=utf8Bits(dm).join(" ");
$("dm-bin").textContent=dmBin;
function streak(){$("dm-streak").textContent=ls.get("awc-dm-streak","0")}streak();
function dsire(t){$("dm-sire").textContent=chaos.checked?t:""}
$("dm-chk").onclick=function(){var v=$("dm-in").value,m=$("dm-msg");
 if(!norm(v)){m.textContent="Type your answer first.";return}
 if(norm(v)===norm(dm)){var n=dayNum(),last=parseInt(ls.get("awc-dm-last","-1"),10),st=parseInt(ls.get("awc-dm-streak","0"),10)||0;
  if(last!==n){st=(last===n-1)?st+1:1;ls.set("awc-dm-last",String(n));ls.set("awc-dm-streak",String(st))}
  streak();m.textContent="Decoded! "+dm;dsire("Sir E: Ok.....")}
 else{m.textContent="Not quite. Check your bytes and try again.";dsire("Sir E: Please read the question again.....")}};
$("dm-hint").onclick=function(){$("dm-msg").textContent="Hint: "+dm.length+" characters, and the first word is \""+dm.split(" ")[0]+"\"."};
$("dm-rev").onclick=function(){$("dm-msg").textContent="Answer: "+dm;dsire("Sir E: Next time try it yourself.....")};
$("dm-send").onclick=function(){setMode("b2t");$("inp").value=dmBin;run();show("tr");history.replaceState(null,"","#tr")};

/* ---------- Tabs ---------- */
var tabs=document.querySelectorAll("[role=tab]");
function show(id){tabs.forEach(function(t){var on=t.dataset.tab===id;t.setAttribute("aria-selected",on);$(t.dataset.tab).hidden=!on});if(id==="ck")tick();if(id==="bd")badge()}
tabs.forEach(function(t){t.onclick=function(){show(t.dataset.tab);history.replaceState(null,"","#"+t.dataset.tab)}});
var h=location.hash.slice(1);if(h&&$(h)&&document.querySelector('[data-tab="'+h+'"]'))show(h);
})();
