//  Copyright (C) 07-03-2015 Jasper den Ouden.
//
//  This is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// The 'face' of Bitvote only thing we can't change.
//  Just a front that gathers topics and votes thereon.
// Allowing the backend to be very changable.
contract BitvoteFace {

    address public oneperid;  // OnePerID. Actually, the Teller entirely determines whether
                              // this value is used.
    address public teller;    // Address from which we believe vote-counts are true.
    address public puppeteer; // Address that allow this thing to do anything.
    address public changer;   // Address that can change special positions.

    // 224 == 32*7, it is a lot, in the future likely 32, and magnet/swarm/contract links.
    struct DataString {
        string32 d0;
        string32 d1;
        string32 d2;
        string32 d3;
        string32 d4;
        string32 d5;
        string32 d6;
        string32 d7;
    }

    struct Topic {
        uint128 votes;
        uint64 creation_time;
        DataString datastring;
    }

    uint64 public topic_i;
    mapping (uint64 => Topic) public topics;

    function Bitvote() {
        changer = msg.sender;
    }

    // Special position changer changing it.
    function changer_change(address _oneperid, address _teller, address _puppeteer, address _changer) {
        if( msg.sender == changer ){ // Must be the current changer.
            oneperid  = _oneperid;
            teller    = _teller;
            puppeteer = _puppeteer;
            changer   = _changer;
        }
    }
    // Teller tells us it has votes.
    function teller_add_votes(uint64 on_i, uint128 amount) {
        if( msg.sender == teller && on_i < topic_i ){
            topics[on_i].votes += amount;
        }
    }

    function puppeteer_command() {
        if( msg.sender == puppeteer ){
            //TODO how to echo the data somewhere else?
        }
    }
    
    //Anyone can add a datastring.
    function add_datastring(DataString dstr) returns(uint64) {
        Topic t;
        t.votes = 0;
        t.creation_time = uint64(block.timestamp);
        t.datastring = dstr;
        topics[topic_i]= t;
    }
    function topic_cnt() returns(uint64) { return topic_i; }
    function get_topic_votes(uint64 i) returns(uint128) { return topics[i].votes; }
    function get_topic_creation_time(uint64 i) returns(uint128) {
        return topics[i].creation_time;
    }
    function get_topic_metadata(uint64 i) returns(uint128 votes, uint64 creation_time) {
        votes         = topics[i].votes;
        creation_time = topics[i].creation_time;
    }
}
/*
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
*/
