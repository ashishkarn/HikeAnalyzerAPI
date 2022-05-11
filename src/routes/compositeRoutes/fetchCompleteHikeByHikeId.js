const express = require('express');
const router = express.Router();
const hs = require('../../repository/hikeDetailsService');
const hbs = require('../../repository/hikesBasecampsService');
const bs = require('../../repository/baseCampService');
const bcn = require('../../repository/baseCampRouteNodesService');
const bms = require('../../repository/bestMonthsService');
const ced = require('../../repository/currentEventsService');
const er = require('../../repository/equipmentRequiredService');
const gpsdns = require('../../repository/gpsRouteNodesService');
const ttdns = require('../../repository/terrainDistributionNodesService');
const poidns = require('../../repository/poiNodesService');
const secdns = require('../../repository/sectionDescService');
const ddns = require('../../repository/distanceDistributionNodesService');
const { response } = require('express');

let client = undefined;

function setClient(_client){
    hs.client = _client;
    hbs.client = _client;
    bs.client = _client;
    bcn.client = _client;
    bms.client = _client;
    ced.client = _client;
    gpsdns.client = _client;
    ttdns.client = _client;
    poidns.client = _client;
    secdns.client = _client;
    ddns.client = _client;
    client = _client
}

router.get("/:hikeId", (request, response) => {
    console.log("Start fetch")
    const hikeId = request.params.hikeId;
    client
        .query('BEGIN')
        .then(res => {
            createResponseJson(hikeId)
                .then(res=>{
                    client.query('COMMIT')
                    response.json(res)
                })
                .catch(err=>{
                    client.query('ROLLBACK')
                    response.statusMessage = err;
                    response.status(404).end();
                });
        })
});

