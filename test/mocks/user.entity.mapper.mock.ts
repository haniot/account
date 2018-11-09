import { IEntityMapper } from '../../src/infrastructure/entity/mapper/entity.mapper.interface'

export class UserEntityMapperMock implements IEntityMapper<any, any>{

    public transform(item: any): any{
        return item
    }

    jsonToModel(json: any): any {
        return undefined;
    }

    modelEntityToModel(item: any): any {
        return undefined;
    }

    modelToModelEntity(item: any): any {
        return undefined;
    }

}

