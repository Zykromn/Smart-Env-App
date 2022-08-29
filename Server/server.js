// Libs
var http = require('http');
var fs = require("fs");




// Consts and vars
const SERVER_Port = 1337;




// Initializings
const server = http.createServer();
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
console.log("SERVER LAUNCHED");
console.log(`Port - ${SERVER_Port}`);
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");




// Main functions
server.listen(SERVER_Port);
server.on("request", (HTTP_Request, HTTP_Response) => {
    HTTP_RequestProcessing(HTTP_Request, HTTP_Response);
})

function HTTP_RequestProcessing(HTTP_Request, HTTP_Response) {
    console.log("\n\n")
    console.log("===========================================================");
    console.log("HTTP REQUEST HAS BEEN RECEIVED");

    let HTTP_EncodePayloadRequest = HTTP_Request.url.replace("/", "");
    let HTTP_PayloadRequest = decodeURIComponent(HTTP_EncodePayloadRequest);
    let JSON_PayloadRequest = JSON.parse(HTTP_PayloadRequest);

    console.log();
    console.log("--------------------------------------------------");
    console.log(`System request - ${HTTP_EncodePayloadRequest}`);
    console.log(`Payload request - ${HTTP_PayloadRequest}`);
    console.log("--------------------------------------------------");
    console.log(`Type - ${JSON_PayloadRequest["type"]}`);

    let JSON_RequestProcessing;
    if (JSON_PayloadRequest["type"] === "entrance") {
        JSON_RequestProcessing = JSON_RequestEntrance(JSON_PayloadRequest);
    } else if (JSON_PayloadRequest["type"] === "infobj") {
        JSON_RequestProcessing = JSON_RequestInfobj(JSON_PayloadRequest);
        HTTP_Response.setHeader('Access-Control-Allow-Origin', '*');
    } else if (JSON_PayloadRequest["type"] === "devicecheck") {
        JSON_RequestProcessing = JSON_DeviceCheck(JSON_PayloadRequest);
        HTTP_Response.setHeader('Access-Control-Allow-Origin', '*');
    }

    HTTP_Response.end(JSON_RequestProcessing)

    console.log();
    console.log("===========================================================");
}




// Addition functions
function JSON_DeviceCheck(JSON_PayloadRequest) {
    let JSON_PayloadRequestSYSTEMID = JSON_PayloadRequest["systemid"];
    let JSON_PayloadRequestPASSWORD = JSON_PayloadRequest["password"]
    console.log("Checking the compatibility of the device...");

    try {
        let DOC_Data = fs.readFileSync('./db/envlist-db.json', 'utf8');
        let JSON_DataBaseENVLIST = JSON.parse(DOC_Data);

        if (JSON_PayloadRequestSYSTEMID in JSON_DataBaseENVLIST) {
            let JSON_ConfigPart = JSON_DataBaseENVLIST[JSON_PayloadRequestSYSTEMID];

            if (JSON_PayloadRequestPASSWORD === JSON_ConfigPart["password"]) {
                if (JSON_ConfigPart["status"] === 1) {
                    console.log("Device already coupled. DataBaseControl access is allowed");
                    console.log("--------------------------------------------------");

                    return ("1");
                } else {
                    console.log("Device not coupled. Processing...");
                    console.log("--------------------------------------------------");

                    JSON_ConfigPart["status"] = 1;
                    JSON_DataBaseENVLIST[JSON_PayloadRequestSYSTEMID] = JSON_ConfigPart;
                    fs.writeFileSync('./db/envlist-db.json', JSON.stringify(JSON_DataBaseENVLIST, null, 4));

                    return ("2");
                }
            } else {
                console.log("Not registered. DataBaseControl access is blocked");
                console.log("--------------------------------------------------");

                return ("0");
            }
        } else {
            console.log("Not registered. DataBaseControl access is blocked");
            console.log("--------------------------------------------------");

            return ("0");
        }
    } catch (err) {
        console.log(`Error reading file - ${err}`);
        console.log("--------------------------------------------------");
    }
}