async function createResponseJson(hikeId){
    let responseJson = {}

    //fetchHikeDetails
    const hikeDetailsRes = await hs.getHikeById(hikeId);

    responseJson.HikeId = hikeDetailsRes.rows[0].hike_id
    responseJson.HikeName = hikeDetailsRes.rows[0].hike_name
    responseJson.DifficultLevel = hikeDetailsRes.rows[0].difficulty_level
    responseJson.CreatedBy = hikeDetailsRes.rows[0].created_by
    responseJson.LastUpdateBy = hikeDetailsRes.rows[0].last_updated_by
    responseJson.CreationTimeStamp = hikeDetailsRes.rows[0].creation_date
    responseJson.LastUpdateTimeStamp = hikeDetailsRes.rows[0].last_update_timestamp
    responseJson.HikeDetails = {}
    responseJson.HikeDetails.TrekProfile = {}
    responseJson.HikeDetails.TrekProfile.TrekRoutes = []

    //fetchAllBaseCampsByHikeIdAndJoin
    let baseCamps = [];
    const fetchAllBaseCampsQuery = {
        text: `
        select
            hikes_basecamps.hike_id,
            hikes_basecamps.base_camp_id,
            base_camps.location_name,
            base_camps.location_coordinates,
            base_camps.country,
            base_camps.state,
            base_camps.district,
            base_camps.city,
            base_camps.starting_point,
            base_camps.address_line_1,
            base_camps.address_line_2,
            base_camps.image_url,
            base_camps.general_summary
        from hikes_basecamps
        inner join base_camps 
        on 
            hikes_basecamps.base_camp_id = base_camps.base_camp_id
        where
            hike_id = $1`,
        values: [hikeId]
    }
    
    const allbaseCamps = await client.query(fetchAllBaseCampsQuery);
    
    for(i=0;i<allbaseCamps.rows.length;i++){
        let baseCamp = {}
        baseCamp.BaseCampLocationName = allbaseCamps.rows[i].location_name
        baseCamp.BaseCampLocationCoordinates = allbaseCamps.rows[i].location_coordinates
        baseCamp.BaseCampCountry = allbaseCamps.rows[i].country
        baseCamp.BaseCampState = allbaseCamps.rows[i].state
        baseCamp.BaseCampDistrict = allbaseCamps.rows[i].district
        baseCamp.BaseCampCity = allbaseCamps.rows[i].city
        baseCamp.BaseCampStartingPoint = allbaseCamps.rows[i].starting_point
        baseCamp.BaseCampAddressLine1 = allbaseCamps.rows[i].address_line_1
        baseCamp.BaseCampAddressLine2 = allbaseCamps.rows[i].address_line_2
        baseCamp.BaseCampImageUrl = allbaseCamps.rows[i].image_url
        baseCamp.Summary = allbaseCamps.rows[i].general_summary
        baseCamp.Routes = []

        //fetchAllRoutes
        const fetchAllRoutesPerBaseCamp = {
            text: `select route_id from basecamp_route_nodes
            where base_camp_id = $1
            group by route_id;`,
            values :[allbaseCamps.rows[i].base_camp_id]
        }

        const baseCampRoutes = await client.query(fetchAllRoutesPerBaseCamp)
        for(j = 0; j<baseCampRoutes.rows.length;j++){
            const routeNodeRes = await bcn.getNodesByBaseCampIdAndRouteNum(allbaseCamps.rows[i].base_camp_id, baseCampRoutes.rows[j].route_id)
            baseCamp.Routes.push(routeNodeRes.rows)
        }

        baseCamps.push(baseCamp)
    }
    
    responseJson.HikeDetails.BaseCamps = baseCamps

    //fetchEquipmentRequired
    const equipmentReqRes = await er.getEquipmentReqByHikeId(hikeId);
    responseJson.HikeDetails.TrekProfile.EquipmentRequired = equipmentReqRes.rows

    //fetchBestMonths
    const bestMonthsRes = await bms.getBestMonthseByHikeId(hikeId);
    responseJson.HikeDetails.TrekProfile.BestMonths = bestMonthsRes.rows

    //fetchCurrentEvents
    const currentEventRes = await ced.getCurrentEventsByHikeId(hikeId);
    responseJson.HikeDetails.CurrentEvents = currentEventRes.rows

    //fetch Trek Routes
    const numberOfRoutesQuery = {
        text: `select route_number from gps_route_nodes
        where hike_id = $1
        group by route_number;`,
        values:[hikeId]
    }

    const routeNumbersRes = await client.query(numberOfRoutesQuery)
    
    for(i =0; i<routeNumbersRes.rows.length;i++){
        //gpsCoords
        let nodes = {}
        const gpsNodesRes = await gpsdns.getNodesByHikeIdAndRouteNum(hikeId, routeNumbersRes.rows[i].route_number) 
        for(j=0;j<gpsNodesRes.rows.length;j++){
            let node = gpsNodesRes.rows[j]
            nodes[node.node_number] = [node.xcoord, node.ycoord]
        }

        //TerrainDistributionNodes
        const ttnNodes = await ttdns.getNodesByHikeIdAndRouteNum(hikeId, routeNumbersRes.rows[i].route_number)
        
        //PointsOfInterestNodes
        const poiNodes = await poidns.getNodesByHikeIdAndRouteNum(hikeId, routeNumbersRes.rows[i].route_number)
        
        //DistanceDistributionNodes
        const ddnNodes = await ddns.getNodesByHikeIdAndRouteNum(hikeId, routeNumbersRes.rows[i].route_number)

        //SectionDescription
        const secDns = await secdns.getNodesByHikeIdAndRouteNum(hikeId, routeNumbersRes.rows[i].route_number)

        responseJson.HikeDetails.TrekProfile.TrekRoutes.push(
            {
                "Nodes":nodes,
                "DistanceDistributionNodes":ddnNodes.rows,
                "TerrainDistributionNodes":ttnNodes.Rows,
                "PointsOfInterestNodes":poiNodes.rows,
                "SectionDescription":secDns.rows
            }
        );
    }
    return responseJson
}

module.exports = [setClient, router]

