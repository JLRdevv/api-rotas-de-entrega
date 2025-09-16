export interface AuthRequest {
    email: string,
    password: string
} 


// If an error happens return
// error: true
// message: "descriptive message"
export interface AuthResponse {
    token?: string,
    error?: boolean,
    message?: string,
}