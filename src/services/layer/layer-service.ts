import {AbstractService} from '../abstract-service';
import {CanvasService} from '../canvas/canvas-service';
import {Services} from '../services';
import {Log} from 'enhance-log';
import * as PIXI from 'pixi.js';

export class LayerService extends AbstractService {
  protected gameStage: PIXI.Container;
  protected layers: PIXI.Container[];

  public init(): void {
    Log.d(`[LayerService] Initialising`);
    this.layers = [];
    this.gameStage = Services.get(CanvasService).stage;
  }

  public registerLayers(...layerConfigs: {name: string}[]): void {
    layerConfigs.forEach((config: {name: string}) => {
      const layer: PIXI.Container = new PIXI.Container();
      layer.name = config.name;
      Log.i(`[LayerService] Adding layer`, config.name);
      this.layers.push(layer);
      this.gameStage.addChild(layer);
    });
  }

  public hasLayer(name: string): boolean {
    return (
      this.layers.findIndex((layer: PIXI.Container) => layer.name === name) > -1
    );
  }

  public getLayer(name: string): PIXI.Container {
    return this.layers.find((layer: PIXI.Container) => layer.name === name);
  }
}
