import pyethereum
from random import randrange, random

from helper import *

u = pyethereum.utils
t = pyethereum.tester

from pyethereum.blocks import BLOCK_REWARD

# TODO test that the face gets the correct arguments.

s, c = None, None  # State and contract
specials = [None, None, None]
ids = None

def reset():
    global c, s, end_time
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
    assert c.changer() == specials[0] and c.oneperid() == specials[1] and c.start_vote_time() == specials[2]


reset()
