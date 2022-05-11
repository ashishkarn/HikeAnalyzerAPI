const express = require('express');
const router = express.Router();
const { randomUUID } = require('crypto'); 
const hs = require('../../repository/hikeDetailsService');
const hbs = require('../../repository/hikesBasecampsService');
const bs = require('../../repository/baseCampService');
const bcn = require('../../repository/baseCampRouteNodesService');
const bms = require('../../repository/bestMonthsService');
const ced = require('../../repository/currentEventsService');
const er = require('../../repository/equipmentRequiredService');
const gps = require('../../repository/gpsRouteNodesService');
const ddns = require('../../repository/distanceDistributionNodesService');
const tdns = require('../../repository/terrainDistributionNodesService');
const poidns = require('../../repository/poiNodesService');
const sedns = require('../../repository/sectionDescService');

let client = undefined;

function setClient(_client){
    hs.client = _client;
    hbs.client = _client;
    bs.client = _client;
    bcn.client = _client;
    bms.client = _client;
    ced.client = _client;
    gps.client = _client;
    ddns.client = _client;
    tdns.client = _client;
    poidns.client = _client;
    sedns.client = _client;
    client = _client
}

router.post("/", (request, response) => {
    const newHikeDetails =request.body;

    const hikeId = randomUUID();

    const timestamp = Date.now();
    const dateObject = new Date(timestamp);
    const date = dateObject.getDate() + "-"+(dateObject.getMonth() + 1)+"-"+dateObject.getFullYear();
    client.query('BEGIN')
        .then(res=>{
            runQuery(hikeId, newHikeDetails, date)
                .then(hike_id=>{
                    client.query('COMMIT')
                    response.json({'hike_id':hikeId,'status':'Inserted'});
                })
                .catch(err=>{
                    client.query('ROLLBACK')
                    response.statusMessage=err;
                    response.status(404).send();
                })
        })    
});

