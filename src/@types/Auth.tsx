export interface Auth {
    name: string;
    email: string;
    password: string;
    team:string;
}

export interface SignupPayload {
    user: {
        name: string;
        email: string;
        password: string;
        team: string;
        position: string;
        owner: boolean;
        icon: boolean;
        is_alumni: boolean;
        is_active: boolean;
    };
    player: {
        player_name: string;
        position: string;
        team_id: string | null;
    };
}

export interface AdminAuth {
    name: string;
    email: string;
    password: string;
    team:string;
}

export interface AuthResponse{
    message: string;
  user: {
    name: string;
    email: string;
  };
}

export interface AdminAuthResponse{
    message: string;
  user: {
    name: string;
    email: string;
  };
}

export interface AuthSignin {
    email: string;
    password: string;
    
}

export interface AdminAuthSignin {
    email: string;
    password: string;
    
}

export interface AuthResponseSignin{
    message: string;
  user: {
    name: string;
    email: string;
  };
}