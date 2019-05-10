% cornA.m

x = [0.00002437577086990786, 0.0000341362542266591, 0.005573153389356284, 0.0007806907115337884];

% x = [21270.58042002369, 6045.628389773431, 206561.93049583366, 39977.87226830131]

% x = x.^0.5


% subplot(1,1)
hold off;
% plot(log(c),r,'r-');

% plot(log(c),'r-');
% plot(x,'r-');


s = std(x)
m = mean(x)

s * 2



stem(x,[1,2,3,4],'r-');


% print -dpng -color "-S200,200" a.png


print -dpng -color "-S1200,800" "output/a.png"
% print -dpng -color "-rNUM200" a.png
% "-"

hold off;
close()

















