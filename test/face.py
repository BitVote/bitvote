import pyethereum
from random import randrange, random

from helper import *

u = pyethereum.utils
t = pyethereum.tester

from pyethereum.blocks import BLOCK_REWARD

# TODO get, test the changer.

s, c = None, None  # State and contract
specials = [None, None, None]
entries = None

def reset():
    global c, s, end_time
    global specials, entries
    print("creating")
    if s is None:
        s = t.state()
    before_gas = s.block.gas_used
    c = s.abi_contract('../contracts/bitvote_face.se', t.k0)
    print('cga', s.block.gas_used - before_gas, s.block.gas_used, before_gas)
    entries = []
    specials = [int(t.a0, 16), 0, 0]
    check()

def anyone_add_datastring():
    global entries
    enter = map(lambda(_):randrange(2**64), range(8))
    entries.append({"data":enter, "votes":0, "ts":s.block.timestamp})
    c.add_datastring(enter, sender=any_key())

def check():
    assert c.changer() == specials[0] and c.teller() == specials[1] and c.puppeteer() == specials[2], (specials, c.changer(), c.teller(), c.puppeteer())
    assert c.topic_cnt() == len(entries)
    for i in range(len(entries)): # Check the contents.
        el = entries[i]
        assert c.get_topic_votes(i) == el["votes"]
        assert c.get_topic_timestamp(i) == el["ts"]
        assert c.get_topic_datastr(i) == el["data"]

def scenario_init():
    global specials
    reset()
    if random() < 0.5:
        s.mine()
    if random() < 0.5:
        for _ in range(randrange(4)):
            anyone_add_datastring()
    specials = map(lambda(x): int(x, 16), [t.a1, t.a2, t.a3])
    c.changer_change(specials, sender=t.k0)
    check()

def event_use():
    for _ in range(2 + randrange(8)):
        if random() < 0.5:
            s.mine()
        anyone_add_datastring()

def event_wrong_change():
    # Anyone not t.k1 shouldnt be able to change it.
    not_specials = map(lambda(x): int(x, 16), [t.a1, t.a2, t.a3])    
    c.changer_change(not_specials, sender=any_key(t.k0))

# Randomly use/mine
def scenario_use():
    scenario_init()
    event_use()
    event_wrong_change()
    check()

def event_add_votes(on_i=None, amount=None):
    on_i, amount = on_i or randrange(len(entries)), amount or randrange(2**64)
    c.teller_add_votes(on_i, amount, sender=t.k2)
    assert c.get_topic_votes(on_i) == entries[on_i]["votes"] + amount, \
      (amount, c.get_topic_votes(on_i), entries[on_i]["votes"])
    entries[on_i]["votes"] += amount

def event_wrong_add_votes(on_i=None, amount=None):
    on_i, amount = on_i or randrange(len(entries)), amount or randrange(2**64)
    c.teller_add_votes(on_i, amount, sender=any_key(t.k2))
    assert c.get_topic_votes(on_i) == entries[on_i]["votes"]

def scenario_add_votes():
    scenario_use()
    event_add_votes()
    check()
    scenario_use()
    event_wrong_add_votes()
    check()

scenario_add_votes()

# TODO check the puppeteer. Check changer a bit more?
