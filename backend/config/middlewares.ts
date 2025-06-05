export default ({ env }) => {
  // Read CORS_HOSTS environment variable and prepare the origins array
  const corsHosts = env('CORS_HOSTS', ''); // Default to empty string if not set
  let allowedOrigins: string[] = ['http://localhost:3000', 'http://127.0.0.1:3000']; // Default origins

  if (corsHosts) {
    allowedOrigins = corsHosts.split(',').map(host => host.trim()).filter(host => host);
  } else {
    // Log if CORS_HOSTS is not set and defaults are being used, can be helpful for debugging
    console.log('CORS_HOSTS environment variable not set. Using default origins:', allowedOrigins);
  }

  return [
    "strapi::logger",
    "strapi::errors",
    {
      name: "strapi::security",
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            "connect-src": ["'self'", "https:"],
            "img-src": [
              "'self'",
              "data:",
              "blob:",
              env("CDN_HOST")
            ],
            "media-src": [
              "'self'",
              "data:",
              "blob:",
              env("CDN_HOST")
            ],
            upgradeInsecureRequests: null,
          },
        },
      },
    },
    {
      name: "strapi::cors",
      config: {
        origin: allowedOrigins,
        headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'], // Common headers
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Common methods
        credentials: true, // If your frontend needs to send cookies or auth headers
      },
    },
    "strapi::poweredBy",
    "strapi::query",
    "strapi::body",
    "strapi::session",
    "strapi::favicon",
    "strapi::public",
  ];
};
