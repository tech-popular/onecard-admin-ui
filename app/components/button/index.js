import React from 'react';
import { Button, Tooltip } from 'antd';

export default ({ tip, ...btn }) => {
  return (
    <Tooltip placement="top" title={tip} arrowPointAtCenter>
      <Button {...btn} />
    </Tooltip>
  );
}
