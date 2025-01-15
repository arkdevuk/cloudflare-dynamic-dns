const  cron = require('node-cron');
const Cloudflare = require('cloudflare');
const getPublicIp = require('./lib/getPublicIp');
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({ path: ['.env.local', '.env'] });
}

const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY;
const ZONE_ID = process.env.ZONE_ID;
const DOMAIN = process.env.DOMAIN;

const lastIp = null;



const updateCloudflare = async (ip_ = undefined) => {
    let ip =await getPublicIp.get();
     if(ip === lastIp){
        console.log('IP has not changed');
        return false;
     }
    const client = new Cloudflare({
        defaultHeaders: {
            'Authorization': `Bearer ${CLOUDFLARE_API_KEY}`
        }
    });
    for await (const recordResponse of
        client.dns.records.list({ zone_id: ZONE_ID })) {
        if(recordResponse?.name === DOMAIN){
            await client.dns.records.edit(recordResponse.id, {
                content: ip,
                zone_id: ZONE_ID,
                proxied: true,
            });
            return true;
        }
    }
    throw new Error('Domain record not found');
}

const recurrentJob = async () => {
    console.log('setting up domain :', DOMAIN)
    updateCloudflare()
        .catch(err => {
            console.log('Error', err);
        })
}

// first run
recurrentJob();

// setup cron job
cron.schedule('*/10 * * * *', () => {
    console.log('running a task every 10 minutes');
    recurrentJob();
});
