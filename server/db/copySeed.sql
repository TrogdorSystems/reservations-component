\connect silverspoon;

\copy restaurants FROM 'restaurant.csv' WITH csv;
\copy reservations (restaurantid, date, time, name, party) FROM 'reservation.csv' WITH csv;
CREATE INDEX reservations_restaurantid_index on reservations (restaurantid);
alter table reservations add foreign key(restaurantId) references restaurants (id) on delete cascade on update cascade;
alter table restaurants add primary key (id);
