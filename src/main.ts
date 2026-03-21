/// <reference path="../node_modules/kakao.maps.d.ts/@types/index.d.ts" />
import type {KakaoRouteResponse} from "../@types/types"

// var
var mapContainer:HTMLElement;
var result:HTMLElement;
var routeCalcButton:HTMLElement;
var moneyCalcButton:HTMLElement;
var start:HTMLInputElement;
var end:HTMLInputElement;

var map:kakao.maps.Map;
var geocoder:kakao.maps.services.Geocoder;
var place:kakao.maps.services.Places;

var markers:Array<kakao.maps.Marker> = [];

// func and arrow func
async function getCost(start:string, end:string):Promise<void> {
    const response = await fetch(`https://time-x-distance-money.vercel.app/api/get-route?origin=${start}&destination=${end}`);
    const data = await response.json() as KakaoRouteResponse;

    const taxiFare = data.routes[0].summary.fare.taxi;
    const tollFare = data.routes[0].summary.fare.toll;

    result.innerText = `편도 택시비: ${taxiFare}원, 통행료: ${tollFare}원`;
}

async function getCoords(query:string):Promise<kakao.maps.LatLng> {
    try {
        return await getCoordsByKeyword(query);
    }
    catch {
        return await getCoordsByAddress(query);
    }
}

function getCoordsByAddress(address:string):Promise<kakao.maps.LatLng> {
    return new Promise((resolve, reject) => {
            geocoder.addressSearch(address, (result:any, status:any) => {
            if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                resolve(coords);
            }
            else {
                reject(new Error(`${address} 주소를 찾을 수 없습니다.`));
            }
        });
    });
}

function getCoordsByKeyword(keyword:string): Promise<kakao.maps.LatLng> {
    return new Promise((resolve, reject) => {
            place.keywordSearch(keyword, (data:any, status:any) => {
            if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(data[0].y, data[0].x);
                resolve(coords);
            }
            else {
                reject(new Error(`'${keyword}' 장소를 찾을 수 없습니다.`));
            }
        });
    });
}

function getCoordsForAPI(query:string):Promise<string> {
    return new Promise(async (resolve, reject) => {
        try {
            const coords = await getCoords(query);
            resolve(`${coords.getLng()},${coords.getLat()}`);
        }
        catch {
            reject();
        }
    });
}

async function calculateRoute(startValue:string = "", endValue:string = ""):Promise<void> {
    if(!startValue || !endValue) {
        alert("출발지와 목적지 모두 입력해주세요.");
        return;
    }

    try {
        console.log("주소를 좌표로 변환 중...");
        const startCoords = await getCoordsForAPI(startValue);
        const endCoords = await getCoordsForAPI(endValue);

        await getCost(startCoords, endCoords);
    }
    catch(error) {
        alert("주소를 찾는 데 실패했습니다. 다시 확인해주세요.");
    }
}

async function search(query:string) {
    try {
        const coords = await getCoords(query);

        if(markers.length > 0) {
            markers.pop();
        }

        console.log(`주소: ${query}`);
        console.log(`위도(y): ${coords.getLat()}, 경도(x): ${coords.getLng()}`);

        map.setCenter(coords);
        map.setLevel(3);

        const marker = new kakao.maps.Marker({
            map: map,
            position: coords
        });
        markers.push(marker);
    }
    catch {
        console.log(new Error(`없는 주소 검색: ${query}`));
    }
}

const handleEnter = (e:KeyboardEvent, nextAction:() => void) => {
    if (e.key === 'Enter') {
        nextAction();
    }
};

const initMap = () => {
    mapContainer = document.getElementById('map') as HTMLElement;
    if(!mapContainer) return;

    result = document.getElementById('result') as HTMLElement;

    var mapOption = { 
        center: new kakao.maps.LatLng(37.566826, 126.9786567),
        level: 3,
        keyboardShortcuts: {speed: 20}
    };

    map = new kakao.maps.Map(mapContainer, mapOption);
    geocoder = new kakao.maps.services.Geocoder();
    place = new kakao.maps.services.Places();
}
const initVar = () => {
    routeCalcButton = document.getElementById("route-calc") as HTMLElement;
    moneyCalcButton = document.getElementById("money-calc") as HTMLElement;
    start = document.getElementById("start") as HTMLInputElement;
    end = document.getElementById("end") as HTMLInputElement;

    start.addEventListener("keydown", (e) => handleEnter(e, () => {
        start.blur();
    }));
    start.addEventListener("blur", () => {
        search(start.value);
    });
    end.addEventListener("keydown", (e) => handleEnter(e, () => {
        end.blur();
    }));
    end.addEventListener("blur", () => {
        search(end.value);
    });

    routeCalcButton.addEventListener("click", () => {
        calculateRoute(start.value, end.value);
    });
    moneyCalcButton.addEventListener('click', () => {
        getCost(start.value, end.value)
    });
}

// onLoad
kakao.maps.load(() => {
    initMap();
});

window.onload = () => {
    initVar();
};
