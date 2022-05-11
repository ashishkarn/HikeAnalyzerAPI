const currentEvents = {
    client: null,

    getCurrentEventsByHikeId: async function(hikeId) {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: 'SELECT * FROM current_events WHERE hike_id = $1',
            values: [hikeId]
        }
        try{
            const res = await this.client.query(query);
            return res;
        }catch(err){
            throw new Error(err);
        }
    },

    getAllCurrentEvents: async function() {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: 'SELECT * FROM current_events',
            values: []
        }
        try{
            const res = await this.client.query(query);
            return res;
        }catch(err){
            throw new Error(err);
        }
    },

    setCurrentEventData: async function (currentEvent_details) {
        if(this.client===null){
            throw new Error("client not defined");
        }
        const query = {
            text: `INSERT INTO public.current_events(
                hike_id, event_type, event_desc, date_posted, images_url)
                VALUES ($1, $2, $3, $4, $5) RETURNING hike_id`,
            values: [currentEvent_details.hike_id, currentEvent_details.event_type, currentEvent_details.event_desc,currentEvent_details.date_posted,
                currentEvent_details.images_url]
        }
        try{
            
            const res = await this.client.query(query);
            
        }catch(err){
            
            throw Error(err)
        }
    }
}

module.exports = currentEvents;