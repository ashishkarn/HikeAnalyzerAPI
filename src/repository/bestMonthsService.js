const bestMonths = {
    client: null,

    getBestMonthseByHikeId: async function(hikeId) {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: 'SELECT * FROM best_months WHERE hike_id = $1',
            values: [hikeId]
        }
        try{
            const res = await this.client.query(query);
            return res;
        }catch(err){
            throw new Error(err);
        }
    },

    getAllBestMonths: async function() {
        if(this.client===null){
            throw new Error("client not defined");
        }
        
        const query = {
            text: 'SELECT * FROM best_months',
            values: []
        }
        try{
            const res = await this.client.query(query);
            return res;
        }catch(err){
            throw new Error(err);
        }
    },

    setBestMonthData: async function (bestMonths_details) {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: 'INSERT INTO best_months(hike_id, month_window, description, images_url) VALUES ($1, $2, $3, $4) RETURNING hike_id',
            values: [bestMonths_details.hike_id, bestMonths_details.month_window, bestMonths_details.description,bestMonths_details.images_url]
        }
        try{
            
            const res = await this.client.query(query);
            
            return res;
        }catch(err){
            
            throw Error(err)
        }
    }
}

module.exports = bestMonths;