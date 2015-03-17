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

def reset():
    global c, s, ids
    global specials, entries
    print("creating")
    if s is None:
        s = t.state()
    before_gas = s.block.gas_used
    c = s.abi_contract('../contracts/bitvote_teller.se', t.k0)
    print('cga', s.block.gas_used - before_gas, s.block.gas_used, before_gas)
    specials = [int(t.a0, 16), 0, 3600*24*31]
    ids = []
    check()

def check():
    assert c.changer() == specials[0]
    assert c.oneperid() == specials[1]
    assert c.start_vote_time() == specials[2]
    for _,a, acc in ids:
        if acc:
            assert c.account(a) == acc, (a, c.account(a), acc)

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
      HALFWAY*(position or s.block.timestamp - c.start_vote_time())

def add():
    p,a = insecure_keypair()
    c.oneperid_add(int(a, 16), sender=t.k2)
    ids.append((p,int(a, 16), acc()))

def move(i=None):
    i = i or randrange(len(ids))
    pold, aold, acc = ids[i]
    
    p,a = insecure_keypair()
    c.oneperid_move(aold, a, sender=t.k2)
    ids[i] = (p, a, acc)  # Update the test memory.

def freeze(i=None):
    i = i or randrange(len(ids))
    p, a, acc = ids[i]

    c.oneperid_freeze(a, sender=t.k2)
    ids[i] = (p, a, 2*(acc // 2))

def add_existing(i=None):
    i = i or randrange(len(ids))
    p, a, acc = ids[i]

    c.oneperid_freeze(a, sender=t.k2)
    ids[i] = (p, a, 2*(acc // 2) + 1)

def scenario_add():
    scenario_init()
    for _ in range(randrange(1,5)):
        if random() < 0.3: s.mine()
        add()

def move_around():
    for _ in range(randrange(2,5)):
        if random() < 0.1:
            s.mine()
        r = random()
        if r < 0.3:
            move()
        elif r < 0.6:
            freeze()
        elif r < 0.8:
            add_existing()
        else:
            add()
    check()

def scenario_move_around():
    scenario_add()
    move_around()

scenario_add()

