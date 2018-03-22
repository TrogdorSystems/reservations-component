const Html = ({ body, title }) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>${title}</title>
    </head>
    <body style="margin:0">
      <div id="app">${body}</div>
    </body>
    <script type="text/javascript" src="bundle.js"></script>
  </html>
`;

module.exports = Html;
