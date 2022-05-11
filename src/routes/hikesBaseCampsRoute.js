const express = require('express');
const router = express.Router();
const hbs = require('../repository/hikesBasecampsService');

router.get("/:id", (request, response)=>{
    const id = request.params.id;
    const searchBy = request.query.searchBy;
    details = null;
    
    if(id==='all'){
        details = hbs.getAllHikesBaseCamps();
    }else{
        if(searchBy==='hike_id'){
            details = hbs.getByHikeId(id);
        }else if(searchBy==='base_camp_id'){
            details = hbs.getByBaseCampId(id);
        }
        else{
            response.statusMessage = 'Unknown Query String \''+searchBy+'\'';
            response.status(404).end();
            return;
        }
    }

    details
    .then(res => res.rows.length === 0 ? response.status(404).end() : response.json({hikes:res.rows}))
    .catch((reason) => {
        response.statusMessage = reason;
        response.status(404).end();
    });
});

router.post("/", (request, response) => {
    const hikeBaseCamp_details =request.body;

    const data = hbs.setHikeBaseCampData(hikeBaseCamp_details);
    data
        .then(res => response.json({hikes_basecamps:res.rows[0]}))
        .catch((err) => {
            response.statusMessage = err;
            response.status(404).end();
        });
});

module.exports = [hbs, router];