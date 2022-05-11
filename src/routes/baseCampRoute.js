const express = require('express');
const router = express.Router();
const bs = require('../repository/baseCampService');

router.get("/:campId", (request, response)=>{
    const campId = request.params.campId;
    
    const campP = campId === 'all'?bs.getAllBaseCamps():bs.getBaseCampById(campId);
    campP
        .then(res => res.rows.length === 0 ? response.status(404).end() : response.json({baseCamps:res.rows}))
        .catch((reason) => {
            response.statusMessage = reason;
            response.status(404).end();
        });
});

router.post("/", (request, response) => {
    const camp_details = request.body;

    const basecampDataPost = bs.setBaseCamp(camp_details);
    basecampDataPost
        .then(res => response.json({campId:res.rows[0].base_camp_id}))
        .catch((err) => {
            response.statusMessage = err;
            response.status(404).end();
        });
});

module.exports = [bs, router];