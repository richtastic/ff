% von mises
offset = 0;
% offset = 90;
degrees = [10,20,15,-5,-30,0,5,14];
% degrees = [0,20,40,60,80,100,120,140,160,180];
% degrees = [0,20,40,60,80,100,120,140,160,180,200,220,240,260,280,300,320,340];
% degrees = [0,0,0,0,0,0];

angles = (degrees + offset) .* (pi/180);
samples = e.^(j*angles);
count = size(samples,2);

m1 = (1/count) * sum(samples);
m2 = (1/count) * sum(samples.^2);
mean = m1;
meanAngle = atan2(imag(mean),real(mean));

% magnitude of first moment = mag(mean)
r = real(mean);
i = imag(mean);
R1 = (r*r + i*i).^0.5;
R2 = abs(m2);
% R = abs(mean);

% variance: 0 = full circle | 1 = single point
v = 1 - R1;
% standard deviation: ?
s = (-2*log(R1))^0.5;
% dispersion: ?
d = (1 - R2)/(2*R1^2);

mean

meanAngle * 180/pi

R1

R2

v

s

d

% ..



% SPHERICAL















%
