import {Log} from 'enhance-log';

namespace Leukus {
  export class Core {
    public init(): void {
      Log.i(`Lukas - INIT`);
    }
  }
}

new Leukus.Core().init();
