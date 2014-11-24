Rough Bitvote prototype, not intended for real use yet.

# Note:
Should work on 

* pyethereum `537d85f206a5fa29aedc61a6e56a9bada4668fa8`
* serpent [this branch](https://github.com/ethereum/serpent/pull/21)

# TODO

* Note: likely current approach will largely be rewritten.

* Testing:
  + Basically to through the 'exit possibilities' and check them all.
  + Will in the end want a test that
    * Tries many variations.
    * Tries attacks?
    
* Javascript needs cleanup and a nicer approach. For instance, perhaps any
  change of value just does things based on the change.
  
  + Once cleaned up, more testing here too? (simulate the buttons)
