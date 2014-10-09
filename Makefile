
default: build/bitvote_creator.js

build/bitvote_creator.js: build/bitvote.evm build/any_per_id.evm bitvote_creator_js.sh
	sh bitvote_creator_js.sh > build/bitvote_creator.js

test: test_cases

test_cases:
	python2 cases.py

build/%.evm: %.lll
	lllc -x $< > $@

build/%.evm: %.se
	serpent compile $< > $@
