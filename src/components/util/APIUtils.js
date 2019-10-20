const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })

    if (localStorage.getItem('accessToken')) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem('accessToken'))
    }

    const defaults = { headers: headers };

    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response => response.json().then(data => {

            if (!response.ok) {
                return Promise.reject(data);
            }
            return data;
        })
        );
};

export function login(loginRequest){
    return request({
        url:'http://localhost:8081/login',
        method:'POST',
        body:JSON.stringify(loginRequest)
    })

}

export function register(registerRequest){
    return request({
        url:'http://localhost:8081/register',
        method:'POST',
        body:JSON.stringify(registerRequest)
    })

}