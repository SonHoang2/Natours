import { useEffect } from 'react';

export default function ChatApp() {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return (
        <div className="App">
            <h1>Welcome to My Chatbot</h1>
            <df-messenger
                intent="WELCOME"
                chat-title="ChatboxforWebservice"
                agent-id="485df303-8e41-4067-8169-f7175f187cf5"
                language-code="en"
            ></df-messenger>
        </div>
    );
}