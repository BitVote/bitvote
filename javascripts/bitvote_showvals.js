// Interfaces the API and the values/actions on the gui.

var launch_key = eth.keys[1]

function launcher_says(state, action) {
    ge("launch_state").innerText = state;
    ge("launcher").innerText = action;
}

function if_both_created() {
    if(bitvote_addr != null && anyperid_addr !=null){ 
        launcher_says("Created", "Launch");
    }
}

function run_createStep() {
    if(!maybe_creating) {
        launcher_says("Creating..", "(no action)");
        mayCreateNotLaunch(function(addr){ bitvote_addr = addr;  if_both_created(); },
                           function(addr){ anyperid_addr = addr; if_both_created(); });
    } else if(bitvote_addr != null && anyperid_addr !=null) {
        launcher_says("Launching..", "(no action)");
        launch(function(){ launcher_says("Launched", "(no action, part done)"); });
    }
}
