
// Middleware для перенаправления с защищенных роутов
export default async function auth ({next, store, to}){
    const hasToken = store.state.user.token && store.state.user.token.trim() !== '';

    if(hasToken){
        return next();
    }

    if( !await store.dispatch('isAuth') ){
        await store.dispatch('safeNavigate', {name: 'Authorization'});
        return next(false);
    }
    return next();
}