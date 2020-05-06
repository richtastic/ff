## Graph Partitioning





---
http://www.cs.utah.edu/~hari/teaching/bigdata/SIREV41.00-Karypis.Kumar-Parallel.Multilevel.Graph.Partitioning.pdf - coloring
http://glaros.dtc.umn.edu/gkhome/fetch/papers/pkwaymlSIAMREVIEW99.pdf
http://downloads.hindawi.com/archive/2000/019436.pdf

The k-way partitioning problem is most frequently solved by recursive bisection
a multilevel recursive bisection (MLRB)




Random Matching (RM)
Heavy Edge Matching (HEM)
Modified HEM (HEM* )

ALG:
graph coarsen phase
	- vertex collapse
graph partitioning phase
	- |V0|/k 
	- balanced partitioning
	- minimum edge cut
	- multilevel recursive bisection algorithm 
		- ...
graph uncoarsen phase
	- local refinement heuristics: greedy refinement (GR), variation of KL
	- ..

[21]


---





---
https://www.cs.utexas.edu/~pingali/CS395T/2009fa/papers/metis.pdf

bisection

Spectral bisection (SB) [45, 2, 26].

Laplacian matrix Q = D − A,
Fiedler vector.

The eigenvector y is computed using the Lanczos algorithm [42].
we set the accuracy to 10−2 and the maximum number of iterations to 100.



---

---
http://users.ece.northwestern.edu/~haizhou/357/lec2.pdf

Kernighan-Lin Algorithm:  O(r * N^3)
- initial bisection of a graph
	-? random ?
- swap vertexes:
	- pick vertex swap with highest reduction in cost & lock
	- repeat until all vertex paors with cost reduction are reached
- repeat until no more cost reduction possible
limits: unit-weight vertexes, exact bisections, no hypergraphs, 

k-way partition
	- get some initial partition SOMEHOW ?
	- apply KL for each pair of subsets

---

---
https://www.cs.cmu.edu/~ckingsf/bioinfo-lectures/kernlin.pdf



n [9].

---

---

https://people.csail.mit.edu/jshun/6886-s18/lectures/lecture13-1.pdf
demonstration
http://adl.stanford.edu/cme342/Lecture_Notes_files/lecture7-14.pdf


---

---

x

---


KL - HOW TO GET initial BISECTION?
	- determine a balanced initial partition of the nodes into sets A and B ??
	- RANDOM ????


B. W. Kernighan and S. Lin - An efficient heuristic procedure for partitioning graphs, Bell System Tech. J., 49 (1970)


KL refinement algorithm
geometric recursive bisection
spectral bisection



oad imbalance tolerance c such that c>=1.













++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

## 2-way partition
- initialization of 2 groups
	- A) RANDOM
	- B) need to guarantee the graph will 50% in A & B
		- black & white marking
			- each vertex starts unmarked
			- mark a remaining vertex as black
			- any adjacent vertexes must be white
			- remove marked vertexes from list
		- merge every black vertex with a white neighbor
		- propagate outward
		=> could end up with some remaining unmarked vertexes that can't be black or white
		=> need to MARK PAIRS TO BE SUBSUMED
	- C) RANDOM-LOCAL
		- pick a random edge
		- contract edge
		- iterate until 2 vertexes remain
		- while |vertex A| > |vertex B| + 1
			- move a vertex from A to B, where an edge is shared across A & B
			- choose vertex with lowest move cost (current edge cost vs moved - edge cost)
	- D) BIG-TO-SMALL
		- A = single vertex [with lowest degree of edge connectivity - eg END]
		- B = all others
		while |A| <= |B|:
			- move lowest delta edge-cost vertex from B to A
- refinement
	- ?


## k=way partition
- initial k groups
	- ?
- refinement
	- ?



INITIAL PARTITION:



	multilevel recursive bisection algorithm






[20] G. Karypis and V. Kumar, SIAM J. Sci. Comput., 20 (1998), pp. 359–392; also available online from
http://www.cs.umn.edu/˜karypis. A short version appears in Proc. Internat. Conf. on Parallel Processing, CRC Press, Boca Raton, FL, 1995.
[21] B. W. Kernighan and S. Lin, An efficient heuristic pro


++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



https://www.cc.gatech.edu/dimacs10/papers/%5B01%5D-high_quality_graph_partitioning_final.pdf
http://faculty.cse.tamu.edu/davis/suitesparse_files/mongoose-ACMTOMS.pdf


