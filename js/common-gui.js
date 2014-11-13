//  Copyright (C) 10-11-2014 Jasper den Ouden.
//
//  This is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

//Helps showing addresses in html.
function addr_html(addr) {
    if( addr.substr(0,2) != "0x" ){ alert("Just accepting hex."); }
    var html = "<span class=\"addr_front\">" + addr.substr(2,10) + "</span>";
    html += "<span class=\"addr_aft\">" + addr.substr(10) + "</span>";
    if( got_privkey(addr) != null ){ html += "<span class=\"have\">(have)</span>"; }
    return html;
}
