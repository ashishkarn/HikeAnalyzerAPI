const baseCampRouteNodes = {
    client: null,

    getNodesByBaseCampId: async function(campId) {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: 'SELECT * FROM basecamp_route_nodes WHERE base_camp_id = $1',
            values: [campId]
        }
        try{
            const res = await this.client.query(query);
            return res;
        }catch(err){
            throw new Error(err);
        }
    },

    getNodesByBaseCampIdAndRouteNum: async function(campId, routeId) {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: 'SELECT * FROM basecamp_route_nodes WHERE base_camp_id = $1 AND route_id = $2',
            values: [campId, routeId]
        }
        try{
            const res = await this.client.query(query);
            return res;
        }catch(err){
            throw new Error(err);
        }
    },

    getAllBaseCampNodes: async function() {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: 'SELECT * FROM basecamp_route_nodes',
            values: []
        }
        try{
            const res = await this.client.query(query);
            return res;
        }catch(err){
            throw new Error(err);
        }
    },

    setBaseCampRouteNode: async function (baseCampNode_details) {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: `INSERT INTO public.basecamp_route_nodes(
                route_id, base_camp_id, node_number, location_name, 
                location_coords, location_description, location_image_url, 
                road_accessible, train_accessible, air_accessible)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING base_camp_id, route_id`,
            values: [baseCampNode_details.route_id, baseCampNode_details.base_camp_id, 
                baseCampNode_details.node_number,baseCampNode_details.location_name,
                baseCampNode_details.location_coords, baseCampNode_details.location_description, 
                baseCampNode_details.location_image_url,baseCampNode_details.road_accessible,
                baseCampNode_details.train_accessible,baseCampNode_details.air_accessible]
        }
        try{
            const res = await this.client.query(query);
            return res;
        }catch(err){
            throw Error(err)
        }
    }
}

module.exports = baseCampRouteNodes;