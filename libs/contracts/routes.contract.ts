export interface Route {
    _id: string;
    results: {
        optimizedRoute: number[];
        totalDistance: number;
    };
    // will turn to string when parsed
    date: string;
    pointsId: string;
}

// create route
export interface AddRouteRequest {
    userId: string;
    pointsId: string;
}

// create route with starting point
export interface AddRouteRequestWithStartPoint {
    userId: string;
    pointsId: string;
    pointId: number;
}

// Default response for both cases
export interface AddRouteResponse {
    route: Route;
}

// history
export interface HistoryRequest {
    userId: string;
    limit?: number;
    offset?: number;
    date?: string[];
    pointsId: string;
}

export interface HistoryResponse {
    route: Route[];
}

// delete route
export interface DeleteRouteRequest {
    routeId: string;
}

export interface DeleteRouteResponse {
    deleted: boolean;
}
