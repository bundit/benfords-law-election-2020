import React from "react";
import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";

const StateChart = ({ races }) => {
  const totalCounties = races.length;
  const data = [
    { name: null },
    { name: 1, Biden: 0, Trump: 0, Benford: totalCounties * 0.301 },
    { name: 2, Biden: 0, Trump: 0, Benford: totalCounties * 0.176 },
    { name: 3, Biden: 0, Trump: 0, Benford: totalCounties * 0.125 },
    { name: 4, Biden: 0, Trump: 0, Benford: totalCounties * 0.097 },
    { name: 5, Biden: 0, Trump: 0, Benford: totalCounties * 0.079 },
    { name: 6, Biden: 0, Trump: 0, Benford: totalCounties * 0.067 },
    { name: 7, Biden: 0, Trump: 0, Benford: totalCounties * 0.058 },
    { name: 8, Biden: 0, Trump: 0, Benford: totalCounties * 0.051 },
    { name: 9, Biden: 0, Trump: 0, Benford: totalCounties * 0.046 },
    { name: null }
  ];

  races.forEach(race => {
    race.candidates.forEach(({ name, vote }) => {
      if (name === "Trump" || name === "Biden") {
        const leadingDigit = String(vote)[0];

        data[leadingDigit][name] += 1;
      }
    });
  });

  return (
    <div className="chartWrapper">
      <LineChart
        width={350}
        height={300}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Trump" stroke="#bf0a30" />
        <Line type="monotone" dataKey="Biden" stroke="#002868" />
        <Line type="monotone" dataKey="Benford" stroke="#000" />
      </LineChart>
    </div>
  );
};

StateChart.propTypes = {
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
  ).isRequired
};

export default StateChart;
