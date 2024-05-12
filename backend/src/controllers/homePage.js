export const home = (req, res) => {
  res.send(`
      <html>
          <head>
              <title>Redirecting...</title>
              <script>
                  setTimeout(function() {
                      window.location.href = "${process.env.FRONTEND_URL}";
                  }, 3000); 
              </script>
          </head>
          <body style="text-align: center; margin-top:30%;">
          <h1>Welcome to the Project Management API</h1>
              <p>you will be redirect to its appropriate frontend :${process.env.FRONTEND_URL}</p>
          </body>
      </html>
  `);
};
