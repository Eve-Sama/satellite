import { useMessage } from '@plasmohq/messaging/hook';
import type { PlasmoCSConfig } from 'plasmo';

export const config: PlasmoCSConfig = {
  matches: ['https://weread.qq.com/*'],
};

const GetSpeedListener = () => {
  useMessage<string, string>(async (req) => {
    speed = parseInt(req.body) / 100;
  });
};

export default GetSpeedListener;

let speed = 0.5;
let startAutoScroll = false;
let recordScroll: number;

function initScrollHeight() {
  let currentScroll = document.documentElement.scrollTop || document.body.scrollTop;
  recordScroll = currentScroll;
}

function addScrollTop(): void {
  recordScroll += speed;
  document.documentElement.scrollTop = recordScroll;
  if (startAutoScroll) {
    window.requestAnimationFrame(addScrollTop);
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key === 's') {
    startAutoScroll = !startAutoScroll;
    if (startAutoScroll) {
      console.log('Satellite: 开启自动阅读');
      initScrollHeight();
      window.requestAnimationFrame(addScrollTop);
    } else {
      console.log('Satellite: 关闭自动阅读');
    }
  }
});

window.addEventListener('load', () => {
  const styles = ['color:green', 'background:yellow', 'font-size:20px', 'border:1px solid red', 'text-shadow:1px 1px black', 'padding:10px'].join(';');

  console.log('%c%s', styles, '当前页面可使用 Satellite 进行辅助操作');
  if (!window.requestAnimationFrame) {
    console.error('Satellite: 该浏览器暂不支持 requestAnimationFrame API, 请更换浏览器!');
    return;
  }
});
