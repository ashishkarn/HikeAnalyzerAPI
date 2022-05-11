const hikeDetails = {
    client: null,

    getHikeById: async function(hikeId) {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: 'SELECT * FROM hike_details WHERE hike_id = $1',
            values: [hikeId]
        }
        try{
            const res = await this.client.query(query);
            return res;
        }catch(err){
            throw new Error(err);
        }
    },

    getAllHikes: async function() {
        if(this.client===null){
            throw new Error("client not defined");
        }
        
        const query = {
            text: 'SELECT * FROM hike_details',
            values: []
        }
        try{
            const res = await this.client.query(query);
            return res;
        }catch(err){
            throw new Error(err);
        }
    },

    setHikeData: async function (hike_details) {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: 'INSERT INTO hike_details(hike_id, hike_name, difficulty_level, last_updated_by, creation_date, last_update_timestamp, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING hike_id',
            values: 
            [
                hike_details.hike_id, hike_details.hike_name, hike_details.difficulty_level,
                hike_details.last_updated_by, hike_details.creation_date, 
                hike_details.last_update_timestamp, hike_details.created_by
            ]
        }
        try{
            
            const res = await this.client.query(query);
            
            return res;
        }catch(err){
            
            throw Error(err)
        }
    }
}

module.exports = hikeDetails;