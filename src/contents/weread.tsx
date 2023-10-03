import { useMessage } from '@plasmohq/messaging/hook';
import type { PlasmoCSConfig } from 'plasmo';
import { Storage } from '@plasmohq/storage';
import type { Config } from '~src/popup';
import { useEffect, useState } from 'react';

export const config: PlasmoCSConfig = {
  matches: ['https://weread.qq.com/*'],
};
const storage = new Storage();
let localConfig: Config;
let _setText: React.Dispatch<React.SetStateAction<string>>;
let timer: NodeJS.Timeout;

(async () => {
  localConfig = await storage.get<Config>('config');
})();

/** 在页面上显示文本, 2秒后自动消失 */
function notify(text: string): void {
  clearTimeout(timer);
  _setText(text);
  timer = setTimeout(() => _setText(undefined), localConfig.notifyTime);
}

const App = () => {
  const [text, setText] = useState(undefined);
  _setText = setText;

  useEffect(() => {
    notify('欢迎使用');
  }, []);

  useMessage<string, string>(async (req) => {
    (async () => {
      if (req.name === 'config update') {
        localConfig = await storage.get<Config>('config');
        speed = localConfig.speed / 100;
        notify(`当前速度:${speed}像素`);
      }
    })();
  });

  const renderDom = () => {
    if (text) {
      return (
        <div
          style={{
            padding: '10px',
            left: '0',
            top: '0',
            // left: '50%',
            // top: '50%',
            // transform: 'translate(-50%, -50%)' /* 50%为自身尺寸的一半 */,
            color: '#fff',
            fontSize: '30px',
            position: 'fixed',
            textShadow: '1px 1px black',
          }}
        >
          <span>Satellite:</span>
          <br />
          <span>{text}</span>
        </div>
      );
    } else {
      return null;
    }
  };

  return <>{renderDom()}</>;
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
        notify('开启自动阅读');
        initScrollHeight();
        window.requestAnimationFrame(addScrollTop);
      } else {
        notify('关闭自动阅读');
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
    notify(
      '该浏览器暂不支持 requestAnimationFrame API, 请更换浏览器!',
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
    notify('章节标题容器DOM已更换类名无法查找!');
  }
  // #endregion
});
