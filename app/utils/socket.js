import React from 'react';
import Stomp from 'stomp-websocket';
import SockJS from 'sockjs-client';

export default function() {
  const connect = () => {
    const socket = SockJS('http://localhost:8080/ws');
    return Stomp.over(socket);
  };

  const register = (registrations) => {
    const stompClient = connect();
    stompClient.connect({}, function(frame) {
      registrations.forEach(function(registration) {
        stompClient.subscribe(registration.route, registration.callback);
      });
    });
  };

  return { register };
};
