import {AbstractService} from '../abstract-service';
import {Log} from 'enhance-log';
import {Assets, ResolverBundle, ResolverManifest} from 'pixi.js';
import {Signal} from 'signals';

export class PreloaderService extends AbstractService {
  public onLoadingStarted: Signal;
  public onLoadingProgress: Signal;
  public onStageLoaded: Signal;
  public onAllStagesLoaded: Signal;
  protected assetManifest: ResolverManifest;
  protected currentAssetBundle: ResolverBundle;
  protected totalBundles: number;

  public init(): void {
    Log.d(`[PreloaderService] Initialising`);
    this.onLoadingStarted = new Signal();
    this.onLoadingProgress = new Signal();
    this.onStageLoaded = new Signal();
    this.onAllStagesLoaded = new Signal();
    this.assetManifest = {
      bundles: [],
    };
  }

  public load(): void {
    Log.i(`[PreloaderService] Loading assets`, this.assetManifest);
    this.totalBundles = this.assetManifest.bundles.length;
    this.onLoadingStarted.dispatch();
    this.loadNextStage();
  }

  public addAssetBundle(...bundles: ResolverBundle[]): void {
    Log.i(`[PreloaderService] Adding loading stages`, ...bundles);
    bundles.forEach((bundle: ResolverBundle) =>
      this.assetManifest.bundles.push(bundle)
    );
  }

  protected async loadNextStage(): Promise<void> {
    Log.i(`[PreloaderService] Loading next bundle`);
    this.currentAssetBundle = this.assetManifest.bundles.shift();
    Assets.addBundle(
      this.currentAssetBundle.name,
      this.currentAssetBundle.assets
    );
    Assets.load(this.currentAssetBundle.name, (progress: number) =>
      this.onProgress(progress)
    ).then(() => this.onComplete());
  }

  protected onProgress(progress: number): void {
    Log.i(`[PreloaderService] onProgress`, progress);
    this.onLoadingProgress.dispatch(
      progress,
      this.totalBundles - this.assetManifest.bundles.length,
      this.totalBundles
    );
  }

  protected onComplete(): void {
    Log.i(`[PreloaderService] Loading phase complete`);
    this.onStageLoaded.dispatch(
      this.currentAssetBundle.name,
      this.totalBundles - this.assetManifest.bundles.length,
      this.totalBundles
    );
    if (this.assetManifest.bundles.length > 0) {
      this.loadNextStage();
    } else {
      Log.i(`[PreloaderService] All loading stages complete`, Assets.cache);
      this.onAllStagesLoaded.dispatch();
    }
  }
}
