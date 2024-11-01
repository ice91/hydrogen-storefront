// app/entry.server.tsx

import type { AppLoadContext, EntryContext } from '@shopify/remix-oxygen';
import { RemixServer } from '@remix-run/react';
import isbot from 'isbot';
import { renderToReadableStream } from 'react-dom/server';
import { createContentSecurityPolicy } from '@shopify/hydrogen';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: AppLoadContext,
) {
  const { nonce, header, NonceProvider } = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    connectSrc: [
      "'self'",
      'https://monorail-edge.shopifysvc.com',
      'https://40ed06-12.myshopify.com',
      'https://canvastalk-867062847423.asia-east1.run.app',
      //context.env.VITE_BACKEND_BASE_URL, // 如果有其他需要的域名，可以继续添加
    ],
    scriptSrc: [
      "'self'",
      'https://cdn.shopify.com',
      'https://shopify.com',
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
      //context.env.VITE_BACKEND_BASE_URL,
      'https://canvastalk-867062847423.asia-east1.run.app',
      'https://40ed06-12.myshopify.com',
      //'https://01ja74vd3j52xmzffynj6d1vdz-827ba860dd475bd1fc22.myshopify.dev',
      'https://monorail-edge.shopifysvc.com',
      ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:*'] : []),
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      'https://cdn.shopify.com',
      'https://canvastalk-867062847423.asia-east1.run.app',
      //context.env.VITE_BACKEND_BASE_URL, // 添加后端域名
    ],
    // 添加以下 imgSrc 設定
    imgSrc: [
      "'self'",
      'data:',
      'blob:',
      'https://cdn.shopify.com',
      'https://shopify.com',
      'https://storage.googleapis.com',
      'https://canvastalk-867062847423.asia-east1.run.app',
      'https://40ed06-12.myshopify.com',
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
