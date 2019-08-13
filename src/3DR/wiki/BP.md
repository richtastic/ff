### Belief Propagation
BP

Factor graph



loopy belief propagation: LBP
- in undirected graph what is meaning of parents / children?
	- dynamic programming
	- evidence nodes (E) => compute conditional propabilities (hidden variables [X])
		- marginal propbabilities: P(x_a) = SUM(x in x_a) P(x)
			- EVIDENCE is what is collected from messages from parent / children
	- priors + conditionals + evidence => belief
	- nodes exchange messages, iteritively until stable belief stat is reached (or max execution)
		- messages from variable nodes to factor nodes
			= ?
		- messages from factor nodes to parent nodes
			= ?
	- parents (message-from: inputs) & children (message-to: outputs)
	- at convergence: belief(x) = alpha * outputs(x) * inputs(x)
	- no parents => initialized with prior Pr(X=x)
	- SUM-PRODUCT ALGORITHM [belief update / belief propagation]
		- goal: find p(x) for variable node
		- assume all vars are hidden
		- marginal: p(x) = sum(X \ x) p(x)
		- factor graph: p(x) = PROD(s) f_s(x_s)
	- MAX-SUM ALGORITHM

	- MAX MARGINAL ?

	- MAX PRODUCT?

	- MAXIMIZATION: argmax f(x1,...,xn) = (argmax f(x1),...,argmax f(xn))

	- observed variables & hidden variables
	- marginal probability
	- FACTOR = ? WHAT IS
		- fxn can be determined by the product of separate fxns
	- factor nodes between variable nodes

	...
	- Energy:
	 	P(X) = (1/Z) * exp(-E[x])
		E(X) = - SUM(a=1_m) ln( f_a(x_a) )
		Heimholtz: F_H = -ln(Z)
		Gibbs: H(q) = - SUM(x) q(x) * log(q(x))
		Bethe: ... BP problems
	- region graph: subset of factor nodes & variables from original factor fraph


		RECURSIVE ALG:)
			1) comput product of incoming message
			2) pick random index according to distribution
			3) updat the message

RELATED: Gibbs sampling, expectation maximization, variational methos, elimination alg, juntion-tree alg, LBP
	- bethe free engergy, kikuchi free engergy

markov random fields: MRF
	- undirected graph
	- vertexes have 'dependencies' ?

Bayesian network:
	- directed & acyclic graph : DAG


MP = message passing
? : EP



Factor Graphs:
http://people.binf.ku.dk/~thamelry/MLSB08/hal.pdf

LBP:
https://cseweb.ucsd.edu/classes/sp06/cse151/lectures/belief-propagation.pdf
https://www.cs.cmu.edu/~epxing/Class/10708-14/scribe_notes/scribe_note_lecture13.pdf
http://www.gatsby.ucl.ac.uk/~turner/LoopBPTutorial/LBP.html
http://cbl.eng.cam.ac.uk/pub/Intranet/MLG/ReadingGroup/loopyBP.pdf


MRF:
https://ermongroup.github.io/cs228-notes/representation/undirected/
http://homes.sice.indiana.edu/natarasr/Courses/I590/Papers/MRF.pdf


VIDS:
https://metacademy.org/graphs/concepts/loopy_belief_propagation

https://www.coursera.org/learn/probabilistic-graphical-models


- mean field approximation

- A) DIRECTED : BAYESIAN | DGM [causality]
- B) UNDIRECTED: MARKOV RANDOM FIELD | augment [correlation]

- JOINT PROBABILITY: P(X INTERSECT Y) = P(X & Y) = P(X,Y)
    - IF INDEPENDENT: P(X,Y) = P(X)&times;P(Y)



contrapositive

modus ponens (mode that affirms):
p→q
p
∴ q

modus tollens (mode that denies):
¬q
p→q
∴ ¬p




- want to maximize the overall P({x}) = (1/Z) PRODUCT(i,j)[  ] * PRODCUT()[ ... ]

- evidence = ACTUAL PIXELS
- hidden = DERIVED PIXELS (highest prob)
- minimized value is bethe energy fxn [on factor graph]
- RANDOM initialization of messages & beliefs
- ANCESTOR -> PARENT -> CHILD -> DESCENDENT
- I-MAP = set of independencies


LBP class:
	- list of nodes
	- list of each node's dependent nodes &| node's children nodes
	- fxn to perform for iterations
		fxn(dataFrom, dataTo)  --- nodes == data?
	- convergence settings (max iterations, ...)
	- 'hidden' layer count?







...
