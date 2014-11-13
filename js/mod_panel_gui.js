//  Copyright (C) 10-11-2014 Jasper den Ouden.
//
//  This is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

function update_panel() {
    update_info_panel();
    update_mod_panel();
}

function bitvote_addr_change() {
    bitvote_addr = ge("bitvote_addr_input").value;
    eth.watch({altered:{id:bitvote_addr}}).changed(update);
    update_panel();    
}

function _update_mod_note(set_el, older, note_el) {
    if(set_el.value == "" || set_el.value == "0x" ){ set_el.value = older; }
    var account = hexify(set_el.value);
    var am_it = (got_privkey(older) != null);
    var text = "";
    if(am_it) { text += "Currently it."; }

    if( account == older ){
        if(am_it){ text += " "; }
        text += "Position addres unchanged.";
    } else if( got_privkey(account) !=null ){
        if(am_it){ text += " And also have the new key"; }
        else{ text = "Have new key."; }
    }
    note_el.innerText = text;
    note_el.className = "warn";
}

var force_show_modification_panel = false;
function update_mod_panel() {

    ge("bitvote_create").hidden = true;
    
    if( ge("bitvote_addr_input").value == "" ){
        ge("bitvote_create").hidden = false;
    }
    
    if(force_show_modification_panel || got_privkey(onePerIDSet())) {
        ge("oneperid_input").hidden = false;
        ge("oneperid_set_input").hidden = false;
        ge("puppeteer_input").hidden = false;

        _update_mod_note(ge("oneperid_input"), onePerID(), ge("oneperid_note"));
        _update_mod_note(ge("oneperid_set_input"), onePerIDSet(), ge("oneperid_set_note"));
        _update_mod_note(ge("puppeteer_input"), puppeteer(), ge("puppeteer_note"));
    } else {
        ge("oneperid_input").hidden = true;
        ge("oneperid_set_input").hidden = true;
        ge("puppeteer_input").hidden = true;
        
        ge("oneperid_note").hidden = true;
        ge("oneperid_set_note").hidden = true;
        ge("puppeteer_note").hidden = true;        
    }
}

function lock_toggle() {
    ge("run_change").hidden = true;
    ge("run_change").innerText = "Unlock Change";    
    if( ge("lock_toggle").innerText == "Unlock" ){
        ge("lock_toggle").innerText = "Lock";
        ge("run_change").hidden = false;
    } else if( ge("lock_toggle").innerText == "Lock" ){
        ge("lock_toggle").innerText = "Unlock";
    } else {
        alert("invalid lock state");
    }
}

function run_change() {
    if(safety) {
        if( ge("run_change").hidden ){
            alert("hidden but still running change?"); return;
        }
        if( ge("lock_toggle").innerText == "Unlock" ){
            alert("Lock toggler tells me it is locked?"); return;
        }
    }
    if( ge("run_change").innerText == "Unlock Change" ){
        ge("run_change").innerText = "Change"; return;
    } else if( ge("run_change").innerText == "Change" ) {
        //
        change(hexify(ge("oneperid_input").value),
               hexify(ge("oneperid_set_input").value),
               hexify(ge("puppeteer_input").value), update)
    }
}

function run_createNotLaunch() {
    if(safety) {
        if( ge("bitvote_create").hidden ){ alert("Hidden yet clicked?"); return; }
        if( bitvoteAddr() != null ){ alert("Already have one?"); return; }
    }
    mayCreateNotLaunch(function(addr){ bitvote_addr = addr; update_panel(); }, update_panel);
}
