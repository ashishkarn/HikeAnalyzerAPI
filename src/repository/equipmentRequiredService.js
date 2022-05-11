const equipmentRequired = {
    client: null,

    getEquipmentReqByHikeId: async function(hikeId) {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: 'SELECT * FROM equipment_required WHERE hike_id = $1',
            values: [hikeId]
        }
        try{
            const res = await this.client.query(query);
            return res;
        }catch(err){
            throw new Error(err);
        }
    },

    getAllEquipmentReq: async function() {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: 'SELECT * FROM equipment_required',
            values: []
        }
        try{
            const res = await this.client.query(query);
            return res;
        }catch(err){
            throw new Error(err);
        }
    },

    setEquipmentReqData: async function (equipmentReq_details) {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: `INSERT INTO public.equipment_required(
                hike_id, eq_name, eq_description, eq_image_url)
                VALUES ($1, $2, $3, $4) RETURNING hike_id`,
            values: [equipmentReq_details.hike_id, equipmentReq_details.eq_name, equipmentReq_details.eq_description,equipmentReq_details.eq_image_url]
        }
        try{
            
            const res = await this.client.query(query);
            
            return res;
        }catch(err){
            await this.client.query('ROLLBACK');
            throw Error(err)
        }
    }
}

module.exports = equipmentRequired;