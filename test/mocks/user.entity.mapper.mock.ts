import { IEntityMapper } from '../../src/infrastructure/entity/mapper/entity.mapper.interface'

export class UserEntityMapperMock implements IEntityMapper<any, any> {

    public transform(item: any): any {
        return item
    }

    public jsonToModel(json: any): any {
        return json
    }

    public modelEntityToModel(item: any): any {
        return item
    }

    public modelToModelEntity(item: any): any {
        return item
    }
}