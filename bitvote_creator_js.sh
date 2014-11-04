#!/bin/bash

echo 'maybe_creating = false;  // Whether maybe_creating already.
launch_key = eth.keys[1] // Second key is Bitvote launch key.

function createNotLaunch(launch_key, bitvote_fun, anyperid_fun) {
    if(maybe_creating){ alert("Already creating?"); }
    maybe_creating = true;
    transact_code(launch_key, "0x'$(cat build/bitvote.evm)'", bitvote_fun);
    transact_code(launch_key, "0x'$(cat build/any_per_id.evm)'", anyperid_fun);
}'
