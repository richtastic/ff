# C#

## string formatting:



```
// float f = 12345.67890123
string.Format("0:0.0",f); // 12345.7
string.Format("0:0.0000",f); // 12345.6789
string.Format("0:000.000",f); // 12345.679   --- prefix 000s do nothing

string.Format(".",f); // ...
```


## delegate

*definition*
```
public delegate void OnEventNameHereDelegate(ParamTypeA paramA, ParamTypeC paramB, ...);
...
public OnEventNameHereDelegate Callback;
```

*assigning*
```
private void MethodNameHere(ParamTypeA paramA, ParamTypeC paramB, ...){
	...
}
...
instance.Callback = MethodNameHere;
```

*calling*
```
if(Callback != null){
    Callback(paramA, paramB, ...);
}
```






## action

*definition*
```
Action<ClassTypeNameHere> Callback;
```

*assigning*
```
private void MethodNameHere(ClassTypeNameHere param){
	...
}
...
instance.Callback = MethodNameHere;
```

*calling*
```
if(Callback != null){
    Callback(classInstance);
}
```




































...



---


