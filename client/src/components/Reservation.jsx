import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

import SetName from './SetName';
import SearchParams from './SearchParams';
import TimeSlotSelector from './TimeSlotSelector';

import styles from './styles/Reservation.css';

import helper from '../lib/helper';

class Reservation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bookingsMadeToday: 0,
      availabilityInfo: [
        { time: 17, remaining: 0 },
        { time: 18, remaining: 0 },
        { time: 19, remaining: 0 },
        { time: 20, remaining: 0 },
        { time: 21, remaining: 0 },
      ],
      date: moment.tz('America/Los_Angeles').format('YYYY-MM-DD'),
      time: 19,
      name: '',
      party: 2,
      message: '',
    };

    this.setName = this.setName.bind(this);
    this.changeParty = this.changeParty.bind(this);
    this.requestReservation = this.requestReservation.bind(this);
    this.getAvailabilityInfo = this.getAvailabilityInfo.bind(this);
  }

  componentDidMount() {
    this.getAvailabilityInfo(this.state.date, this.state.time, this.state.party);
  }

  setName(name) {
    this.setState({ name });
  }

  getAvailabilityInfo(date, time, party) {
    helper.getReservationInfo(this.props.id, date, (err, data) => {
      if (!err) {
        this.setState({
          availabilityInfo: data.reservations,
          bookingsMadeToday: data.madeToday,
          party,
          date,
          time,
        });
      } else {
        this.setState({
          message: `Error getting availability info: ${err}`,
        });
      }
    });
  }

  changeParty(party) {
    this.setState({ party });
  }

  requestReservation(time) {
    if (this.state.name.length === 0) {
      this.setState({
        message: 'Enter your name before making a reservation!',
      });
    } else {
      helper.requestReservation(
        this.props.id, this.state.date, time, this.state.name, this.state.party,
        (err) => {
          if (!err) {
            this.setState({
              message: 'Your table has been saved!',
            });
            this.getAvailabilityInfo(this.state.date, this.state.time, this.state.party);
          } else {
            this.setState({
              message: 'Error making reservation',
            });
          }
        },
      );
    }
  }

  render() {
    const {
      name, bookingsMadeToday, availabilityInfo, message,
    } = this.state;

    return (
      <div className={styles.container}>
        <SetName
          name={name}
          clickHandler={this.setName}
        />
        <SearchParams
          clickHandler={this.getAvailabilityInfo}
          changeParty={this.changeParty}
        />
        <TimeSlotSelector
          party={this.state.party}
          bookingsMadeToday={bookingsMadeToday}
          availabilityInfo={availabilityInfo}
          clickHandler={this.requestReservation}
        />
        <div className={styles.message}>
          {message}
        </div>
      </div>
    );
  }
}

Reservation.propTypes = {
  id: PropTypes.number.isRequired,
};

module.exports = Reservation;
