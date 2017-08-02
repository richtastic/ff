% uniqueness.m

samples = 10;
i = [0:samples-1];
d = 0.5;
ideal = 1.0 - exp(-d*i);

good_unique = 0.1 + (1/samples)*i;
bad_unique = 0.25 + (1/(samples*2.0))*i;
good_nonunique = 0.1 + (1/(samples*2.0))*i;
bad_nonunique = 0.35 + (1/(samples*4.0))*i;

bad = 0.25 + (1/(samples*1E6))*i; % + ideal*0.5;

hold off;
plot(ideal,'r-');
hold on;
plot(good_unique,'m-');
plot(bad_unique,'b-');
plot(good_nonunique,'g-');
plot(bad_nonunique,'c-');
plot(bad,'k-');

h = legend('ideal','good unique','bad unique','good non-unique','bad non-unique','bad',  "location","southeast");

item = good_unique;
	item = (item - min(item))/range(item);
score = sum(abs(ideal - item))

item = bad_unique;
	item = (item - min(item))/range(item);
score = sum(abs(ideal - item))

item = good_nonunique;
	item = (item - min(item))/range(item);
score = sum(abs(ideal - item))

item = bad_nonunique;
	item = (item - min(item))/range(item);
score = sum(abs(ideal - item))

item = bad;
	item = (item - min(item))/range(item);
score = sum(abs(ideal - item))

plot(item,'r-*');

% set (h, "fontsize", 20);
% northeastoutside


