// TTT.js
TTT.PLAYER_EMPTY = -1;
TTT.PLAYER_COMPUTER = 0;
TTT.PLAYER_HUMAN = 1;
// 
TTT.RESULT_NONE = -2;
TTT.RESULT_HUMAN_WIN = -1;
TTT.RESULT_DRAW = 0;
TTT.RESULT_COMPUTER_WIN = 1;

function TTT(){
	this._tree = new Tree();
	this._tree.data( new TTT.NodeData() ); // empty board
	// fill out assuming human goes first:
	this.generateChildNodes(this._tree, TTT.PLAYER_HUMAN, []);
	console.log("done "+TTT.GEN_CALLS);
	var next, board = [], tree = this._tree;
console.log(tree.data());
	// 1
	next = new TTT.Move(1,1, TTT.PLAYER_HUMAN);
	console.log(next.toString());
	tree = this.makeMove(tree, board, next);
	// 2
	next = this.nextBestMove(tree);
	console.log(next.toString());
	tree = this.makeMove(tree, board, next);
	// 3
	next = new TTT.Move(1,0, TTT.PLAYER_HUMAN);
	console.log(next.toString());
	tree = this.makeMove(tree, board, next);
	// 4
	next = this.nextBestMove(tree);
	console.log(next.toString());
	tree = this.makeMove(tree, board, next);
console.log(tree.data());
	// 5
	next = new TTT.Move(1,2, TTT.PLAYER_HUMAN);
	console.log(next.toString());
	tree = this.makeMove(tree, board, next);
	// 6
console.log(tree.data());
	next = this.nextBestMove(tree);
	console.log(next.toString());
	tree = this.makeMove(tree, board, next);

}
TTT.prototype.makeMove = function(tree, board, move){
	board.push(move);
	var i, node ,children = tree.children();
	for(i=0;i<children.length;++i){
		node = children[i];
		if(TTT.Move.equal(node.data().move,move)){
			return node;
		}
	}
	return null;
}
TTT.prototype.nextBestMove = function(tree){ // should already just have pruned the single best move, just pick only child
	var i, node, children = tree.children();
	var best = null;
	for(i=0;i<children.length;++i){
		node = children[i];
		console.log("   : "+i+": "+node.data().move+" ("+node.data().min+","+node.data().max+")");
		if(best==null || node.data().max >= best.data().max ){
			best = node;
		}
	}
	if(best){
		return best.data().move;
	}
	return null;
}
TTT.NodeData = function(m,i,a){
	this.move = m;
	this.min = i;
	this.max = a;
}
TTT.Result = function(r,o){
	this.result = r;
	this.over = o;
}
TTT.Move = function(x,y,p){
	this.cellX = x;
	this.cellY = y;
	this.player = p;
}
TTT.Move.prototype.toString = function(){
	return "["+this.cellX+"-"+this.cellY+":"+(this.player==TTT.PLAYER_HUMAN?"H":"C")+"]";
}
TTT.Move.equal = function(a,b){
	return (a.cellX==b.cellX) && (a.cellY==b.cellY);
}
TTT.Move.moveExists = function(array, move){
	var i, len = array.length;
	for(i=0;i<len;++i){
		if(TTT.Move.equal(move,array[i])){
			return true;
		}
	}
	return false;
}
TTT.prototype.gridToString = function(grid){
	var i, j, index=0, move, str = "";
	for(j=0;j<=2;++j){
		str += "[";
		for(i=0;i<=2;++i){
			player = grid[index];
			if(player==TTT.PLAYER_EMPTY){
				str += "   "
			}else if(player==TTT.PLAYER_HUMAN){
				str += " H "
			}else if(player==TTT.PLAYER_COMPUTER){
				str += " C "
			}
			++index;
		}
		str += "]";
		if(j<2){
			str += "\n";
		}
	}
	return str;
}
TTT.prototype.boardToGrid = function(board){
	var i, j, move, index=0, grid = [];
	for(i=0;i<=2;++i){ // row
		for(j=0;j<=2;++j){ // col
			grid.push(TTT.PLAYER_EMPTY);
		}
	}
	for(i=0;i<board.length;++i){
		move = board[i];
		grid[move.cellY*3 + move.cellX] = move.player;
	}
	return grid;
}
TTT.prototype.gameOutcome = function(board){
	var grid = this.boardToGrid(board);
	// genuine wins
	if( grid[0]==grid[1] && grid[1]==grid[2] && grid[0]!=TTT.PLAYER_EMPTY){ // top row
		if(grid[0]==TTT.PLAYER_HUMAN){ return TTT.RESULT_HUMAN_WIN; }
		return TTT.RESULT_COMPUTER_WIN;
	}else if( grid[3]==grid[4] && grid[4]==grid[5] && grid[3]!=TTT.PLAYER_EMPTY){ // mid row
		if(grid[3]==TTT.PLAYER_HUMAN){ return TTT.RESULT_HUMAN_WIN; }
		return TTT.RESULT_COMPUTER_WIN;
	}else if( grid[6]==grid[7] && grid[7]==grid[8] && grid[6]!=TTT.PLAYER_EMPTY){ // bot row
		if(grid[6]==TTT.PLAYER_HUMAN){ return TTT.RESULT_HUMAN_WIN; }
		return TTT.RESULT_COMPUTER_WIN;
	}else if( grid[0]==grid[3] && grid[3]==grid[6] && grid[0]!=TTT.PLAYER_EMPTY){ // lef col
		if(grid[0]==TTT.PLAYER_HUMAN){ return TTT.RESULT_HUMAN_WIN; }
		return TTT.RESULT_COMPUTER_WIN;
	}else if( grid[1]==grid[4] && grid[4]==grid[7] && grid[1]!=TTT.PLAYER_EMPTY){ // mid col
		if(grid[1]==TTT.PLAYER_HUMAN){ return TTT.RESULT_HUMAN_WIN; }
		return TTT.RESULT_COMPUTER_WIN;
	}else if( grid[2]==grid[5] && grid[5]==grid[8] && grid[2]!=TTT.PLAYER_EMPTY){ // rig col
		if(grid[2]==TTT.PLAYER_HUMAN){ return TTT.RESULT_HUMAN_WIN; }
		return TTT.RESULT_COMPUTER_WIN;
	}else if( grid[0]==grid[4] && grid[4]==grid[8] && grid[0]!=TTT.PLAYER_EMPTY){ // diag l->r
		if(grid[0]==TTT.PLAYER_HUMAN){ return TTT.RESULT_HUMAN_WIN; }
		return TTT.RESULT_COMPUTER_WIN;
	}else if( grid[2]==grid[4] && grid[4]==grid[6] && grid[2]!=TTT.PLAYER_EMPTY){ // diag r->l
		if(grid[2]==TTT.PLAYER_HUMAN){ return TTT.RESULT_HUMAN_WIN; }
		return TTT.RESULT_COMPUTER_WIN;
	}
	// filled draw
	if(board.length==9){
		return TTT.RESULT_DRAW;
	}
	// not done yet
	return TTT.RESULT_NONE;
}


