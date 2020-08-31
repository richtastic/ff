### Belief Propagation
BP

Factor graph


solve: inference | optimization | constraint



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
    FACTOR GRAPH:
        - variable nodes
        - factor nodes

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



? : EP



Factor Graphs:
http://people.binf.ku.dk/~thamelry/MLSB08/hal.pdf

LBP:
https://cseweb.ucsd.edu/classes/sp06/cse151/lectures/belief-propagation.pdf
https://www.cs.cmu.edu/~epxing/Class/10708-14/scribe_notes/scribe_note_lecture13.pdf
http://www.gatsby.ucl.ac.uk/~turner/LoopBPTutorial/LBP.html
http://cbl.eng.cam.ac.uk/pub/Intranet/MLG/ReadingGroup/loopyBP.pdf

https://ermongroup.github.io/cs228-notes/inference/jt/


MRF:
https://ermongroup.github.io/cs228-notes/representation/undirected/
http://homes.sice.indiana.edu/natarasr/Courses/I590/Papers/MRF.pdf


JT:
https://ermongroup.github.io/cs228-notes/inference/jt/

VIDS:
https://metacademy.org/graphs/concepts/loopy_belief_propagation

https://www.coursera.org/learn/probabilistic-graphical-models




???2:
http://www.stat.columbia.edu/~liam/teaching/compstat-spr18/AMPlecture.pdf
http://www.cse.psu.edu/~rtc12/CSE586/lectures/cse586GMplusMP_6pp.pdf
http://www.utstat.toronto.edu/~rsalakhu/sta4273/notes/Lecture5.pdf
https://people.eecs.berkeley.edu/~wainwrig/Talks/Wainwright_PartII.pdf
https://people.eecs.berkeley.edu/~wainwrig/Talks/Wainwright_PartI.pdf








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

- EM = ?
- GM = Graph Model
- CRF = conditional random field
- RBM = Restricted Boltzmann Machines
- BN = Bayesian Network
- MN = ? markov?
- CHAIN GRAPH = graph with directed and undirected edges
- I-MAP = set of independencies
- P-MAP = perfect map : I(P) = I(G)
- PGM = Probabalistic Graph Model
- HMM = Hidden Markov Model
- MPA = Most Probable (Joint) Assignment
- MAP = Maximum A Posterior
- SP = sum product
- FG = factor graph
- MP = maximum product
- moral graph: married ancestors to convert directed to undirected graph
- clique tree: ? (use MST alg to create)
- junction tree: clique tree for triangulated graph [local consistency = global consistency]
- triangulate:
- MP = message passing
- DC - divide and conquer

- want to maximize the overall P({x}) = (1/Z) PRODUCT(i,j)[  ] * PRODCUT()[ ... ]

- evidence = ACTUAL PIXELS
- hidden = DERIVED PIXELS (highest prob)
- minimized value is bethe energy fxn [on factor graph]
- RANDOM initialization of messages & beliefs
- ANCESTOR -> PARENT -> CHILD -> DESCENDENT


- DAG as a distribution P(X1,...,Xn) = (1/Z)PROD(c in C)[ psi_c(x_c) ] is H with positive POTENTIAL FUNCTIONS phi_c
    - X = set of random variables
    - x_i = random variable
    - psi_c = potential function = ? [goodness function, not probability distribution] : arbitrary potentials => preserved qualitative specification
    - x_c = ?
    - C = cliques ?
    - Z = SUM(x_i in X)[phi_c &middot; x_c]
    - phi_c(x_c) = more generic energy function ~potential -- used by psi_c(x_c) = exp(-phi_c(x_c)) [log linear / botlzmann]

    - evidence e is assignment of values to a set E variables in domain
    - E = {X_k+1, ..., X_n} ???
    - X = set of variables
    - F = set of factors, phi in F
    - P(e) = probability of evidence = SUM_x_1 ... Sum_x_k P(x_1,...,x_k, e)
        - likelihood of e
    - P(X|e) = conditional probability distribution = P(X,e)/P(e) = P(X,e)/[SUM_x P(X=x,e)]
    - SUM PRODUCT: SUM_z PRODUCT_phi phi [phi is in set of factors F]
        - P(X_1,e) = SUM_x_n ... SUM_x_1 PROD_i P(x_i|p&middot;a_i)
        - P(X_1|e) = phi(X_1,e)[SUM_x_1 phi(X_1,e)]
    - m_ij(x_i) = message from x_j to x_i ~ 'belief'
    - SUM-PRODUCT = BELIEF PROPAGATION =
    - message  passing:
        - forward algorithm: ?
        - backward algorithm: ?

