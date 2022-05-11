const express = require('express');
const router = express.Router();
const bestMonths = require('../repository/bestMonthsService');

router.get("/:hikeId", (request, response)=>{
    const hikeId = request.params.hikeId;
    
    const bMonthP = hikeId === 'all'?bestMonths.getAllBestMonths():bestMonths.getBestMonthseByHikeId(hikeId);
    bMonthP
        .then(res => res.rows.length === 0 ? response.status(404).end() : response.json({bestMonths:res.rows}))
        .catch((reason) => {
            response.statusMessage = reason;
            response.status(404).end();
        });
});

router.post("/", (request, response) => {
    const bestMonths_details = request.body;

    const bMonthPromise = bestMonths.setBestMonthData(bestMonths_details);
    bMonthPromise
        .then(res => response.json({hikeId:res.rows[0].hike_id}))
        .catch((err) => {
            response.statusMessage = err;
            response.status(404).end();
        });
});

module.exports = [bestMonths, router];