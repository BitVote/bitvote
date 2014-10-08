#!/bin/bash


echo 'function createNotLaunch() {
    transact({"from":eth.key, "endowment":0, "code":"'$(cat bitvote.evm)'"});
}

function createAnyPerID() {
    transact({"from":eth.key, "endowment":0, "code":"'$(cat any_per_id.evm)'"});
}'
