/// <reference path="../../node_modules/kakao.maps.d.ts/@types/index.d.ts" />
import type {KakaoRouteResponse} from "../../@types/types"

var mapContainer = document.getElementById('map') as HTMLElement;
var result = document.getElementById('result') as HTMLElement;

var mapOption = { 
    center: new kakao.maps.LatLng(37.566826, 126.9786567),
    level: 3 
};

var map = new kakao.maps.Map(mapContainer, mapOption);

function calculateRoute():any {     
    // 1. 입력된 주소를 좌표로 변환 (Geocoding)
    // 2. 카카오/네이버 '로컬/모빌리티 API'에 경로 데이터 요청
    // 3. 응답받은 좌표값들로 지도에 선(Polyline) 그리기
    // 4. 비용(fare) 데이터를 가져와 화면에 출력
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