### Belief Propagation

#### types of networks / graph models:
	
	naive bayes (assumes independence) [simple bayes, independent bayes]
		- P(x|y1,y2,...,C) ~ p(x|C) ~ p(C)&PI;p(y_i|C)

	bayes network (directed / acyclic)

	markov random field ()

	constraint graph / hypergraph
		- 

	factor graph

	=> Markov chain Monte Carlo

	=> loopy belief propagation

	- Restricted Boltzmann machine ?

	Conditional Random Fields 


#### Bayesian Network [aka: Bayesian Belief Networks, Bayes Nets, Causal Networks]
	- 
	- compute P(X_n = k):
		- &Sigma; x&isin;values(X1) ...
		- ...
	- Variable Elimination (VE)
		...
....

#### Markov Field:
	- Markov Property: memoryless (for stochastic) -- only present state matters
	- undirected graph of random variables
	- local markov property: variable is conditionally independent of all other variables given its neighbors
		x_v &perp; not_neighbors(x_v) | neighbors(x_v)
	- pairwise markov property: non-neighbors are conditionally independent given all other variables
		x_u &perp; x_v | all_except(x_u,x_v)
	- global markov property: any two subsets of variables are conditionally independent given a separating subset
		X_u &perp; X_v | X_w   (every path from node in A to node in B must pass thru S)
	- factor nodes _describe_ influence variable nodes have on each other
	...


#### Markov Chain:
	- each state holds a next-state distribution: probability of entering neighbor state i
	- ~ transition model defines for each state pair, the probability of going from state a -> state b
		ex: drunken grasshopper
	- each state is a Random Variable RV
	- long ter, behavior is how likely each individual state is
	- reversible markov chain is stationary result
	- mixing time between portions of graph
	- contuctance measure of how probable transition edges are
	flavors: state:(discrete/continuous) & time:(discreete/continuous)


#### BN -> MN
	- BN: evidence e => Gibbs: Z=P(e)
	- CPS: p(X_i|Pa_Xi) => factor: {X_i,Pa_Xi}
	- moralized graph: need edge between each of X_i parents
	- no direct conversion of parameters

#### MN -> BN
	- minimal i-Map

#### BN == MN
	- chordal graphs
	- 


#### Factor Graph
	- bipartie graph of variable nodes & factor nodes
	- variable nodes that affect other variable nodes do so thru a factor



#### compare MAP & MLE
	- use log addition rather than product multiplication for numerical stability (underflow)
	- maximum liklihood estimate (MLE) :
		- &Theta;<sub>MLE</sub> = arg max<sub>&Theta;</sub> &Sigma;<sub>i</sub> log( P(x<sub>i</sub>|&Theta;) )
	- maximum a posteriori (MAP) :
		- &Theta;<sub>MLE</sub> = arg max<sub>&Theta;</sub> &Sigma;<sub>i</sub> log( P(x<sub>i</sub>|&Theta;) ) + log( P(&Theta;) )


- 
https://wiseodd.github.io/techblog/2017/01/01/mle-vs-map/


#### Bayesian Inference
	- A: Query => set RV, get a probabilty
		- P(query | evidence) = P(Xi, ..., Xn | Ej=vj, ... , Em=vm )
		- P(Y | E = e):
			- Y = query variables
			- E are evidence / observed variables
			- e = evidence value
	- B: parameter estimation => find best (mode of posterior distribution) == most common scenario
		- Max A Posteriori (MAP)
		- = values of the random variables that are most likeley (max probability in table)

=> CAN YOU PERFORM THE P(A,B,C,D... | evidence) & pick most probable?
	- is this computationally feasable?
	P(x0=0 | evidence) A
	P(x0=1 | evidence) B
	P(x1=0 | evidence) A
	P(x1=1 | evidence) B ... pick highest A / B
	
	...


- Marginal Likelihood  ?
- Expectation Maximation  ?






all messages are typically initialized uniformly at the beginning







Sum Product / message passing === Belief Propagation [different flavor for BN v MN]
	- performs inference
	- calculates marginal distribution for unobserved node (or var) conditional on observed nodes (or vars)
	- 

