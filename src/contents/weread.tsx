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
    // dispatchEvent 不生效, 所以只能手动模拟
    case 'w':
      initScrollHeight();
      recordScroll -= 45;
      document.documentElement.scrollTop = recordScroll;
      break;
    case 's':
      initScrollHeight();
      recordScroll += 45;
      document.documentElement.scrollTop = recordScroll;
      break;
  }
});

window.addEventListener('load', () => {
  const styles = [
    'color:green',
    'background:yellow',
    'font-size:20px',
    'border:1px solid red',
    'text-shadow:1px 1px black',
    'padding:10px',
  ].join(';');

  console.log('%c%s', styles, '当前页面可使用 Satellite 进行辅助操作');
  if (!window.requestAnimationFrame) {
    console.error(
      'Satellite: 该浏览器暂不支持 requestAnimationFrame API, 请更换浏览器!',
    );
    return;
  }
});
