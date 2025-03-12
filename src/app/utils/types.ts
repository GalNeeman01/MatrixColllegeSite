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