import React from 'react';
import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from 'moment-timezone';

import dayPickerStyles from './styles/dayPicker.css';
import styles from './styles/SearchParams.css';

class SearchParams extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      partyVal: 2,
      dateVal: moment.tz('America/Los_Angeles').format('YYYY-MM-DD'),
      timeVal: 19,
    };

    this.handleDayChange = this.handleDayChange.bind(this);
  }

  handleDayChange(day) {
    // const dayStr = day.toISOString().slice(0, 10);
    const dayStr = moment(day).tz('America/Los_Angeles').format('YYYY-MM-DD');
    this.props.clickHandler(dayStr, this.state.timeVal, this.state.partyVal);
    this.setState({
      dateVal: dayStr,
    });
  }

  handlePartyChange(party) {
    this.props.changeParty(Number(party));
    this.setState({
      partyVal: Number(party),
    });
  }

  handleTimeChange(time) {
    this.setState({
      timeVal: Number(time),
    });
  }


  render() {
    const { dateVal, timeVal, partyVal } = this.state;
    const arrayTo10 = Array.from({ length: 10 }).map((val, i) => i + 1);
    const timeArray = Array.from({ length: 5 }).map((val, i) => i + 17);

    return (
      <div className={styles.container}>
        <div>
          <select
            className={styles.input}
            name="partySize"
            value={partyVal}
            onChange={e => this.handlePartyChange(e.target.value)}
          >
            { arrayTo10.map(val => (
              <option value={val} key={val} >
                {val} {val === 1 ? 'Person' : 'People'}
              </option>)) }
          </select>
        </div>
        <div>
          <DayPickerInput
            dayPickerProps={{
              disabledDays: { before: moment.tz('America/Los_Angeles').toDate() },
            }}
            onDayChange={this.handleDayChange}
            value={dateVal}
          />
        </div>
        <div>
          <select
            className={styles.input}
            name="time"
            value={timeVal}
            onChange={e => this.handleTimeChange(e.target.value)}
          >
            { timeArray.map(time => (
              <option value={time} key={time} >
                {time > 12 ? time - 12 : time}:00 {time > 12 ? 'PM' : 'AM'}
              </option>)) }
          </select>
        </div>
      </div>
    );
  }
}

SearchParams.propTypes = {
  clickHandler: PropTypes.func.isRequired,
  changeParty: PropTypes.func.isRequired,
};

export default SearchParams;
