import pyethereum
from random import randrange
t = pyethereum.tester

# TODO.. all these convenience definitions are not well named and
#  not well located.

def i(str):
    s,f = 0, 1
    for i in range(len(str)):
        s += f*ord(str[len(str)-i-1])
        f *= 256
    return s

def stri(i):
    s=""
    while i > 0:
        s += chr(i%256)
        i /=256
    return "".join(reversed(s))

s = t.state()
c = s.contract('bitvote.se', t.k0)
c2 = s.contract('any_per_id.se', t.k0)  # TODO test of that alone.

def ae(a, b, cond=None, what="N/A"):
    if (a !=b if cond == None else not cond):
        print('-', map(stri,a), "vs", map(stri,b), ":", what)
        print(map(hex,a), "vs", map(hex,b), ":", what)
        assert False

def store(index, contract=None):
    global c
    if contract == None:  # How the optional arguments worked bit me.
        contract = c      # (they work badly in Python)
    result = int(s.block.get_storage_data(contract, index))
    if contract == c:
        ae(s.send(t.k9, contract, 0, [i("account"), index]), [result],
           None, what="store mismatch")
    return result

def i_store(index, contract=None):
    return int(store(index, contract))

def str_store(index, contract=None):
    return stri(store(index, contract))

def addr_store(index, contract=None):
    return hex(store(index, contract))[2:-1]

LARGE = 1152921504606846976
HALFWAY = 340282366920938463463374607431768211456

def non_exist_vote_count(j=None):
    if not j:
        j = (i_store(0x40) - 0x60)/224
    ae(s.send(t.k9, c, 0, [i("vote_count"), j]),
        [i("topic doesnt exist yet.")],
        "getting vote count nonexistance failed.")

def non_exist_vote(j=None):
    if not j:
        j = (i_store(0x40) - 0x60)/224
    ae(s.send(t.k9, c, 0, [i("vote"), j, randrange(0,10)]),
       [i("topic doesnt exist yet(vote)")])

def expect_topic_count(n, zeros=True):
    ae([i_store(0x40)], [0x60 + 224*n])
    ae(s.send(t.k9, c, 0, [i("topic_count")]), [n])
    non_exist_vote(randrange(n, n+3))
    non_exist_vote_count(randrange(n, n+3))
    if n > 0:
        ae(s.send(t.k9, c, 0, [i("vote_count"), 0]), [0],
           what="Not zero votes on it/wrong message.")

def too_long_topic():
    ae(s.send(t.k9, c, 0, map(lambda i : i, range(224 + randrange(1,10)))),
       [i("too long topic string")])

def check():  # TODO this would be better with 'stateless call'
    s.mine()
    # Smaller than large.
    ae(i_store(0x40), LARGE, i_store(0x40) < LARGE, "topic index unrealistic")
    # Thing that can happen in any case.
    non_exist_vote(store(0x40))
    non_exist_vote_count(store(0x40))
    too_long_topic()
    ae(s.send(t.k9, c, 0, [1, 2]), [i("anyone bad 1")])
    ae(s.send(t.k9, c, 0, [1, 2, 3]), [i("anyone bad 2")])
    ae(s.send(t.k9, c, 0, []), [i("anyone bad 3")])
    ae(s.send(t.k9, c, 0, [4]), [i("anyone bad 4")])

    # Ways you cannot set the one per ID.
    ae(s.send(t.k0, c, 0, []), [i("OnePerIDSet bad")])
    ae(s.send(t.k0, c, 0, [randrange(LARGE)]), [i("OnePerIDSet bad")])

def no_topics_yet():
    non_exist_vote_count(0)
    non_exist_vote(0)
    expect_topic_count(0)

run_i = 0

