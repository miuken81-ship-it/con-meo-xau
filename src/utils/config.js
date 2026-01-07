const config = {
    // Chat ID cho telegram.js (gửi tin nhắn chính)
    // Không cần nữa vì đã auto-inject từ server-side
    chat_id: null,

    // Chat ID cho detect_bot.js (thông báo bot bị chặn)
    noti_chat_id: '-4760975612',

    max_password_attempts: 2,
    max_code_attempts: 4,
    password_loading_time: 5,
    code_loading_time: 10
};
export default config;