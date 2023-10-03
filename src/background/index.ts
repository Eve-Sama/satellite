import { Storage } from '@plasmohq/storage';
import type { Config } from '~src/popup';

export {};
(async () => {
  const storage = new Storage();

  // await storage.clear();
  const config = await storage.get<Config>('config');
  
  if (!config) {
    const defaultConfig = {
      speed: 20,
    };
    await storage.set('config', defaultConfig);
  }
})();
