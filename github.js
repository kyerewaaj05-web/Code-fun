(function(){
"use strict";
var $=function(i){return document.getElementById(i)};
var A=window.AWC||{};
var pick=function(a){return a[Math.floor(Math.random()*a.length)]};
var HI="\uD83D\uDE4F";
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}

/* Apply form */
$("apply").addEventListener("submit",function(e){
 e.preventDefault();
 var n=$("nick").value.trim().slice(0,20);if(!n||!$("prom").checked)return;
 $("done-t").textContent="Welcome, "+n+". Favourite bug: "+$("bug").value+". Reason: "+$("why").value+". Please make it public.....";
 $("apply").hidden=true;$("done").hidden=false;$("done").scrollIntoView({behavior:"smooth",block:"nearest"});
});

/* Repos */
var R=[["final-final-v2","The final version. Again.",3,"fix again"],["works-on-my-machine","Only works on one laptop.",12,"trust me"],["test123","Nobody knows what this is.",0,"why"],["my-first-website-REAL","The real one. Really.",7,"final"],["do-not-delete","Please delete.",1,"update update"],["untitled-folder-7","Folders 1 to 6 are lost.",2,"maybe fixed"]];
R.forEach(function(r){var c=el("div","card"),top=el("div","repo");
 top.append(el("b",0,r[0]),el("span","pill","Public"));
 c.append(top,el("p","muted",r[1]),el("p","muted","\u2605 "+r[2]+"   Last commit: \""+r[3]+"\""));$("repos").append(c)});

/* Commit messages */
var C=["fix","fix again","fix fix","final","final final","final v2","works now","why","I do not know what I did","trust me","tiny change (huge change)","forgot a semicolon","removed the bug (added three)","it compiled, do not touch","update","update update","maybe fixed","please work","Sir E said ok.....","read the error this time"];
var lastC="";
function gen(){var m;do{m=pick(C)}while(m===lastC&&C.length>1);lastC=m;$("cmsg").textContent="git commit -m \""+m+"\""}
$("cgo").onclick=gen;
$("ccp").onclick=function(){if(!lastC)return;var t="git commit -m \""+lastC+"\"";
 var ok=function(){$("cmsg").textContent=t+"  (copied)"};
 if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(ok,function(){});else ok()};

/* Contribution graph: 20 weeks x 7 days */
function graph(busy){var g=$("graph");g.textContent="";
 for(var i=0;i<140;i++){var c=document.createElement("i"),lv=0;
  if(busy)lv=Math.random()<.85?1+Math.floor(Math.random()*4):0;
  else lv=(i===3||i===4||i===71)?1:0;
  if(lv)c.className="l"+lv;g.append(c)}
 $("gnote").textContent=busy?"Looking very busy. Suspicious.....":"3 squares, all from the first week. The honest version."}
$("busy").onclick=function(){graph(true)};$("honest").onclick=function(){graph(false)};graph(false);

/* Public simulator */
var pub=true;
$("vtog").onclick=function(){pub=!pub;
 $("vstate").textContent=pub?"Public":"Private";
 $("vtxt").textContent=pub?"Visitors can see it.":"Only you can see it.";
 $("vtog").textContent=pub?"Switch to Private":"Switch to Public";
 $("vmsg").textContent=pub?"Sir E: Ok....."+HI:"Sir E: Sir I cannot see it....."};

/* Poll */
$("pr").onclick=function(){$("pm").textContent="Vote counted. Soldiers are always ready."};
$("pn").onclick=function(){$("pm").textContent="Vote rejected: soldiers are always ready....."};
})();
