import { Button, Form, Slider } from 'antd';
import React, { useEffect } from 'react';
import { sendToContentScript } from '@plasmohq/messaging';
import { Storage } from '@plasmohq/storage';

export interface Config {
  speed: number;
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
      const { speed } = values;
      const config = await storage.get<Config>('config');
      await storage.set('config', {...config, speed});
      await sendToContentScript({
        name: 'config update',
        body: speed.toString(),
      });
    })();
  };

  return (
    <div
      style={{
        width: '560px',
        height: '100px',
      }}
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        style={{ padding: 10 }}
        initialValues={{ remember: true }}
        autoComplete="off"
        onFinish={onSubmit}
      >
        <Form.Item label="阅读速度" name="speed">
          <Slider min={1} max={100} />
        </Form.Item>
        <Form.Item label="快捷键">
          x: 开始/停止自动阅读 w: 向上滑动 s: 向下滑动 (暂不支持更改)
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
