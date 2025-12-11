import api from '../api/axios';

export const getAuditLogs = () => {
    return api.get('/audit-logs');
};
