% fade.m


x = [0:.1:1];
% y = x.*x.*x;
y = exp(x.*x) - 1;

hold off;
plot( x, x, 'b-');
hold on;
plot( x, y, 'r-');
























