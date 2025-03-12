import { GUID } from "../utils/types";

export class ProgressModel {
    public id: GUID;
    public userId: GUID;
    public lessonId: GUID;
    public watchedAt: Date;
}