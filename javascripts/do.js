//  Copyright (C) 10-11-2014 Jasper den Ouden.
//
//  This is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

var safety = true;

function mayCreateNotLaunch(bitvote_fun, anyperid_fun) {
    maybe_addr = bitvoteAddr();
    if(maybe_addr != '0x' && maybe_addr != null) {
        alert("Already created!");
        return;
    }
    createNotLaunch(launch_key, bitvote_fun, anyperid_fun);
}

// NOTE Non-serious of course, AnyPerID is a bad OnePerID, and user keeps
//  total control over it.
function setAnyPerID(anyperid_addr, fun) {
    addr = bitvoteAddr();
    if(safety) {
        if(addr == "0x" || addr == null){ alert("No bitvote contract"); return; }
        if(anyperid_addr == "0x" || anyperid_addr == null){
            alert("No prospective anyperid contract."); return; 
        }
    }
    
    launch_addr = onePerIDSet();
    launch_key = got_privkey(launch_addr);
    if(launch_key == null){ alert("You dont have the private key to launch it.");  return;}

    if(anyPerID_Initializer() != "0x") { //It doesnt know what the bitvote contract is yet!
        if( anyPerID_Bitvote() != "0x" ){ alert("Inconsistent state AnyPerID!"); }
        eth.transact({"from":launch_key, "to":OnePerID(), "value":0, "data":[addr]});
    } else if(anyPerID_Bitvote() != addr) {
        alert("AnyPerID does not agree on which is Bitvote!");
    }
    
  // First argument the new anyperid, and second keeping full control to set later,
    data = [anyperid_addr, launch_addr];
    eth.transact({"from":launch_key, "to":addr, "value":0, "data":data}, fun);
}

function registerOnePerID(addr, fun) {
    addr = hexify(addr);
    if(safety && addr == onePerIDSet()){
        alert("If the setter is the same as an bitvote account, the former cannot do anything. Prevented transaction."); return; }
    
    priv = got_privkey(addr);
    if(priv == null){ alert("Dont have private key to do transaction."); return; }
    eth.transact({"from":priv, "to":onePerID(), "value":0}, fun);
}

function createTopic(string, priv, fun) {
    if( safety && eth.secretToAddress(priv) == onePerIDSet() ){
        alert("The OnePerID setter cannot do anything outside role.\nLike creating topics.");
    }
    data = [];
    for( i = 0 ; i < string.length ; i+= 32 ){
        data.push(string.substr(i, i+32));
    }
    while( i/32 <= 3 ){ data.push(""); i+=32; }
    eth.transact({"from":priv, "to":bitvoteAddr(), "value":0, "data":data}); //TODO
}

function vote(vote_addr, index, amount) {
    if(safety && registeredState(vote_addr)=="0x") {
        alert("This doesnt look to be a registered account."); return;
    }
    priv = got_privkey(vote_addr);
    if(priv == null){ alert("You dont have the private key of address.");  return;}

    data = [eth.fromAscii("vote"), "" + index, "" + amount];
    alert(data);
    eth.transact({"from":priv, "to":bitvoteAddr(), "value":0,
                  "data":data});
}
