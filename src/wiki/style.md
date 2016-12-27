# styles



### tabs
use tabs

**correct**
```javascript
	// 1 tab
```

**wrong**
```javascript
    // n spaces
```


### semicolons
use semicolons after every statement
**correct**
```javascript
	var myCat = {
		// cat stuff
	};
```

**wrong**
```javascript
    // n spaces
```



### spaces
use spaces sparingly, no need to take up more of a line than needed

**correct**
```javascript
	function name(a,b){
		// ...
	}
	function another(a,b){ // comment
		// ...
	}
```

**wrong**
```javascript
	function name (a,b) {
		// ...
	}
	function another (a,b) { // comment
		// ...
	}
```

### braces / brackets / parens

**correct**
```javascript
	function name(a,b){
		if(a){
			// ...
		}else{
			// ...
		}
	}
```

**wrong**
```javascript
	function name(a,b)
	{
		if(a)
		{
			// ...
		}
		else
		{
			// ...
		}
	}
```



### naming
use descriptive naming to clarify the purpose of a label when logic/procedure is not concise.

**correct**
```javascript
	Code.PI_OVER_2 = Math.PI * 0.5;

	var maximumContainerHeight = 300;

	function dot(a,b){
		return a.x*b.x + a.y*b.y;
	}

	function vectorDotProduct(vectorA,vectorB){
		return vectorA.x*vectorB.x + vectorA.y*vectorB.y;
	}
```

**wrong**
```javascript
	Code.PIO2 = Math.PI * 0.5;

	var maxHeight = 300;
```


### constants
use uppercase-underscore, and attach to some type of global-ish object for context

**correct**
```javascript
	MyClass.EXTERNAL_CONSTANT_VARIABLE = 0;
	MyClass._INTERNAL_CONSTANT_VARIABLE = 0;
```


**wrong**
```javascript
	MyClass.externalConstantVariable = 0;
	global_external_variable = 0;
```


### data
use lowercase-underscore, for literal keys, use quotes and not literals. separate keys/values to multiple lines to emphasize data's structure

**correct**
```javascript
	var data = {
		"item_count": 1,
		"item_list": [
			// ...
		]
	};
```

**wrong**
```javascript
	var data = {
		ITEM_COUNT: 1,
		"ITEM_LIST": [
			// ...
		]
	}
```


### variables
getter and setter functions should be used to modify any internal variables

**correct**
```javascript
	this._myInternalVariable = "value";
	this.myInternalVariable = function(v){
		if(v!==undefined){
			this._myInternalVariable = v;
		}
		return this._myInternalVariable;
	}
```

**wrong**
```javascript
	this.myInternalVariable = "value";
```

### function
attach functions to objects, avoid anonymous function declarations. an exception would be where you were generating methods dynamically and appending to eg an array, or are otherwise somehow correct track of.

**kep**
```javascript
	MyClass.operation = function(){
		// ...
	}
```

**wrong**
```javascript
	MyClass {
		var operation = function(){
			// ...
		}
	}
```




### classes


### enums
enums should be mimicked using external constants, confined to a container or otherwise. use ints rather than strings or objects unless special case.
**correct**
```javascript
	MyClass.ENUM_TYPE_A = 0;
	MyClass.ENUM_TYPE_B = 1;
	MyClass.ENUM_TYPE_C = 2;
	
	MyClass.EnumType = {
		TYPE_A: 0,
		TYPE_B: 1,
		TYPE_C: 2
	};
```

**wrong**
```javascript
	MyClass.EnumType = {
		TypeA: "string",
		TypeB: 3.141,
		TypeC: 2.0
	}
```




### class / object constants
use starting-uppercase camel-case for class names


**correct**
```javascript
	MyClass = function(){
		// ...
	}
```

**wrong**
```javascript
	myClass = function(){
		// ...
	}
```

### switch
switch cases are ugly, have problems with non-primitives, don't deal with complicated logic, aren't quickly extendible if use cases change
<br/>
use if statements instead, or iterating over a logic-type-array to handle cases

**correct**
```
	if(A){
		// do A
	}else if{
		// do B
	}else{
		// do C
	}
```

**wrong**
```javascript
	switch(variable){
		case 0:
			// do A
			break;
		case 1:
			// do B
			break;
		default:
			// do C
	}
```

### optimizing vertical space
fit as much as possible onto a screen, we live in a universe where more than 80 characters is now possible. non-procedureal code, like constants or lists can be separated into lines, but operations and calls should fit onto a single line if possible. separable sections of code may be separated by spaces or comments. Use parenthesis, indentes, spaces to emphasize if necessary.
**correct**
```javascript
	LONG LINE
	INDENDTS
```

**wrong**
```javascript
	
```


### optimizing horizontaly space
don't put extra spaces around unless it really helps out readability with a long line
**correct**
```javascript
	
```

**wrong**
```javascript
	
```




### comments
multiline comments should only be used for long-winded info, or temporarily . use single-line comments where possible. place a space before and after comment-beginning to clarify readability. place single line comments at end of line where possible to optimize vertical space
**correct**
```javascript
	function cos(a,b,c){ // a = b^c get taylor series cosine approx of b to cth iteration
		// ...
	}
```

**wrong**
```javascript
	/*
		function cos
	 	a = assigned value
	 	b = b input value
	 	c = iteration 
	*/
	function cos(a,b,c){
		// ...
	}
	
```



class inheritance




















**correct**
```javascript
	
```

**wrong**
```javascript
	
```



**correct**
```javascript
	
```

**wrong**
```javascript
	
```
