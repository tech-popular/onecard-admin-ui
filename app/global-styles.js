import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    font-family: 微软雅黑, Ubuntu, Arial, Helvetica, sans-serif;
    white-space: normal;
    height: 100%;
    width: 100%;
  }
  body .ant-message i.anticon {
    position: relative;
    top: -3px;  
  }

  #app .logo{
    line-height: 32px;
    text-align: center;
    height: 32px;
    background: rgba(255,255,255,.2);
    margin: 16px;
  }
  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  i {
    position: relative;
    top: -2px;
  }
  
  .flex {
    display: flex;
    align-items: center;
  }
`;

export default GlobalStyle;
