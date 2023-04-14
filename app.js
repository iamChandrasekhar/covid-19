const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "moviesData.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    stateId: dbObject.state_id,
    stateName: dbObject.state_name,
    population: dbObject.population,
  };
};

const districtTable = (dbObject) => {
  return {
    districtId: dbObject.district_id,
    districtName: dbObject.district_name,
    stateId: dbObject.state_id,
    cases: dbObject.cases,
    cured: dbObject.cured,
    active: dbObject.active,
    deaths: dbObject.deaths,
  };
};

app.get("/states/", async (request, response) => {
  const statesList = `
    SELECT * FROM state;`;
  const statesArray = await database.all(statesList);
  response.send(
    statesArray.map((eachState) => convertDbObjectToResponseObject(eachState))
  );
});

app.get("/states/:stateId/", async (request, response) => {
  const { stateId } = request.body;
  const getStateDetails = `
    SELECT * FROM state WHERE state_id = ${stateId};`;
  const stateDetails = await database.all(getStateDetails);
  response.send(convertDbObjectToResponseObject(stateDetails));
});

app.post("/districts/", async (request, response) => {
  const { districtName, stateId, cases, cured, active, deaths } = request.body;
  const postQuery = `
    INSERT INTO district (district_name,state_id,cases,active,deaths)
    VALUES ('${districtName}',${stateId},${cases},${active},${deaths});`;
  await database.run(postQuery);
  response.send("District Successfully Added");
});

add.get("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const getDistrict = `
    SELECT * FROM district WHERE district_id = ${districtId};`;
  const districtIds = await database.all(getDistrict);
  response.send(districtTable(districtIds));
});

add.delete("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const deleteQuery = `
    DELETE FROM district WHERE district_id = ${districtId};`;
  await database.run(deleteQuery);
  response.send("District Removed");
});

app.put("/districts/:districtId/", async (request, response) => {
  const { districtId } = request.params;
  const updateQuery = `
    UPDATE district SET 
    district_id = ${districtId},
    district_name = '${districtName}',
    state_id = ${tateId},
    cases = ${cases},
    cured = ${cured},
    active = ${active},
    deaths = ${deaths},
    WHERE district_id = ${districtId};`;
  await database.run(updateQuery);
  response.send("District Details Updated");
});

app.get("/districts/:districtId/", async (request, response) => {
  const { stateId } = request.params;
  const updateQuery = `
  SELECT 
  SUM(cases),
  SUM(cured),
  SUM(active),
  SUM(deaths),
  FROM district 
    WHERE state_id = ${stateId};`;
  const stats = await database.get(updateQuery);
  response.send(
      totalCases: stats["SUM(cases)"]
      totalCured: stats["SUM(cured)"]
      totalActive: stats["SUM(active)"]
      totalDeaths: stats["SUM(deaths)"] 
      );
});



module.exports = app;
