// Define the expected shape of the Turnstile verification response
interface TurnstileVerificationResult {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
}

export default async (policyContext: any, config: unknown, { strapi }: { strapi: any }) => {
  // Use policyContext.request to access the request object in a policy
  const request = policyContext.request;

  // Allow OPTIONS requests to pass through without Turnstile verification (for CORS preflight)
  if (request.method === 'OPTIONS') {
    strapi.log.debug('Turnstile policy: OPTIONS request, allowing.');
    return true;
  }

  let turnstileToken: string | undefined = undefined;
  const body = request.body as { [key: string]: any } | undefined;

  if (body && typeof body === 'object') {
    if ('cf-turnstile-response' in body) {
      turnstileToken = body['cf-turnstile-response'];
    } else if (body.data && typeof body.data === 'object' && 'cf-turnstile-response' in body.data) {
      turnstileToken = (body.data as { [key: string]: any })['cf-turnstile-response'];
    }
  }

  if (!turnstileToken) {
    strapi.log.warn('Turnstile policy: Token not found in request body. Blocking request.');
    return false; 
  }

  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    strapi.log.error('Turnstile policy: TURNSTILE_SECRET_KEY is not set. Blocking request.');
    return false; 
  }

  try {
    const payload = {
      secret: secretKey,
      response: turnstileToken,
      remoteip: request.ip, // Add the remoteip parameter
    };

    strapi.log.debug(`Turnstile policy: Sending verification request to Cloudflare with payload: ${JSON.stringify({ ...payload, secret: '[REDACTED]' })}`);

    const verificationResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!verificationResponse.ok) {
      const errorBody = await verificationResponse.text();
      strapi.log.error(
        `Turnstile policy: Siteverify request failed with status ${verificationResponse.status}. Response: ${errorBody}. Blocking request.`
      );
      return false; 
    }

    const verificationResult = await verificationResponse.json() as TurnstileVerificationResult;

    if (verificationResult.success) {
      strapi.log.info('Turnstile policy: Verification successful. Allowing request.');
      return true;
    } else {
      const errorCodes = verificationResult['error-codes']?.join(', ') || 'unknown error';
      strapi.log.warn(`Turnstile policy: Verification failed. Cloudflare Errors: [${errorCodes}]. Blocking request.`);
      // You can inspect specific verificationResult['error-codes'] here if needed for more granular server-side logic
      return false; 
    }
  } catch (error: any) {
    strapi.log.error('Turnstile policy: Exception during verification process. Blocking request.', error.message ? error.message : error);
    return false; 
  }
}; 