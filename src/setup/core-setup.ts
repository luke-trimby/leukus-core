import { Components } from '../components/components';
import { ICanvasConfig } from '../global/interface/canvas-config';
import { Size } from '../global/size';
import { AssetService } from '../services/asset/asset-service';
import { CanvasService } from '../services/canvas/canvas-service';
import { LayerService } from '../services/layer/layer-service';
import { PreloaderService } from '../services/preloader/preloader-service';
import { Services } from '../services/services';
import { StateMachineService } from '../services/state/state-machine-service';
import { AbstractCoreSetup } from './abstract-core-setup';

export class CoreSetup extends AbstractCoreSetup {

  protected canvasOptions: ICanvasConfig;

  constructor(canvasOptions: ICanvasConfig = {
    size: new Size(920, 540),
    canvasColor: 0x000000,
    centered: true,
    canvasTargetId: 'canvas-layer-container',
    htmlTargetId: 'html-layer-container'
  }) {
    super();
    this.canvasOptions = canvasOptions;
  }
  
  public registerServices(): void {    
    Services.register(new CanvasService(this.canvasOptions));
    Services.register(new AssetService());
    Services.register(new PreloaderService());
    Services.register(new LayerService());
    Services.register(new StateMachineService());
  }

  public registerLayers(): void {
    Services.get(LayerService).registerLayers(
      { name: 'preloader-layer' }
    );
  }

  public registerComponents(): void {
    // throw new Error('Method not implemented.');
  }

  public registerAssets(): void {
    Services.get(PreloaderService).addAssetBundle(
      {
        name: 'Core_Preloader',
        assets: [
          { name: 'logo', srcs: './assets/static/logo.png' }
        ]
      }
    );
  }

  public registerAudio(): void {
    // .. override this
  }

  public registerStates(): void {
    // .. override this
  }

  public registerDebug(): void {
    (window as any).Services = Services;
    (window as any).Components = Components;
  }
}