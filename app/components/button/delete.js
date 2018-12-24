import React from 'react';
import { Button, Popconfirm, Tooltip } from 'antd';

export default ({ action, message, tip }) => {
  return (
    <Tooltip placement="top" title={tip} arrowPointAtCenter>
      <Popconfirm title={message} onConfirm={() => action()} okText="确认"
                  cancelText="取消">
        <Button type="danger" icon="delete" size='small' />
      </Popconfirm>
    </Tooltip>
  );
}
