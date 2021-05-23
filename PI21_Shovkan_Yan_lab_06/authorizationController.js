const fetch = require('node-fetch')
const clientId = '2ae1c626fb3044adbd352194efc7a902'
const clientSecret = '83856f6264754340925c1f0c59c5a0fd'

let ref_token;
let acs_token;

exports.main = (req, res) => {
    res.render('main.ejs');
};

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/main');
    ref_token = null;
    acs_token = null;
}

exports.authorization = async (req, res) => {
    const query = {
        body: `grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&code=${req.query.code}`,
        method: 'post'
    };

    await fetch('https://oauth.yandex.ru/token', query)
        .then(res => res.json())
        .then(data => { acs_token = data.access_token; ref_token = data.refresh_token; })
    res.redirect('/token');
}

exports.token = (req, res) => {
    res.render('token.ejs', { access_token: acs_token, refresh_token: ref_token });
}

exports.updateToken = async (req, res) => {
    if (ref_token != null) {
        const query = {
            body: `grant_type=refresh_token&refresh_token=${ref_token}&client_id=${clientId}&client_secret=${clientSecret}`,
            method: 'post'
        }

        await fetch('https://oauth.yandex.ru/token', query)
            .then(res => res.json())
            .then(data => { acs_token = data.access_token; ref_token = data.refresh_token; lifetime = data.expires_in; type = data.token_type; })
    }
    res.redirect('/token')
}