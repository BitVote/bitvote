#!/bin/bash

echo 'launching = false;  // Whether launching already.
launch_key = eth.keys[1] // Second key is Bitvote launch key.

function createNotLaunch() {
    if(launching){ return; }
    launching = true;
    eth.transact({"from":launch_key, "endowment":0, "code":"'$(cat build/bitvote.evm)'"},
             function(addr){ bitvote_addr = addr; } );
    eth.transact({"from":launch_key, "endowment":0, "code":"'$(cat build/any_per_id.evm)'"},
             function(addr){ anyperid_addr = addr; } );
}'
