import { useMessage } from '@plasmohq/messaging/hook';
import type { PlasmoCSConfig } from 'plasmo';
import { Storage } from '@plasmohq/storage';
import type { Config } from '~src/popup';

export const config: PlasmoCSConfig = {
  matches: ['https://weread.qq.com/*'],
};
const storage = new Storage();

const App = () => {
  useMessage<string, string>(async (req) => {
    (async () => {
      if (req.name === 'config update') {
        const config = await storage.get<Config>('config');
        speed = config.speed / 100;
        console.log(`Satellite: 更新自动阅读速度为每帧率移动${speed}像素`);
      }
    })();
    // else if (req.name === 'config init') {
    //   console.log(`Satellite: 检测到初次使用, 已使用默认配置`);
    // }
  });
};

export default App;

let speed = 0.5;
let startAutoReading = false;
let recordScroll: number;

function initScrollHeight() {
  let currentScroll =
    document.documentElement.scrollTop || document.body.scrollTop;
  recordScroll = currentScroll;
}

function addScrollTop(): void {
  recordScroll += speed;
  document.documentElement.scrollTop = recordScroll;
  if (startAutoReading) {
    window.requestAnimationFrame(addScrollTop);
  }
}
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    // 开启/关闭自动阅读
    case 'x':
      startAutoReading = !startAutoReading;
      if (startAutoReading) {
        console.log('Satellite: 开启自动阅读');
        initScrollHeight();
        window.requestAnimationFrame(addScrollTop);
      } else {
        console.log('Satellite: 关闭自动阅读');
      }
      break;
    // dispatchEvent 不生效, 所以只能手动模拟上滑和下滑
    case 'ArrowUp':
    case 'w':
      initScrollHeight();
      recordScroll -= 45;
      document.documentElement.scrollTop = recordScroll;
      break;
    case 'ArrowDown':
    case 's':
      initScrollHeight();
      recordScroll += 45;
      document.documentElement.scrollTop = recordScroll;
      break;
  }
});

window.addEventListener('load', () => {
  // #region 不支持就提示换浏览器, 不做兼容方案, 还用老掉牙浏览器的人, 不配使用我的插件
  if (!window.requestAnimationFrame) {
    console.error(
      'Satellite: 该浏览器暂不支持 requestAnimationFrame API, 请更换浏览器!',
    );
    return;
  }
  // #endregion

  (async () => {
    const config = await storage.get<Config>('config');
    speed = config.speed / 100;
  })();

  // #region 当承载章节名的容器内容变化时, 认为是翻页了, 需要重置滚轴高度
  const title = document.querySelector('.readerTopBar_title_chapter');
  if (title) {
    const documentObserver = new MutationObserver(function () {
      document.documentElement.scrollTop = 0;
      initScrollHeight();
    });
    documentObserver.observe(title, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    });
  } else {
    console.log('Satellite: 章节标题容器DOM已更换类名无法查找!');
  }
  // #endregion
});