function JSON_RequestEntrance(JSON_PayloadRequest) {
    let JSON_PayloadRequestSYSTEMID = JSON_PayloadRequest["systemid"];
    console.log(`Id - ${JSON_PayloadRequestSYSTEMID}`);

    try {
        let DOC_Data = fs.readFileSync('./db/envlist-db.json', 'utf8');
        let JSON_DataBaseENVLIST = JSON.parse(DOC_Data);

        if (JSON_PayloadRequestSYSTEMID in JSON_DataBaseENVLIST) {
            let JSON_ConfigPart = JSON_DataBaseENVLIST[JSON_PayloadRequestSYSTEMID];


            if (JSON_ConfigPart["status"] === 1) {
                console.log("Registered. Connected to the control point. DataBaseControl access is allowed");
                console.log("--------------------------------------------------");

                return ("1");
            } else {
                console.log("Registered. Not connected to the control point. DataBaseControl access is blocked");
                console.log("--------------------------------------------------");

                return ("2");
            }
        } else {
            console.log("Not registered. DataBaseControl access is blocked");
            console.log("--------------------------------------------------");

            return ("0");
        }
    } catch (err) {
        console.log(`Error reading file - ${err}`);
        console.log("--------------------------------------------------");
    }
}

function JSON_RequestInfobj(JSON_PayloadRequest) {
    let JSON_PayloadRequestSYSTEMID = JSON_PayloadRequest["systemid"];
    let JSON_PayloadRequestPASSWORD = JSON_PayloadRequest["password"];
    let JSON_DataBaseINFOLIST;

    delete JSON_PayloadRequest["type"];
    delete JSON_PayloadRequest["systemid"];
    delete JSON_PayloadRequest["pasword"]
    try {
        let DOC_Data = fs.readFileSync('./db/infolist-db.json', 'utf8');
        JSON_DataBaseINFOLIST = JSON.parse(DOC_Data);

        if (JSON_PayloadRequestSYSTEMID in JSON_DataBaseINFOLIST) {
            if (JSON_DataBaseINFOLIST[JSON_PayloadRequestSYSTEMID]["password"] === JSON_PayloadRequestPASSWORD) {
                console.log("System registered. DataBaseControl working...")

                for (let JSON_InfoPartItem in JSON_PayloadRequest) {
                    JSON_DataBaseINFOLIST[JSON_PayloadRequestSYSTEMID][JSON_InfoPartItem] = JSON_PayloadRequest[JSON_InfoPartItem];
                }
            } else {
                console.log("System not registered. DataBaseControl Access blocked.")
                return ("0");
            }
        } else {
            console.log("System not registered. Information cell addendum. DataBaseControl working...");
            JSON_DataBaseINFOLIST[JSON_PayloadRequestSYSTEMID] = JSON_PayloadRequest;
        }
        fs.writeFileSync('./db/infolist-db.json', JSON.stringify(JSON_DataBaseINFOLIST, null, 4));

        return JSON_ResponseInfobj(JSON_PayloadRequestSYSTEMID);
    } catch (err) {
        console.log(`DBC error - ${err}`);
        console.log("--------------------------------------------------");
        return ("-1");
    }
}

function JSON_ResponseInfobj(JSON_PayloadRequestSYSTEMID) {
    let JSON_DataBaseINFOLIST;

    try {
        let DOC_Data = fs.readFileSync('./db/infolist-db.json', 'utf8');
        JSON_DataBaseINFOLIST = JSON.parse(DOC_Data);

        if (JSON_PayloadRequestSYSTEMID in JSON_DataBaseINFOLIST) {
            console.log("System registered. DataBaseControl working...")

            let JSON_InfoPart = JSON_DataBaseINFOLIST[JSON_PayloadRequestSYSTEMID];
            delete JSON_InfoPart["password"];
            JSON_InfoPart = JSON.stringify(JSON_InfoPart);

            return (encodeURIComponent(JSON_InfoPart));
        } else {
            console.log("System not registered. Information cell addendum. DataBaseControl working...");

            return ("0");
        }
    } catch (err) {
        console.log(`DBC error - ${err}`);
        console.log("--------------------------------------------------");

        return ("-1");
    }
}
