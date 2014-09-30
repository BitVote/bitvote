

//eth.transact(_sec, _xValue, _aDest, _bData, _xGas, _xGasPrice, _fn)

function vote(to) {
    eth.transact(eth.key, _xValue, bitvote_contract, "0xdata", 1000, 1000)
}
