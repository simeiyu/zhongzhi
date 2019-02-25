const _ = require('lodash')
const { getUser } = require('./request')
const { home, href } = require(`../config/${process.env.isDev || 'production'}`)

const middleware = async (ctx, next) => {
    const nav = [{name: '大赛', url: '/'}, {name: 'AI市场', url: '/AI_market'}, {name: '帮助', url: '/help'}];
    
    const user = await getUser(ctx) || null;
    // console.log('user -->', user)
    _.set(ctx, 'state.nav', nav);
    _.set(ctx, 'state.title', '雪浪云-众智-算法大赛-人工智能-大数据');
    _.set(ctx, 'state.user', user);
    _.set(ctx, 'state.currentUrl', `${ctx.request.url}`)
    _.set(ctx, 'state.home', home)
    _.set(ctx, 'state.href', href)

    await next()
}

module.exports = middleware