\connect silverspoon;

\copy restaurants FROM 'restaurant.csv' WITH csv;
\copy reservations (restaurantid, date, time, name, party) FROM 'reservation.csv' WITH csv;
