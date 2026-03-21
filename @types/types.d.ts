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

enum DistanceUnit {
    KM = "km",
    M = "m"
}

interface DistanceContents {
    distanceValue:number,
    unitValue:DistanceUnit
}

interface TimeContents {
    hour:number,
    minute:number,
    second:number
}