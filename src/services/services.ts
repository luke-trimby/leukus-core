import {ClassType} from '../global/type/class-type';
import {AbstractService} from './abstract-service';

export class Services {
  public static init() {
    this.services.forEach(service => service.init());
  }

  public static register(service: AbstractService) {
    Services.services.push(service);
  }

  public static deregister<T extends AbstractService>(type: ClassType<T>) {
    const index = Services.services.findIndex(value => value instanceof type);
    if (index !== -1) {
      Services.services.splice(index, 1);
    }
  }

  public static get<T extends AbstractService>(type: ClassType<T>): T {
    return Services.services.find(value => value instanceof type) as T;
  }

  private static services: AbstractService[] = [];
}
