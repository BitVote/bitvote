
default: bitvote_create.js

bitvote_create.js: bitvote.evm any_per_id.evm
	sh create_launcher_js.sh

test: test_cases

test_cases:
	python2 cases.py

%.evm: %.lll
	lllc -x $< > $@

%.evm: %.se
	serpent compile $< > $@
