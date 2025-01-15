const http = require('http');

class getPublicIp {

    constructor() {
        this.options = {
            host: 'api.ipify.org',
            port: 80,
            path: '/?format=json'
        };
    }
    async get(){
        const self = this;
        return new Promise((resolve, reject) => {
            http.get(self.options, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(data);
                        resolve(parsedData.ip);
                    } catch (e) {
                        reject(e);
                    }
                });
            }).on("error", (err) => {
                reject(err);
            });
        });
    }
}

const getPublicIp_ = new getPublicIp();

module.exports = getPublicIp_;
