const app = require('express')();
const parser = require('body-parser');
const client = require('./src/repository/registerDB');

const portNumber = 5000;

const [hs, hikeDetailsRoute] = require('./src/routes/hikeDetailsRoute');
const [bs, baseCampDetailsRoute] = require('./src/routes/baseCampRoute');
const [hbs, hikeBaseCampRoute] = require('./src/routes/hikesBaseCampsRoute');
const [bestMonthS, bestMonthsRoute] = require('./src/routes/bestMonthsRoute');
const [currentEventS, currentEventsRoute] = require('./src/routes/currentEventsRoute');
const [equipmentReqS, equipmentReqRoute] = require('./src/routes/equipmentRequiredRoute');
const [baseCampRouteNodeS, baseCampNodeRoute] = require('./src/routes/baseCampNodesRoute');
const [newhikeDataClient, newHikeDataRoute] = require('./src/routes/compositeRoutes/insertNewHikeDataComplete');
const [fetchCompleteHikeClient, fetchCompleteHike] = require('./src/routes/compositeRoutes/fetchCompleteHikeByHikeId');

//Registering db client with Services client
bs.client = client;
hs.client = client;
hbs.client = client;
bestMonthS.client = client;
currentEventS.client = client;
equipmentReqS.client = client;
baseCampRouteNodeS.client = client;
newhikeDataClient(client);
fetchCompleteHikeClient(client);

app.use(parser.json());

app.use("/api/hikedetails", hikeDetailsRoute);
app.use("/api/basecampdetails", baseCampDetailsRoute);
app.use("/api/hikesNbasecamps", hikeBaseCampRoute);
app.use("/api/bestmonths", bestMonthsRoute);
app.use("/api/currentevents", currentEventsRoute);
app.use("/api/equipmentrequired", equipmentReqRoute);
app.use("/api/basecampnodes", baseCampNodeRoute);
app.use("/api/newhikedata", newHikeDataRoute);
app.use("/api/fullHike", fetchCompleteHike);

app.listen(portNumber, ()=>{
    console.log("Listening on port", portNumber);
});



