// http://www.linuxtv.org/downloads/legacy/video4linux/v4l2dwgNew.html
// http://linuxtv.org/downloads/v4l-dvb-apis/capture-example.html
// http://linuxtv.org/downloads/v4l-dvb-apis/v4l2grab-example.html
// http://www.google.com/url?sa=t&rct=j&q=video%204%20linux%20clear%20buffer&source=web&cd=4&ved=0CD4QFjAD&url=http%3A%2F%2Flinuxtv.org%2Fdownloads%2Fpresentations%2Fsummit_jun_2010%2FVideobuf_Helsinki_June2010.pdf&ei=VPVHUb6RHpTYyAHo4YCgBQ&usg=AFQjCNHzFEj1LlTtF8d5NtEPEvMzRNlFUw&bvm=bv.43828540,d.aWM&cad=rja
// http://www.google.com/url?sa=t&rct=j&q=video%204%20linux%20clear%20buffer&source=web&cd=5&ved=0CEMQFjAE&url=http%3A%2F%2Fkernelbook.sourceforge.net%2Fvideobook.pdf&ei=VPVHUb6RHpTYyAHo4YCgBQ&usg=AFQjCNEMmkp-630E8cFBYMaknMaDEHuD-Q&bvm=bv.43828540,d.aWM&cad=rja
// Video for Linux Two API Specification
// http://v4l2spec.bytesex.org/spec/
// http://www.thedirks.org/v4l2/
// 
#include <assert.h>
#include <dirent.h>
#include <fcntl.h>
#include <getopt.h>
#include <grp.h>
#include <langinfo.h>
#include <locale.h>
#include <limits.h>
#include <math.h>
#include <netdb.h>
#include <malloc.h>
#include <pwd.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <stdarg.h>
#include <string.h>
#include <time.h>
#include <unistd.h>
#include <sys/errno.h>
#include <sys/mman.h>
#include <sys/ioctl.h>
#include <sys/socket.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <sys/time.h>
#include <arpa/inet.h>
#include <asm/types.h>
#include <linux/videodev2.h>
#include <errno.h>
// ------------------------------------------------------------------------------------ consts
#define CONST_QUIT_SUCCESS 'q'
#define CONST_QUIT_FAILURE 'Q'
#define CONST_SAVE_SUCCESS 's'
#define CONST_SAVE_FAILURE 'S'
// ------------------------------------------------------------------------------------ shorthand
#define CLEAR(x) memset (&(x), 0, sizeof (x))
#define MAX(a,b) a>b?a:b
double max_double(double a,double b){ if(a>=b){ return a; } return b; }
double min_double(double a,double b){ if(a<=b){ return a; } return b; }
// ------------------------------------------------------------------------------------ enums
typedef enum{
	IO_METHOD_READ,
	IO_METHOD_MMAP,
	IO_METHOD_USERPTR,
} io_method;
typedef struct buffer{
	void *start;
	size_t length;
} buffer;
// ------------------------------------------------------------------------------------ colors
void convertYUVtoRGB(int y, int u, int v, int *R, int *G, int *B){ 
	double Y = y;
	double U = u;
	double V = v;
	if(U==0){ U = 128; }
	if(V==0){ V = 128; }
	double Yint = 0.9; // 1.150;
	*R = (int)max_double(min_double(Yint*(Y-16.0) + 2.500*(V-128), 255.0), 0.0);
	*G = (int)max_double(min_double(Yint*(Y-16.0) - 1.250*(V-128) - 0.750*(U-128), 255.0), 0.0);
	*B = (int)max_double(min_double(Yint*(Y-16.0) + 2.500*(U-128), 255.0), 0.0);
}
// ------------------------------------------------------------------------------------ image
int save_image_to_ppm(const char* file_name, int w, int h, char *bytes){
	fprintf(stderr, "writing to file: '%s' ...\n", file_name);
	int ret, image_len = w*h*3;
	char temp[32];
	int fd;
	fd = open(file_name, O_RDWR | O_CREAT, S_IRUSR | S_IWUSR | S_IXUSR | S_IRGRP | S_IWGRP | S_IXGRP | S_IROTH | S_IWOTH | S_IXOTH );
	fprintf(stderr, "\tdescriptor: %d\n",fd);
	if( fd <= 0 ){
		fprintf(stderr, "\tfailed to open file for writing\n");
		printf("%c", CONST_SAVE_FAILURE);
		return EXIT_FAILURE;
	}
	fprintf(stderr, "widxhei = %dx%d\n",w,h);
	sprintf(temp,"P6\n%d %d\n255\n",w,h);
	ret = write(fd, temp, strlen(temp)); // full header
	ret = write(fd, bytes, image_len); // image
	//
	if( ret < image_len ){
		fprintf(stderr, "\tfailed to write all bytes: %d/%d\n",ret, image_len);
		printf("%c", CONST_SAVE_FAILURE);
		return EXIT_FAILURE;
	}else{
		fprintf(stderr, "\tall bytes written: %d\n",ret);
	}
	ret = close(fd);
	if( ret==0 ){
		fprintf(stderr, "\tfile closed\n");
	}else{
		fprintf(stderr, "\tfile close failure: %d\n", ret);
	}
	printf("%c", CONST_SAVE_SUCCESS);
	return EXIT_SUCCESS;
}
// ------------------------------------------------------------------------------------ helpers
int __nsleep(const struct timespec *req, struct timespec *rem){
	struct timespec temp_rem;
	if(nanosleep(req,rem)==-1){
		__nsleep(rem,&temp_rem);
	}else{
		return 1;
	}
}
int msleep(unsigned long milisec){
	struct timespec req={0},rem={0};
	time_t sec=(int)(milisec/1000);
	milisec=milisec-(sec*1000);
	req.tv_sec=sec;
	req.tv_nsec=milisec*1000000L;
	__nsleep(&req,&rem);
	return 1;
}
void errno_exit (const char* s){
	fprintf(stderr, "%s error %d, %s\n", s, errno, strerror (errno));
	printf("%c", CONST_QUIT_FAILURE);
	exit(EXIT_FAILURE);
}
int xioctl(int fd, int request, void *arg){ // busy wait checking
	int r;
	do r = ioctl(fd, request, arg);
	while (-1 == r && EINTR == errno);
	return r;
}
void init_mmap(const char *dev_name, int *fd, struct buffer **buffer_ptr, unsigned int *n_buffers){
	struct buffer *buffers = *buffer_ptr;
	fprintf(stderr, "\tmemory mapping device ...\n");
	struct v4l2_requestbuffers req;
	CLEAR(req);
	req.count = 4;
	req.type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
	req.memory = V4L2_MEMORY_MMAP;
	if( -1 == xioctl(*fd, VIDIOC_REQBUFS, &req) ){
		if(EINVAL == errno){
			fprintf(stderr, "%s does not support memory mapping\n", dev_name);
			printf("%c", CONST_QUIT_FAILURE);
			exit(EXIT_FAILURE);
		}else{
			errno_exit("VIDIOC_REQBUFS");
		}
	}else{
		fprintf(stderr, "\t\t%s supports memory mapping\n", dev_name);
	}
	if(req.count < 2){
		fprintf (stderr, "Insufficient buffer memory on %s\n", dev_name);
		printf("%c", CONST_QUIT_FAILURE);
		exit(EXIT_FAILURE);
	}else{
		fprintf(stderr, "\t\t%s sufficient memory for buffer\n", dev_name);
	}
	fprintf(stderr, "\t\tsize of buffer: %ld\n", sizeof(*buffers));
	buffers = (buffer*)calloc(req.count, sizeof (*buffers));
	*buffer_ptr = buffers;
	if(!buffers){
		fprintf(stderr, "out of memory\n");
		printf("%c", CONST_QUIT_FAILURE);
		exit (EXIT_FAILURE);
	}
	fprintf(stderr, "\t\t%s  buffers allocated\n", dev_name);
	for(*n_buffers=0; *n_buffers<req.count; (*n_buffers=*n_buffers+1)){
		struct v4l2_buffer buf;
		CLEAR(buf);
		buf.type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
		buf.memory = V4L2_MEMORY_MMAP;
		buf.index = *n_buffers;
		if(-1 == xioctl (*fd, VIDIOC_QUERYBUF, &buf)){
			errno_exit("VIDIOC_QUERYBUF");
		}
		buffers[*n_buffers].length = buf.length;
		buffers[*n_buffers].start = mmap(NULL /* start anywhere */, buf.length, PROT_READ | PROT_WRITE /* required */, MAP_SHARED /* recommended */, *fd, buf.m.offset);
		if(MAP_FAILED == buffers[*n_buffers].start){
			errno_exit("mmap");
		}
	}
	fprintf(stderr, "\tsuccess\n");
}
// ------------------------------------------------------------------------------------ device starting
void open_device(const char *dev_name, int *fd){
	struct stat st;
	fprintf(stderr, "opening %s ...\n",dev_name);
	if(-1 == stat(dev_name, &st)){
		fprintf(stderr, "Cannot identify '%s': %d, %s\n", dev_name, errno, strerror(errno));
		printf("%c", CONST_QUIT_FAILURE); exit(EXIT_FAILURE);
	}else{
		fprintf(stderr, "\tnlink: %ld\n", st.st_nlink);
	}
	if(!S_ISCHR (st.st_mode)){
		fprintf (stderr, "%s is no device\n", dev_name);
		printf("%c", CONST_QUIT_FAILURE); exit (EXIT_FAILURE);
	}else{
		fprintf(stderr, "\tmode: %d\n", S_ISCHR(st.st_mode));
	}
	*fd = open(dev_name, O_RDWR | O_NONBLOCK, 0);
	if (-1 == *fd){
		fprintf (stderr, "Cannot open '%s': %d, %s\n", dev_name, errno, strerror (errno));
		printf("%c", CONST_QUIT_FAILURE); exit (EXIT_FAILURE);
	}else{
		fprintf(stderr, "\tfile descriptor: %d\n",*fd);
	}
	fprintf(stderr, "success\n");
}
void init_device(const char *dev_name, int *fd, int *picWidth, int *picHeight, struct buffer **buffer_ptr, unsigned int *n_buffers){
	struct v4l2_capability cap;
	struct v4l2_cropcap cropcap;
	struct v4l2_crop crop;
	struct v4l2_format fmt;
	unsigned int min;
	fprintf(stderr, "initting device ...\n");
	
	if(-1 == xioctl(*fd, VIDIOC_QUERYCAP, &cap)){
		if(EINVAL == errno){
			fprintf(stderr, "%s is no V4L2 device\n", dev_name);
			printf("%c", CONST_QUIT_FAILURE); exit(EXIT_FAILURE);
		}else{
			errno_exit("VIDIOC_QUERYCAP");
		}
	}else{
		fprintf(stderr, "\t%s is a V4L2 device\n", dev_name);
	}
	if ( !(cap.capabilities & V4L2_CAP_VIDEO_CAPTURE) ){
		fprintf(stderr, "%s is no video capture device\n", dev_name);
		printf("%c", CONST_QUIT_FAILURE); exit(EXIT_FAILURE);
	}else{
		fprintf(stderr, "\t%s is a video capture device\n", dev_name);
	}
	if (!(cap.capabilities & V4L2_CAP_STREAMING)) {
		fprintf(stderr, "%s does not support streaming i/o\n", dev_name);
		printf("%c", CONST_QUIT_FAILURE); exit(EXIT_FAILURE);
	}else{
		fprintf(stderr, "\t%s supports streaming i/o\n", dev_name);
	}
	CLEAR(cropcap);
	cropcap.type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
	if( xioctl(*fd, VIDIOC_CROPCAP, &cropcap)==0 ){
		crop.type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
		crop.c = cropcap.defrect; // reset to default
		if(-1 == xioctl(*fd, VIDIOC_S_CROP, &crop) ){
			switch(errno){
				case EINVAL: // cropping not supported
				break;
				default: // errors ignored
				break;
			}
		}
		fprintf(stderr, "\tcropping checked ...\n");
	}else{ // errors ignored
		fprintf(stderr, "an error occurred with the device - ignored ...\n");
	}
	CLEAR(fmt);
	fmt.type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
	fmt.fmt.pix.width = *picWidth;
	fmt.fmt.pix.height = *picHeight;
	fmt.fmt.pix.pixelformat = V4L2_PIX_FMT_YUYV;
	fmt.fmt.pix.field = V4L2_FIELD_INTERLACED;
	if( -1 == xioctl (*fd, VIDIOC_S_FMT, &fmt) ){
		errno_exit ("VIDIOC_S_FMT");
	}else{
		fprintf(stderr, "\tformat set: %dx%d\n",fmt.fmt.pix.width,fmt.fmt.pix.height);
	}
	*picWidth = fmt.fmt.pix.width;
	*picHeight = fmt.fmt.pix.height;
	// buggy driver paranoia
	min = fmt.fmt.pix.width*2;
	if(fmt.fmt.pix.bytesperline < min){
		fmt.fmt.pix.bytesperline = min;
		min = fmt.fmt.pix.bytesperline * fmt.fmt.pix.height;
	}
	if (fmt.fmt.pix.sizeimage < min){
		fmt.fmt.pix.sizeimage = min;
	}
	init_mmap(dev_name, fd, buffer_ptr, n_buffers);
	fprintf(stderr, "success\n");
}
void start_capturing(int *fd, unsigned int *n_buffers){
	fprintf(stderr, "capturing starting ... \n");
	unsigned int i;
	enum v4l2_buf_type type;
	for(i=0; i<*n_buffers; ++i){
		struct v4l2_buffer buf;
		CLEAR(buf);
		buf.type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
		buf.memory = V4L2_MEMORY_MMAP;
		buf.index = i;
		if( -1 == xioctl (*fd, VIDIOC_QBUF, &buf) ){
			errno_exit("VIDIOC_QBUF");
		}
	}
	type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
	if( -1 == xioctl (*fd, VIDIOC_STREAMON, &type) ){
		errno_exit("VIDIOC_STREAMON");
	}
	fprintf(stderr, "success\n");
}
// ------------------------------------------------------------------------------------ device capturing
void clear_buffer(int *fd, struct buffer **buffer_ptr, unsigned int *n_buffers, int picWidth, int picHeight, char *image_buffer, const char *outFilename){
	return;
	printf("clearing buffer...");
	fd_set fds;
	struct timeval tv;
	int r, i = 0;
	struct buffer *buffers = *buffer_ptr;
	struct v4l2_buffer buf;
	while(i<2000000){
		FD_ZERO(&fds);
		FD_SET(*fd, &fds);
		r = select((*fd) + 1, &fds, NULL, NULL, &tv);
		if(r==-1){ if(EINTR == errno){continue;}
		}else{
			CLEAR(buf);
			buf.type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
			buf.memory = V4L2_MEMORY_MMAP;
			assert (buf.index < *n_buffers);
			// read_frame ... 
		}
		++i;
	}
	printf("done\n");
}
void grab_frame(int *fd, struct buffer **buffer_ptr, unsigned int *n_buffers, int picWidth, int picHeight, char *image_buffer, const char *outFilename){
	fprintf(stderr, "grabbing frame ... \n");
	unsigned int count;
	struct timeval tv;
	int r, i=0, limit=10;
	tv.tv_sec = 0;
	tv.tv_usec = 0;
	fd_set fds;
	while(i<limit){
		fprintf(stderr, "attempt %d\n",i);
		FD_ZERO(&fds);
		FD_SET(*fd, &fds);
		r = select((*fd) + 1, &fds, NULL, NULL, &tv);
		if(r==-1){
			fprintf(stderr, "\t-1\n");
			if(EINTR == errno){
				continue;
			}
			errno_exit ("select");
		}else if( read_frame(fd, buffer_ptr, n_buffers, picWidth, picHeight, image_buffer, outFilename) ){
			break;
		}
		++i;
	}
	fprintf(stderr, "success\n");
}
int read_frame(int *fd, struct buffer **buffer_ptr, unsigned int *n_buffers, int picWidth, int picHeight, char *image_buffer, const char *outFilename){
	fprintf(stderr, "reading frame ... \n");
	struct buffer *buffers = *buffer_ptr;
	struct v4l2_buffer buf;
	unsigned int i;
	int success;
	CLEAR(buf);
	buf.type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
	buf.memory = V4L2_MEMORY_MMAP;
	assert (buf.index < *n_buffers);
	return process_image(buffers[buf.index].start, buffers[buf.index].length, picWidth, picHeight, image_buffer, outFilename);
}
//char trash[153600];
int process_image(const void* p, size_t len, int picWidth, int picHeight, char *image_buffer, const char *outFilename){
	fprintf(stderr, "processing image ... \n");
	int success = 0;
	char* ptr = (char*)p;
	int length = (int)len;
	int encodedLength = picWidth*picHeight*2;// two pixels are encoded with 4 values
	int picLength = picWidth*picHeight*3;// each pixel is encoded with 3 values
	fprintf(stderr, "available buffer: %d / %d | %d (%dx%d)\n",length, encodedLength, picLength, picWidth, picHeight);
	if(length>=encodedLength){
		int i, j;
		unsigned char c, y0, u, y1, v;
		int r, g, b;
		j = 0;
		fprintf(stderr, "reading buffer ... \n");
		for(i=0;i<encodedLength;i+=4){
			y0 = ptr[i];
			u = ptr[i+1];
			y1 = ptr[i+2];
			v = ptr[i+3];
			convertYUVtoRGB(y0, u, v, &r, &g, &b);
			image_buffer[j++] = r; image_buffer[j++] = g; image_buffer[j++] = b;
			convertYUVtoRGB(y1, u, v, &r, &g, &b);
			image_buffer[j++] = r; image_buffer[j++] = g; image_buffer[j++] = b;
		}
//fwrite(p, encodedLength, 8, stderr);
		fprintf(stderr, "converted yuyv to rgb on image buffer\n");
		success = 1;
		save_image_to_ppm(outFilename, picWidth,picHeight, image_buffer);
	}
	if(success==0){
		fprintf(stderr, "failure\n");
	}else{
		fprintf(stderr, "success\n");
	}
	return 1;
}
// ------------------------------------------------------------------------------------ device stopping
void stop_capturing(int *fd){
	fprintf(stderr, "capturing stopping ... \n");
	enum v4l2_buf_type type;
	type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
	if( -1 == xioctl (*fd, VIDIOC_STREAMOFF, &type) ){
		errno_exit("VIDIOC_STREAMOFF");
	}
	fprintf(stderr, "success\n");
}
void uninit_device(struct buffer **buffer_ptr, int *n_buffers){
	fprintf(stderr, "uninitting device ...\n");
	unsigned int i;
	struct buffer *buffers = *buffer_ptr;
	for(i=0; i<*n_buffers; ++i){
		if (-1 == munmap(buffers[i].start, buffers[i].length) ){
			errno_exit ("munmap");
		}
	}
	fprintf(stderr, "freeing ... \n");
	free(buffers);
	*buffer_ptr = NULL;
	fprintf(stderr, "success\n");
}
void close_device(int *fd){
	fprintf(stderr, "closing device ...\n");
	if(-1 == close(*fd)){
		errno_exit("close");
	}
	*fd = -1;
	fprintf(stderr, "success\n");
}
// ------------------------------------------------------------------------------------ main
int file_descriptor = -1;
int main(int argc, const char **argv){
	char input_char;
	int wid = 320, hei = 240, continue_boolean = 1;
	struct buffer* buffers = NULL;
	unsigned int n_buffers = 0;
	char *image_buffer = NULL;
	if(argc<3){
		fprintf(stderr, "to use: %s /dev/video# /output/file.ppm [width height]\n", argv[0]);
		fprintf(stderr, " input: %c = quit | %c = save image\n", CONST_QUIT_SUCCESS, CONST_SAVE_SUCCESS);
		fprintf(stderr, "output: q = quit success | Q = quit fail | s = save success | S = save fail\n", CONST_QUIT_SUCCESS, CONST_QUIT_FAILURE, CONST_SAVE_SUCCESS, CONST_SAVE_FAILURE);
		return 0;
	}
	if(argc>3){ wid = atoi(argv[3]); }
	if(argc>4){ hei = atoi(argv[4]); }
	fprintf(stderr, "device: %s\n",argv[1]);
	fprintf(stderr, "output: %s\n",argv[2]);
	fprintf(stderr, " width: %d\n",wid);
	fprintf(stderr, "height: %d\n",hei);
	open_device(argv[1], &file_descriptor);
	init_device(argv[1], &file_descriptor, &wid, &hei, &buffers, &n_buffers);
	image_buffer = (char*)malloc(wid*hei*3 * sizeof(char));
	start_capturing(&file_descriptor,&n_buffers);
	while(continue_boolean){
		input_char = fgetc(stdin);
		if(input_char==CONST_SAVE_SUCCESS){
			//start_capturing(&file_descriptor,&n_buffers);
			clear_buffer(&file_descriptor, &buffers, &n_buffers, wid, hei, image_buffer, argv[2]);
			grab_frame(&file_descriptor, &buffers, &n_buffers, wid, hei, image_buffer, argv[2]);
			//stop_capturing(&file_descriptor);
		}else if(input_char==CONST_QUIT_SUCCESS){
			continue_boolean = 0;
		}
	}
	stop_capturing(&file_descriptor);
	uninit_device(&buffers, &n_buffers);
	close_device(&file_descriptor);
	printf("%c", CONST_QUIT_SUCCESS);
	return EXIT_SUCCESS;
}