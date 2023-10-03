import { Button, Form, InputNumber, Slider } from 'antd';
import React, { useEffect } from 'react';
import { sendToContentScript } from '@plasmohq/messaging';
import { Storage } from '@plasmohq/storage';

export interface Config {
  /** 自动阅读的速度 */
  speed: number;
  /** 屏幕通知的停留时间 */
  notifyTime: number;
}

function App() {
  const [form] = Form.useForm<Config>();
  const storage = new Storage();

  useEffect(function initForm() {
    (async () => {
      const config = await storage.get<Config>('config');
      form.setFieldsValue(config);
    })();
  }, []);

  const onSubmit = (values: Config) => {
    (async () => {
      const { speed, notifyTime } = values;
      const config = await storage.get<Config>('config');
      await storage.set('config', { ...config, speed, notifyTime });
      await sendToContentScript({
        name: 'config update',
      });
    })();
  };

  return (
    <div
      style={{
        width: '560px',
        height: '220px',
      }}
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        initialValues={{ remember: true }}
        autoComplete="off"
        onFinish={onSubmit}
      >
        <Form.Item label="阅读速度" name="speed">
          <Slider min={1} max={100} />
        </Form.Item>
        <Form.Item label="快捷键">
          x: 开始/停止自动阅读 w/s: 上下滑动 a/d:调整阅读速度
        </Form.Item>
        <Form.Item label="提示停留时间" name="notifyTime">
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 10, span: 2 }}>
          <Button type="primary" htmlType="submit">
            应用
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default App;
