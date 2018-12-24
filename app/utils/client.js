const call = ({ endpoint, body = null, method }) => {
  const head = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body && JSON.stringify(body),
  };

  if (method === 'get') {
    delete head.body;
  }

  return fetch(`./api${endpoint}`, head).then(response =>
    response.json().then(json => {
      if (!response.ok) {
        return { error: json };
      }
      return json;
    })
  ).catch(error => {
    return { error };
  });
};

export const Delete = (endpoint, body) =>
  call({ endpoint, body, method: 'delete' });

export const Post = (endpoint, body) =>
  call({ endpoint, body, method: 'post' });

export const Put = (endpoint, body) => call({ endpoint, body, method: 'put' });

export const Get = endpoint => call({ endpoint, method: 'get' });
