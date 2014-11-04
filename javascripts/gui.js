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

function run_register() {
    register_oneperid(ge("oneperid_register_input").value, update);
}

//TODO more notes about input.

function update() {
    // No contract in existance yet.
    if(bitvoteAddr(true) == null || bitvoteAddr(true) == "0x") {
        ge("creation").hidden = false;
        ge("launch_state").innerText = "Not created";
        ge("creation").innerText = "Create";
        ge("creation").onclick = run_createNotLaunch;
        ge("launch_addr_input").hidden = true;

        ge("message").hidden = false;
        ge("message").innerText = "No bitvote contract determined";
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

    // Look up own registered accounts.
    i = 0;
    for( ; i < eth.keys.length ; i++) {
        addr = eth.secretToAddress(eth.keys[i]);
        state = registeredState(addr);
      //Got it. TODO handle more than one. (and have warning about it)
        if( state != "0x") {
            ge("message").hidden = true;
            ge("message").innerText = "Have a register (text shouldnt show)";
            // Fill in data.
            // timestamp = TODOX
            registered_time = eth.toDecimal(stateRegisteredTime(state)).valueOf();
            moving_time = eth.toDecimal(stateVoteTime(state)).valueOf();

            ge("current_time") = "todo need time stamp";
            ge("register_time") = registered_time;
            ge("spent_time") = moving_time - registered_time;
            ge("power_time") = "todo need time stamp";
            ge("oneperid_register").hidden = true;
            break;
        }
    }
    if(i == eth.keys.length) {  //No address.
        ge("message").hidden = false;
        ge("message").innerText = "Dont control any address with bitvote account.";
        //Show info on how to register.
        ge("oneperid_register").hidden = false;

        input = ge("oneperid_register_input").value;
        note = ge("oneperid_register_note");
        note.innerText = "";
        note.className = "";
        if(got_privkey(hexify(input)) == null) {
            note.innerText = "dont have this private key";
            note.className = "warn";
        } else if( hexify(input) == onePerIDSet() ) {
            note.innerText = "That address already sets the OnePerID";
            note.className = "warn";
        }
    }
}