def scenario_start():
    s.mine()  # Otherwise a series of tests could hit the block gas limit.
    global c, c2, run_i
    c = s.contract('bitvote.se', t.k0)
    c2 = s.contract('any_per_id.se', t.k0)
    run_i = run_i + 1
    print("Run " + str(run_i) + " bitvote: " + c + " anyperid: " + c2)
    
    check()
    ae(i_store(0x00), 0)
    assert addr_store(0x20) == t.a0
    ae(i_store(0x40), 0x60)
    no_topics_yet()

def initialize(have_topics=False):
    # TODO check that it responds with "not initialized" when registering.
    assert addr_store(0, c2) == t.a0
    # Gives himself full power, the bastard.
    ae(s.send(t.k0, c, 0, [c2, t.a0]), [i("changed!")])
    ae([store(0x00)], [int(c2,16)])
    assert addr_store(0x20) == t.a0
    check()
    for x in [[1,2], []]:
        ae(s.send(t.k0, c2, 0, x), [i("initializer bad")])
    ae(s.send(t.k0, c2, 0, [c]), [i("initialized")])
    assert i_store(0, c2) == 0
    
    if not have_topics:
        no_topics_yet()

def add_topic(string=None):
    if string == None:
        string = ""
        for j in range(randrange(20)):
            string += ["herp", "derp", "blurb", "bla"][randrange(4)]
    args = []
    while string != "":
        args.append(i(string[:32]))
        string = string[32:]
    while len(args) <= 3:
        args.append(i(""))
    
    j = i_store(0x40)
    if len(args) > 6:
        ae(s.send(t.k2, c, 0, args), [i("too long topic string")])
        assert i_store(0x40) == j  # Cant have added it anyway.
    elif len(args) > 3:
        ae(s.send(t.k2, c, 0, args), [i("topic set")])
        assert i_store(0x40) == j + 224   # Must have indeed moved forward.
        assert i_store(j) == 0  # Must start with zero votes.
        for k in range(len(args)):  # Check message.
            assert i_store(j + 0x20 + k*0x20) == args[k]
    else:
        print("na", len(args))
    check()

def scenario_create_topics(init_first=False): 
    scenario_start()
    init_first = randrange(2)==1 if init_first == None else init_first
    if init_first:
        initialize()
    n = randrange(1,5)
    for j in range(n):
        expect_topic_count(j)
        add_topic()
    
    if not init_first:
        initialize(True)

    expect_topic_count(n)
    return n

def register(k):
    ae(s.send(t.keys[k], c2, 0, []), [i("registered")])
    # Check that timestamp set right.
    tm = s.block.timestamp
    assert tm + HALFWAY*tm == store(int(t.accounts[k],16))
    # TODO check timestamp on the account.
    check()
    return tm

def scenario_vote():
    n = scenario_create_topics()
    tm = register(2)
    j = randrange(n)
    ae(s.send(t.k2, c, 0, [i("vote"), j, 60]), [i("cannot spend more than you have")])
    assert tm + HALFWAY*tm == store(int(t.a2,16))
    
    s.mine(100)  # Get some time. TODO test not independent on block time right now.
    use_tm = randrange(60,600)
    ae(s.send(t.k2, c, 0, [i("vote"), j, use_tm]), [i("voted")])
    #print(tm, tm + use_tm, store(int(t.a2,16))/HALFWAY, store(int(t.a2,16))%HALFWAY)        
    # Check that vote counter indeed advanced.
    assert tm + HALFWAY*(tm + use_tm) == store(int(t.a2,16))
    # Check that topic received said votes.
    ae(s.send(t.k9, c, 0, [i("vote_count"), j]), [use_tm])

    tm2 = register(3)  # Register and check again.
    use_tm2 = randrange(60,600)
    s.mine(100)  
    ae(s.send(t.k3, c, 0, [i("vote"), j, use_tm2]), [i("voted")])
    assert tm2 + HALFWAY*(tm2 + use_tm2) == store(int(t.a3,16))
    ae(s.send(t.k9, c, 0, [i("vote_count"), j]), [use_tm + use_tm2])


for k in range(8):
    scenario_vote()
