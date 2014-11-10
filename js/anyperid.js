//  Copyright (C) 10-11-2014 Jasper den Ouden.
//
//  This is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

function anyPerID_Initializer() {
    return eth.storageAt(onePerID(), "0x00");
}
function anyPerID_Bitvote() {
    return eth.storageAt(onePerID(), "0x20");
}
