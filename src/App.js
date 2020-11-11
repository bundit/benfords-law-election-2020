import "./App.css";

import { forceCheck } from "react-lazyload";
import React, { useState, useEffect } from "react";
import Select from "react-select";

import StateCard from "./components/state-card";

const STATE_FIPS = [
  "01",
  "02",
  "04",
  "05",
  "06",
  "08",
  "09",
  "10",
  "12",
  "13",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "44",
  "45",
  "46",
  "47",
  "48",
  "49",
  "50",
  "51",
  "53",
  "54",
  "55",
  "56"
];

const SWING_STATES = [
  "Arizona",
  "Colorado",
  "Florida",
  "Georgia",
  "Iowa",
  "Maine",
  "Michigan",
  "North Carolina",
  "Ohio",
  "Pennsylvania",
  "Texas",
  "Wisconsin"
];

function App() {
  const [states, setStates] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState({
    value: "All States",
    label: "All States"
  });
  const [selectedSort, setSelectedSort] = useState({
    value: "Alphabetical",
    label: "Alphabetical"
  });

  useEffect(() => {
    Promise.all(
      STATE_FIPS.map(
        fipsCode => fetch(`./data/${fipsCode}.json`).then(res => res.json()) // eslint-disable-next-line
      )
    ).then(results => {
      setStates(results);
    });
  }, []);

  useEffect(() => {
    window.onresize = forceCheck;

    return () => {
      window.onresize = undefined;
    };
  });

  const filterOptions = [
    { value: "All States", label: "All States" },
    { value: "Swing States", label: "Swing States" },
    { value: "Democratic Lead", label: "Democratic Lead" },
    { value: "Republican Lead", label: "Republican Lead" }
  ];

  const sortOptions = [{ value: "Alphabetical", label: "Alphabetical" }];

  return (
    <div className="app">
      {/* <header className="appHeader">
        <h1>Benford&apos;s Law (2020 US Election)</h1>
      </header> */}
      <div className="landing">
        <h1>Benford&apos;s Law</h1>
        <p>
          <a href="https://en.wikipedia.org/wiki/Benford%27s_law">
            Benford&apos;s law
          </a>{" "}
          is an observation about the frequency distribution of leading digits
          in many real-life sets of numerical data.
        </p>
        <p>
          It has been shown that this result applies to a wide variety of data
          sets, including electricity bills, street addresses, stock prices,
          house prices, population numbers, death rates, lengths of rivers, and
          physical and mathematical constants. It tends to be most accurate when
          values are distributed across multiple orders of magnitude, especially
          if the process generating the numbers is described by a power law
          (which is common in nature).
        </p>

        <section>
          <h2>Benford&apos;s Law and the US 2020 Election</h2>
          <p>
            There have been{" "}
            <a href="https://github.com/cjph8914/2020_benfords">
              multiple graphs
            </a>{" "}
            circulating online that brings into question the authenticity of the
            results of the election.
          </p>
        </section>
      </div>
      <div className="optionsList">
        <span>Filter: </span>
        <Select
          defaultValue={selectedFilter}
          options={filterOptions}
          onChange={setSelectedFilter}
          value={selectedFilter}
        />
        <span>Sort: </span>
        <Select
          defaultValue={selectedSort}
          options={sortOptions}
          onChange={setSelectedSort}
          value={selectedSort}
        />
      </div>
      <main className="main">
        {states.map(({ name, abbreviation, ...data }) => (
          <StateCard
            name={name}
            abbreviation={abbreviation}
            data={data}
            key={name}
            setStates={setStates}
          />
        ))}
      </main>
    </div>
  );
}

export default App;
