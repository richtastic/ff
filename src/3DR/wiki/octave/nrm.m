% nrm.m

% 
l = 0.5;
dx = 0.0001;

u = 0.0;
s = 1.0;
x = [-l:dx:l];
ss = s*s;
c = 1/(2*pi*ss).^0.5;
% c = 1.0;

y = c*exp(-(x-u).^2/(2*ss));

area = sum(y).*dx;

area

hold off;
plot(x,y);

hold off;





