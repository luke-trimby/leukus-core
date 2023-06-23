export abstract class AbstractCoreSetup {
  public abstract registerServices(): void;
  public abstract registerLayers(): void;
  public abstract registerComponents(): void;
  public abstract registerAssets(): void;
  public abstract registerAudio(): void;
  public abstract registerStates(): void;
  public abstract registerDebug(): void;
}
