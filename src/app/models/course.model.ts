import {GUID} from "../utils/types";

export class CourseModel {
    public id: GUID;
    public title: string;
    public description: string;
    public createdAt: Date;
}