/// <reference path="../node_modules/kakao.maps.d.ts/@types/index.d.ts" />
import type {KakaoRouteResponse} from "../@types/types"

var mapContainer:HTMLElement;
var result:HTMLElement;
var routeCalcButton:HTMLElement;
var moneyCalcButton:HTMLElement;

function calculateRoute():any {
         
}

async function getCost():Promise<void> {
    const origin = "127.1,37.5";
    const destination = "127.2,37.6";
    
    const response = await fetch(`https://time-x-distance-money.vercel.app/api/get-route?origin=${origin}&destination=${destination}`);
    const data = await response.json() as KakaoRouteResponse;

    const taxiFare = data.routes[0].summary.fare.taxi;
    const tollFare = data.routes[0].summary.fare.toll;


    result.innerText = `편도 택시비: ${taxiFare}원, 통행료: ${tollFare}원`;
}

const initMap = () => {
    mapContainer = document.getElementById('map') as HTMLElement;
    if(!mapContainer) return;

    result = document.getElementById('result') as HTMLElement;

    var mapOption = { 
        center: new kakao.maps.LatLng(37.566826, 126.9786567),
        level: 3 
    };

    new kakao.maps.Map(mapContainer, mapOption);
}
const initVar = () => {
    routeCalcButton = document.getElementById("route-calc") as HTMLElement;
    moneyCalcButton = document.getElementById("money-calc") as HTMLElement;

    routeCalcButton.addEventListener("click", calculateRoute);
    moneyCalcButton.addEventListener("click", getCost);
}



window.onload = () => {
    initMap();
    initVar();
};