Joint Mass Function:
	p(x) = &Pi; (a &isin; F) f_a(x_a)
	x_a = vector of neighboring var nodes to factor node a

	- messages contain 'influence' that one variable exerts on another.
	- messages v->a and a->v computerd differently
	- v->a:
		product of messages from all other neighboring factor nodes (except recipient, ie recipient message = 1)
		[if no other neighbors, message = uniform distribution (unknown)]
			&Pi;_a_i message_a_i(x_v)
	- a->v:
		product of factor with messages from all other nodes, marginalized over all variables except v
		[if no other neighbors, message = f_z(x_v)]
			&Sigma;_v f_a(x_a) &middot; &Pi;_v_i message_v_to_a(x_i)

	- https://en.wikipedia.org/wiki/Belief_propagation

	- on a tree, optimal solution is after single iteration of all messages
	- on loopy graph, optimal solution is after iterations, updating messages simultaneously : soln is only proportional

BP

Factor graph


solve: inference | optimization | constraint




#### Marginal probability
P(y=1) -- sum up all occurrences with y=1, ignore other variables -- sum in the "margins" of table / reduce dimensionality
	sum over the variables you don't care about

#### Joint probability
p(x=1,y=1) -- with multiple parameters in query, get joint marginal intersection
	sum over all variable that have 'states/values' in common

#### Conditional probability
P(y=1|x=0) -- with a subset of the universe in interest, only consider this portion as the new universe
	sum only in values ....?




- beta distribution
- Dirichlet distribution







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


A) most likely A,B,C given data
B) given A,B,C: what is probability?






## Bayesian Networks / Belief Network

B = (G,P) (bayesian network = graph?, probability?)

CPD: c-prob-dist?

- VARIABLE ELIMINATION
- MESSAGE PASSING (believ propagation)
- INTEGER PROGRAMMING METHODS

p(x_i) = marginal distribution
p(x_i | x_j) = conditional distribution
arg max p(x_i | x_j) = maximum a posteriori (most likely)

max marginal

- DAG
- input nodes are P(x)
- output nodes are 
- nodes are rand vars
- edges are dependence
- Conditional Probabiity Distribution CPD

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





random variable = X = represents the outcome of events


Naive Bayes’: assumes independence of events, event though they aren't necessarily actually independent (simplifies math)



MLE : maximum liklihood estimate = method to determine VALUES for a MODEL'S PARAMETERS ; often least squares estimates


models:
	- random forest model
	- linear model
	- gaussian


Marginalize Product of Functions (MPF)

NOT-SUMs


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



Exact inference algorithms:
	– Symbolic inference (D’Ambrosio)
	– Recursive decomposition/variable elimination (Cooper, Dechter)
	– Message-passing algorithm (Pearl)
	– Clustering and joint-tree approach (Lauritzen, Spiegelhalter)
	– Arc reversal (Olmsted, Schachter)
Approximate inference algorithms:
	– Monte Carlo methods:
		- Rejection sampling, Likelihood sampling
	– Variational methods 

bayesian factor graph: target node becomes root of tree, items sum up children -> parents (SUM - PRODUCT)




multipy 2 gaussian distributions:
	?
	http://www.bzarg.com/p/how-a-kalman-filter-works-in-pictures/






https://cseweb.ucsd.edu/classes/sp06/cse151/lectures/belief-propagation.pdf



https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.296.6522&rep=rep1&type=pdf



Huber or Cauchy cost function

Bayesian inference

Bayesian network

factor graph

Loopy belief propagation






#### Sum Product Algorithm:

##### Bayes (context)
	
	to compute g_i(x_i)
	for tree rooted at x_i
	start at leaves, move inward:
		PRODUCT RULE:
			at variable node:
				take product of descendents
		SUM-PRODUCT RULE:
			at factor node:
				take product of f with decendents
				perform NOT-SUM over parent node

	to compute marginals (probability(x_i)?)
		simultaneous message passing following sum-product algorithm
			EX:
				BP: ?
				FWD-BAK ALG: ?same?

##### loopy BP
	Junction Tree
		- convert to graph w/o loops
		- (very large graph)
	Sum Product / message passing
		- disreguard loops
		- approx inference


variational inference
	- deterministic
	- Examples: Mean-field, Bethe, Kikuchi, Expectation Propagation

stochastic inference:
	- sampling approaches
	- Examples: Markov Chain Monte Carlo Methods
	- Gibbs sampling (special case of MCMC)

...



...
