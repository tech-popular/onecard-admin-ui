import React from 'react';
import Socket from 'utils/socket';
//
// const EmptySelector = () => {
//   return (<h1>请选择kafka配置</h1>);
// };

export default class KafkaViewInfo extends React.PureComponent {
  componentDidMount() {
    this.socket = new Socket();
    console.info('in view');
    // this.connect();
  }

  connect() {

    this.socket.register([
      {
        route: '/topic/consumer-', callback: (response) => {
          console.info(response.body);
        },
      },
    ]);

    //
    // const stompClient = Stomp.over(socket);
    // stompClient.connect({}, function (frame) {
    //   // setConnected(true);
    //   console.log('Connected:' + frame);
    //   stompClient.subscribe('/topic/say', function (response) {
    //     console.info(response)
    //   });
    // // 另外再注册一下定时任务接受
    // stompClient.subscribe('/topic/callback', function (response) {
    //   showCallback(response.body);
    // });
    // });
  }

  render() {
    return (
      <h1>kafka info</h1>
    );
  }
}
