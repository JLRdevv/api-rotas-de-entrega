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

export interface historyFilters {
    limit?: number;
    offset?: number;
    date?: string[];
    pointsId?: string;
}

export interface HistoryRequest {
    userId: string;
    filters?: historyFilters;
}

export interface HistoryResponse {
    route: Route[];
}

// delete route
export interface DeleteRouteRequest {
<<<<<<< HEAD
=======
    userId: string;
>>>>>>> b41ea1c689d2bb8d829689d413cba67e9d723728
    routeId: string;
}

export interface DeleteRouteResponse {
    deleted: boolean;
}
