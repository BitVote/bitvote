
function anyPerID_Initializer() {
    return eth.storageAt(onePerID(), "0x00");
}
function anyPerID_Bitvote() {
    return eth.storageAt(onePerID(), "0x20");
}
