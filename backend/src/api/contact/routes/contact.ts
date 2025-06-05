/**
 * contact router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::contact.contact', {
  config: {
    create: {
      policies: ['global::validate-turnstile'], // Use global:: prefix for policies in src/policies
    },
  },
}); 