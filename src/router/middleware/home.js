
export default async function home({next, store}) {

    let mainPage = '';
    if (store.state.user.status == 'client' || store.state.user.status == 'redactor') {
        mainPage = 'VideoPage';
    } else {
        mainPage = 'AdminPanel';
    }

    const hasToken = store.state.user.token && store.state.user.token.trim() !== '';

    if (!hasToken && !store.state.user.tokenRefresh) {
        await store.dispatch('safeNavigate', {name: 'Authorization'});
        return next(false);
    }

    if (await store.dispatch('isAuth')) {
        await store.dispatch('safeNavigate', {name: mainPage});
        return next(false);
    }

    await store.dispatch('safeNavigate', {name: 'Authorization'});
    return next(false);
}
