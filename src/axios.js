const axios = require("axios")

module.exports =  axios.create({
    // baseURL: config.rootPath,
    withCredentials: true
});