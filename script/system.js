// Consts and vars
let SYS_HTTPRequestCount = 0;
let BMM_IconClose = $('.BMM-BurgerMenuClose');
let BMH_IconClose = $('.BMH-BurgerMenuClose');
let BMC_status = 0;
let BM_Icon = $('.Header-BurgerMenuIcon');
let MD_Content = $(".MD-Content");
let MM_Content = $(".MM-Content");
let MI_Content = $(".MI-Content");
let APP_SwipeStart = 0;
let APP_SwipeEnd = 0;

const SES_UOFNameList= {
    "d0000": "Distance",
    "d0001": "Humidity",
    "d0002": "Temperature",
    "i0000": "Water leak",
    "i0001": "Gas leak",
    "m0000": "Lamp",
    "m0001": "Output 1",
    "m0002": "Output 2",
    "m0003" : "Servo door"
}
const SED_UOFIdList = {
    "d0000": "cm.",
    "d0001": "%",
    "d0002": "C."
}
const SEI_UOFValList = {
    "i0000": {0: "Normal", 1: "Leak detected"},
    "i0001": {0: "Normal", 1: "Leak detected"}
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
            APP_CookieJson = SYS_MMContent(APP_CookieJson);
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
        MI_Content.html("");
        if (SYS_HTTPRequestCount === 1) {MM_Content.html("")}

        for (let ITEM_JSONResponse in JSON_ResponseINFOOBJ) {
            if (ITEM_JSONResponse in SED_UOFIdList) {
                let HTML_InfoPart = `
                    <div class="MD-Item">
                        <img src= "./images/System_${ITEM_JSONResponse}.png">
                        ${JSON_ResponseINFOOBJ[ITEM_JSONResponse]} ${SED_UOFIdList[ITEM_JSONResponse]}
                    </div>
                `;
                MD_Content.html(MD_Content.html() + HTML_InfoPart);
            } else if (ITEM_JSONResponse in SEI_UOFValList) {
                function SES_UOFValUi() {
                    let HTML_DivInfoPart;

                    if (JSON_ResponseINFOOBJ[ITEM_JSONResponse]){
                        HTML_DivInfoPart = `
                            <div class="MI-ItemValue" style="margin-right: 2vw; color: #ff0000; font-weight: 900;">        
                                <!--  ${JSON_ResponseINFOOBJ[ITEM_JSONResponse]} -->                     
                                ${SEI_UOFValList[ITEM_JSONResponse][JSON_ResponseINFOOBJ[ITEM_JSONResponse]]} 
                                <!-- ${SEI_UOFValList[ITEM_JSONResponse]} -->
                            </div>

                        `;
                    } else {
                        HTML_DivInfoPart = `
                            <div class="MI-ItemValue" style="margin-right: 2vw"> 
                                <!-- ${JSON_ResponseINFOOBJ[ITEM_JSONResponse]} -->     
                                ${SEI_UOFValList[ITEM_JSONResponse][JSON_ResponseINFOOBJ[ITEM_JSONResponse]]}
                                <!-- ${SEI_UOFValList[ITEM_JSONResponse]} -->
                            </div>
                        `;
                    }

                    return HTML_DivInfoPart
                }

                let HTML_InfoPart = `
                    <div class="MI-Item" style="display: flex; align-items: center; justify-content: space-between;">
                        <div class="MI-ItemHeader"> ${SES_UOFNameList[ITEM_JSONResponse]} </div>
                            ${SES_UOFValUi()}
                    </div>
                `;

                MI_Content.html(MI_Content.html() + HTML_InfoPart);
            } else if (ITEM_JSONResponse in SES_UOFNameList && SYS_HTTPRequestCount === 1) {
                let HTML_InfoPartSwipeValue;

                function SYS_MMContentCheck() {
                    if (JSON_ResponseINFOOBJ[ITEM_JSONResponse] === 1) {
                        return "checked";
                    } else {
                        return "";
                    }
                }

                HTML_InfoPartSwipeValue = SYS_MMContentCheck();
                let HTML_InfoPart = `
                       <div class="MM-Item" style="display: flex; align-items: center; justify-content: space-between;">
                           <div class="MM-ItemHeader"> ${SES_UOFNameList[ITEM_JSONResponse]} </div>
                           <div class="form-check form-switch">
                               <input class="form-check-input MMI-${ITEM_JSONResponse}" style="height: 3vh; width: 10vw; margin-right: 2vw;" type="checkbox" role="switch" id="flexSwitchCheckDefault" ${HTML_InfoPartSwipeValue}>
                           </div>
                       </div>
                   `;
                MM_Content.html(MM_Content.html() + HTML_InfoPart);
            }
        }
    }
}

function SYS_MMContent(APP_CookieJson) {
    for (let ITEM_UOFNameList in SES_UOFNameList){
        if (ITEM_UOFNameList[0] === "m") {
            if (document.querySelector(`.MMI-${ITEM_UOFNameList}`).checked) {
                APP_CookieJson[ITEM_UOFNameList] = 1;
            } else {
                APP_CookieJson[ITEM_UOFNameList] = 0;
            }
        }
    }

    return APP_CookieJson;
}

function BM_Show() {
    if (!BMC_status) {
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

        BMC_status = 1
    }
}

function BM_Hide() {
    if (BMC_status) {
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

        BMC_status = 0
    }
}

HTTP_Request()
let SYS_IntervalId = setInterval(HTTP_Request, 2000);