https://www.doc.ic.ac.uk/~wjk/publications/trifunovic-knottenbelt-ispdc-2004.pdf
https://pdfs.semanticscholar.org/b981/195b306c39ef40939113bdc7e2bec5665191.pdf
https://hal-enac.archives-ouvertes.fr/hal-01021583/document
https://www.cc.gatech.edu/dimacs10/papers/%5B01%5D-high_quality_graph_partitioning_final.pdf
http://algo2.iti.kit.edu/schulz/gpgc_vorlesung/graphpartitioning_lecture.pdf
https://www.di.ens.fr/~fbourse/publications/BGEP.pdf
https://www.lume.ufrgs.br/bitstream/handle/10183/67181/000872783.pdf;sequence=1
https://arxiv.org/pdf/1311.3144.pdf
http://laurel.datsi.fi.upm.es/~atorre/lib/exe/fetch.php?id=universidad%3Adoctorado&cache=cache&media=universidad:barnard94fast.pdf
https://static.aminer.org/pdf/PDF/000/243/475/a_parallel_implementation_of_mrsb.pdf









































CLUSTERING NOTES:


https://www.sciencedirect.com/science/article/pii/S1572528610000642
https://www.ee.columbia.edu/~jghaderi/allerton_overlap.pdf
https://dollar.biz.uiowa.edu/~nstreet/research/oedm12.pdf
http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.591.5987&rep=rep1&type=pdf
https://cme.h-its.org/exelixis/pubs/Exelixis-RRDR-2011-7.pdf
https://pdfs.semanticscholar.org/726a/387efd9927f4fc5d80f9da02b160d56d615a.pdf
clustering-general:
https://www-users.cs.umn.edu/~kumar001/dmbook/ch8.pdf


community
network
network decomposition
cluster
overlap
clustering
classification
sparsness
graph

"cluster editing"
maximal cliques
clique percolation method CPM
network community profile plot

Intra-cluster density vs. inter-cluster sparsity
Minimum-Cut Tree








KNOWN k - cluster [MINIMUM] =  CEIL( (vertex count) / (group size - overlap size) )



- remove vertexes
- remove edges ???
- add fake edges?
- random walk

edge-collapse



"minimize conductance"


k-way graph partitioning




ALG F: theft
- 
- all vertexes are initialized into group size = 1
- Q on each group, prioritized on best edge to add:
- if group has U - do nothing []
- if group has less than U: if any neighbors have more than U -> steal best neighbor
- if group has more than U: if any neighbors have less than U -> pust out neighbor
-> some possibly oscilating equlibrium
- while each group overlap count < O: includes neighbor from top O neighbors (or same neighbor until )
X -> ends will fight over common point

ALG G: flow
- push group in thru end to another end

ALG H: continuous divide
- continually cut skeleton graph until size of each part is <= N
X -> no way to cut a lot of graph scenarios along edge
=> cut VERTEX ?


- find 2 vertexes furthest apart (longest path count)
- cut along middle vertex if TIE [every verted in shared-distance neighbor is divided in half and half kept], middle vertex repeated 2ce in remaining group
- cut along EDGE if not
- 

ALG I: repeated minimum K cutting [gen. graph] | bisect-cutting [MSP]
- find 'end' vertex
- BFT to collect K nearest
- prune from tree, keep any vertex of degree greater than 1
- repeat
=> no?

ALG J:
- each vertex has 'ideal group'
- union / intersect?

ALG K:




K-WAY GRPAH PARTITIONING:
https://pdfs.semanticscholar.org/b981/195b306c39ef40939113bdc7e2bec5665191.pdf
https://patterns.eecs.berkeley.edu/?page_id=571
http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.585.7194&rep=rep1&type=pdf
https://surface.syr.edu/cgi/viewcontent.cgi?article=1029&context=npac
BOOK:
http://algo2.iti.kit.edu/schulz/gpgc_vorlesung/graphpartitioning_lecture.pdf
STUDY:
https://www.lume.ufrgs.br/bitstream/handle/10183/67181/000872783.pdf;sequence=1


several types of partitions:
https://www.cs.cornell.edu/~bindel/class/cs5220-f11/slides/lec19.pdf




KaHyPar GPL direct k-way and recursive bisection based multilevel hypergraph partitioning framework
kMetis  Apache 2.0  graph partitioning package based on multilevel techniques and k-way local search




stretch factor:
	- would like a size exactly 6, but if the size stretched up to 8 or down to 4, ok
	- eg: having a set of 6 and a set of 2 is not useful













---

UNUSED:

short summary:
https://patterns.eecs.berkeley.edu/?page_id=571#5k_-way_partitioning
hypergraph partitioning:
https://algo2.iti.kit.edu/download/Thesis.pdf



...