const hikeBaseCampDetails = {
    client: null,

    getByHikeId: async function(hikeId) {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: 'SELECT * FROM hikes_basecamps WHERE hike_id = $1',
            values: [hikeId]
        }
        try{
            const res = await this.client.query(query);
            return res;
        }catch(err){
            throw new Error(err);
        }
    },

    getByBaseCampId: async function(campId) {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: 'SELECT * FROM hikes_basecamps WHERE base_camp_id = $1',
            values: [campId]
        }
        try{
            const res = await this.client.query(query);
            return res;
        }catch(err){
            throw new Error(err);
        }
    },

    getAllHikesBaseCamps: async function() {
        if(this.client===null){
            throw new Error("client not defined");
        }
        
        const query = {
            text: 'SELECT * FROM hikes_basecamps',
            values: []
        }
        try{
            const res = await this.client.query(query);
            return res;
        }catch(err){
            throw new Error(err);
        }
    },

    setHikeBaseCampData: async function (hikeBaseCamp_details) {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: 'INSERT INTO hikes_basecamps(hike_id, base_camp_id) VALUES($1, $2) RETURNING hike_id',
            values: [hikeBaseCamp_details.hike_id, hikeBaseCamp_details.base_camp_id]
        }
        try{
            
            const res = await this.client.query(query);
            
            return res;
        }catch(err){
            
            throw Error(err)
        }
    }
}

module.exports = hikeBaseCampDetails;