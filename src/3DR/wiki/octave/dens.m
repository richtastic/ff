% dens.m



pixelWidth = 1920;
pixelHeight = 1080;
pixelWidthHeightRatio = pixelWidth/pixelHeight;
pixelWidthHeightRatio;

cellPercent = 0.1; % 10%
cellPercent = 0.01; %  1%


countX = ceil(cellPercent*pixelWidth);
countY = ceil(cellPercent*pixelHeight);


count = 10; % too few
count = 20; % ok
%count = 40; % maximum for lo density
%count = 80; % maximum for hi density
count = 120; % max for add-back image ?

countX = count;
countY = count;
if pixelWidthHeightRatio > 1
	countX = ceil(count*pixelWidthHeightRatio);
else
	countY = ceil(count/pixelWidthHeightRatio);
end


countX
countY

cellSize = floor( min(pixelWidth/countX, pixelHeight/countY) );


xs = [];
ys = [];


for j = 1:countY
	for i = 1:countX
		xs = [xs, i];
		ys = [ys, j];
	end;
end


hold off;
scatter(xs,ys);
title( [num2str(countX), " x ", num2str(countY), " cell size = ", num2str(cellSize), " pixels"] );

axis equal;










% ...n