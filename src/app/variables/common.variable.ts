export const appInfo = {
    APPLICATION_ID: '4981bc49-24b4-4a31-bd44-02f675502ecc',
    ROLE_ID: '4a868d3d-63a2-408e-8fdc-6e8bcf7a2f45',
};

export const cacheInfo = {
    user: {
        id: localStorage.getItem('userId'),
        name: localStorage.getItem('username'),
        fullname: localStorage.getItem('fullname'),   
    }, 
    hospital: {
        id: localStorage.getItem('hospitalId'),
        name: localStorage.getItem('hospitalName'),
        alias: localStorage.getItem('hospitalAlias'),
        orgId: localStorage.getItem('organizationId'),
        zone: localStorage.getItem('timeZone'),     
    },
    collection: JSON.parse(localStorage.getItem('hospitals')),
}

export const sourceApps = '::ffff:10.83.146.145';
