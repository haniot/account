import { IEventBus } from '../../../src/infrastructure/port/event.bus.interface'
import { IDisposable } from '../../../src/infrastructure/port/disposable.interface'
import { IQuery } from '../../../src/application/port/query.interface'
import { IIntegrationEventHandler } from '../../../src/application/integration-event/handler/integration.event.handler.interface'
import { IntegrationEvent } from '../../../src/application/integration-event/event/integration.event'
import { IConnectionEventBus } from '../../../src/infrastructure/port/connection.event.bus.interface'

export class EventBusRabbitMQMock implements IEventBus, IDisposable {
    public connectionPub: IConnectionEventBus = undefined!
    public connectionRpcClient: IConnectionEventBus = undefined!
    public connectionRpcServer: IConnectionEventBus = undefined!
    public connectionSub: IConnectionEventBus = undefined!

    public dispose(): Promise<void> {
        return Promise.resolve()
    }

    public enableLogger(): void {
        return
    }

    public executeResource(resourceName: string, query?: string | IQuery): Promise<any> {
        return Promise.resolve({})
    }

    public provideResource(name: string, listener: (...any) => any): Promise<boolean> {
        return Promise.resolve(true)
    }

    public publish(event: IntegrationEvent<any>, routingKey: string): Promise<boolean> {
        return Promise.resolve(true)
    }

    public subscribe(
        event: IntegrationEvent<any>,
        handler: IIntegrationEventHandler<IntegrationEvent<any>>,
        routingKey: string): Promise<boolean> {
        return Promise.resolve(true)
    }

}
