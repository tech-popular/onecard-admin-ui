import { message, Button } from 'antd';

const info = () => {
  message.info('This is a normal message');
};

export default ({msg, type})=>{
  message[type](msg);
}
