import LazyLoad from "react-lazyload";
import PropTypes from "prop-types";
import React from "react";

import StateChart from "./state-chart";
import formatNumber from "../utils/formatNumber";

const StateCard = ({ name, abbreviation, data, setStates }) => {
  const { races, chartData, trumpVotes, bidenVotes, totalVotes } = data;

  const trumpPercent = ((trumpVotes * 100) / totalVotes).toFixed(2);
  const bidenPercent = ((bidenVotes * 100) / totalVotes).toFixed(2);

  function formatName() {
    return name.toLowerCase().replace(" ", "-");
  }

  function getSourceHref() {
    return `https://www.politico.com/2020-election/results/${formatName()}/`;
  }

  return (
    <div className={`card ${trumpVotes > bidenVotes ? "gopCard" : "demcard"}`}>
      <header>
        <h2>{name}</h2>

        <div className="optionsList">
          <span>{races.length} Counties</span>
          <span>{formatNumber(totalVotes)} Votes</span>
        </div>
      </header>

      <LazyLoad height={300} offset={-200}>
        <StateChart chartData={chartData} width={325} height={300} />
        <div
          style={{
            fontSize: "11px",
            textAlign: "center"
          }}
        >
          <a href={getSourceHref()} target="_blank" rel="noreferrer">
            Last Updated: {new Date(data.lastUpdated).toLocaleString()}
          </a>
        </div>
      </LazyLoad>

      <div className="winner">
        <strong>
          {trumpVotes > bidenVotes ? "Trump" : "Biden"} lead by{" "}
          {formatNumber(Math.abs(bidenVotes - trumpVotes))}
        </strong>
        <div>({Math.abs(bidenPercent - trumpPercent).toFixed(2)}% Lead)</div>
      </div>

      <footer>
        <div className="trumpVsBidenVotes">
          <span className="totalGop">
            <strong>Trump</strong>
            <div>{formatNumber(trumpVotes)} votes</div>
            <div>{`${trumpPercent}%`}</div>
          </span>
          <span className="totalDem">
            <strong>Biden</strong>
            <div>{formatNumber(bidenVotes)} votes</div>
            <div>{`${bidenPercent}%`}</div>
          </span>
        </div>
      </footer>
    </div>
  );
};

StateCard.propTypes = {
  name: PropTypes.string.isRequired,
  abbreviation: PropTypes.string.isRequired,
  data: PropTypes.shape({
    lastUpdated: PropTypes.string,
    candidates: PropTypes.arrayOf(
      PropTypes.shape({
        candidateID: PropTypes.string,
        party: PropTypes.string,
        fullName: PropTypes.string,
        shortName: PropTypes.string
      })
    ),
    fips: PropTypes.string,
    counties: PropTypes.objectOf(PropTypes.string),
    races: PropTypes.arrayOf(
      PropTypes.shape({
        countyFips: PropTypes.string,
        candidates: PropTypes.arrayOf(
          PropTypes.shape({
            candidateID: PropTypes.string,
            vote: PropTypes.number,
            name: PropTypes.string
          })
        )
      })
    ),
    lead: PropTypes.string,
    leadAmount: PropTypes.number,
    chartData: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.number,
        Biden: PropTypes.mumber,
        Trump: PropTypes.number,
        Benford: PropTypes.number
      })
    ),
    trumpVotes: PropTypes.number,
    bidenVotes: PropTypes.number,
    totalVotes: PropTypes.number
  }).isRequired,
  setStates: PropTypes.func.isRequired
};

export default StateCard;
