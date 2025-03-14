import { CourseModel } from "../models/course.model";

export type GUID = string & { isGuid: true};

export type CourseProgress = {
    completed: number;
    total: number;
    lastWatched: Date;
}

export enum Roles {
    Student = "student",
    Professor = "professor"
}

export interface ProfileData {
    courses: CourseModel[],
    courseProgress: { [courseId: string]: CourseProgress }
}
