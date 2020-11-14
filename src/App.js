import "./App.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ResponsiveContainer } from "recharts";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faShare, faCheck } from "@fortawesome/free-solid-svg-icons";
import LazyLoad, { forceCheck } from "react-lazyload";
import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";

import GraphExample from "./assets/graph-example.png";
import StateCard from "./components/state-card";
import StateChart from "./components/state-chart";
import TableExample from "./assets/table-example.png";
import copyToClipboard from "./utils/copyToClipboard";
import formatNumber from "./utils/formatNumber";

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
  const [hasCopiedShare, setHasCopiedShare] = useState(false);
  const overallResultsRef = useRef(null);

  useEffect(() => {
    Promise.all(
      STATE_FIPS.map(
        fipsCode => fetch(`./data/${fipsCode}.json`).then(res => res.json()) // eslint-disable-next-line
      )
    )
      .then(results => {
        setStates(results);
      })
      .catch(e => console.error("error fetching data", e));
  }, []);

  useEffect(() => {
    // react-lazyload
    window.onresize = forceCheck;

    return () => {
      window.onresize = undefined;
    };
  }, []);

  const filterOptions = [
    { value: "All States", label: "All States" },
    { value: "Swing States", label: "Swing States" },
    { value: "Non-Swing States", label: "Non-Swing States" },
    { value: "Democratic Lead", label: "Democratic Lead" },
    { value: "Republican Lead", label: "Republican Lead" }
  ];

  const sortOptions = [
    { value: "Alphabetical", label: "Alphabetical" },
    { value: "Most Counties", label: "Most Counties" },
    { value: "Least Counties", label: "Least Counties" },
    { value: "Democrat Lead", label: "Democrat Lead" },
    { value: "Republican Lead", label: "Republican Lead" },
    { value: "Least Contested", label: "Least Contested" },
    { value: "Most Contested", label: "Most Contested" }
  ];

  const chartData = [
    { name: null },
    { name: 1, Biden: 0, Trump: 0, Benford: 0 },
    { name: 2, Biden: 0, Trump: 0, Benford: 0 },
    { name: 3, Biden: 0, Trump: 0, Benford: 0 },
    { name: 4, Biden: 0, Trump: 0, Benford: 0 },
    { name: 5, Biden: 0, Trump: 0, Benford: 0 },
    { name: 6, Biden: 0, Trump: 0, Benford: 0 },
    { name: 7, Biden: 0, Trump: 0, Benford: 0 },
    { name: 8, Biden: 0, Trump: 0, Benford: 0 },
    { name: 9, Biden: 0, Trump: 0, Benford: 0 },
    { name: null }
  ];

  let totalBidenVotes = 0;
  let totalTrumpVotes = 0;
  let totalVotes = 0;

  states.forEach(state => {
    if (state.chartData) {
      for (let i = 0; i < state.chartData.length; i++) {
        chartData[i].Biden += state.chartData[i].Biden;
        chartData[i].Trump += state.chartData[i].Trump;
        chartData[i].Benford += state.chartData[i].Benford;
      }
    }

    totalBidenVotes += Number(state.bidenVotes);
    totalTrumpVotes += Number(state.trumpVotes);
    totalVotes += Number(state.totalVotes);
  });

  const bidenPercent = (totalBidenVotes * 100) / totalVotes;
  const trumpPercent = (totalTrumpVotes * 100) / totalVotes;

  const totalCounties = states.reduce(
    (acc, state) => acc + state.races.length,
    0
  );

  let modifiedList = states.slice();

  switch (selectedFilter.value) {
    case "Swing States": {
      modifiedList = modifiedList.filter(
        state => SWING_STATES.includes(state.name) // eslint-disable-next-line
      );
      break;
    }
    case "Non-Swing States": {
      modifiedList = modifiedList.filter(
        state => !SWING_STATES.includes(state.name) // eslint-disable-next-line
      );
      break;
    }
    case "Democratic Lead": {
      modifiedList = modifiedList.filter(
        state => state.bidenVotes > state.trumpVotes
      );
      break;
    }
    case "Republican Lead": {
      modifiedList = modifiedList.filter(
        state => state.trumpVotes > state.bidenVotes
      );
      break;
    }
    default: {
      break;
    }
  }

  switch (selectedSort.value) {
    case "Most Counties": {
      modifiedList = modifiedList.sort(
        (a, b) => b.races.length - a.races.length
      );
      break;
    }
    case "Least Counties": {
      modifiedList = modifiedList.sort(
        (a, b) => a.races.length - b.races.length
      );
      break;
    }
    case "Democrat Lead": {
      modifiedList = modifiedList.sort(
        (a, b) =>
          a.trumpPercent - a.bidenPercent - (b.trumpPercent - b.bidenPercent)
      );
      break;
    }
    case "Republican Lead": {
      modifiedList = modifiedList.sort(
        (a, b) =>
          a.bidenPercent - a.trumpPercent - (b.bidenPercent - b.trumpPercent)
      );
      break;
    }
    case "Least Contested": {
      modifiedList = modifiedList.sort(
        (a, b) =>
          Math.abs(b.bidenPercent - b.trumpPercent) -
          Math.abs(a.bidenPercent - a.trumpPercent)
      );
      break;
    }
    case "Most Contested": {
      modifiedList = modifiedList.sort(
        (a, b) =>
          Math.abs(a.bidenPercent - a.trumpPercent) -
          Math.abs(b.bidenPercent - b.trumpPercent)
      );
      break;
    }
    default: {
      break;
    }
  }

  function handleFilterChange(selectedOption) {
    setSelectedFilter(selectedOption);
    setTimeout(forceCheck, 300);
  }

  function handleSortChange(selectedOption) {
    setSelectedSort(selectedOption);
    setTimeout(forceCheck, 300);
  }

  function handleShareClick() {
    copyToClipboard(`${window.location.origin}/?show=overall-results`);

    setHasCopiedShare(true);
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("show") === "overall-results") {
      setTimeout(
        () => overallResultsRef.current.scrollIntoView({ behavior: "smooth" }),
        300
      );
    }
  }, []);

  return (
    <div className="app">
      <header className="appHeader">
        <a
          href="https://github.com/bundit/benfords-law-election-2020"
          target="_blank"
          rel="noreferrer"
        >
          <FontAwesomeIcon icon={faGithub} size="2x" />
        </a>
      </header>
      <div className="landing">
        <h1>Benford&apos;s Law</h1>
        <p>
          <a
            href="https://en.wikipedia.org/wiki/Benford%27s_law"
            target="_blank"
            rel="noreferrer"
          >
            Benford&apos;s law
          </a>{" "}
          is an observation about the frequency distribution of leading digits
          in many real-life sets of numerical data.
        </p>
        <p>
          It has been shown that this result applies to a wide variety of data
          sets, including electricity bills, street addresses, stock prices,
          house prices, population numbers, death rates, lengths of rivers, and
          physical and mathematical constants. It tends to be{" "}
          <em>
            most accurate when values are distributed across multiple orders of
            magnitude
          </em>
          , especially if the process generating the numbers is described by a
          power law (which is common in nature).
        </p>

        <section>
          <h2>Benford&apos;s Law and the US 2020 Election</h2>
          <p>
            There have been{" "}
            <a
              href="https://github.com/cjph8914/2020_benfords"
              target="_blank"
              rel="noreferrer"
            >
              multiple graphs
            </a>{" "}
            circulating online that questions the authenticity of the results of
            the election. However, these graphs only show data in some states.
          </p>
          <p>
            Benford&apos;s Law is{" "}
            <a href="https://www.jstor.org/stable/23011436?seq=1">
              problematical at best as a forensic tool
            </a>{" "}
            when applied to elections. <br />
            And, as one applies more sophisticated methods of estimation, the
            results become increasingly inconsistent. Worse still, when compared
            with observational data, the{" "}
            <a href="https://repository.library.georgetown.edu/handle/10822/557850">
              application of Benford&apos;s Law frequently predicts fraud where
              none has occurred
            </a>
            .
          </p>
        </section>

        <section>
          <h2>What is this website?</h2>
          <p>
            This website aims to display both candidates&apos; results graphed
            side by side against Benford&apos;s Law in an easily digestible
            form. You can view the source and methods for data fetching{" "}
            <a
              href="https://github.com/bundit/benfords-law-election-2020"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>
            .
          </p>
          <p>
            The data is sourced from{" "}
            <a
              href="https://www.politico.com/"
              target="_blank"
              rel="noreferrer"
            >
              https://www.politico.com/
            </a>
            .
          </p>
        </section>

        <section>
          <h2>What is the data being graphed?</h2>
          <p>
            The method is simple. Take the number of votes that a candidate
            received in each county and count its leading digit. Graph the total
            number of occurance of each leading digit (1-9) and the expected
            Benford&apos;s values.
          </p>

          <h3>Example: New Hampshire</h3>
          <div>
            <a
              href="https://www.politico.com/2020-election/results/new-hampshire/"
              target="_blank"
              rel="noreferrer"
            >
              Image source: politico.com
            </a>
          </div>
          <img src={TableExample} alt="table-example" />
          <p>
            Biden&apos;s data set includes: 12390, 16649, 33168, 48373, 25460,
            16857, 121010, 100035, 41721 and 7628. <br />
            The leading digits of those are respectfully: 1, 1, 3, 4, 2, 1, 1,
            1, 4, and 7. <br /> Occurances of each digit are: 1: 5, 2: 1, 3: 1,
            4: 2, 5: 0, 6: 0, 7: 1, 8: 0, 9: 0. The total number of data points
            is 10 (counties).
          </p>
          <p>
            Benford&apos; law suggests a spread of leading digits of: 1&apos;s:
            30.1%, 2&apos;s: 17.6%, 3&apos;s: 12.5%, 4&apos;s: 9.7%, 5&apos;s:
            7.9%, 6&apos;s: 6.7%, 7&apos;s: 5.8%, 8&apos;s: 5.1%, 9&apos;s:
            4.6%. You then take the percentage of the total dataset (10) for
            Benford&apos;s numbers. <br />
            For this example, 1: 3.01, 2: 1.76, 3: 1.25, 4: 0.97, 5: 0.79, 6:
            0.67, 7: 0.58, 8: 0.51, 9: 0.46.
          </p>
          <p>
            Lastly, we just plot the occurances vs expected and try to visualize
            any data anomalies.
          </p>
          <img src={GraphExample} alt="graph-example" />
          <p>
            It&apos;s important to note that results are most accurate with
            large datasets that contain a range of multiple orders of magnitude.
            A dataset of 10 datapoints is (likely) too small to make any
            accurate assumptions about the data.
          </p>
        </section>

        <section ref={overallResultsRef}>
          <h1>Overall Results</h1>

          <h2>
            Entire Dataset{" "}
            <button
              type="button"
              style={{
                backgroundColor: "#002868",
                position: "relative",
                bottom: 3
              }}
              className="share-button"
              onClick={handleShareClick}
            >
              {hasCopiedShare ? (
                <>
                  <FontAwesomeIcon icon={faCheck} /> Copied to Clipboard
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faShare} /> Share
                </>
              )}
            </button>
          </h2>
          <div className="optionsList">
            <span>{formatNumber(totalCounties)} Total Counties</span>
            <span>{formatNumber(totalVotes)} Total Votes</span>
          </div>

          <LazyLoad height={400} offset={-200}>
            <ResponsiveContainer height={400} width="100%">
              <StateChart chartData={chartData} />
            </ResponsiveContainer>
          </LazyLoad>

          <div
            className="winner"
            style={{ textAlign: "center", margin: "20px auto" }}
          >
            <strong>
              {totalTrumpVotes > totalBidenVotes ? "Trump" : "Biden"} lead by{" "}
              {formatNumber(Math.abs(totalBidenVotes - totalTrumpVotes))}
            </strong>
            <div>
              ({Math.abs(bidenPercent - trumpPercent).toFixed(2)}% Lead)
            </div>
          </div>

          <div className="trumpVsBidenVotes">
            <span className="totalGop">
              <strong>Total Trump Votes: </strong>
              <div>{formatNumber(totalTrumpVotes)}</div>
              <div>{`${trumpPercent.toFixed(2)}%`}</div>
            </span>
            <span className="totalDem">
              <strong>Total Biden Votes:</strong>
              <div>{formatNumber(totalBidenVotes)}</div>
              <div>{`${bidenPercent.toFixed(2)}%`}</div>
            </span>
          </div>
        </section>

        <section>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <h2>State Datasets</h2>
            <span style={{ marginLeft: "auto" }}>
              {modifiedList.length} of {states.length}
            </span>
          </div>

          <div className="optionsList">
            <span>Filter: </span>
            <Select
              defaultValue={selectedFilter}
              options={filterOptions}
              onChange={handleFilterChange}
              value={selectedFilter}
            />
            <span>Sort: </span>
            <Select
              defaultValue={selectedSort}
              options={sortOptions}
              onChange={handleSortChange}
              value={selectedSort}
            />
          </div>

          <div className="stateGridLayout">
            {modifiedList.map(({ name, abbreviation, ...data }) => (
              <StateCard
                name={name}
                abbreviation={abbreviation}
                data={data}
                key={name}
                setStates={setStates}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
