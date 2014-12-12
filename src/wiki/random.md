# Randomizing


#### random double (0,1)
```
# Math.random()
srand((unsigned)time(NULL));
double num = (double)rand() / (double)RAND_MAX;
```



#### random integer [0,N]
```
arc4random_uniform(N); // [0,N-1]

# Math.floor( Math.random()*N )
```
**note:**
<br/>
`rand() % num` introduces *modulus bias* => result is not necessarily equidistributed






### random iteration thru array:
```
# for(i=0;i<count;++i){ self.indexes[i] = [NSNumber numberWithInteger:i]; }
-(void)randomizeList{
    NSInteger i, count = self.indexes.count;
    if(count<=1){ return; }
    NSInteger indexA, indexB;
    NSNumber *temp;
    NSInteger wasLastIndex = [self.indexes[count-1] integerValue];
    for(i=0;i<count;++i){
        indexA = arc4random_uniform(count);
        indexB = arc4random_uniform(count);
        temp = self.indexes[indexA];
        self.indexes[indexA] = self.indexes[indexB];
        self.indexes[indexB] = temp;
    }
    NSInteger isFirstIndex = [self.indexes[0] integerValue];
    if(wasLastIndex==isFirstIndex){ // guarantee no repeats
        indexA = 0;
        indexB = arc4random_uniform(count-1)+1;
        temp = self.indexes[indexA];
        self.indexes[indexA] = self.indexes[indexB];
        self.indexes[indexB] = temp;
    }
}
# self.readArray[self.indexes[index]]; ++index; ...
```



