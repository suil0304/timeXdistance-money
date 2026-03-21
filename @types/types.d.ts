export interface KakaoRouteResponse {
    routes: {
        summary: {
            distance: number;
            duration: number;
            fare: {
                taxi: number;
                toll: number;
            };
        };
    }[];
}

interface DistanceContents {
    distanceValue:number,
    unitValue:"km" | "m"
}

interface TimeContents {
    hour:number,
    minute:number,
    second:number
}