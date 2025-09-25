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
    pointId?: number;
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
    userId: string;
    routeId: string;
}

export interface DeleteRouteResponse {
    deleted: boolean;
}

// single point
export interface SinglePoint {
    id: number;
    x: number;
    y: number;
}

// optimized route
export type OptimizedRouteResult = {
    optimizedRoute: (number | string)[];
    totalDistance: number;
};

export interface SaveHistory {
    pointsId: string;
    userId: string;
    optimizedRoute: number[];
    totalDistance: number;
}
