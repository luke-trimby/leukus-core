import * as PIXI from 'pixi.js';
import {Log} from 'enhance-log';
import {Size} from '../../global/size';
import {AbstractService} from '../abstract-service';
import {ICanvasConfig} from '../../global/interface/canvas-config';

export class CanvasService extends AbstractService {
  private pixiApplication: PIXI.Application<HTMLCanvasElement>;
  private canvasOptions: ICanvasConfig;
  private canvasContainer: HTMLDivElement;
  private ratio: number;
  private size: Size;
  private scale: Size;
  private htmlLayerContainerDiv: HTMLDivElement;

  constructor(canvasOptions: ICanvasConfig) {
    super();
    this.canvasOptions = canvasOptions;
  }

  public init(): void {
    Log.d(`[CanvasService] Initialising with options`, this.canvasOptions);
    this.size = this.canvasOptions.size;
    this.ratio = this.size.width / this.size.height;
    this.htmlLayerContainerDiv = document.getElementById(
      this.canvasOptions.htmlTargetId
    ) as HTMLDivElement;

    const pixiOptions: Partial<PIXI.IApplicationOptions> = {
      width: this.canvasOptions.size.width,
      height: this.canvasOptions.size.height,
      backgroundColor: this.canvasOptions.canvasColor,
    };
    this.pixiApplication = new PIXI.Application(pixiOptions);

    this.injectCanvas();
  }

  public get stage(): PIXI.Container {
    return this.pixiApplication.stage;
  }

  public get renderer(): PIXI.IRenderer<PIXI.ICanvas> {
    return this.pixiApplication.renderer;
  }

  public registerForUpdates(
    updateFunc: (...params: unknown[]) => unknown,
    context: unknown,
    priority?: PIXI.UPDATE_PRIORITY
  ): void {
    if (this.pixiApplication.ticker?.started) {
      this.pixiApplication.ticker.add(updateFunc, context, priority);
    }
  }

  public deRegisterFromUpdates(
    updateFunc: (...params: unknown[]) => unknown,
    context: unknown
  ): void {
    if (this.pixiApplication.ticker?.started) {
      this.pixiApplication.ticker.remove(updateFunc, context);
    }
  }

  private injectCanvas(win: Window = window) {
    this.canvasContainer = document.getElementById(
      this.canvasOptions.canvasTargetId
    ) as HTMLDivElement;
    if (this.canvasContainer) {
      this.canvasContainer.appendChild(this.pixiApplication.view);

      win.addEventListener('resize', () => this.windowResize(win));
      this.windowResize(win);
    }
  }

  private getBestCanvasSizeForWindow(currentWindow: Window): Size {
    let w: number;
    let h: number;
    if (currentWindow.innerWidth / window.innerHeight >= this.ratio) {
      w = currentWindow.innerHeight * this.ratio;
      h = currentWindow.innerHeight;
    } else {
      w = currentWindow.innerWidth;
      h = currentWindow.innerWidth / this.ratio;
    }
    return new Size(w, h);
  }

  private windowResize(currentWindow: Window) {
    const size: Size = this.getBestCanvasSizeForWindow(currentWindow);
    this.pixiApplication.renderer.view.style.height = size.height + 'px';
    this.pixiApplication.renderer.view.style.width = size.width + 'px';
    if (this.canvasOptions.centered) {
      this.pixiApplication.renderer.view.style.marginLeft =
        (currentWindow.innerWidth - size.width) / 2 + 'px';
    }
    this.scale = new Size(
      size.width / this.size.width,
      size.height / this.size.height
    );
    this.htmlLayerContainerDiv.style.width = this.size.width + 'px';
    this.htmlLayerContainerDiv.style.height = this.size.height + 'px';
    this.htmlLayerContainerDiv.style.transform =
      'scale(' + this.scale.width + ', ' + this.scale.height + ')';
    this.htmlLayerContainerDiv.style.transformOrigin = 'center top';
    this.htmlLayerContainerDiv.style.left =
      (currentWindow.innerWidth - this.size.width) / 2 + 'px';
  }
}
