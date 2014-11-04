// Interfaces the API and the values/actions on the gui.

function if_both_created(anyperid_addr) {
    if(bitvote_addr != null)  { ge("bitvote_addr_input").value = bitvote_addr; }
    if(anyperid_addr != null) { ge("launch_addr_input").value = anyperid_addr; }
    update();
}

function set_from_input() {
    bitvote_addr = ge("bitvote_addr_input").value;
    if_both_created();
}

function run_createNotLaunch() {
    mayCreateNotLaunch(function(addr){ bitvote_addr = addr;  if_both_created(); },
                       function(addr){ if_both_created(addr); });
}

function run_launch() {
    set_anyperid(hexify(ge("launch_addr_input").value), update);
}

function update() {
    // Nothing there yet.
    if(bitvoteAddr() == null || bitvoteAddr() == "0x") {
        ge("creation").hidden = false;
        ge("launch_state").innerText = "Not created";
        ge("creation").innerText = "Create";
        ge("creation").onclick = run_createNotLaunch;
        ge("launch_addr_input").hidden = true;
        return;
    }
    // Display who the OnePerID is.
    one_per_id = onePerID();
    if(one_per_id == "0x") { //None yet.
        ge("oneperid").innerText = "Not launched yet";
        
        priv = got_privkey(onePerIDSet());
        if( priv != null ) { //None yet, and we are the launchers.
            ge("creation").hidden = false;
            ge("launch_addr_input").hidden = false;            
            ge("launch_state").innerText = "Not launched, have launching key.";
            if(ge("launch_addr_input").value != "") {
                ge("creation").innerText = "Launch"; 
            } else {
                ge("creation").innerHTML = "Launch <span class=\"warning\">No suggested new address</span>";
            }
            ge("creation").onclick =run_launch;;
        } else {
            ge("creation").hidden = true;
            ge("launch_addr_input").hidden = true;        
            ge("launch_state").innerText = "Created, not launched.";
            ge("creation").onclick = null;
        }
    } else {
        ge("oneperid").innerText = addr_text(one_per_id);
        ge("launch_state").innerText = "Launched";
        ge("creation").hidden = true;
    }
    ge("oneperid_set").innerText = addr_text(onePerIDSet());
}
