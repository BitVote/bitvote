import pyethereum
from random import randrange, random

from helper import *

u = pyethereum.utils
t = pyethereum.tester

HALFWAY = 340282366920938463463374607431768211456

# TODO test that the face gets the correct arguments.

s, c = None, None  # State and contract
specials = [None, None, None]
ids = None  # IDs that should be in there.
zero_ids = None  # IDs expected to be gone.

def kp():
    k,a = insecure_keypair()
    s.send(t.k0, a, 10**14)
    return k, int(a, 16)

def reset():
    global c, s, ids, zero_ids
    global specials, entries
    print("creating")
    if s is None:
        s = t.state()
    before_gas = s.block.gas_used
    c = s.abi_contract('../contracts/bitvote_teller.se', t.k0)
    print('cga', s.block.gas_used - before_gas, s.block.gas_used, before_gas)
    specials = [int(t.a0, 16), 0, 3600*24*31]
    ids, zero_ids = [], []
    check()

def check():
    assert c.changer() == specials[0]
    assert c.oneperid() == specials[1]
    assert c.start_vote_time() == specials[2]
    for _,a, acc in ids:
        if acc != 0:
            assert c.account(a) == acc, (a, c.account(a) / HALFWAY, acc/HALFWAY,
                                         c.account(a) % HALFWAY, acc%HALFWAY)
            assert c.created_time(a) == (acc % HALFWAY) // 2
            assert c.vote_time_pos(a) == (acc // HALFWAY if acc%2 == 1 else 0)
            assert c.vote_time_available(a) == \
              ((acc // HALFWAY - s.block.timestamp) if acc%2 == 1 else 0)
        else:
            assert a in zero_ids
            assert c.account(a) == 0

def scenario_init():
    global specials
    reset()
    if random() < 0.5:
        s.mine()
    specials = [int(t.a1, 16), int(t.a2, 16), randrange(10000)]
    print(c.changer_change(specials, sender=t.k0))
    check()

def acc(time=None, position=None, frozen=False):
    return (0 if frozen else 1) + \
      2*(time or s.block.timestamp) + \
      HALFWAY*(position or (s.block.timestamp - c.start_vote_time()))

def add():
    p,a = kp()
    c.oneperid_add(a, sender=t.k2)
    ids.append((p,a, acc()))

def scenario_add():
    scenario_init()
    for _ in range(randrange(5,10)):
        if random() < 0.3:
            s.mine()
        add()
    check()

def move(i=None):
    i = i or randrange(len(ids))
    pold, aold, acc = ids[i]

    if acc != 0:  # Moving nonexistent is tested as "wrongs"
        p,a = kp()
        c.oneperid_move(aold, a, sender=t.k2)
        ids.append((p, a, acc))  # Update the test memory.

        ids[i] = (pold, aold, 0)
        zero_ids.append(aold)

def freeze(i=None):
    i = i or randrange(len(ids))
    p, a, acc = ids[i]

    c.oneperid_freeze(a, sender=t.k2)
    assert 2*(acc // 2) == acc - acc%2
    assert 2*(acc // 2) == (acc if acc%2 == 0  else acc - 1)
    ids[i] = (p, a, 2*(acc // 2))

def add_existing(i=None):
    i = i or randrange(len(ids))
    p, a, acc = ids[i]

    if acc != 0:  # Otherwise it was actually not already existing.
        c.oneperid_add(a, sender=t.k2)
        ids[i] = (p, a, 2*(acc // 2) + 1)

def remove(i=None):
    i = i or randrange(len(ids))
    p, a, _ = ids[i]    
    c.oneperid_remove(a, sender=t.k2)

    ids[i] = (p,a,0)
    zero_ids.append(a)

def move_around():
    for _ in range(randrange(5,10)):
        if random() < 0.1:
            s.mine()
        r = random()
        if r < 0.2:
            move()
        elif r < 0.4:
            freeze()
        if r < 0.6:
            add_existing()
        elif r < 0.8:
            remove()
        else:
            add()
        if len(ids) == 0:  # (code assumes at least one)
            add()
    check()

def scenario_move_around():
    scenario_add()
    move_around()

def vote(i=None, on_i=None, amount=None):
    i = i or randrange(len(ids))
    on_i = on_i or randrange(2**30)
    amount = amount or randrange(60)
    
    k,a,acc =  ids[i]
    c.vote(on_i, amount, sender = k)

    movtime = acc // HALFWAY + amount
    # Something only happens if vote time available, exists, and not frozen.
    if movtime < s.block.timestamp and acc%2 == 1:
        ids[i] = (k,a, acc%HALFWAY + HALFWAY*movtime)

def scenario_vote():
    scenario_move_around()
    before = s.block.timestamp
    for _ in range(randrange(10,20)):
        vote()
    while s.block.timestamp < before + 80:
        s.mine()
    for _ in range(randrange(10,20)):
        vote()
    check()

# Doing things wrong.
def do_wrong():
    k,aself = kp()  # Sending when none available.
    c.vote(randrange(2**30), randrange(60), sender=k)
    c.oneperid_add(aself)
    assert c.account(aself) == 0
    
    c.changer_change([0, 0, 0])  # Playinh changer special position.

    _,a, acc = ids[randrange(len(ids))]  # Playing OnePerID special postion.
    c.oneperid_remove(a)
    assert c.account(a) == acc

    _,a, acc = ids[randrange(len(ids))] 
    c.oneperid_freeze(a)
    assert c.account(a) == acc

    _,a, acc = ids[randrange(len(ids))]
    c.oneperid_move(a, aself)
    assert c.account(a) == acc and c.account(aself) == 0    

def oneperid_wrongs():
    _,a = kp()  # Freeze nonexistent.
    c.oneperid_freeze(a, sender=t.k2)
    assert c.account(a) == 0
    
    _,fr = kp()  # Move override, from non-account
    _,to, acc = ids[randrange(len(ids))]
    c.oneperid_move(fr, to, sender=t.k2)
    assert c.account(to) == acc, (c.account(to), acc)
    assert c.account(fr) == 0

    _,fr, accfr = ids[randrange(len(ids))]  # Move-override from account.
    c.oneperid_move(fr, to, sender=t.k2)
    assert c.account(to) == acc, (acc, c.account(to))
    assert c.account(fr) == accfr

def scenario_wrongs():
    scenario_vote()
    do_wrong()
    oneperid_wrongs()
    check()

scenario_wrongs()
for _ in range(randrange(20,40)):
    vote()
check()

