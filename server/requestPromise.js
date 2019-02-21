const request = require('request-promise');
const { getRequestUrl } = require('./common')

const rq = async (url = '', options = {}, serviceName) => {
    const { method = 'get'} = options;
    return new Promise((resolve, reject) => {
        request[method.toLowerCase()](getRequestUrl(url, serviceName), {...options, json: true}).then(
            result => resolve(result)
        ).catch(
            error => reject(error)
        )
    })
}

module.exports = rq