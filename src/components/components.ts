import {ClassType} from '../global/type/class-type';
import {AbstractComponent} from './abstract-component';

export class Components {
  public static init() {
    this.components.forEach(component => component.init());
  }

  public static register(component: AbstractComponent) {
    Components.components.push(component);
  }

  public static deregister<T extends AbstractComponent>(type: ClassType<T>) {
    const index = Components.components.findIndex(
      value => value instanceof type
    );
    if (index !== -1) {
      Components.components.splice(index, 1);
    }
  }

  public static get<T extends AbstractComponent>(type: ClassType<T>): T {
    return Components.components.find(value => value instanceof type) as T;
  }

  private static components: AbstractComponent[] = [];
}
