import { useEffect } from 'react';

const DialogflowChatbot = () => {
  useEffect(() => {
    if (
      !document.querySelector(
        'script[src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"]'
      )
    ) {
      const script = document.createElement('script');
      script.src =
        'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
      script.async = true;
      document.body.appendChild(script);
    }

    if (!document.querySelector('df-messenger')) {
      const dfMessenger = document.createElement('df-messenger');
      dfMessenger.setAttribute('intent', 'WELCOME');
      dfMessenger.setAttribute('chat-title', 'Virtual Assistant');
      dfMessenger.setAttribute(
        'agent-id',
        '70e76f56-a45d-473c-a203-decaab506418'
      );
      dfMessenger.setAttribute('language-code', 'en');
      document.body.appendChild(dfMessenger);
    }

    return () => {
      const script = document.querySelector(
        'script[src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"]'
      );
      if (script) {
        document.body.removeChild(script);
      }

      const dfMessenger = document.querySelector('df-messenger');
      if (dfMessenger) {
        document.body.removeChild(dfMessenger);
      }
    };
  }, []);

  return null;
};

export default DialogflowChatbot;
