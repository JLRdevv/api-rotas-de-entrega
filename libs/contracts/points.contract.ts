// Single point
export interface Point {
    id: number;
    x: number;
    y: number;
}

// Points response with id
export interface Points {
    _id: string;
    points: Point[];
}

// add points
export interface AddPointsRequest {
    userId: string;
    points: Point[];
}

export interface AddPointsResponse {
    _id: string;
    points: Point[];
}

// patch points
export interface PatchPointsRequest {
    userId: string;
    pointsId: string;
    points: Point[];
}

export interface PatchPointsResponse {
    pointsId: string;
    points: Point[];
}

// get all points from user
export interface GetPointsRequest {
    userId: string;
}

export interface GetPointsResponse {
    userPoints: Points[];
}

// get specific point/delete specific point from user
export interface FindPointRequest {
    userId: string;
    pointId: string;
}

// Response for specific point
export interface FindPointResponse {
    point: AddPointsResponse;
}

// Response for deleted points
export interface DeletePointsResponse {
    deleted: boolean;
}

// Delete specific point from points
export interface DeletePointRequest {
    userId: string;
    pointsId: string;
    pointId: number;
}

export interface DeletePointResponse {
    pointsId: string;
    points: Point[];
}