TTT.prototype.firstMoveNotInBoard = function(board,player){
	var move = new TTT.Move(0,0,player);
	var i, j;
	for(i=0;i<=2;++i){
		for(j=0;j<=2;++j){
			move.cellX = i;
			move.cellY = j;
			if(!TTT.Move.moveExists(board, move)){
				return move;
			}
		}
	}
	return null;
}
TTT.GEN_CALLS = 0;
TTT.prototype.generateChildNodes = function(tree,player, board){
++TTT.GEN_CALLS;
	var i, result, len = 9 - board.length, move, node;
	var boardCopy = Code.copyArray(board);
	var nextPlayer = player==TTT.PLAYER_HUMAN?TTT.PLAYER_COMPUTER:TTT.PLAYER_HUMAN;
	var winable = false;
	var thisChoice, bestChoice = -1;
	for(i=0;i<len;++i){ // remaining locations
		move = this.firstMoveNotInBoard(boardCopy, player); // this repeats itself by calculating moves that were dropped in previous calls
		boardCopy.push(move); // fill out board to iterate over all remaining moves
		board.push(move);
		result = this.gameOutcome(board);
		// new tree
		node = new Tree();
		data = new TTT.NodeData(move,0,0); // TTT.RESULT_NONE
	 	node.data(data);
	 	// add new tree
	 	tree.addChild(node);
	 	// further down tree, or done:
		if(result==TTT.RESULT_NONE){ // require next move
			this.generateChildNodes(node,nextPlayer, board);
			// if(false){//player==TTT.PLAYER_COMPUTER){ // my choice - only retain best choice(s)
			// 	this.generateChildNodes(node,nextPlayer, board);
			// 	// if node.data().result> bestChoice => save best choice, drop all previous nodes, add this node
			// }else{ // retain all of humans possible choices - cannot choose for this player
			//	this.generateChildNodes(node,nextPlayer, board);
			// 	// drop nodes where CPU loses
			// }
		}else{// if(result==TTT.RESULT_DRAW || result==TTT.RESULT_COMPUTER_WIN || result==TTT.RESULT_HUMAN_WIN){ // end
			// if(player==TTT.PLAYER_HUMAN){
			// 	result = 
			// }
			node.data().min = result;
			node.data().max = result;
		}
		board.pop();
	}
	//
	var children = tree.children();
	tree.data().min = 0;
	tree.data().max = 0;
	for(i=0;i<children.length;++i){
		node = children[i];
		//tree.data().min = Math.min(tree.data().min, node.data().min);
		//tree.data().max = Math.max(tree.data().max, node.data().max);
		if(player==TTT.PLAYER_HUMAN){
			// minimize player wins
			tree.data().max += node.data().max;
			//tree.data().max -= node.data().max;
			//tree.data().min += node.data().min;
		}else{
			// maximize cpu wins
			tree.data().max -= node.data().max;
			//tree.data().max += node.data().max;
			//tree.data().min += node.data().min;
		}
		// tree.data().max += node.data().max;
		// tree.data().min += node.data().min;
	}
}
TTT.boardsEqual = function(boardA,boardB){
	var i, j, lenA=boardA.length, lenB=boardB.length;
	if(lenA!=lenB){ return false; }
	for(i=0;i<lenA;++i){
		if( !TTT.Move.moveExists(boardA[i],boardB) ){
			return false;
		}
	}
	return true;
}
// -----------------------------------------------------------------------------------------------




