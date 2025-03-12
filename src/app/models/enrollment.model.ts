import { GUID } from "../utils/types";

export class EnrollmentModel {
    public id: GUID;
    public userId: GUID;
    public courseId: GUID;
    public enrolledAt: Date;
}