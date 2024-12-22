import { CommonResponse } from "./common";

export interface UserData {
  id: string;
  auth0_sub: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface GetUserResponse extends CommonResponse {
  user: UserData;
}
