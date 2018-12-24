import React from 'react';
import styled from 'styled-components';
import './circle.less';


const Circle = styled.span`
    width: 10px;
    height: 10px;
    display: inline-block;
    margin-top: 7px;
    border-radius: 50%;
`;

export default ({ enabled, ...props }) => {
  return <Circle {...props} className={enabled ? 'enabled' : 'disabled'} />;
}
