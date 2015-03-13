//  Copyright (C) 07-03-2015 Jasper den Ouden.
//
//  This is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Initial teller.
contract BitvoteTeller {
    BitvoteFace public face;  // TODO it needs to be told what the OnePerID is instead..

    struct Account {
        uint64 created;
        uint64 cur_time;
        uint8 state;
    }
    mapping (address => Account) accounts;

    // Fetching info.
    function account(address addr) returns(Account) { return accounts[addr]; }
    function vote_time(address addr) returns(uint64) { 
        if( accounts[addr].state % 1 == 0 ){
            return 0;
        } else {
            return uint64(block.timestamp) - accounts[addr].cur_time;
        }
    }

    // Constructor.
    function BitvoteTeller(address _face) {
        face = BitvoteFace(_face);
    }

    // OnePerID special position priviledges.
    function oneperid_register(address addr) {
        if( msg.sender == face.oneperid() ){
            Account a = accounts[addr];
            if( a.created == 0 ){  // Did not exist yet.
                a.created = uint64(block.timestamp);
                var start_vote_time = 3600*24*31;
                a.cur_time = uint64(block.timestamp) - start_vote_time;
                a.state = 1;
            } else {
                a.state = 1;  // Unfreeze if( it was frozen.
            }
        }
    }
    function oneperid_deregister(address addr){
        Account a = accounts[addr];
        if( a.created != 0 && msg.sender == face.oneperid() ){ 
            a.state = 0; // Freeze it.
        }
    }
    function oneperid_move(address from, address to) {
        Account a = accounts[from];
        if( a.created != 0 && msg.sender == face.oneperid() ){ 
            accounts[to] = a;  // Set it.
            a.created = 0;  // Wipe the old one.
            a.cur_time = 0;
            a.state = 0;
        }
    }
    // Voting for those that can.
    function vote(uint64 on_i, uint64 amount) {
        Account a = accounts[msg.sender];
        // Exists, not frozen and enough vote time available.
        if( a.created != 0 && (a.state % 2 == 1) && a.cur_time + amount < block.timestamp ){
            a.cur_time += amount;  // NOTE: if the index does not exist, votes are wasted.
            face.teller_add_votes(on_i, uint128(amount));  // Tell the face immediately.
        }
    }
}
