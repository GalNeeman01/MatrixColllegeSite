import { GUID } from "../utils/types";

export class UserModel {
    public id: GUID;
    public name: string;
    public email: string;
    public role: string;
}