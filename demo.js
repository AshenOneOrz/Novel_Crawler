var Agent = require('socks5-http-client/lib/Agent');
var request = require('request');
request.get({
    url: 'https://www.ptwxz.com/html/10/10125/7132551.html',
    agentClass: Agent,
    agentOptions: {
        socksHost: 'localhost', // Defaults to 'localhost'.
        socksPort: 7890 // Defaults to 1080.
    }
}, function (err, res) {
    console.log(err)
    console.log(res)
});