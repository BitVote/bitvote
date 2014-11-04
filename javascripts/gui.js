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
    setAnyPerID(hexify(ge("launch_addr_input").value), update);
}

function run_register() {
    registerOnePerID(ge("oneperid_register_input").value, update);
}

function run_createTopic() {
    createTopic(ge("topic_string_input").value, eth.key, update);
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
    vote_addr = find_own_vote_address();
    if( vote_addr == null ) {
        ge("message").hidden = false;
        ge("message").innerText = "Dont control any address with bitvote account.";
      //Show info on how to register.
        ge("oneperid_register").hidden = false;
        ge("account_status").hidden = true;

        input = ge("oneperid_register_input").value;
        note = ge("oneperid_register_note");
        note.innerText = "";
        note.className = "";
        if(input == "") {
        } else if(got_privkey(hexify(input)) == null) {
            note.innerText = "dont have this private key";
            note.className = "warn";
        } else if( hexify(input) == onePerIDSet() ) {
            note.innerText = "That address already sets the OnePerID";
            note.className = "warn";
        }
    } else {
        ge("message").hidden = true;
        ge("message").innerText = "Have a bitvote account (text shouldnt show)";
        // Fill in data.
        ge("oneperid_register").hidden = true;
        //TODO might want to use the actual timestamp from the block.
        // (eth.block(eth.number) doesnt work for me yet)
        timestamp = Math.floor((new Date()).getTime()/1000);
        ge("account_status").hidden = false;

        state = registeredState(vote_addr);
        
        registered_time = eth.toDecimal(stateRegisteredTime(state)).valueOf();
        moving_time = eth.toDecimal(stateVoteTime(state)).valueOf();

        ge("current_time").innerText = timestamp; //"todo need time stamp";
        ge("register_time").innerText = registered_time;
        ge("spent_time").innerText = moving_time - registered_time;
        ge("power_time").innerText = timestamp - moving_time;
    }
    // Topic list stuff.
    n = topicN();
    list_str = "";
    ge("topic_count").innerText = n
    for( j = 0 ; j < n ; j+=1 ) {
        list_str += "<tr><td>" + eth.toDecimal(topicVotes(j));
        list_str += "</td><td>" + topicString(j) + "</td></tr>";
    }
    ge("topic_list").innerHTML = list_str;
}
