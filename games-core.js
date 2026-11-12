(function(){
"use strict";
var A=window.AWC||{},ls=A.ls||{get:function(k,d){return d},set:function(){}};
var B={first:["Rookie Coder","Played your first game."],oksir50:["Ok sir x50","Said Ok sir 50 times."],slayer:["Semicolon Slayer","Scored 20 or more in Bug Squash."],brain:["Binary Brain","10 correct binary answers in a row."],vault:["Vault Cracker","Escaped the computer lab."],dots:["Dotmaster","Scored 15 or more in Sir E Is Coming."]};
function list(){try{var a=JSON.parse(ls.get("awc-badges","[]"));return Array.isArray(a)?a:[]}catch(e){return[]}}
window.GC={
 BADGES:B,
 diff:function(){var d=ls.get("awc-diff","normal");return d==="easy"||d==="hard"?d:"normal"},
 setDiff:function(d){ls.set("awc-diff",d)},
 best:function(g){return parseInt(ls.get("awc-best-"+g,"0"),10)||0},
 setBest:function(g,s){if(s>this.best(g)){ls.set("awc-best-"+g,String(s));return true}return false},
 earned:list,
 award:function(id){if(!B[id])return false;var l=list();if(l.indexOf(id)>=0)return false;l.push(id);ls.set("awc-badges",JSON.stringify(l));if(A.toast)A.toast("Badge unlocked: "+B[id][0]);return true},
 share:function(game,score){return"I scored "+score+" on "+game+" in the Department of Almost Working Code. Sir E said Ok....."}
};
})();
