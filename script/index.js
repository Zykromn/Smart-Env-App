// Launching
LNCH_Preapare();




// Main functions
function LNCH_Working(LNCH_Flag) {
    setTimeout(() => {
        if (LNCH_Flag === "0") {
            window.location.href = 'registration.html';
        } else if (LNCH_Flag === "1") {
            window.location.href = 'system.html';
        } else if (LNCH_Flag === "2") {
            window.location.href = 'success-access.html';
        } else {
            window.location.href = 'server-error.html';
        }
    }, 2000)
}

function LNCH_Preapare() {
    let APP_Cookie = document.cookie;
    if (APP_Cookie) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `https://adaptive-married-akubra.glitch.me/${APP_Cookie.replace("inform=", "")}`, true);
        xhr.withCredentials = false;
        xhr.send();

        xhr.onload = () => {
            LNCH_Working(xhr.responseText);
        };

        xhr.onerror = () => {
            window.location.href = 'server-error.html';
        };
    } else {
        setTimeout(() => {window.location.href = 'registration.html'}, 2000);
    }
}
