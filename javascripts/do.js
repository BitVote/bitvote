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
function set_anyperid(anyperid_addr, fun) {
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

function register_oneperid(addr, fun) {
    addr = hexify(addr);
    if(safety && addr == onePerIDSet()){
        alert("If the setter is the same as an bitvote account, the former cannot do anything. Prevented transaction."); }
    
    priv = got_privkey(addr);
    if(priv == null){ alert("Dont have private key to do transaction."); return; }
    eth.transact({"from":priv, "to":onePerID(), "value":0}, fun);
}
