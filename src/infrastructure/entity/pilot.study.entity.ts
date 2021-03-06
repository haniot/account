export class PilotStudyEntity {
    public id?: string
    public created_at?: string
    public name?: string
    public is_active?: boolean
    public start?: Date
    public end?: Date
    public health_professionals?: Array<any>
    public patients?: Array<any>
    public location?: string
    public data_types?: Array<string>
}
