'use client';

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // Recreate your full Chatbase script logic inside useEffect
    if (
      !window.chatbase ||
      (typeof window.chatbase === 'function' &&
        (window.chatbase as any)('getState') !== 'initialized')
    ) {
      const q: any[] = [];
      const chatbaseFn = (...args: any[]) => {
        q.push(args);
      };
      (chatbaseFn as any).q = q;
      window.chatbase = new Proxy(chatbaseFn, {
        get(target, prop) {
          if (prop === 'q') return target.q;
          return (...args: any[]) => target(prop, ...args);
        },
      });

      const onLoad = () => {
        const script = document.createElement('script');
        script.src = 'https://www.chatbase.co/embed.min.js';
        script.id = 'nsuYxOwjQdKjRBCfu1XfT';
        script.setAttribute('domain', 'www.chatbase.co');
        document.body.appendChild(script);
      };

      if (document.readyState === 'complete') {
        onLoad();
      } else {
        window.addEventListener('load', onLoad);
      }
    }
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">AI Food Chatbot</h1>
      <p>Ask me what to eat based on your diet or craving!</p>
    </main>
  );
}
