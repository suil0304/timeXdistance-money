var mapContainer = document.getElementById('map'), 
mapOption = { 
    center: new kakao.maps.LatLng(37.566826, 126.9786567),
    level: 3 
};

var map = new kakao.maps.Map(mapContainer, mapOption);

function calculateRoute() {
    // 1. 입력된 주소를 좌표로 변환 (Geocoding)
    // 2. 카카오/네이버 '로컬/모빌리티 API'에 경로 데이터 요청
    // 3. 응답받은 좌표값들로 지도에 선(Polyline) 그리기
    // 4. 비용(fare) 데이터를 가져와 화면에 출력
}