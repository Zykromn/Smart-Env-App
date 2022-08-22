// Consts and vars
let BMM_IconClose = $('.BMM-BurgerMenuClose');
let BMH_IconClose = $('.BMH-BurgerMenuClose');
let BM_Icon = $('.Header-BurgerMenuIcon');
let MD_Content = $(".MD-Content");
let APP_SwipeStart = 0;
let APP_SwipeEnd = 0;

const SE_UOFIdList = {
    "0000": "cm.",
    "0001": "%",
    "0002": "C.",
    "0003": "True"
}



// Interface
$('body').on('touchstart', function (event) {
    APP_SwipeStart = event.originalEvent.touches[0].pageX;
})
$('body').on('touchend', function (event) {
    APP_SwipeEnd = event.originalEvent.changedTouches[0].pageX;
    if (APP_SwipeEnd - APP_SwipeStart >= 100) {
        BM_Show();
    } else if (APP_SwipeStart - APP_SwipeEnd >= 100) {
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
        APP_CookieJson["type"] = "getinfo";

        let xhr = new XMLHttpRequest();
        xhr.open('GET', `http://192.168.0.138:1337/${encodeURIComponent(JSON.stringify(APP_CookieJson))}`, true);
        xhr.withCredentials = false;
        xhr.send();

        xhr.onload = () => {
            HTTP_Working(decodeURIComponent(xhr.responseText));
        };

        xhr.onerror = () => {
            window.location.href = './server-error.html';
        };
    } else {
        window.location.href = './registration.html';
    }
}

function HTTP_Working(HTTP_Response) {
    let JSON_ResponseINFOOBJ = JSON.parse(HTTP_Response);
    if (HTTP_Response === "0" && HTTP_Response === "-1") {
        window.location.href = './server-error.html';
    } else {
        MD_Content.html("");

        for (let ITEM_JSONResponse in JSON_ResponseINFOOBJ) {
            let HTML_InfoPart = `
                <div class="MD-Item">
                    <img src= "./images/System_${ITEM_JSONResponse}.png">
                    ${JSON_ResponseINFOOBJ[ITEM_JSONResponse]} ${SE_UOFIdList[ITEM_JSONResponse]}
                </div>
            `;
            MD_Content.html(MD_Content.html() + HTML_InfoPart);
        }
    }
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
let ITVL_Id = setInterval(HTTP_Request, 2000);
