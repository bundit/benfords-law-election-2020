import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";
import PropTypes from "prop-types";
import React from "react";

const StateChart = ({ chartData, width, height }) => (
  <div className="chartWrapper">
    <LineChart width={width} height={height} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="Trump" stroke="#bf0a30" />
      <Line type="monotone" dataKey="Biden" stroke="#002868" />
      <Line type="monotone" dataKey="Benford" stroke="green" />
    </LineChart>
  </div>
);

StateChart.propTypes = {
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.number,
      Biden: PropTypes.mumber,
      Trump: PropTypes.number,
      Benford: PropTypes.number
    })
  ).isRequired,
  width: PropTypes.number,
  height: PropTypes.number
};

StateChart.defaultProps = {
  width: undefined,
  height: undefined
};

export default StateChart;
