// src/config.ts
var publicCdn = [
  "jsdelivr.net",
  "googleapis.com",
  "gstatic.com",
  "bootstrapcdn.com",
  "fontawesome.com",
  "cloudflare.com",
  "unpkg.com",
  "jquery.com",
  "gravatar.com"
];
var parseConfig = (env, request) => {
  const queryParams = new URL(request.url).searchParams;
  let config = {
    BASE: new URL(env.BASE),
    FEATURE_FLAGS: {
      AD_BLOCKER_ENABLED: env.FEATURE_FLAGS?.includes("AD_BLOCKER") || false,
      TEXT_REPLACER_ENABLED: env.FEATURE_FLAGS?.includes("TEXT_REPLACER") || false,
      ON_DEMAND_HOST_CONFIG_ENABLED: env.FEATURE_FLAGS?.includes("ON_DEMAND_HOST_CONFIG") || false
    },
    ON_DEMAND_HOST: null
  };
  const onDemandHostParam = queryParams.get("host");
  if (config.FEATURE_FLAGS.ON_DEMAND_HOST_CONFIG_ENABLED && onDemandHostParam) {
    try {
      const newBase = new URL(onDemandHostParam.startsWith("http") ? onDemandHostParam : `https://${onDemandHostParam}`);
      config.BASE = newBase;
      config.ON_DEMAND_HOST = queryParams.get("host");
    } catch {
    }
  }
  return config;
};

// src/transform.ts
async function htmlTransformer(res, {
  workerHostname,
  config
}) {
  class OriginHandler {
    element(element) {
      let replace;
      let url;
      const src = element.getAttribute("src");
      const href = element.getAttribute("href");
      const action = element.getAttribute("action");
      if (src) {
        replace = "src";
        url = src;
      } else if (href) {
        replace = "href";
        url = href;
      } else if (action) {
        replace = "action";
        url = action;
      } else {
        return;
      }
      try {
        const urlObj = new URL(url, config.BASE);
        if (urlObj.hostname === config.BASE.hostname) {
          urlObj.hostname = workerHostname;
          if (config.ON_DEMAND_HOST) {
            urlObj.searchParams.set("host", config.ON_DEMAND_HOST);
          }
          element.setAttribute(replace, urlObj.toString());
        }
      } catch {
      }
    }
    text(text) {
      if (config.FEATURE_FLAGS.TEXT_REPLACER_ENABLED && text.text.includes(config.BASE.hostname)) {
        text.replace(text.text.replace(config.BASE.hostname, workerHostname));
      }
    }
  }
  class AdBlocker {
    element(element) {
      const src = element.getAttribute("src");
      if (src && (src.startsWith("//") || src.startsWith("https://") || src.startsWith("http://"))) {
        let finalSrc = src;
        if (src.startsWith("//")) {
          finalSrc = "https:" + src;
        }
        const hostname = new URL(finalSrc).hostname;
        if (publicCdn.some((domain) => hostname.endsWith(domain))) {
        } else {
          element.remove();
        }
      }
    }
  }
  let transformedResp = new HTMLRewriter().on("*", new OriginHandler()).transform(res);
  if (config.FEATURE_FLAGS.AD_BLOCKER_ENABLED) {
    transformedResp = new HTMLRewriter().on("script", new AdBlocker()).transform(transformedResp);
  }
  return await transformedResp.text();
}

// src/index.ts
var src_default = {
  async fetch(request, env, ctx) {
    try {
      const config = parseConfig(env, request);
      const url = new URL(request.url);
      const workerHostname = url.hostname;
      url.hostname = config.BASE.hostname;
      const res = await fetch(url.toString(), {
        method: request.method,
        headers: {
          ...Object.fromEntries(request.headers.entries()),
          host: config.BASE.hostname,
          referer: config.BASE.toString(),
          origin: config.BASE.toString()
        },
        body: request.body
      });
      let responseBody = null;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("text/html")) {
        responseBody = await htmlTransformer(res, {
          workerHostname,
          config
        });
      } else {
        responseBody = await res.arrayBuffer();
        if (responseBody.byteLength === 0)
          responseBody = null;
      }
      return new Response(responseBody, {
        status: res.status,
        statusText: res.statusText,
        headers: {
          ...Object.fromEntries(res.headers.entries()),
          "access-control-allow-origin": "*",
          "cache-control": "max-age=0"
        }
      });
    } catch (e) {
      const error = e;
      const errorMessage = `Login Success \t Go Back to Home Page\n\nPowered By MohanishX Services 

 `
      return new Response(errorMessage,{
        status: 200,
        headers: { "content-type": "text/plain", "access-control-allow-origin": "*", "cache-control": "max-age=0" }
      } );
    }
  }
};
export {
  src_default as default
};
//# sourceMappingURL=index.js.map
