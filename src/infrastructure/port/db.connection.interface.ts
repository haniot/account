import { IDisposable } from './disposable.interface'
import { EventEmitter } from 'events'

export interface IDBConnection extends IDisposable {
    eventConnection: EventEmitter
    conn: any
    tryConnect(): void
}
