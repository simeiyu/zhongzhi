let serverConfig = {}

const initServerConfig = (config) => {
    Object.assign(serverConfig, config)
}

const getRequestUrl = (url, serviceName='zhongzhi') => {
    const serverUrl = serverConfig[serviceName]
    return `${serverUrl}${url}`
}

module.exports = {
    initServerConfig,
    getRequestUrl
}