async function runQuery(hikeId, newHikeDetails, date){
    //Insert hikeDetails
    const hike_details = {
        "hike_id":hikeId,
        "hike_name":newHikeDetails.Hike_Name,
        "difficulty_level":newHikeDetails.Difficulty_Level,
        "last_updated_by":newHikeDetails.Last_Updated_By,
        "creation_date":date,
        "last_update_timestamp":date,
        "created_by":newHikeDetails.Created_By
    }
    await hs.setHikeData(hike_details);
    console.log("INSERTED HikeDetails")

    //Insert BaseCampDetails
    //If basecamp is already in database
    if(newHikeDetails.AddPreviousBaseCamp.state === true){
        for(i=0;i<newHikeDetails.AddPreviousBaseCamp.base_camp_id.length;i++){
            const hikesBaseCampData = {
                "hike_id":hikeId,
                "base_camp_id":newHikeDetails.AddPreviousBaseCamp.base_camp_id[i]
                
            }
            await hbs.setHikeBaseCampData(hikesBaseCampData)
        }
    }
    
    //New basecamp detail
    if(newHikeDetails.BaseCamps.length>0){
        for(k=0;k<newHikeDetails.BaseCamps.length;k++){
            let baseCampDetail = newHikeDetails.BaseCamps[k]
            const baseCampDetails = {
                "location_name":baseCampDetail.BaseCampLocationName,
                "location_coordinates":baseCampDetail.BaseCampLocationCoordinates,
                "country":baseCampDetail.BaseCampCountry,
                "state":baseCampDetail.BaseCampState,
                "district":baseCampDetail.BaseCampDistrict,
                "city":baseCampDetail.BaseCampCity,
                "starting_point":baseCampDetail.BaseCampStartingPoint,
                "address_line_1":baseCampDetail.BaseCampAddressLine1,
                "address_line_2":baseCampDetail.BaseCampAddressLine2,
                "image_url":baseCampDetail.BaseCampImageUrl,
                "general_summary":baseCampDetail.GeneralDescription
            }

            const baseCampDetails_res = await bs.setBaseCamp(baseCampDetails)
            const baseCampId = baseCampDetails_res.rows[0].base_camp_id;

            //SetBaseCampRouteNodes
            if(baseCampDetail.Routes.length>0){
                for(i =0;i<baseCampDetail.Routes.length;i++){
                    for(j=0;j<baseCampDetail.Routes[i].length;j++){
                        const baseCampNodeDetails = {
                            "route_id":i+1,
                            "base_camp_id":baseCampId,
                            "node_number":baseCampDetail.Routes[i][j].NodeNumber,
                            "location_name":baseCampDetail.Routes[i][j].LocationName,
                            "location_coords":baseCampDetail.Routes[i][j].LocationCoords,
                            "location_description":baseCampDetail.Routes[i][j].LocationDescription,
                            "location_image_url":baseCampDetail.Routes[i][j].LocationImageUrl,
                            "road_accessible":baseCampDetail.Routes[i][j].CanBeReachedBy.ROAD,
                            "train_accessible":baseCampDetail.Routes[i][j].CanBeReachedBy.RAIL,
                            "air_accessible":baseCampDetail.Routes[i][j].CanBeReachedBy.AIR
                        }
                        await bcn.setBaseCampRouteNode(baseCampNodeDetails)                        
                    }
                    
                }
            }
            const hikesBaseCampData = {
                "hike_id":hikeId,
                "base_camp_id":baseCampId
                
            }
            await hbs.setHikeBaseCampData(hikesBaseCampData)
        }
    }
    console.log("INSERTED BASECAMPS");

    //BestMonths
    if(newHikeDetails.BestMonths.length>0){
        for(i =0;i<newHikeDetails.BestMonths.length;i++){
            let bestMonthData = newHikeDetails.BestMonths[i]
            const bestMonthDetails = {
                "hike_id":hikeId,
                "month_window":bestMonthData.MonthWindow,
                "description":bestMonthData.Description,
                "images_url":bestMonthData.ImagesUrl
            }
            await bms.setBestMonthData(bestMonthDetails)
        }
    }
    console.log("INSERTED BestMonths");

    //CurrentEvents
    if(newHikeDetails.CurrentEvents.length>0){
        for(i =0;i<newHikeDetails.CurrentEvents.length;i++){
            let currentEventData = newHikeDetails.CurrentEvents[i]
            const currentEventDetails = {
                "hike_id":hikeId,
                "event_type":currentEventData.CurrentEventType,
                "event_desc":currentEventData.EventDescription,
                "date_posted":date,
                "images_url":currentEventData.EventImagesUrl
            }
            await ced.setCurrentEventData(currentEventDetails)
        }
    }
    console.log("INSERTED CurrentEvents");

    //EquipmentRequired
    if(newHikeDetails.EquipmentRequired.length>0){
        for(i =0;i<newHikeDetails.EquipmentRequired.length;i++){
            let equipmentData =  newHikeDetails.EquipmentRequired[i]
            const equipmentDetails = {
                "hike_id":hikeId,
                "eq_name":equipmentData.EquipmentName,
                "eq_description":equipmentData.EquipmentDescription,
                "eq_image_url":equipmentData.EquipmentImageUrl
            }
            await er.setEquipmentReqData(equipmentDetails)
        }
    }
    console.log("INSERTED EquipmentRequired");

    //InsertTrekRoutes
    if(newHikeDetails.TrekRoutes.length>0){
        for(i=0;i<newHikeDetails.TrekRoutes.length;i++){
            let trekRoute = newHikeDetails.TrekRoutes[i]

            //Insert Gps Nodes
            for(j=0;j<trekRoute.nodes.length;j++){
                let routeDetails = {
                    route_number:i+1, 
                    hike_id:hikeId, 
                    xcoord:trekRoute.nodes[j].CoordX, 
                    ycoord:trekRoute.nodes[j].CoordY, 
                    node_number:j
                }
                await gps.setGpsRouteNodeData(routeDetails)
            }

            //Insert DD Nodes
            if(trekRoute.dd_nodes.length>0){
                for(j=0;j<trekRoute.dd_nodes.length;j++){
                    let data = trekRoute.dd_nodes[j]
                    let routeDetails = {
                        route_number:i+1, 
                        hike_id:hikeId, 
                        start_node_number:data.StartNodeNumber, 
                        end_node_number:data.EndNodeNumber,
                        distance_in_km:data.DistanceInKm, 
                        description:data.Description
                    }
                    await ddns.setDistanceDistributionNodeData(routeDetails)
                }
            }
            
            //Insert Terrain Nodes
            if(trekRoute.terrainNodes.length>0){
                for(j=0;j<trekRoute.terrainNodes.length;j++){
                    let data = trekRoute.terrainNodes[j]
                    let routeDetails = {
                        route_number:i+1, 
                        hike_id:hikeId, 
                        start_node_number:data.StartNodeNumber, 
                        end_node_number:data.EndNodeNumber,
                        terrain_type:data.TerrainType
                    }
                    await tdns.setNodeData(routeDetails)
                }
            }

            //Insert Poi Nodes
            if(trekRoute.poiNodes.length>0){
                for(j=0;j<trekRoute.poiNodes.length;j++){
                    let data = trekRoute.poiNodes[j]
                    let routeDetails = {
                        route_number:i+1, 
                        hike_id:hikeId, 
                        node_number:data.NodeNumber, 
                        poi_type:data.POIType, 
                        poi_name:data.POIName, 
                        poi_colour:data.POIColour
                    }
                    await poidns.setPOINodeData(routeDetails)
                }
            }

            //Insert Section Description Nodes
            if(trekRoute.sectionDescNodes.length>0){
                for(j=0;j<trekRoute.sectionDescNodes.length;j++){
                    let data = trekRoute.sectionDescNodes[j]
                    let routeDetails = {
                        route_number:i+1, 
                        hike_id:hikeId, 
                        start_node_number:data.StartNodeNumber, 
                        end_node_number:data.EndNodeNumber,
                        description:data.Description
                    }
                    await sedns.setNodeData(routeDetails)
                }
            }
        }
    }


    return hikeId;
}

module.exports = [ setClient, router]

