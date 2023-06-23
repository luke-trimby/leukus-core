import {Services} from '../services';
import {StateMachineService} from './state-machine-service';

export class State {
  protected stateName: string;
  protected stateIsInit: boolean;

  constructor(name: string, isInit = false) {
    this.stateName = name;
    this.stateIsInit = isInit;
  }

  public get name(): string {
    return this.stateName;
  }

  public get isInit(): boolean {
    return this.stateIsInit;
  }

  public onEnter(): Promise<unknown> {
    return new Promise((resolve: (reason?: unknown) => void) => resolve());
  }

  public onExit(): Promise<unknown> {
    return new Promise((resolve: (reason?: unknown) => void) => resolve());
  }

  protected complete(): void {
    const stateMachineService: StateMachineService =
      Services.get(StateMachineService);
    stateMachineService.complete();
  }
}
