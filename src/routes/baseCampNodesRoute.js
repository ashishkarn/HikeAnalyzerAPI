const express = require('express');
const router = express.Router();
const baseCampRoute = require('../repository/baseCampRouteNodesService');

router.get("/:campId", (request, response)=>{
    const campId = request.params.campId;
    
    const campP = campId === 'all'?baseCampRoute.getAllBaseCampNodes():baseCampRoute.getNodesByBaseCampId(campId);
    campP
        .then(res => res.rows.length === 0 ? response.status(404).end() : response.json({baseCampAllRoutesNodes:res.rows}))
        .catch((reason) => {
            response.statusMessage = reason;
            response.status(404).end();
        });
});

router.get("/:campId/:routeNum", (request, response)=>{
    const campId = request.params.campId;
    const routeNum = request.params.routeNum;
    
    const campP = baseCampRoute.getNodesByBaseCampIdAndRouteNum(campId, routeNum);
    campP
        .then(res => res.rows.length === 0 ? response.status(404).end() : response.json({baseCampAllRoutesNodes:res.rows}))
        .catch((reason) => {
            response.statusMessage = reason;
            response.status(404).end();
        });
});

router.post("/", (request, response) => {
    const baseCampRouteNode_details =request.body;

    const baseCampRouteNodePromise = baseCampRoute.setBaseCampRouteNode(baseCampRouteNode_details);
    baseCampRouteNodePromise
        .then(res => response.json({campId:res.rows[0].base_camp_id, routeNum: res.rows[0].route_id}))
        .catch((err) => {
            response.statusMessage = err;
            response.status(404).end();
        });
});

module.exports = [baseCampRoute, router];