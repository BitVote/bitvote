
default: test

test: test_cases

test_cases:
	python2 cases.py

%.lll.evm: %.lll
	lllc -x $< > $@

%.se.evm: %.se
	serpent compile $< > $@

