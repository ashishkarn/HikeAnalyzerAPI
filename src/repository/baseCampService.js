const baseCampService = {
    client: null,

    getBaseCampById : async function(camp_id) {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: 'SELECT * FROM base_camps WHERE base_camp_id = $1',
            values: [camp_id]
        }
        try{
            const res = await this.client.query(query);
            return res;
        }catch(err){
            throw new Error(err);
        }
    },

    getAllBaseCamps: async function() {
        if(this.client===null){
            throw new Error("client not defined");
        }
        
        const query = {
            text: 'SELECT * FROM base_camps',
            values: []
        }
        try{
            const res = await this.client.query(query);
            return res;
        }catch(err){
            throw new Error(err);
        }
    },

    setBaseCamp: async function(camp_details){
        if(this.client===null){
            throw new Error("Client not Defined");
        }
        const query = {
            text: `INSERT INTO base_camps(
                    location_name, location_coordinates, 
                    country, state, 
                    district, city,
                    starting_point,
                    address_line_1,
                    address_line_2,
                    image_url,
                    general_summary) 
                   VALUES ($1, $2, $3, $4, $5, $6, $7,
                    $8, $9, $10, $11) RETURNING base_camp_id`,
            values: 
            [
                camp_details.location_name, 
                camp_details.location_coordinates, 
                camp_details.country,
                camp_details.state,
                camp_details.district, 
                camp_details.city,
                camp_details.starting_point, 
                camp_details.address_line_1, 
                camp_details.address_line_2,
                camp_details.image_url,
                camp_details.general_summary
            ]
        }
        try{
            
            const res = await this.client.query(query);
            
            return res;
        }catch(err){
            
            throw new Error(err)
        }
    }
}

module.exports = baseCampService;