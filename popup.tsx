import { Button, Form, Slider } from 'antd';
import React, { useState } from 'react';
import { sendToContentScript } from '@plasmohq/messaging';

function IndexPopup() {
  const [speed, setSpeed] = useState(50);

  const onSpeedChange = (value: number) => setSpeed(value);
  const applyConfig = async () => {
    console.log('apply');
    // https://github.com/PlasmoHQ/plasmo/issues/583

    const csResponse = await sendToContentScript({
      name: 'speed',
      body: speed.toString(),
      // body: speed.toString(),
    });

    console.log(csResponse);
  };

  return (
    <div
      style={{
        width: '560px',
        height: '400px',
      }}
    >
      {/* <Slider defaultValue={30} /> */}
      <Form
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        style={{ padding: 10 }}
        initialValues={{ remember: true }}
        autoComplete="off"
      >
        <Form.Item label="阅读速度" name="username">
          <Slider
            defaultValue={50}
            min={1}
            max={100}
            onChange={onSpeedChange}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 10, span: 2 }}>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => applyConfig().then()}
          >
            应用
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default IndexPopup;
