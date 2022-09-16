import Route from '@ioc:Adonis/Core/Route';

Route.post('/auth/login', 'AuthController.login');
Route.post('/auth/register', 'AuthController.register');
Route.get('/auth/email/verify/:email/:id', 'AuthController.verifyEmail').as('verifyEmail');

Route.post('/auth/password/forgot', 'AuthController.forgotPassword');
Route.post('/auth/password/reset/:id/:token', 'AuthController.resetPassword').as('resetPassword');

Route.group(() => {
    Route.get('/auth/user', 'AuthController.user');
    Route.post('/auth/logout', 'AuthController.logout');
    Route.post('/auth/email/verify/resend', 'AuthController.resendVerificationEmail');

    Route.group(() => {}).middleware('verifyEmail');
}).middleware('auth:api');
