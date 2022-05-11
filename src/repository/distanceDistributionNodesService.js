const distanceDistributionNodes = {
    client: null,

    getNodesByHikeId: async function(hikeId) {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: 'SELECT * FROM distance_distribution_nodes WHERE hike_id = $1',
            values: [hikeId]
        }
        try{
            const res = await this.client.query(query);
            return res;
        }catch(err){
            throw new Error(err);
        }
    },

    getNodesByHikeIdAndRouteNum: async function(hikeId, routeId) {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: 'SELECT * FROM distance_distribution_nodes WHERE hike_id = $1 AND route_number = $2',
            values: [hikeId, routeId]
        }
        try{
            const res = await this.client.query(query);
            return res;
        }catch(err){
            throw new Error(err);
        }
    },

    getAllDDNodes: async function() {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: 'SELECT * FROM distance_distribution_nodes',
            values: []
        }
        try{
            const res = await this.client.query(query);
            return res;
        }catch(err){
            throw new Error(err);
        }
    },

    setDistanceDistributionNodeData: async function (ddn_details) {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: `INSERT INTO public.distance_distribution_nodes(
                route_number, hike_id, start_node_number, end_node_number, distance_in_km, description)
                VALUES ($1,$2,$3,$4,$5,$6) RETURNING hike_id, route_number`,
            values: [ddn_details.route_number,
                ddn_details.hike_id,
                ddn_details.start_node_number,
                ddn_details.end_node_number,
                ddn_details.distance_in_km,
                ddn_details.description]
        }
        try{
            
            const res = await this.client.query(query);
            
            return res;
        }catch(err){
            
            throw Error(err)
        }
    }
}

module.exports = distanceDistributionNodes;