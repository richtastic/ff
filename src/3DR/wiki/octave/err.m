% err.m



x = [3, 4, 5, 4.5]; % measurement
w = [2, 1, 3, 1.1]; % window

x_avg = sum(x./w) ./ sum(1./w);  % combined measurement
w_avg = ( 1./sum( w.^-2 ) )^0.5; % combined window
x_avg
w_avg


