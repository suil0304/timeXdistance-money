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