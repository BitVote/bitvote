//  Copyright (C) 10-11-2014 Jasper den Ouden.
//
//  This is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Get element.
function ge(element_id) { return document.getElementById(element_id); }

function transact_code(from, code, fun) { //This one is lazy.
    eth.transact({"from":from, "endowment":0, 
//                  "gas":1000000, "gasPrice":eth.gasPrice,
                  "code":code}, fun);
}

function private_keys_dict(keys) {
    var have = {}
    for(i=0 ; i < keys.length ; i++) {
        have[eth.secretToAddress(keys[i])] = keys[i];
    }
    return have;
}

var have_keys_dict = null;
function got_privkey(account, keys) { // Returns corresponding private key, if available.
    if(keys == null) {
        if( have_keys_dict == null){ have_keys_dict = private_keys_dict(eth.keys); }
        return have_keys_dict[account];
    } else {
        for(i=0 ; i < keys.length ; i++) {
            if( eth.secretToAddress(keys[i]) == account ){ return keys[i]; }
        }
        return null;
    }
}

// Returns text for an address, including info if it is one we have the privkey of.
function addr_text(addr) {
    if(got_privkey(addr)) { return addr + "(have)"; }
    return addr;
}

function hexify(data) {
    if(data == null){ return data; }
    if(data.length < 2 ){ return "0x" + data; }
    if(data.substr(0,2) != '0x'){ return "0x" + data; }
    return data;
}
