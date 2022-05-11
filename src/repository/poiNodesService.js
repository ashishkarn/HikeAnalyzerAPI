const poiNodes = {
    client: null,

    getNodesByHikeId: async function(hikeId) {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: 'SELECT * FROM poi_nodes WHERE hike_id = $1',
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
            text: 'SELECT * FROM poi_nodes WHERE hike_id = $1 AND route_number = $2',
            values: [hikeId, routeId]
        }
        try{
            const res = await this.client.query(query);
            return res;
        }catch(err){
            throw new Error(err);
        }
    },

    getAllNodes: async function() {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: 'SELECT * FROM poi_nodes',
            values: []
        }
        try{
            const res = await this.client.query(query);
            return res;
        }catch(err){
            throw new Error(err);
        }
    },

    setPOINodeData: async function (poi_details) {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: `INSERT INTO public.poi_nodes(
                route_number, hike_id, node_number, poi_type, poi_name, poi_colour)
                VALUES($1,$2,$3,$4,$5,$6)`,
            values: [poi_details.route_number,
                poi_details.hike_id,
                poi_details.node_number,
                poi_details.poi_type,
                poi_details.poi_name,
                poi_details.poi_colour]
        }
        try{
            
            const res = await this.client.query(query);
            
            return res;
        }catch(err){
            
            throw Error(err)
        }
    }
}

module.exports = poiNodes;