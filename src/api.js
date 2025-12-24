const API_URL = '/api';

export const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('fireDeptAuth'));
    return user?.token ? { 'Authorization': `Bearer ${user.token}` } : {};
};

// Generic request handler
const request = async (endpoint, options = {}) => {
    const defaults = {
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
        }
    };

    const config = {
        ...defaults,
        ...options,
        headers: {
            ...defaults.headers,
            ...options.headers
        }
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        throw error;
    }
};

export const api = {
    // Auth
    login: (credentials) => request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),
    register: (userData) => request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),
    updateProfile: (data) => {
        // We need to pass the email to identify the user since our simple backend update route uses it
        // In a better implementation, the token would handle identification
        const user = JSON.parse(localStorage.getItem('fireDeptAuth'))?.userData;
        return request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify({ ...data, email: user?.email })
        });
    },

    // Applications
    createApplication: (data) => request('/applications', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    getApplications: (userId) => {
        const query = userId ? `?userId=${userId}` : '';
        return request(`/applications${query}`);
    },
    getApplication: (id) => request(`/applications/${id}`),
    updateApplication: (id, data) => request(`/applications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    }),

    // Inspections
    getInspections: () => request('/inspections'),
    createInspection: (data) => request('/inspections', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    updateInspection: (id, data) => request(`/inspections/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    }),

    // Users (Admin)
    getUsers: () => request('/admin/users'),

    // Generic Request (Exposed for flexibility if needed)
    request: (endpoint, options) => request(endpoint, options)
};
