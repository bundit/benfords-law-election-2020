import LazyLoad from "react-lazyload";
import PropTypes from "prop-types";
import React from "react";

import StateChart from "./state-chart";
import formatNumber from "../utils/formatNumber";

const StateCard = ({ name, abbreviation, data, setStates }) => {
  const { candidates, races } = data;

  const { candidateID: trumpID } = candidates.find(
    candidate => candidate.shortName === "Trump"
  );

  const { candidateID: bidenID } = candidates.find(
    candidate => candidate.shortName === "Biden"
  );

  const trumpResults = races.reduce(
    (acc, race) =>
      acc +
      race.candidates.find(candidate => candidate.candidateID === trumpID).vote,
    0
  );

  const bidenResults = races.reduce(
    (acc, race) =>
      acc +
      race.candidates.find(candidate => candidate.candidateID === bidenID).vote,
    0
  );

  const totalVotes = races.reduce(
    (acc, race) =>
      acc +
      race.candidates.reduce((acc2, candidate) => acc2 + candidate.vote, 0),
    0
  );

  const trumpPercent = ((trumpResults * 100) / totalVotes).toFixed(2);

  const bidenPercent = ((bidenResults * 100) / totalVotes).toFixed(2);

  React.useEffect(() => {
    setStates(
      states =>
        states.map(state => {
          if (state.name === name) {
            return {
              ...state,
              lead: bidenResults < trumpResults ? "Trump" : "Biden",
              leadAmount: Math.abs(bidenResults - trumpResults)
            };
          }

          return state;
        }) // eslint-disable-next-line
    );
  }, [bidenResults, trumpResults]);
  console.log("data");
  return (
    <div
      className={`card ${trumpResults > bidenResults ? "gopCard" : "demcard"}`}
    >
      <header>
        <h2>{name}</h2>
        <span>{races.length} Total Counties</span>
      </header>

      <LazyLoad height={300} offset={-300}>
        <StateChart races={data.races} />
      </LazyLoad>

      {data.lead && (
        <div className="winner">
          <strong>
            {data.lead} lead by {formatNumber(data.leadAmount)}
          </strong>
        </div>
      )}

      <footer>
        <span className="totalGop">
          <strong>Trump</strong>
          <div>{formatNumber(trumpResults)} votes</div>
          <div>{`${trumpPercent}%`}</div>
        </span>
        <span className="totalDem">
          <strong>Biden</strong>
          <div>{formatNumber(bidenResults)} votes</div>
          <div>{`${bidenPercent}%`}</div>
        </span>
      </footer>
    </div>
  );
};

StateCard.propTypes = {
  name: PropTypes.string.isRequired,
  abbreviation: PropTypes.string.isRequired,
  data: PropTypes.shape({
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
    leadAmount: PropTypes.number
  }).isRequired,
  setStates: PropTypes.func.isRequired
};

export default StateCard;
