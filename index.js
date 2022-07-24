const http = require("http");
const fs = require('fs');
const port = process.env.PORT || 8000;
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

function fToC(fahrenheit) 
{
  var fTemp = fahrenheit;
//   var fToCel = (fTemp - 32) * 5 / 9;
     var fToCel = (fTemp-270);
     var message = Math.round(fToCel) + '\xB0C.'
     return message;
}
const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", fToC(orgVal.main.temp));
    temperature = temperature.replace("{%tempmin%}", fToC(orgVal.main.temp_min));
    temperature = temperature.replace("{%tempmax%}", fToC(orgVal.main.temp_max));
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);  
    return temperature;
}

const server = http.createServer((req, res) => {
    if(req.url == "/"){
        requests("http://api.openweathermap.org/data/2.5/weather?q=Nagpur&appid=e0e6031c330e5e8e8a66c28abaf7769a")
        .on('data', (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrayData = [objdata];
        //   console.log(arrayData[0].main.temp);
            const realTimeData = arrayData
            .map((val) => replaceVal(homeFile, val))
            .join("");

            res.writeHeader(200, {"Content-Type": "text/html"}); 

        // response.write(html);  
       

            res.write(realTimeData);
            res.end();
        //    console.log(realTimeData);
        })
        .on('end', (err) => {
          if (err) return console.log('connection closed due to errors', err);
         
         res.end();
        });   
    }
});

//server.listen(8000, "127.0.0.1");
server.listen(port, () => console.log(`Listening to the port ${port}`));


