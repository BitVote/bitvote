#!/bin/bash

echo 'launching = false;  // Whether launching already.

function createNotLaunch() {
    if(launching){ return; }
    launching = true;
    transact({"from":eth.key, "endowment":0, "code":"'$(cat build/bitvote.evm)'"},
             function(addr){ bitvote_addr = addr; } );
    transact({"from":eth.key, "endowment":0, "code":"'$(cat build/any_per_id.evm)'"},
             function(addr){ anyperid_addr = addr; } );
}'
