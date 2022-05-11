const express = require('express');
const router = express.Router();
const equipmentReq = require('../repository/equipmentRequiredService');

router.get("/:hikeId", (request, response)=>{
    const hikeId = request.params.hikeId;
    
    const hikeP = hikeId === 'all'?equipmentReq.getAllEquipmentReq():equipmentReq.getEquipmentReqByHikeId(hikeId);
    hikeP
        .then(res => res.rows.length === 0 ? response.status(404).end() : response.json({equipmentReq:res.rows}))
        .catch((reason) => {
            response.statusMessage = reason;
            response.status(404).end();
        });
});

router.post("/", (request, response) => {
    const equipmentReq_details =request.body;

    const equipmentReqPromise = equipmentReq.setEquipmentReqData(equipmentReq_details);
    equipmentReqPromise
        .then(res => response.json({hikeId:res.rows[0].hike_id}))
        .catch((err) => {
            response.statusMessage = err;
            response.status(404).end();
        });
});

module.exports = [equipmentReq, router];