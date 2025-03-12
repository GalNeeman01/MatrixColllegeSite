import { GUID } from "../utils/types";

export class LessonModel {
    public id: GUID;
    public courseId: GUID;
    public title: string;
    public videoUrl: string;
}