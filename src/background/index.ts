import { Storage } from '@plasmohq/storage';
import type { Config } from '~src/popup';

export {};
(async () => {
  const storage = new Storage();

  // await storage.clear();
  const config = await storage.get<Config>('config') || {} as Config;
  const defaultConfig = {
    speed: 20,
    notifyTime: 2000,
  };
  // 为防止后续用户已经安装了插件, 而我又更新了新的默认配置, 所以逐条赋值
  config.speed = config.speed || defaultConfig.speed;
  config.notifyTime = config.notifyTime || defaultConfig.notifyTime;
  if (!config) {
    await storage.set('config', defaultConfig);
  }
})();
