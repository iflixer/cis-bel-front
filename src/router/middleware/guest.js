
// Middleware для перенаправления с роутов авторизации, регистрации, восстановления
export default async function guest ({next, store, to}){

    let mainPage = '';
    if(store.state.user.status == 'client' || store.state.user.status == 'redactor'){
        mainPage = 'VideoPage';
    }else{
        mainPage = 'AdminPanel';
    }

    const hasToken = store.state.user.token && store.state.user.token.trim() !== '';

    if(!hasToken && !store.state.user.tokenRefresh){
        return next();
    }

    console.log(await store.dispatch('isAuth'));
    if( await store.dispatch('isAuth') ){
        await store.dispatch('safeNavigate', {name: mainPage});
        return next(false);
    }
    return next();
}