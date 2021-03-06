const url = 'https://spooky-corpse-96953.herokuapp.com'
// const url = 'http://localhost:3000'

const resource = (method, endpoint, payload?) => {
    const options: RequestInit = {
        method,
        credentials: 'include',
        headers: {"Content-Type": "application/json"}
    }
    if (payload) {
      options.body = JSON.stringify(payload);
    }

    return fetch(`${url}/${endpoint}`, options)
        .then(r => {
            if (r.status === 200) {
                if (r.headers.get('Content-Type').indexOf('json') > 0) {
                    return r.json();
                } else {
                    return r.text();
                }
            } else {
                // useful for debugging, but remove in production
                console.error(`${method} ${endpoint} ${r.statusText}`);
                throw new Error(r.statusText);
            }
        })
}

export { url, resource };
