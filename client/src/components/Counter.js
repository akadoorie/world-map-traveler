import React from 'react';
import './Counter.css';

const Counter = ({ count, total, daysAbroad, currentPlaceDays, currentCountry, currentArea, currentYear }) => {
  return (
    <div className="counter-container">
      <div className="counter">
        <div className="counter-value">{count}</div>
        <div className="counter-label">
          {count === 1 ? 'Country Visited' : 'Countries Visited'}
        </div>
      </div>
      {daysAbroad !== undefined && (
        <div className="counter">
          <div className="counter-value">{daysAbroad}</div>
          <div className="counter-label">Days abroad (total)</div>
        </div>
      )}
      {currentPlaceDays !== null && currentPlaceDays !== undefined && (
        <div className="counter">
          <div className="counter-value">{currentPlaceDays}</div>
          <div className="counter-label">Days Abroad (current)</div>
        </div>
      )}
      {currentCountry && (
        <div className="counter current-country-counter">
          <div className="counter-value">
            <div className="country-area-line">
              <span className="counter-year">{currentYear} </span>
              <span>{currentCountry}</span>
              {currentArea && <span className="counter-area"> ({currentArea})</span>}
            </div>
          </div>
          <div className="counter-label">Current Country</div>
        </div>
      )}
    </div>
  );
};

export default Counter;
