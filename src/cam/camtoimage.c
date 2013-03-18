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
void convertYUVtoRGB(int y, int u, int v, int *R, int *G, int *B){ // HAVE NOT CHECKED C VALIDITY YET
	double Y = y;
	double U = u;
	double V = v;
	if(U==0){
		U = 128;
	}
	if(V==0){
		V = 128;
	}
	double Yint = 0.9;//1.150;
	*R = (int)max_double(min_double(Yint*(Y-16.0) + 2.500*(V-128), 255.0), 0.0);
	*G = (int)max_double(min_double(Yint*(Y-16.0) - 1.250*(V-128) - 0.750*(U-128), 255.0), 0.0);
	*B = (int)max_double(min_double(Yint*(Y-16.0) + 2.500*(U-128), 255.0), 0.0);
}
/*
while(y<picture.height){
y0 = picture.readY();
u = picture.readUV();
y1 = picture.readY();
v = picture.readUV();
BitPic.convertYUVtoRGB(y0, u, v, RGB);
rgb = 0x0;
rgb |= (RGB[0]&0xFF)<<16;
rgb |= (RGB[1]&0xFF)<<8;
rgb |= (RGB[2]&0xFF);
img.setRGB(x, y, rgb);
BitPic.convertYUVtoRGB(y1, u, v, RGB);
rgb = 0x0;
rgb |= RGB[0]<<16;
rgb |= RGB[1]<<8;
rgb |= RGB[2];
img.setRGB(x+1, y, rgb);
x+=2;
if(x>=picture.width){
	x=0;
	++y;
}}
*/
int save_image_to_ppm(char* file_name, int w, int h, char *bytes){
	fprintf(stdout, "writing to file: '%s' ...\n", file_name);
	int ret, image_len = w*h*3;
	char temp[32];
	//char *header = "P6\n";
	//char *space = " ";
	//char *bitmax = "\n255";
	int fd;
	fd = open(file_name, O_RDWR | O_CREAT, S_IRUSR | S_IWUSR | S_IXUSR | S_IRGRP | S_IWGRP | S_IXGRP | S_IROTH | S_IWOTH | S_IXOTH );
	fprintf(stdout, "\tdescriptor: %d\n",fd);
	if( fd <= 0 ){
		fprintf(stdout, "\tfailed to open file for writing\n");
		return EXIT_FAILURE;
	}
	printf("widxhei = %dx%d\n",w,h);
	sprintf(temp,"P6\n%d %d\n255\n",w,h);
	ret = write(fd, temp, strlen(temp)); // full header
	ret = write(fd, bytes, image_len); // image
	//
	if( ret < image_len ){
		fprintf(stdout, "\tfailed to write all bytes: %d/%d\n",ret, image_len);
		return EXIT_FAILURE;
	}else{
		fprintf(stdout, "\tall bytes written: %d\n",ret);
	}
	ret = close(fd);
	if( ret==0 ){
		fprintf(stdout, "\tfile closed\n");
	}else{
		fprintf(stdout, "\tfile close failure: %d\n", ret);
	}
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
	exit (EXIT_FAILURE);
}
int xioctl(int fd, int request, void *arg){
	int r;
	do r = ioctl(fd, request, arg);
	while (-1 == r && EINTR == errno);
	return r;
}
void init_mmap(const char *dev_name, int *fd, struct buffer **buffer_ptr, unsigned int *n_buffers){
	struct buffer *buffers = *buffer_ptr;
	fprintf(stdout, "\tmemory mapping device ...\n");
	struct v4l2_requestbuffers req;
	CLEAR(req);
	req.count = 4;
	req.type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
	req.memory = V4L2_MEMORY_MMAP;
	if( -1 == xioctl(*fd, VIDIOC_REQBUFS, &req) ){
		if(EINVAL == errno){
			fprintf (stderr, "%s does not support memory mapping\n", dev_name);
			exit(EXIT_FAILURE);
		}else{
			errno_exit("VIDIOC_REQBUFS");
		}
	}else{
		fprintf (stdout, "\t\t%s supports memory mapping\n", dev_name);
	}
	if(req.count < 2){
		fprintf (stderr, "Insufficient buffer memory on %s\n", dev_name);
		exit(EXIT_FAILURE);
	}else{
		fprintf (stdout, "\t\t%s sufficient memory for buffer\n", dev_name);
	}
	fprintf (stdout, "\t\tsize of buffer: %ld\n", sizeof(*buffers));
	buffers = (buffer*)calloc(req.count, sizeof (*buffers));
	*buffer_ptr = buffers;
	if(!buffers){
		fprintf(stderr, "out of memory\n");
		exit (EXIT_FAILURE);
	}
	fprintf (stdout, "\t\t%s  buffers allocated\n", dev_name);
	
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
	fprintf(stdout, "\tsuccess\n");
}
// ------------------------------------------------------------------------------------ statics
// static char * dev_name = NULL;
// static int fd = -1;
// static io_method io = IO_METHOD_MMAP;
// struct buffer* buffers = NULL;
// static unsigned int n_buffers = 0;
// ------------------------------------------------------------------------------------ device functions
void open_device(const char *dev_name, int *fd){
	struct stat st;
	fprintf(stdout, "opening %s ...\n",dev_name);
	if(-1 == stat(dev_name, &st)){
		fprintf(stderr, "Cannot identify '%s': %d, %s\n", dev_name, errno, strerror(errno));
		exit(EXIT_FAILURE);
	}else{
		printf("\tnlink: %ld\n", st.st_nlink);
	}
	if(!S_ISCHR (st.st_mode)){
		fprintf (stderr, "%s is no device\n", dev_name);
		exit (EXIT_FAILURE);
	}else{
		printf("\tmode: %d\n", S_ISCHR(st.st_mode));
	}
	*fd = open(dev_name, O_RDWR | O_NONBLOCK, 0);
	if (-1 == *fd){
		fprintf (stderr, "Cannot open '%s': %d, %s\n", dev_name, errno, strerror (errno));
		exit (EXIT_FAILURE);
	}else{
		fprintf(stdout, "\tfile descriptor: %d\n",*fd);
	}
	fprintf(stdout, "success\n");
}
void init_device(const char *dev_name, int *fd, int picWidth, int picHeight, struct buffer **buffer_ptr, unsigned int *n_buffers){
	struct v4l2_capability cap;
	struct v4l2_cropcap cropcap;
	struct v4l2_crop crop;
	struct v4l2_format fmt;
	unsigned int min;
	fprintf(stdout, "initting device ...\n");
	
	if(-1 == xioctl(*fd, VIDIOC_QUERYCAP, &cap)){
		if(EINVAL == errno){
			fprintf(stderr, "%s is no V4L2 device\n", dev_name);
			exit(EXIT_FAILURE);
		}else{
			errno_exit("VIDIOC_QUERYCAP");
		}
	}else{
		fprintf(stdout, "\t%s is a V4L2 device\n", dev_name);
	}
	if ( !(cap.capabilities & V4L2_CAP_VIDEO_CAPTURE) ){
		fprintf(stderr, "%s is no video capture device\n", dev_name);
		exit(EXIT_FAILURE);
	}else{
		fprintf(stdout, "\t%s is a video capture device\n", dev_name);
	}
	if (!(cap.capabilities & V4L2_CAP_STREAMING)) {
		fprintf(stderr, "%s does not support streaming i/o\n", dev_name);
		exit(EXIT_FAILURE);
	}else{
		fprintf(stdout, "\t%s supports streaming i/o\n", dev_name);
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
		fprintf(stdout, "\tcropping checked ...\n");
	}else{ // errors ignored
		fprintf(stdout, "an error occurred with the device - ignored ...\n");
	}
	CLEAR(fmt);
	fmt.type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
	fmt.fmt.pix.width = picWidth;
	fmt.fmt.pix.height = picHeight;
	fmt.fmt.pix.pixelformat = V4L2_PIX_FMT_YUYV;
	fmt.fmt.pix.field = V4L2_FIELD_INTERLACED;
	if( -1 == xioctl (*fd, VIDIOC_S_FMT, &fmt) ){
		errno_exit ("VIDIOC_S_FMT");
	}else{
		fprintf(stdout, "\tformat set: %dx%d\n",fmt.fmt.pix.width,fmt.fmt.pix.height);
	} // note VIDIOC_S_FMT may change width and height
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
	fprintf(stdout, "success\n");
}
void start_capturing(int *fd, unsigned int *n_buffers){
	fprintf(stdout, "capturing starting ... \n");
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
	fprintf(stdout, "success\n");
}
//
void grab_frame(int *fd, struct buffer **buffer_ptr, unsigned int *n_buffers, int picWidth, int picHeight){
	fprintf(stdout, "grabbing frame ... \n");
	unsigned int count;
	struct timeval tv;
	int r, i=0, limit=10;
	tv.tv_sec = 0;
	tv.tv_usec = 0;
	fd_set fds;
	while(i<limit){
		fprintf(stdout, "attempt %d\n",i);
		FD_ZERO(&fds);
		FD_SET(*fd, &fds);
		r = select((*fd) + 1, &fds, NULL, NULL, &tv);
		if(r==-1){
			fprintf(stdout, "-1\n");
			if(EINTR == errno){
				continue;
			}
			errno_exit ("select");
		}else if( read_frame(fd, buffer_ptr, n_buffers, picWidth, picHeight) ){
			break;
		}
		++i;
	}
	fprintf(stdout, "success\n");
}
int read_frame(int *fd, struct buffer **buffer_ptr, unsigned int *n_buffers, int picWidth, int picHeight){
	fprintf(stdout, "reading frame ... \n");
	struct buffer *buffers = *buffer_ptr;
	struct v4l2_buffer buf;
	unsigned int i;
	int success;
	CLEAR(buf);
	buf.type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
	buf.memory = V4L2_MEMORY_MMAP;
	if(-1 == xioctl(*fd, VIDIOC_DQBUF, &buf)) {
		msleep(100);
	}
	assert (buf.index < *n_buffers);
	success = process_image(buffers[buf.index].start, buffers[buf.index].length, picWidth, picHeight);
	if (-1 == xioctl(*fd, VIDIOC_QBUF, &buf)){
		msleep(100);
	}
	return success;
}
int process_image(const void* p, size_t len, int picWidth, int picHeight){
	fprintf(stdout, "processing image ... \n");
	int success = 0;
	char* ptr = (char*)p;
	int length = (int)len;
	int encodedLength = picWidth*picHeight*2;// two pixels are encoded with 4 values
	int picLength = picWidth*picHeight*3;// each pixel is encoded with 3 values
fprintf(stdout, "available buffer: %d / %d | %d (%dx%d)\n",length, encodedLength, picLength, picWidth, picHeight);
	if(length>=encodedLength){
		int i, j;
		unsigned char c, y0, u, y1, v;
		int r, g, b;
		char *image_buffer = NULL;
		image_buffer = (char*)malloc(picLength * sizeof(char));
		j = 0;
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
		//fprintf(stdout, "LENGTH: %d\n",length);
		success = 1;
		save_image_to_ppm("image.ppm", picWidth,picHeight, image_buffer);
		free(image_buffer);
	}
	if(success==0){
		fprintf(stdout, "failure\n");
	}else{
		fprintf(stdout, "success\n");
	}
	return 1;
}
int save_image(){
	printf("SAVE IMAGE\n");
}
//
void stop_capturing(int *fd){
	fprintf(stdout, "capturing stopping ... \n");
	enum v4l2_buf_type type;
	type = V4L2_BUF_TYPE_VIDEO_CAPTURE;
	if( -1 == xioctl (*fd, VIDIOC_STREAMOFF, &type) ){
		errno_exit("VIDIOC_STREAMOFF");
	}
	fprintf(stdout, "success\n");
}
void uninit_device(struct buffer **buffer_ptr, int *n_buffers){
	fprintf(stdout, "uninitting device ...\n");
	unsigned int i;
	struct buffer *buffers = *buffer_ptr;
	for(i=0; i<*n_buffers; ++i){
		if (-1 == munmap(buffers[i].start, buffers[i].length) ){
			errno_exit ("munmap");
		}
	}
	fprintf(stdout, "freeing ... \n");
	free(buffers);
	*buffer_ptr = NULL;
	fprintf(stdout, "success\n");
}
void close_device(int *fd){
	printf("closing device ...\n");
	if(-1 == close(*fd)){
		errno_exit("close");
	}
	*fd = -1;
	fprintf(stdout, "success\n");
}
// ------------------------------------------------------------------------------------ main
int file_descriptor = -1;
int main(int argc, const char **argv){
	if(argc<3){
		printf("to use: %s /dev/video# /output/folder \n",argv[0]);
		return 0;
	}
	printf("device: %s\n",argv[1]);
	printf("output: %s\n",argv[2]);

char input_char;
int continue_boolean = 1;
	while(continue_boolean){
		//fgets(&input_char,1,stdin);
		input_char = fgetc(stdin);
		printf("IN: '%c'\n",input_char);
		if(input_char=='q'){
			continue_boolean = 0;
		}else{
			//printf("nothing\n");
			msleep(100);
		}
		input_char = 0;
	}
return 0;

	int wid=320, hei=240;
	struct buffer* buffers = NULL;
	unsigned int n_buffers = 0;
	// 
	open_device(argv[1], &file_descriptor);
	init_device(argv[1], &file_descriptor, wid, hei, &buffers, &n_buffers);
	start_capturing(&file_descriptor,&n_buffers);
	printf(" loop \n");
	while(1){
		msleep(1000);
		grab_frame(&file_descriptor, &buffers, &n_buffers, wid, hei);
	}
	stop_capturing(&file_descriptor);
	uninit_device(&buffers, &n_buffers);
	close_device(&file_descriptor);
time_t timeNow;
timeNow = time(0);
//printf("TIME: %d\n",timeNow->tm_sec);
printf("TIME SECONDS: %ld\n",timeNow);
struct timeval tv;
gettimeofday(&tv,0);
printf("TIME: %ld.%ld\n",tv.tv_sec,tv.tv_usec);
	return EXIT_SUCCESS;
}
