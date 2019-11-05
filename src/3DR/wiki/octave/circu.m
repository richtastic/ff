% circu.m

% around ~ 1,0,0
preferred = [
	[1,0,0],
	[1,0.1,-0.1],
	[1,-0.1,0.1],
	[1,0.1,0.1],
	[1,0.0,0.1],
	[1,0.1,0.0],
	[1,0.2,0.1],
	[1,0.1,0.2],
	];

uniform = [
	[1,0,0.1],
	[-1,0.1,0],
	[0,1,0.1],
	[-0.1,-1,0],
	[0,0.1,1],
	[0.1,-0.1,-1],
	[1,1,1],
	[-1,1,-1],
	[1,-1,-1],
	[-.5,2.0,0.1],
	[1,0.1,0.9],
	[0.6,0.2,0.1],
	[0.3,0.9,1.2],
	];

medium = [preferred', uniform']';

% example data to test
normals = preferred; % 0.99
% normals = uniform; % 0.25
% normals = medium; % 0.5



count = size(normals,1);

% to unit lengths
for i=1:count
	n = normals(i,:);
	l = sqrt(sum(n.*n));
	normals(i,:) = n / l;
end
normals;


average = sum(normals) / count;
magnitude = sqrt(sum(average.*average));
average = average/magnitude;

magnitude
average


% get angles:
% to unit lengths
angles = [];
for i=1:count
	n = normals(i,:);
	angle = acos(sum(average.*n));
	angles(1,i) = angle;
	angles(1,i) = angle * 180 / pi;
end
%angles



hold off;
rose(angles);
%polar(angles);

%
