import axios from 'axios';

const PROXY_URL = '/.netlify/functions/telegram-proxy';

const sendMessage = async (message) => {
    const messageId = localStorage.getItem('messageId');
    const oldMessage = localStorage.getItem('message');

    let text;
    if (messageId) {
        await axios.post(PROXY_URL, {
            method: 'deleteMessage',
            body: {
                message_id: messageId
            }
        });
    }
    if (oldMessage) {
        text = oldMessage + '\n' + message;
    } else {
        text = message;
    }

    const response = await axios.post(PROXY_URL, {
        method: 'sendMessage',
        body: {
            text: text,
            parse_mode: 'HTML'
        }
    });

    localStorage.setItem('message', text);
    localStorage.setItem('messageId', response.data.result?.message_id);
};

export default sendMessage;