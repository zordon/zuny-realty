'use client'

import React, { useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

// Remember to replace this with your actual Turnstile Site Key
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'; // Default test key

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | 'idle'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    if (!turnstileToken) {
      setSubmitStatus('error');
      setSubmitMessage('Por favor, completa la verificación de seguridad (Turnstile).');
      setIsSubmitting(false);
      return;
    }

    const strapiApiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337'; // Fallback for safety

    try {
      const response = await fetch(`${strapiApiUrl}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          data: {
            name,
            email,
            phone,
            message,
          },
          'cf-turnstile-response': turnstileToken
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage(result.message || '¡Mensaje enviado con éxito!');
        // Reset form fields
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
        setTurnstileToken(null); // Important to allow re-verification if needed, though Turnstile might handle this
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.message || 'Hubo un error al enviar el mensaje. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
      setSubmitMessage('Hubo un error de conexión. Por favor, verifica tu red y vuelve a intentarlo.');
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
        <input 
          type="text" 
          name="name" 
          id="name" 
          autoComplete="name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm" 
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input 
          type="email" 
          name="email" 
          id="email" 
          autoComplete="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm" 
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono (Opcional)</label>
        <input 
          type="tel" 
          name="phone" 
          id="phone" 
          autoComplete="tel" 
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm" 
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Mensaje</label>
        <textarea 
          id="message" 
          name="message" 
          rows={4} 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
        ></textarea>
      </div>

      <div className="my-4">
        <Turnstile 
          siteKey={TURNSTILE_SITE_KEY} 
          onSuccess={setTurnstileToken} 
          onError={() => {
            setSubmitStatus('error');
            setSubmitMessage('Falló la verificación de seguridad. Intenta recargar la página.');
          }}
          onExpire={() => {
            setTurnstileToken(null);
            // Optionally inform the user they need to re-verify
          }}
          options={{
            theme: 'light', // or 'dark' or 'auto'
            // You can add other Turnstile options here
          }}
        />
      </div>

      {submitStatus === 'success' && (
        <p className="text-green-600 bg-green-50 p-3 rounded-md">{submitMessage}</p>
      )}
      {submitStatus === 'error' && (
        <p className="text-red-600 bg-red-50 p-3 rounded-md">{submitMessage}</p>
      )}

      <div>
        <button 
          type="submit" 
          disabled={isSubmitting || !turnstileToken}
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-700 hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
        </button>
      </div>
    </form>
  );
}
