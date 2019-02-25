
const router = require('koa-router')()
const _find = require('lodash/find')
const _filter = require('lodash/filter')
const _isEmpty = require('lodash/isEmpty')
const _sortBy = require('lodash/sortBy')
const moment = require('moment')
const competitions = require('../services/config/competitions')
const services = require('../services/config/services')
const { profession, education, tags } = require('../services/config/map')
const { zhongzhi } = require(`../config/${process.env.isDev || 'production'}`)
const {
  getUserInfo,
  getIsApplied,
  getApply,
  checkVerify,
  getDemandAdd,
  getConsultAdd,
  getSchool,
  saveBasic,
  saveCurrentState,
  getRegion,
  updatePassword,
  getCertificationStatus,
  getMyCompetition,
  saveCertification,
  getCompetitionResult,
  getCompetitionSubmit,
  getCompetitionRanks,
  getCompetitionMyScore,
  postFeedback,
  logout
} = require('../services/request')

function getCompetition(type, id) {
  return _find(competitions[type], item => item.id == id)
}

router.get('/', async function (ctx, next) {
  const banner = { heading: '众智大赛平台', subheading: '打造国际高端算法竞赛' };

  await ctx.render('index', { title: '众智', active: '/', ...ctx.state, banner, challenge: competitions['challenge'], practice: competitions['practice'] });
})
  .get('/competition/:type/:id', async function (ctx, next) {
    let { section, pageNo=1, pageSize=10 } = ctx.query;
    
    const banner = { heading: '众智大赛平台', subheading: '打造国际高端算法竞赛', img: '/images/banner/banner-competition.jpg' };
    // 当前比赛
    const competition = getCompetition(ctx.params.type, ctx.params.id);
    const today = moment().format('YYYY-MM-DD');
    const toTody = new Date(today).getTime() - new Date(competition.startTime).getTime();
    const toEnd = new Date(competition.endTime).getTime() - new Date(competition.startTime).getTime();
    let cross = toTody / toEnd * 100;
    if (!toTody) {
      cross = 0
    }
    const timeline = { start: moment(competition.startTime).format('YYYY年MM月DD日'), today: moment(today).format('YYYY年MM月DD日'), end: moment(competition.endTime).format('YYYY年MM月DD日'), cross: cross };
    // 排行榜当前赛季 section为0时请求 我的成绩
    const rankingSection = section || competition.section
    // 是否已参赛
    const isApplied = ctx.state.user ? await getIsApplied(ctx) : false;
    // 获取提交结果
    const submitedFiles = ctx.state.user && isApplied ? await getCompetitionResult(ctx, competition.section) : [];
    // 获取比赛排名
    const rankingData = await getCompetitionRanks(ctx, {section: rankingSection, pageNo, pageSize});
    // 获得我的成绩
    const myScore = rankingSection == '0' ? await getCompetitionMyScore(ctx) : null
    // console.log('myScore -->', myScore)
    
    await ctx.render('competition/detail', {
      active: '/',
      ...ctx.state,
      banner,
      timeline,
      submitedFiles,
      action: `/competition/${ctx.params.type}/${ctx.params.id}`,
      ...competition,
      rankingSection,
      isApplied,
      rankingData,
      myScore
    })
  })
  .get('/AI_market', async function (ctx, next) {
    const banner = { heading: '众智大赛平台', subheading: 'AI市场' };
    const { keyword, labels, sort } = ctx.query
    let serviceList = services;
    let tagList = tags;
    let sorted = 0;
    if(!_isEmpty(keyword)) {
      serviceList = _filter(serviceList, n => {
        let hasKeyword = n.name.indexOf(keyword) > -1 || n.description.indexOf(keyword) > -1;
        if (!hasKeyword) {
          for (let i = 0; i < n.introduction.length; i++) {
            if (n.introduction[i].indexOf(keyword) > -1) {
              hasKeyword = true;
              break;
            }
          }
        }
        return hasKeyword
      })
    }
    if(!_isEmpty(labels)) {
      tagList = tagList.map(tag => {
        const _labels = tag.labels.map(item => {
          return {
            ...item,
            checked: labels.indexOf(item.id) > -1
          }
        })
        return {
          ...tag,
          labels: _labels
        }
      })
      serviceList = _filter(serviceList, n => {
        return labels.indexOf(n.tag) > -1
      })
    }
    if(sort > 0) {
      sorted = sort;
      serviceList = _sortBy(serviceList, o => {
        const _key = sort == 1 ? 'releaseTime' : 'price';
        return o[_key]
      })
    }
    
    await ctx.render('AI_market/index', {
      active: '/AI_market',
      banner,
      ...ctx.state,
      serviceList,
      keyword,
      tagList,
      sorted,
      verifyUrl: zhongzhi + '/api/verify/getVerify'
    })
  })
  .get('/AI_market/:id', async function (ctx, next) {
    const service = _find(services, item => item.id == ctx.params.id)
    await ctx.render('AI_market/detail', {
      active: '/AI_market',
      ...ctx.state,
      ...service,
      verifyUrl: zhongzhi + '/api/verify/getVerify'
    })
  })
  .post('/competition-apply', async function (ctx, next) {
    ctx.body = await getApply(ctx)
  })
  .post('/competition/:type/:id', async (ctx, next) => {
    // 提交结果
    // 当前比赛
    const competition = getCompetition(ctx.params.type, ctx.params.id);
    ctx.body = await getCompetitionSubmit(ctx, competition.section)
  })
  .post('/check-verify', async (ctx, next) => {
    ctx.body = await checkVerify(ctx)
  })
  .post('/check-in', async (ctx, next) => {
    // console.log('check-in -->', 'check-in')
    ctx.body = await getDemandAdd(ctx)
  })
  .post('/consult-add', async (ctx, next) => {
    ctx.body = await getConsultAdd(ctx)
  })
  .post('/basic', async (ctx, next) => {
    ctx.body = await saveBasic(ctx)
  })
  .post('/current-state', async (ctx, next) => {
    ctx.body = await saveCurrentState(ctx)
  })
  .post('/update-password', async (ctx, next) => {
    ctx.body = await updatePassword(ctx)
  })
  .post('/save-certification', async (ctx, next) => {
    // console.log('/save-certification', ctx.body)
    ctx.body = await saveCertification(ctx)
  })
  .post('/suggestion', async (ctx, next) => {
    ctx.body = await postFeedback(ctx)
  })
  // 退出登录
  .post('/logout', async (ctx, next) => {
    const result = await logout(ctx)
    if (result.data) {
      ctx.cookies.set('xuelangyun_login_uid','',{signed:false,maxAge:0,overwrite:true,domain:'.xuelangyun.com'})
      ctx.cookies.set('xuelangyun_login_ticket','',{signed:false,maxAge:0,overwrite:true,domain:'.xuelangyun.com'})
      ctx.body = true
    } else {
      ctx.body = false
    }
  })
  .get('/schoolName', async (ctx, next) => {
    ctx.body = await getSchool(ctx)
  })
  .get('/regionList', async (ctx, next) => {
    ctx.body = await getRegion(ctx, ctx.query.id)
  })
  .get('/help', async function (ctx, next) {
    await ctx.render('help', {
      ...ctx.state,
      active: '/help'
    })
  })
  .post('/certification', async (ctx, next) => {
    ctx.body = await saveCertification(ctx)
  })
  .get('/user', async function (ctx, next) {
    const { certifyRestart } = ctx.query;
    // console.log('ctx.query -->', ctx.query)
    const userInfo = await getUserInfo(ctx);
    const parentRegionList = await getRegion(ctx, null)
    const regionList = await getRegion(ctx, userInfo.parentRegionId);
    const certificationStatus = await getCertificationStatus(ctx);
    const myCompetitionIds = await getMyCompetition(ctx);
    const challenge = _filter(competitions['challenge'], n => myCompetitionIds.indexOf(n.id) > -1);
    const practice = _filter(competitions['practice'], n => myCompetitionIds.indexOf(n.id) > -1);
    let region = '';
    if (!!userInfo.parentRegionId) {
      region += _find(parentRegionList, n => n.id == userInfo.parentRegionId).name;
    }
    if (!!userInfo.regionId) {
      region += ' ' + _find(regionList, n => n.id == userInfo.regionId).name;
    }
    userInfo.region = region;
    const _education = _find(education, n => n.value == userInfo.educationType);
    const _profession = _find(profession, n => n.value == userInfo.professionType);
    userInfo.education = _education ? _education.name : '';
    userInfo.profession = _profession ? _profession.name : '';

    // console.log('certificationStatus', certificationStatus)
    
    await ctx.render('user', {
      ...ctx.state,
      challenge,
      practice,
      userInfo,
      education,
      profession,
      parentRegionList,
      regionList,
      certificationStatus,
      certifyRestart: certifyRestart ? true : false
    })
  })

module.exports = router
