var constants = require("../constants");

var Api = {
    async getEvent(eventId: string) {
        const requestUrl = constants.URL + eventId;
        const response = await fetch(requestUrl);

        console.log(response);
        return response;
    },
    
    async listEvents() {
        const response = await fetch(constants.URL);

        console.log(response);
        return response;
    }
}