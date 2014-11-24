//  Copyright (C) 10-11-2014 Jasper den Ouden.
//
//  This is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

function anyPerID_Initializer() {
    return eth.stateAt(onePerID(), "0x00");
}
function anyPerID_Bitvote() {
    return eth.stateAt(onePerID(), "0x20");
}

function anAnyPerID_already_involved(c) {
    return eth.stateAt(c, "0x20") != 0;
}
