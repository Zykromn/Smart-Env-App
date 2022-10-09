// Consts and vars
let FORM_ValuesSYSTEMID = $(".FORM-InputID");
let FORM_ValuesPASSWORD = $(".FORM-InputPAS");
let COOCKIE_MaxAge = 600;




// Main event listener
$(".FORM-Button").click(FORM_OnHandle);




// Main functions
function FORM_OnHandle() {
    let xhr = new XMLHttpRequest();
    let HTTP_RequestContent = `{"type":"devicecheck","systemid":"${FORM_ValuesSYSTEMID.val()}","password":"${FORM_ValuesPASSWORD.val()}"}`;
    xhr.open('GET', `https://adaptive-married-akubra.glitch.me/${encodeURIComponent(HTTP_RequestContent)}`, true);
    xhr.withCredentials = false;
    xhr.send();

    xhr.onload = () => {
        FORM_Working(xhr.responseText);
    };

    xhr.onerror = () => {
        window.location.href = 'server-error.html';
    };
}

function FORM_Working(HTTP_ResponseFlag) {
    if (HTTP_ResponseFlag === "0") {
        FORM_ValuesSYSTEMID.val("");
        FORM_ValuesPASSWORD.val("");
        $(".REG-InvalidData").css({"display":"block"})
    } else if (HTTP_ResponseFlag === "1") {
        let COOCKIE_Content = encodeURIComponent(`{"type":"devicecheck","systemid":"${FORM_ValuesSYSTEMID.val()}","password":"${FORM_ValuesPASSWORD.val()}"}`);
        document.cookie = `inform=${COOCKIE_Content}; path=/; max-age=${COOCKIE_MaxAge}`;
        window.location.href = "system.html"
    } else if (HTTP_ResponseFlag === "2") {
        let COOCKIE_Content = encodeURIComponent(`{"type":"devicecheck","systemid":"${FORM_ValuesSYSTEMID.val()}","password":"${FORM_ValuesPASSWORD.val()}"}`);
        document.cookie = `inform=${COOCKIE_Content}; path=/; max-age=${COOCKIE_MaxAge}`;
        window.location.href = "success-access.html"
    } else {
        window.location.href = 'server-error.html';
    }
}
