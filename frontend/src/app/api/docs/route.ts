import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  // Try multiple paths for different environments
  const possiblePaths = [
    join(process.cwd(), "docs", "api", "openapi.yaml"),           // Root level
    join(process.cwd(), "..", "docs", "api", "openapi.yaml"),     // From frontend/
    join(process.cwd(), "..", "..", "docs", "api", "openapi.yaml"), // From frontend/src/app/api
    "/opt/render/project/src/docs/api/openapi.yaml",                // Render specific
  ];
  
  let yamlContent: string | null = null;
  
  for (const yamlPath of possiblePaths) {
    try {
      yamlContent = readFileSync(yamlPath, "utf-8");
      break;
    } catch {
      continue;
    }
  }
  
  if (!yamlContent) {
    return NextResponse.json(
      { success: false, error: "OpenAPI spec not found" },
      { status: 500 }
    );
  }
  
  try {
    
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
  <script src="https://cdnjs.cloudflare.com/ajax/libs/js-yaml/4.1.0/js-yaml.min.js"></script>
  <script>
    const spec = ${JSON.stringify(yamlContent)};
    
    window.onload = function() {
      const parsedSpec = jsyaml.load(spec);
      
      SwaggerUIBundle({
        spec: parsedSpec,
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
  } catch (error) {
    console.error("Failed to load OpenAPI spec:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load API documentation" },
      { status: 500 }
    );
  }
}
