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
var markers:kakao.maps.Marker[] = [];

// constant
var geocoder:kakao.maps.services.Geocoder;

// func and arrow func
async function getCost(start:string, end:string):Promise<void> {
    const response = await fetch(`https://time-x-distance-money.vercel.app/api/get-route?origin=${start}&destination=${end}`);
    const data = await response.json() as KakaoRouteResponse;

    const taxiFare = data.routes[0].summary.fare.taxi;
    const tollFare = data.routes[0].summary.fare.toll;

    result.innerText = `편도 택시비: ${taxiFare}원, 통행료: ${tollFare}원`;
}

function getCoordsByAddress(address: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, (result: any, status: any) => {
            if(status === kakao.maps.services.Status.OK) {
                // Vercel API 형식에 맞게 "경도,위도" 문자열 반환
                resolve(`${result[0].x},${result[0].y}`);
            }
            else {
                reject();
            }
        });
    });
}

async function calculateRoute(startValue:string = "", endValue:string | null = ""):Promise<void | undefined> {
    if(!startValue || !endValue) {
        alert("출발지와 목적지 모두 입력해주세요.");
        return;
    }

    try {
        console.log("주소를 좌표로 변환 중...");
        const startCoords = await getCoordsByAddress(startValue);
        const endCoords = await getCoordsByAddress(endValue);

        await getCost(startCoords, endCoords);
    }
    catch(error) {
        alert("주소를 찾는 데 실패했습니다. 다시 확인해주세요.");
    }
}

function addressSearch(address:string, failCallback:() => void = () => {}) {
    geocoder.addressSearch(address, (result:any, status:any) => {
        if(status === kakao.maps.services.Status.OK) {
            if(markers.length > 0) {
                markers.pop();
            }
            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
            
            console.log(`주소: ${address}`);
            console.log(`위도(y): ${result[0].y}, 경도(x): ${result[0].x}`);

            map.setCenter(coords);

            const marker = new kakao.maps.Marker({
                map: map,
                position: coords
            });
            markers.push(marker);
        }
        else {
            failCallback();
        }
    });
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
        level: 3 
    };

    map = new kakao.maps.Map(mapContainer, mapOption);
    geocoder = new kakao.maps.services.Geocoder();
}
const initVar = () => {
    routeCalcButton = document.getElementById("route-calc") as HTMLElement;
    moneyCalcButton = document.getElementById("money-calc") as HTMLElement;
    start = document.getElementById("start") as HTMLInputElement;
    end = document.getElementById("end") as HTMLInputElement;

    routeCalcButton.addEventListener("click", () => {
        calculateRoute(start.value, end.value);
    });

    start.addEventListener("keydown", (e) => {
        handleEnter(e, () => addressSearch(start.value));
    });
    start.addEventListener("blur", () => {
        addressSearch(start.value);
    });
    end.addEventListener("keydown", (e) => {
        handleEnter(e, () => addressSearch(end.value));
    });
    end.addEventListener("blur", () => {
        addressSearch(end.value);
    });
    routeCalcButton.addEventListener('click', () => calculateRoute());
    moneyCalcButton.addEventListener('click', () => getCost(start.value, end.value));
}

// onLoad
kakao.maps.load(() => {
    initMap();
});

window.onload = () => {
    initVar();
};
