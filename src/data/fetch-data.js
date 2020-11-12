const fetch = require("node-fetch");

const fs = require("fs");

const STATES = [
  { name: "Alabama", abbreviation: "AL", fips: "01" },
  { name: "Alaska", abbreviation: "AK", fips: "02" },
  { name: "Arizona", abbreviation: "AZ", fips: "04" },
  { name: "Arkansas", abbreviation: "AR", fips: "05" },
  { name: "California", abbreviation: "CA", fips: "06" },
  { name: "Colorado", abbreviation: "CO", fips: "08" },
  { name: "Connecticut", abbreviation: "CT", fips: "09" },
  { name: "Delaware", abbreviation: "DE", fips: "10" },
  { name: "Florida", abbreviation: "FL", fips: "12" },
  { name: "Georgia", abbreviation: "GA", fips: "13" },
  { name: "Hawaii", abbreviation: "HI", fips: "15" },
  { name: "Idaho", abbreviation: "ID", fips: "16" },
  { name: "Illinois", abbreviation: "IL", fips: "17" },
  { name: "Indiana", abbreviation: "IN", fips: "18" },
  { name: "Iowa", abbreviation: "IA", fips: "19" },
  { name: "Kansas", abbreviation: "KS", fips: "20" },
  { name: "Kentucky", abbreviation: "KY", fips: "21" },
  { name: "Louisiana", abbreviation: "LA", fips: "22" },
  { name: "Maine", abbreviation: "ME", fips: "23" },
  { name: "Maryland", abbreviation: "MD", fips: "24" },
  { name: "Massachusetts", abbreviation: "MA", fips: "25" },
  { name: "Michigan", abbreviation: "MI", fips: "26" },
  { name: "Minnesota", abbreviation: "MN", fips: "27" },
  { name: "Mississippi", abbreviation: "MS", fips: "28" },
  { name: "Missouri", abbreviation: "MO", fips: "29" },
  { name: "Montana", abbreviation: "MT", fips: "30" },
  { name: "Nebraska", abbreviation: "NE", fips: "31" },
  { name: "Nevada", abbreviation: "NV", fips: "32" },
  { name: "New Hampshire", abbreviation: "NH", fips: "33" },
  { name: "New Jersey", abbreviation: "NJ", fips: "34" },
  { name: "New Mexico", abbreviation: "NM", fips: "35" },
  { name: "New York", abbreviation: "NY", fips: "36" },
  { name: "North Carolina", abbreviation: "NC", fips: "37" },
  { name: "North Dakota", abbreviation: "ND", fips: "38" },
  { name: "Ohio", abbreviation: "OH", fips: "39" },
  { name: "Oklahoma", abbreviation: "OK", fips: "40" },
  { name: "Oregon", abbreviation: "OR", fips: "41" },
  { name: "Pennsylvania", abbreviation: "PA", fips: "42" },
  { name: "Rhode Island", abbreviation: "RI", fips: "44" },
  { name: "South Carolina", abbreviation: "SC", fips: "45" },
  { name: "South Dakota", abbreviation: "SD", fips: "46" },
  { name: "Tennessee", abbreviation: "TN", fips: "47" },
  { name: "Texas", abbreviation: "TX", fips: "48" },
  { name: "Utah", abbreviation: "UT", fips: "49" },
  { name: "Vermont", abbreviation: "VT", fips: "50" },
  { name: "Virginia", abbreviation: "VA", fips: "51" },
  { name: "Washington", abbreviation: "WA", fips: "53" },
  { name: "West Virginia", abbreviation: "WV", fips: "54" },
  { name: "Wisconsin", abbreviation: "WI", fips: "55" },
  { name: "Wyoming", abbreviation: "WY", fips: "56" }
];

STATES.forEach(({ name, abbreviation, fips }) => {
  const endpoints = [
    `https://www.politico.com/2020-statewide-results/${fips}/potus-counties.json`,
    `https://www.politico.com/2020-statewide-metadata/${fips}/county-names.meta.json`,
    `https://www.politico.com/2020-statewide-metadata/${fips}/potus.meta.json`
  ];

  Promise.all(
    endpoints.map(endpoint => fetch(endpoint).then(res => res.json()))
  )
    .then(([results, counties, candidateResults]) => {
      const candidates =
        candidateResults.candidates || candidateResults[0].candidates;

      const { candidateID: trumpID } = candidates.find(
        candidate => candidate.shortName === "Trump"
      );

      const { candidateID: bidenID } = candidates.find(
        candidate => candidate.shortName === "Biden"
      );

      const races = results.races.map(race => ({
        ...race,
        candidates: race.candidates.map(raceCandidate => ({
          ...raceCandidate,
          name: candidates.find(
            candidate => candidate.candidateID === raceCandidate.candidateID
          ).shortName
        }))
      }));

      const totalCounties = results.races.length;
      const chartData = [
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
        race.candidates.forEach(({ name: candidateName, vote }) => {
          if (candidateName === "Trump" || candidateName === "Biden") {
            const leadingDigit = String(vote)[0];

            chartData[leadingDigit][candidateName] += 1;
          }
        });
      });

      const trumpVotes = results.races.reduce(
        (acc, race) =>
          acc +
          race.candidates.find(candidate => candidate.candidateID === trumpID)
            .vote,
        0
      );

      const bidenVotes = results.races.reduce(
        (acc, race) =>
          acc +
          race.candidates.find(candidate => candidate.candidateID === bidenID)
            .vote,
        0
      );

      const totalVotes = results.races.reduce(
        (acc, race) =>
          acc +
          race.candidates.reduce((acc2, candidate) => acc2 + candidate.vote, 0),
        0
      );

      const bidenPercent = (bidenVotes * 100) / totalVotes;
      const trumpPercent = (trumpVotes * 100) / totalVotes;

      const payload = {
        lastUpdated: results.lastUpdated,
        name,
        fips,
        abbreviation,
        candidates,
        counties,
        trumpVotes,
        trumpPercent,
        bidenVotes,
        bidenPercent,
        totalVotes,
        races,
        chartData
      };

      try {
        fs.writeFile(
          `../public/data/${fips}.json`,
          JSON.stringify(payload),
          () => {}
        );
      } catch (e) {
        console.error(`Failed to write ${fips} ${name} to file`);
      }
    })
    .catch(e => console.log(`Error fetching ${name} ${fips}`));
});
