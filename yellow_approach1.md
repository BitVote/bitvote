---
layout: post
title:  "Bitvote Yellow Paper 1"
categories: Bitvote_yellowpaper
---

**WORK IN PROGRESS**

# Bitvote Yellow Paper 1

Bitvote intends to provide vote-time for efficient political clout and
statement making. Perhaps it will also be modified to provide democratic
control of things.

Vote-time is a constant influx of voting power each person gets, so each
person has the same voting-budget, and the statements it is used for has to be
chosen.

However, this paper is not about the social and political approach to make
it effective, it is about technically a decentralized accounting of this vote
time. Both why it should be decentralized and social political approach will
be in the whitepaper.

In order to give each person one vote-hour per hour, you need to give people
identities, and not give two identities to the same person. This will *not*
be covered in this paper, instead it is delegated to a second system called 
OnePerID. Since it is such an important part, this might be disappointing.
If too much so, perhaps you should wait until a later time when that problem
has been analysed more. Note that the OnePerID system will be upgradable
in operation.

**TODO** might have a section about early OnePerID ideas.

# The current technical approach
The current approach is to use Ethereum contracts written in Serpent. This may 
change in future versions. Contracts can contain permanent storage, kept in
chunks fof 32 bytes.

This is used to keep the vote hours available of registered bitvoters, using
`contract.storage` as a key-value store, where the key is Ethereum addresses.
Only registered Ethereum addresses can vote, and OnePerID chooses which
Ethereum addresses are registered.

The subjects to vote on are kept in a array with each votable
subject-string 224 bytes long, and the first 32 are the count of votes
received, and the rest are the strings. This is done principly for simplicity.
In the future, it will save on-blockchain space for magnet/swarm links
instead.<sup>MAGNET_SWARM</sup> *Any* ethereum addresss can suggest
subject-strings.

**TODO* link in image

Next to the  `contract.storage` holds two addresses that have special powers over
bitvote; the OnePerID and the OnePerID changer. After launch, these two will be
contracts, so their special powers will be decentralized; it would only be able
to act according to programming, and their programming is aimed at
decentralization.

The OnePerID position has the special power of registering, deregistering
and moving people with voting power between different accounts. If it
operates perfectly, each person has at most one Ethereum account registered 
in Bitvote. Each registered account accumulates and can use vote-hours on topic.

Of course, one person per ID is a difficult task, so it is important to be
able to change it. But being able to change it too easily is a threat.
The OnePerID changer has this single purpose; it can send messages to
the bitvote contract to change which addressses have the two special
powers.

After bitvote is launched, the changer will be programmed to list
suggestions about changing the OnePerID and/or changer itself, and voting
on said suggestions. When the votes reaches the threshhold(s), it uses
its special power on the Bitvote contract to actually enact it. The
condition for that to happen must be carefully chosen so it cant be done
by an overly small part of the bitvoters, but also that change is
practically very difficult. It should also give lead time in case of
compromise of the OnePerID.

### How does a person get registered?
A person *cannot* directly ask Bitvote to register. Registering and
deregistering is a special power of the OnePerID position.

Essentially, the OnePerID is it whole own thing, and based on how it works,
the person will have to do things to convince the system that he is infact
a person that is not yet registered. An Ethereum address in control of the
person is then registered. More about this in appendix.

# User Interface
We will mainly use HTML (+ CSS) + JS for creating user interfaces. It will
consists of overview pages and buttons people can add to things.

Note that anyone could in principle create user interfaces to Bitvote
(or any Ethereum contract), and that is fine. Basically phishing is to create
such pages, but ones that lie.

We will likely use the method the Ethereum team suggests. Possibly this will be
just having a system where people can indicate trusted re-displayers where they
see the relevant state of the contract and the transaction they are sending.
It would also be good to indicate the importance of the transaction so that
people know when checking is particularly important.

There is also the oppertunity there to try keep track of a list of phishers,
and have some kind of warning system. Possibly including after-the fact.
(likely as managed client-side as to maintain privacy.)

# Other desirable features
These features are not implemented:(yet)

### Privacy of votes
Since they are votes, we dont want social pressure, threats, or sale to affect
them. Privacy protects against the first two, and can add uncertaintly of the
parties for the third in the case that you cant cryptographically link what 
is voted on and a payment.

Ring signatures are one aproach<sup>CRYPTONOTE</sup>, there might be other zero
knowledge proof approaches.(well ring signatures isnt entirely zero knowledge)

**TODO** anonymous if currencies anonymous? Non sellable?

### Scalability
It is unclear how scalable Ethereum 1.0 will infact be. For Ethereum scalability
is a limitation of the system, which they want to diminish. After all, assuming
the gas price mechanism works, the gas price will simply go up, and there will
still be useful for activities that can stand the gas price.

Bitvote, however, wants to give *everyone* 1 vote-hour/hour, and people not
being able to pay for gas is an outright defeater. And bitvote has a large
number of people that should be able to vote.

