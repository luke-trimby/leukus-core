import { Log } from 'enhance-log';
import { Decision } from './decision';
import { StateTransition } from './state-transition';
import { State } from './state';
import { AbstractService } from '../abstract-service';

export class StateMachineService extends AbstractService {
  protected states: Map<string, State>;
  protected decisions: Map<string, Decision>;
  protected transitions: Map<string, StateTransition>;
  protected currentState: State;
  protected started: boolean;

  public init(): void {
    this.states = new Map();
    this.decisions = new Map();
    this.transitions = new Map();
    this.started = false;
  }

  public start(): void {
    if (!this.started) {
      Log.d(`[StateMachineService] Starting`,this.states);
      this.states.forEach((state: State) => {
        if (state.isInit) {
          Log.i(`[StateMachineService] init state = '${state.name}'`);
          this.enterState(state);
        }
      });
      if (!this.currentState) {
        Log.throw(`No init state found!`);
      }
      this.started = true;
    }
  }

  public getState(name: string): State {
    return this.states.get(name);
  }

  public complete(): void {
    this.currentState.onExit().then(
      () => {
        const transition: StateTransition = this.transitions.get(this.currentState.name);
        if (transition) {
          if (this.decisions.has(transition.to)) {
            this.resolveDecision(this.decisions.get(transition.to));
          } else if (this.states.has(transition.to)) {
            this.currentState = this.states.get(transition.to);
            Log.i(`[StateMachineService] '${transition.from}' -> '${transition.to}'`);
            this.currentState.onEnter();
          }
        } else {
          Log.e(`[StateMachineService] Couldn't find a transition from state:`, this.currentState.name);
        }
      }
    );
  }

  public addState(state: State): StateMachineService {
    Log.i(`[StateMachineService] Adding state`, state.name);
    this.states.set(state.name, state);
    return this;
  }

  public addDecision(decision: Decision): StateMachineService {
    Log.i(`[StateMachineService] Adding decision`, decision.name);
    this.decisions.set(decision.name, decision);
    return this;
  }

  public mapTransition(from: string, to: string): StateMachineService {
    Log.i(`[StateMachineService] Mapping transition '${from}' -> '${to}'`);
    this.transitions.set(from, new StateTransition(from, to));
    return this;
  }

  protected enterState(state: State): void {
    this.currentState = state;
    this.currentState.onEnter();
  }

  protected resolveDecision(decision: Decision): void {
    const nextName: string = decision.evaluate();
    Log.i(`[StateMachineService] Resolved decision '${decision.name}' -> '${nextName}'`);
    if (this.decisions.has(nextName)) {
      this.resolveDecision(this.decisions.get(nextName));
    } else if (this.states.has(nextName)) {
      this.enterState(this.states.get(nextName));
    }
  }
}
