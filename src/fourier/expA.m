% expA.m


%x = [0:0.1:10];
% phi = (2*pi)/6;
%phi = 0;
%y = cos(x.*((2*pi)/3) + phi);


% x = [0:0.5:500];
% x = linspace(0,0.5,500);

% 40 hz & 90 hz

% y = sin(40 * 2 * pi .* x) + 0.5 * sin(90 * 2 * pi .* x) + 0.50;
% y = sin(40 * 2 * pi .* x) + 0.5 * sin(20 * 2 * pi .* x);



x = linspace(0,10,100);
y = sin(0.5 * 2 * pi .* x + pi*0.25);


count = size(x,2);

hold off;
plot(y);
xlabel('Sample index');
ylabel('Amplitude');
title('signal samples');


% coefficients
T = x(1,2) - x(1,1); % sample spacing
k = [1:count];
coefficients = zeros(1,count);

for k = 0:count-1 % frequency
	coefficient = 0;
	for n = 0:count-1 % sample
		sample = y(1,n+1);
		coefficient = coefficient + sample * exp(-2*pi*j * k * n/count );
	endfor
	coefficients(1,k+1) = coefficient;
endfor

hold off;


% coefficients are scaled by count -- should be scaled by 1/count

% coefficients = fft(y);


coefficients


% coefficientsccc

% stem(coefficients.*coefficients);
% stem( abs(coefficients) );
% f = linspace(0,1/T,count);
f = linspace(0,1.0, count);
% bar(f(1:count/2) , abs(coefficients)(1:count/2) * 1/count );
bar(f , abs(coefficients) * 1/count );
xlabel('Frequencies (units?)');
ylabel('Amplitude');
title('Frequency components');






% also try a summation using literally cos waves w/ phases?

values = zeros(1,count);
freq0 =  1.0/T;
for n = 0:count-1 % for each time sample
	value = 0;
	dt = n/T;
	for k = 0:count-1 % for each frequency
		c = coefficients(1,k+1);
		phase = angle(c);
		magnitude = abs(c);
		freq = freq0 * k;
		val = magnitude * cos(2*pi*freq*dt + phase);
		value = value + val;
	endfor
	values(1,n+1) = value;
endfor


values

plot( values );
xlabel('Time (s)');
ylabel('Amplitude');
title('reproduced signal');


xx

% reproduce original signal:


s = linspace(0,1/T,count);
for n = 0:count-1
	value = 0;
	for k = 0:count-1
		c = coefficients(1,k+1);
		value = value + c * exp(2*pi*j * k * n/count); % * T;
	endfor
	value = value * 1/count;
	s(1,n+1) = value;
endfor


% 0.0025


hold off;
% plot( abs(s) );
plot( real(s) );
xlabel('Time (s)');
ylabel('Amplitude');
title('reproduced signal');











% f = fft(y);



% ...