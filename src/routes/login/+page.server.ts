import axios from 'axios';

export const load = async ({ locals }) => {
    return {
        token: locals.token
    };
};

/** @type {import('./$types').Actions} */
export const actions = {
    login: async ({ request, locals }) => {
        // TODO log the user in
        const formData = await request.formData();
        const username = formData.get('username');
        const password = formData.get('password');

        console.log(username, password);
        const response = await axios.post('http://localhost:8080/login', {
            username,
            password
        });
        console.log(response.data);
        // save token as local storage
        // token is a string token : xyz format
        locals.token = response.data.split(':')[1];
        return { success: true };
    },
    register: async (event) => {
        // TODO register the user
    }
};
