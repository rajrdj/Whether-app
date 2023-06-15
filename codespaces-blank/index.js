const http = require('http');
const fs = require('fs');
const requests = require('requests');
const docu = fs.readFileSync('./index.html','utf-8');
 
const replaceVal = (docu,val) => {
    let chngdocu = docu.replace("{%city%}",val.name);
    chngdocu = chngdocu.replace("{%country%}",val.sys.country);
    chngdocu = chngdocu.replace("{%temp%}",val.main.temp);
    chngdocu = chngdocu.replace("{%min%}",val.main.temp_min);
    chngdocu = chngdocu.replace("{%max%}" ,val.main.temp_max);
    chngdocu = chngdocu.replace("{%Status%}",val.weather[0].main);
    return chngdocu;
}
const server = http.createServer((req,res) => {
   
    if(req.url == '/')
    {
         requests(
            `http://api.openweathermap.org/data/2.5/weather?q=Jaipur&appid=cdb4abce6537e91138658b5003647005`
        )
        .on('data',(chunk) => {
            const apidata = JSON.parse(chunk);
            const apidataArray = [apidata];
            const realData = apidataArray.map((val) => replaceVal(docu,val)).join("");

           res.write(realData);
           

        })
        .on('end',(err) => {
            if(err) return console.log("connection close");
            res.end();
        });
    }
});

server.listen(8000,"127.0.0.1",(err) => {
    console.log("server listened successfully");
});