**TODO** calculate it a bit.

### Aggegrate Signatures
These are multiple signatures that take no more space than a single signature.
Of course it only helps scalability memory-usage-wise.

If you assume that pubkey encryption does not increase the size of the data,
an 'obvious' approach is for multiple people to encrypt towards a public
'secret' key, then if you know who 'signed' and in what order, you can decrypt
it reversedly.

Unfortunately currently it seems that alternate crypto functions take a lot of
gas.<sup>NATIVE_CODE_EXTENSIONS</sup> Also, it will require a way to combine
the signatures, and finally make it a transaction.

**TODO consider reducing to just the conclusion and rest to appendix**
### Hanging blocks<sup>HANGING_BLOCKS</sup>
Hanging blocks is basically a blocks of transactions that has a
reference -a Merkle root- on Ethereum that allows it to be be audited by
the Ethereum contract. So it can be kept correct by ensuring that people
can audit it and discard incorrect hanging blocks. More on this in the appendix.

Its critical weakness is the availability of data to be audited. A solution
is to vote about whether it exists, this solution could in principle fit
Bitvote well, however it is a point of potential vulnerability.

## 'DOUGness'
As explained above, there is a system to change the one per identity and its
changer. It might be desirable to be able to change other facets, and have
an wholesome/systematic approach to do so.

DOUG is such an approach; it basically gives the different contracts around
a contract names, and you can change what each name means.
(all such contracts have special powers of sorts)

One thing to keep in mind is that it is not gas-cheap to move large amount
of contract storage on Ethereum.

## Other democracy features
Sometimes, someone will want to make a statement from *local* people, and not
involve the entire world, it might be useful to allow people to define
'constituancies' for their own areas.

Or we might want to add some kind of (delagative) voting that doesnt take
vote-time. For instance changing the OnePerID using vote-time allows people
to accumulate power over that decision too much.

# Current implementation


### Appendix: Current application contract interface
**TODO**

### Appendix: Hanging blocks
Hanging blocks is an idea i came up with myself, although no doubt others have
had the same idea before me.<sup>THREE_SIDES_CONSENSUS</sup>

The idea is to use an Ethereum contract to audit consensus data. This is done
by having a Merkle root<sup>MERKLE_TREE</sup> referenced block where each
transaction refers to the everything of before-state the transition depends on,
and re-declares the everything changed in the after-state.

This can then be audited by having the Ethereum contract be able calculate any
transition, using the Merkle trees to prove what the the before and after state
are, and then having the contract calculate whether the before and after state
indeed correspond to the before state. In practice, you would bring it up to the
Ethereum contract when it doesnt correspond, it is then proven to the Ethereum
contract that it doesnt, and the *entire* block is taken away.

**TODO** picture

Of course the reference to be before-data could also be wrong, however, this
can also be shown to the Ethereum contract, by showing to it that there is
another before-state that is later than the one referenced.

**TODO** picture

Note that next to simply repeating the before and after state, you could
probably use more clever mechanisms using state tries. Or even use the clever
mechanisms, but 'non-clever' Merkle Trees.

Hanging Blocks *far* more consensus computation power and storage, as with them
full nodes need to neither execute or store everything. Each portion simply has
to be audited by someone. However, it has a *critical* issue; if you dont have
the data, you cannot audit it.

The solution to this is to use a vote to establish unavailability if it is not
available. This is not applicable to everything, and in many cases it will be
too fragile. However, bitvote is about voting, so it may be very applicable.

### Appendix: Control of user over his own actions
The issue here is the dire state of computer security. I advocate of control
over our computing devices, or *at least* private keys. Without the former,
anonymity is not possible, without the second control is not possible.

I think this is a losing battle on regular machines, in part this is because 
the security/convenience compromise. For many/most installs, for some parties,
breaking in could be a point-and-click affair, although i am not sure to what
extent that is indeed the case. I personally advocate the development of
small security-oriented devices. Cheap devices already exist, just making
security-oriented OS-ses for them and investigating the hardware would go a
long way.

Note that Ethereum can also use contracts to help security along somewhat, but
it is *not* sufficient to the problem that people know someone with a secure-ish
computer. They need their own secure-ish computer.

### Appendix: Some suggested terms

# References

THREE_SIDES_CONSENSUS **TODO** where was it again.... 

MERKLE_TREE https://en.wikipedia.org/wiki/Merkle_tree

NATIVE_CODE_EXTENSIONS https://blog.ethereum.org/2014/08/27/state-ethereum-august-edition/
see also [this ECC example](https://github.com/ethereum/serpent/tree/master/examples/ecc)
for costs.

CRYPTONOTE cryptonote uses it https://cryptonote.org/inside#untraceable-payments,
apparently also bytecoin http://bravenewcoin.com/profiles/coins/bytecoin/

REF_HANGING_BLOCKS  http://o-jasper.github.io/blog/2014/06/03/hanging_blocks.html
