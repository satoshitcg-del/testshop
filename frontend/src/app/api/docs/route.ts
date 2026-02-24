import { NextResponse } from "next/server";

export async function GET() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TestShop API Documentation</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui.min.css" />
  <style>
    body { margin: 0; padding: 0; }
    .topbar { display: none !important; }
    .swagger-ui .info { margin: 20px 0; }
    .swagger-ui .info .title { font-size: 28px; }
    .swagger-ui .scheme-container { margin: 20px 0; padding: 20px; }
    .swagger-ui .opblock { margin: 0 0 15px; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.10.3/swagger-ui-bundle.min.js"></script>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        url: 'https://raw.githubusercontent.com/satoshitcg-del/testshop/main/docs/api/openapi.yaml',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIBundle.presets.standalone
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "BaseLayout",
        validatorUrl: null,
        supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
        tryItOutEnabled: true
      });
    };
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
