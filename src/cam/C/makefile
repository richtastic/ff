# Basic Camera Reader Makefile
CC = gcc
#OPT = -O2
#LIBS = -lm
#OPS = -Wno-deprecated

camtoimage: camtoimage.o 
	$(CC) -o camtoimage camtoimage.o 
	rm *.o

camtoimage.o: camtoimage.c
	$(CC) -c camtoimage.c

clean:
	rm *.o


