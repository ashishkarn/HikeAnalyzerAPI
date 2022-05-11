const gpsRouteNodes = {
    client: null,

    getNodesByHikeId: async function(hikeId) {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: 'SELECT * FROM gps_route_nodes WHERE hike_id = $1',
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
            text: 'SELECT * FROM gps_route_nodes WHERE hike_id = $1 AND route_number = $2',
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
            text: 'SELECT * FROM gps_route_nodes',
            values: []
        }
        try{
            const res = await this.client.query(query);
            return res;
        }catch(err){
            throw new Error(err);
        }
    },

    setGpsRouteNodeData: async function (gps_details) {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: `INSERT INTO public.gps_route_nodes(
                route_number, hike_id, xcoord, ycoord, node_number)
                VALUES($1,$2,$3,$4,$5)`,
            values: [gps_details.route_number,
                gps_details.hike_id,
                gps_details.xcoord,
                gps_details.ycoord,
                gps_details.node_number]
        }
        try{
            
            const res = await this.client.query(query);
            
            return res;
        }catch(err){
            
            throw Error(err)
        }
    }
}

module.exports = gpsRouteNodes;