- ACTUAL MESSAGES?
    - ARG MAX (INPUTS)
        A:
            - x_j: max x_j [ psi(x_j)&middot;psi(x_i,x_j)&middot; PROD_(k in N(j)-i) m_k_j(x_j) ]
        B:
            - j: arg max(psi(x_j)&middot;psi(x_i,x_j)&middot;m_k_j&middot;m_i_j(x_j) )







LBP class:
	- list of nodes
	- list of each node's dependent nodes &| node's children nodes
	- fxn to perform for iterations
		fxn(dataFrom, dataTo)  --- nodes == data?
	- convergence settings (max iterations, ...)
	- 'hidden' layer count?







- observations
- evidence

- inference









## Bayesian Networks / Belief Network

- DAG
- input nodes are P(x)
- output nodes are 
- nodes are rand vars
- edges are dependence

- evidence enters the 'observed' nodes & propagates thru the network
- nodes send messages, formed from: priors, conditionals, evidence
- MESSAGE TYPE A: Y->X, Y's opinion of how likely X is
- MESSAGE TYPE B: U->X, reweight distribution of X
	- Y = child node
	- U = parent node
- BELIEF = normalized product of incoming messages: &alpha; x &lambda;(x) x &pi;(x) &approx; Pr(X=x | E)

- non-parent X initialized with prior: &pi; = Pr(X=x)
- observed node: x = e (evidence) or 0
- messages out are normalized : sum to 1

- sum product:
- max product: (max sum)

- what is being solved for?
	- input nodes (eg: P(x) )



EXAMPLE: STEREO:
	- r & s = image coordinages
	- D(x,y) = D(r) = disparity field (unknown)
	- prior smoothness: P(D) = 1/Z x e^(-BETA x V(D))
		- V(D) = windowing: Sum(r,s) |Dr - Dr| neighbor pixels -- 
	- m(D) = matching error across entirety of left & right images = |L(x + D, y) - R(x,y)|
	- P(m(D) | D) = (1/Z) x e^(mu x m x D)
	- conditional independence assumed: P(m|D) = PRODUCT: P(m(D)|D)
	- posterior: P(D|m) = P(D) x P(m|D) / P(m)
	- 




Joint distribution = table of all possible outcomes / probabilities === all possible events / outcomes
P(a,b,c) is a TABLE of all possible RV & probabilities of outcomes
probability mass function






marginal probability =  P(A)  = unconditional probability  = not dependent on anything else = known constant [known function]
conditional probability = P(A | B) = reduce the 'total' set from universe to B ; of all of B: how likley is A
	P(A | B) = P(A & B) / P(B)
joint probability = P(A & B) = intersection 
union = or = P(A union B) P(A or B) = P(A) + P(B) - P(A&B)
independent: P(A|B) = P(A)  == knowing event B occurred tells us nothing about outcome of event A

liklihood: L(...) = liklihood of values given data observations
probability: P(...) = obseriving data given parameters


prior = already known event's probability, eg P(A) : known prior to 
prior distribution = unknown SINGLE value, instead a range of possibilities (eg normal distribution)

posterior = belief in parameter/values after performing calculation involving a prior
posterior distribution

inference = process to determine properties of a population(distribution) given data

data = evidence

Bayes’ Theorem: P(A|B) x P(B) = P(B|A) x P(A)
	MODEL FORM: P(model | data) &prop; = P(data|model) x P(model)

Bayesian inference for parameter estimation = 



random variable = X = represents the outcome of events


Naive Bayes’: assumes independence of events, event though they aren't necessarily actually independent (simplifies math)



MLE : maximum liklihood estimate = method to determine VALUES for a MODEL'S PARAMETERS ; often least squares estimates


models:
	- random forest model
	- linear model
	- gaussian





factor graph
arc consistency - remove variable values that don't satisfy the constraint
constraing statisfay problem CSP

Gibbs sampling - avoid local optima by randomly assigning values until convergence



particle swarm optimization
	- genetic algorithms
	- ...





Probabilistic inference 



variable EVIDENCE - known data
variable QUERY - to be predicted
factors - 

=> goal is to assign each variable a value of 0 or 1 (or some discrete set)
=> maximize probabilities
=> hidden variables (ones without inputs?)
	- using the observed / evidence
=> use output of 'joint distribution' => pick most probable set ?







multipy 2 gaussian distributions:
	?
	http://www.bzarg.com/p/how-a-kalman-filter-works-in-pictures/






https://cseweb.ucsd.edu/classes/sp06/cse151/lectures/belief-propagation.pdf



https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.296.6522&rep=rep1&type=pdf





...



...
