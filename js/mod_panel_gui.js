//  Copyright (C) 10-11-2014 Jasper den Ouden.
//
//  This is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

function update_panel() {
    update_info_panel();
    update_mod_panel();
    update_puppeteer();
}

function bitvote_addr_change() {
    bitvote_addr = ge("bitvote_addr_input").value.trim();
    eth.watch({altered:{id:bitvote_addr}}).changed(update);
    update_panel();    
}

function _update_mod_note(set_el, older, note_el) {
    if(set_el.value == "" || set_el.value == "0x" ){ set_el.value = older; }
    var account = hexify(set_el.value.trim());
    var am_it = (got_privkey(older) != null);
    var text = "";
    if(am_it) { text += "Currently have. "; }

    if( account == older ){
        if(am_it){ text += " "; }
        text += "Unchanged. ";
        
    }
    if( got_privkey(account) !=null ){
        text += "Have key.";
        note_el.className = "warn";        
    } else{ note_el.className = ""; }
    note_el.innerText = text;
    
    note_el.hidden = false;
}

var force_show_modification_panel = false;
function update_mod_panel() {

    ge("bitvote_create").hidden = true;
    
    if( ge("bitvote_addr_input").value == "" ){
        ge("bitvote_create").hidden = false;
    }
    
    if(force_show_modification_panel || got_privkey(changer())) {
        ge("oneperid_input").hidden = false;
        ge("changer_input").hidden = false;
        ge("puppeteer_input").hidden = false;

        oneperid_note = ge("oneperid_note");
        _update_mod_note(ge("oneperid_input"),  onePerID(),  oneperid_note);
        if( anAnyPerID_already_involved(hexify(ge("oneperid_input").value)) ){
            oneperid_note.className = "warn";
            oneperid_note.innerText = "Already knows a bitvote?";
        }        
        _update_mod_note(ge("changer_input"),   changer(),   ge("changer_note"));
        
        _update_mod_note(ge("puppeteer_input"), puppeteer(), ge("puppeteer_note"));

        ge("lock_toggle").hidden = false;
    } else {
        ge("oneperid_input").hidden  = true;
        ge("changer_input").hidden   = true;
        ge("puppeteer_input").hidden = true;
        
        ge("oneperid_note").hidden  = true;
        ge("changer_note").hidden   = true;
        ge("puppeteer_note").hidden = true;
        
        ge("lock_toggle").hidden = true;
    }
}

function _puppet_pass_list() {
    var string = ge("puppet_data_input").value;
    var list = string.trim().split(','), out = [], wrong=false;
    for( var i=0 ; i < list.length ; i++ ){
        var cur = list[i].trim();
        if( cur[0] == '"' ){
            out.push(eth.fromAscii(cur.substr(1,cur.length-1)));
        } else {
            var v = parseInt(cur).toString(16);
            if( v == "NaN" ){ if( list.length!=1 ){ wrong = true; out.push("INVALID"); } }
            else{ out.push("0x" + v.toString(16)); }
        }
    }
    return [wrong].concat(out);
}

function update_puppeteer() {
    //ge("am_puppeteer").hidden = (got_privkey(puppeteer()) == null);

    var list = _puppet_pass_list(), html="<table>";
    for( var i=1 ; i<list.length ; i++ ){
        html += "<tr><td>" + list[i] + "</tr></td>";
    }
    html += "</table>";
    ge("puppeteer_repeat_args").innerHTML = html;
    var note = ge("puppeteer_msg_note");
    note.innerText = "";
    note.className = "";
    if(ge("puppeteer_to_input").value == ""){
        note.innerText = "No address to send to.";
        note.className = "warn";
    } else if( list[0] ){
        note.innerText = "Input not good.";
        note.className = "warn";
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
               hexify(ge("changer_input").value),
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

function run_puppetSend() {
    puppetSend(hexify(ge("puppeteer_to_input").value), _puppet_pass_list().slice(1));
}
