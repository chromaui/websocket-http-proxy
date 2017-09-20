### Proof of Concept HTTP->WS proxy (in browser tunnel)

To use:

1. Run `npm install`

2. Run `npm start`

3. Add the following code snippet to an app of your choice:

```js
if (window.location.port !== '5005') {
  const ws = new WebSocket('ws://localhost:5006');
  ws.onmessage = async ({ data }) => {
    const { id, path, headers } = JSON.parse(data);
    const response = await fetch(path, { headers });
    const text = await response.text();

    const responseHeaders = {};
    for (const [name, value] of response.headers.entries()) {
       responseHeaders[name] = value;
    }
    ws.send(JSON.stringify({
      id,
      text,
      headers: responseHeaders,
    }));
  }
}
```

4. Start the app, up, check for "got socket" in the node console

5. Browse to http://localhost:5005
