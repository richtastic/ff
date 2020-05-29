## javascript


### prototypes (classes/instances) vs objects
- objects are isolated memory chunks, class instances share common code
- save memory for repeated/common variables/values

```
// OBJECT
var object = {
	myString: "str",
	myFloat: 3.141
	myFxn: function() {
		return "["+this.str+"]";
	}
};
// INSTANCE
function SimpleClass(){
	this._string = "123";
	this._float = 3.141;
}
SimpleClass.prototype.myFxn = function(){
		return "["+this.str+"]";
}
var instance = new SimpleClass();
```
The memory footprint will look something like:
```
------------------------
# object -> Object
------------------------
	myString -> ...
------------------------
	myFloat -> ...
------------------------
	myFxn -> ...
------------------------
+++++++++++++
------------------------
# instance -> SimpleClass
------------------------
	_string -> ...
------------------------
	_float -> ...
------------------------
+++++++++++++
------------------------
Object ...
------------------------
+++++++++++++
------------------------
SimpleClass ...
------------------------
```


### iteration vs function calls
- array `forEach` method takes `2+` times longer than a `for` loop
- save stack pushes

```
var sum = 0;
var sumFxn = function(a){
	sum += a;
}
array.forEach(sumFxn);
```

```
var sum = 0;
for(var i=0; i<array.length; ++i){
	sum += array[i];
}
```




### for loop optimizing
- remove a variable check during iteration
- (minimal impact)
- (in cases order doesn't matter)

```
for(var i=0; i<array.length; ++i){
	array[i] = Math.random();
}
```

```
for(var i=array.length; i--; ){
	sum += array[i];
}
```


### memory chunking

- processor repeated register lookup [tiny] **
- CPU memory cache [small] *
- memory [medium]
- disk [large]
- network [huge]













...
