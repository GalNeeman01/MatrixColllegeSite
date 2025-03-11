export type GUID = string & { isGuid: true};

export type CourseProgress = {
    completed: number;
    total: number;
    lastWatched: Date;
}