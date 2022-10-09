// Consts and vars
let SYS_HTTPRequestCount = 0;
let BMM_IconClose = $('.BMM-BurgerMenuClose');
let BMH_IconClose = $('.BMH-BurgerMenuClose');
let BM_Icon = $('.Header-BurgerMenuIcon');
let MD_Content = $(".MD-Content");
let MI_Content = $(".MI-Content");
let MF_Content = $(".MF-Content");
let APP_SwipeStart = 0;
let APP_SwipeEnd = 0;

const SES_UOFNameList= {
    "d0000": "Distance",
    "d0001": "Humidity",
    "d0002": "Temperature",
    "d0003": "Gas leak",
    "d0004": "Water leak",
    "m0000": "Lamp"
}
const SED_UOFIdList = {
    "d0000": "cm.",
    "d0001": "%",
    "d0002": "C."
}
const SEF_UOFValList = {
    "d0004": {1: "LEAK DETECTED", 0: "Normal"}
}



// Interface
$('body').on('touchstart', function (event) {
    APP_SwipeStart = event.originalEvent.touches[0].pageX;
})
$('body').on('touchend', function (event) {
    APP_SwipeEnd = event.originalEvent.changedTouches[0].pageX;
    if (APP_SwipeEnd - APP_SwipeStart >= 300) {
        BM_Show();
    } else if (APP_SwipeStart - APP_SwipeEnd >= 300) {
        BM_Hide();
    }
})
BMM_IconClose.click(() => {
    BM_Hide();
});
BMH_IconClose.click(() => {
    BM_Hide();
});
BM_Icon.click(() => {
    BM_Show();
});




// Main functions
function HTTP_Request() {
    let APP_Cookie = decodeURIComponent(document.cookie);
    if (APP_Cookie) {
        let APP_CookieJson = JSON.parse(APP_Cookie.replace("inform=", ""));
        APP_CookieJson["type"] = "infobj";


        if (SYS_HTTPRequestCount !== 0) {
            APP_CookieJson = SYS_MIContent(APP_CookieJson);
        }

        let xhr = new XMLHttpRequest();
        xhr.open('GET', `https://adaptive-married-akubra.glitch.me/${encodeURIComponent(JSON.stringify(APP_CookieJson))}`, true);
        xhr.withCredentials = false;
        xhr.send();

        xhr.onload = () => {
            HTTP_Working(decodeURIComponent(xhr.responseText));
        };

        xhr.onerror = () => {
            window.location.href = 'server-error.html';
        };

        SYS_HTTPRequestCount++;
    } else {
        window.location.href = 'registration.html';
    }
}

function HTTP_Working(HTTP_Response) {
    let JSON_ResponseINFOOBJ = JSON.parse(HTTP_Response);
    if (HTTP_Response === "0" && HTTP_Response === "-1") {
        window.location.href = 'server-error.html';
    } else {
        MD_Content.html("");
        MF_Content.html("");
        if (SYS_HTTPRequestCount === 1) {MI_Content.html("")}

        for (let ITEM_JSONResponse in JSON_ResponseINFOOBJ) {
            if (ITEM_JSONResponse in SED_UOFIdList) {
                let HTML_InfoPart = `
                    <div class="MD-Item">
                        <img src= "./images/System_${ITEM_JSONResponse}.png">
                        ${JSON_ResponseINFOOBJ[ITEM_JSONResponse]} ${SED_UOFIdList[ITEM_JSONResponse]}
                    </div>
                `;
                MD_Content.html(MD_Content.html() + HTML_InfoPart);
            } else if (ITEM_JSONResponse in SEF_UOFValList) {
                function SES_UOFValUi() {
                    let HTML_DivInfoPart;

                    if (JSON_ResponseINFOOBJ[ITEM_JSONResponse]){
                        HTML_DivInfoPart = `
                            <div class="MF-ItemValue" style="margin-right: 2vw; color: #ff0000; font-weight: 900;">
                                ${SEF_UOFValList[ITEM_JSONResponse][JSON_ResponseINFOOBJ[ITEM_JSONResponse]]}
                            </div>

                        `;
                    } else {
                        HTML_DivInfoPart = `
                            <div class="MF-ItemValue" style="margin-right: 2vw"> 
                                ${SEF_UOFValList[ITEM_JSONResponse][JSON_ResponseINFOOBJ[ITEM_JSONResponse]]}
                            </div>
                        `;
                    }

                    return HTML_DivInfoPart
                }

                let HTML_InfoPart = `
                    <div class="MF-Item" style="display: flex; align-items: center; justify-content: space-between;">
                        <div class="MF-ItemHeader"> ${SES_UOFNameList[ITEM_JSONResponse]} </div>
                            ${SES_UOFValUi()}
                    </div>
                `;

                MF_Content.html(MF_Content.html() + HTML_InfoPart);
            } else if (ITEM_JSONResponse in SES_UOFNameList && SYS_HTTPRequestCount === 1) {
                let HTML_InfoPartSwipeValue;

                function SYS_MIContent() {
                    if (JSON_ResponseINFOOBJ[ITEM_JSONResponse] === 1) {
                        return "checked";
                    } else {
                        return "";
                    }
                }

                HTML_InfoPartSwipeValue = SYS_MIContent();
                let HTML_InfoPart = `
                       <div class="MI-Item" style="display: flex; align-items: center; justify-content: space-between;">
                           <div class="MI-ItemHeader"> ${SES_UOFNameList[ITEM_JSONResponse]} </div>
                           <div class="form-check form-switch">
                               <input class="form-check-input MII-${ITEM_JSONResponse}" style="height: 3vh; width: 10vw; margin-right: 2vw;" type="checkbox" role="switch" id="flexSwitchCheckDefault" ${HTML_InfoPartSwipeValue}>
                           </div>
                       </div>
                   `;
                MI_Content.html(MI_Content.html() + HTML_InfoPart);
            }
        }
    }
}

function SYS_MIContent(APP_CookieJson) {
    for (let ITEM_UOFNameList in SES_UOFNameList){
        if (ITEM_UOFNameList[0] === "m") {
            if (document.querySelector(`.MII-${ITEM_UOFNameList}`).checked) {
                APP_CookieJson[ITEM_UOFNameList] = 1;
            } else {
                APP_CookieJson[ITEM_UOFNameList] = 0;
            }
        }
    }

    return APP_CookieJson;
}

function BM_Show() {
    anime({
        targets: '.Header-BurgerMenuIcon',
        opacity: ['1', '0'],
        duration: 500,
        loop: false
    });

    anime({
        targets: ['.BM-Content', '.BM-BlackScreen'],
        translateX: ['-150%', '0'],
        easing: 'easeInOutQuad',
        direction: 'alternate',
        duration: 1000,
        loop: false
    });
}

function BM_Hide() {
    anime({
        targets: ['.BM-Content', '.BM-BlackScreen'],
        translateX: ['0', '-150%'],
        easing: 'easeInOutQuad',
        direction: 'alternate',
        duration: 1000,
        loop: false
    });

    setTimeout(() => {
        anime({
            targets: '.Header-BurgerMenuIcon',
            opacity: ['0', '1'],
            duration: 500,
            loop: false
        })
    }, 1000);
}

HTTP_Request()
let SYS_IntervalId = setInterval(HTTP_Request, 2000);
