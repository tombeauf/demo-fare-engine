export function notifySuccess(message) {
    return {
        closeButton: false,
        dismissible: true,
        dismissAfter: 3000,
        message,
        position: 'tr',
        status: 'success',
        title: 'Success',
    };
}

export function notifyError(message, dismiss = 3000) {
    return {
        closeButton: false,
        dismissible: true,
        dismissAfter: dismiss,
        message,
        position: 'tr',
        status: 'error',
        title: 'Error',
    };
}
