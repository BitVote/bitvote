
// Get element.
function ge(element_id) { return document.getElementById(element_id); }

function transact_code(from, code, fun) {
    eth.transact({"from":from, "endowment":0, 
//                  "gas":1000000, "gasPrice":eth.gasPrice,
                  "code":code}, fun);
}

function got_privkey(account, keys) { // Returns corresponding private key, if available.
    if(keys == null) { keys = eth.keys }
    for(i=0 ; i < keys.length ; i++) {
        if( eth.secretToAddress(keys[i]) == account ){ return keys[i]; }
    }
    return null;
}

// Returns text for an address, including info if it is one we have the privkey of.
function addr_text(addr) {
    if(got_privkey(addr)) { return addr + "(have)"; }
    return addr;
}

function hexify(data) {
    if(data.substr(0,2) != '0x'){ return "0x" + data; }
    return data;
}
