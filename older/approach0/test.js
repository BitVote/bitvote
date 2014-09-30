

//eth.transact(_sec, _xValue, _aDest, _bData, _xGas, _xGasPrice, _fn)

var test_contract = "0x...";

function _after_launch(addr) {
    test_contract = addr;
    report();
}

function launch() {
    eth.create(eth.key, 1, "", 1000, 1000, _after_launch);
}

function _after_set() {
    report();
}

function set(to) {
    if( to == nil ){
        to = "0xdeadbeef";
    }
    eth.transact(eth.key, 0, test_contract, to, 1000, 1000, _after_set)
}

function report() {
    document.getElementById("addr").innerHTML = test_contract;
    document.getElementById("bal").innerHTML  = bal( );
    document.getElementById("stor").innerHTML = stor();
}

function bal() {
    return balanceAt(test_contract)
}
function stor() {
    return storageAt(test, _x)
}
