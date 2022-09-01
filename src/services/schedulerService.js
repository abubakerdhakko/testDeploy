import axios from 'axios';
import EndPoints from './EndPoints';

export const schedulerService =  {

    async getSchedularTickets(requestObject) {
        const url = EndPoints.schedulerService.scheduler + '/scheduler';
        try {
            return await axios.post(url, requestObject)
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    throw error
                });
        } catch (e) {
            throw e;
        }
    },

    
} 
export default schedulerService;