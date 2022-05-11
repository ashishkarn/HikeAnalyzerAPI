const express = require('express');
const router = express.Router();
const currentEvent = require('../repository/currentEventsService');

router.get("/:hikeId", (request, response)=>{
    const hikeId = request.params.hikeId;
    
    const hikeP = hikeId === 'all'?currentEvent.getAllCurrentEvents():currentEvent.getCurrentEventsByHikeId(hikeId);
    hikeP
        .then(res => res.rows.length === 0 ? response.status(404).end() : response.json({currentEvents:res.rows}))
        .catch((reason) => {
            response.statusMessage = reason;
            response.status(404).end();
        });
});

router.post("/", (request, response) => {
    const currentEvent_details =request.body;

    const currentEventPromise = currentEvent.setCurrentEventData(currentEvent_details);
    currentEventPromise
        .then(res => response.json({hikeId:res.rows[0].hike_id}))
        .catch((err) => {
            response.statusMessage = err;
            response.status(404).end();
        });
});

module.exports = [currentEvent, router];