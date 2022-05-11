const express = require('express');
const router = express.Router();
const hs = require('../repository/hikeDetailsService');

router.get("/:hikeId", (request, response)=>{
    const hikeId = request.params.hikeId;
    
    const hikeP = hikeId === 'all'?hs.getAllHikes():hs.getHikeById(hikeId);
    hikeP
        .then(res => res.rows.length === 0 ? response.status(404).end() : response.json({hikes:res.rows}))
        .catch((reason) => {
            response.statusMessage = reason;
            response.status(404).end();
        });
});

router.post("/", (request, response) => {
    const timestamp = Date.now();
    const dateObject = new Date(timestamp);
    const date = dateObject.getDate() + "-"+(dateObject.getMonth() + 1)+"-"+dateObject.getFullYear();

    const hike_details =request.body;

    hike_details.creation_date = date;
    hike_details.last_update_timestamp = date;

    const hikeDataPost = hs.setHikeData(hike_details);
    hikeDataPost
        .then(res => response.json({hikeId:res.rows[0].hike_id}))
        .catch((err) => {
            response.statusMessage = err;
            response.status(404).end();
        });
});

module.exports = [hs, router];