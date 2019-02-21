const request = require('../server/requestPromise');
const fs = require('fs')

exports.getUser = async (ctx) => {
    const url = '/api/user';

    const cookie = ctx.request.header.cookie || '';
    const {code, data, message} = await request(url, {
        headers: {
            Cookie: cookie
        }
    }, 'guanwang');
    // console.log('code -->', code)
    // console.log('data -->', data)
    // console.log('message -->', message)
    return data
}

exports.getUserInfo = async (ctx) => {
    const url = '/api/personal/getMyInfo';
    
    const cookie = ctx.request.header.cookie || '';
    // console.log('cookie -->', cookie)
    const {code, data, message} = await request(url, {
        headers: {
            Cookie: cookie
        }
    });
    // console.log('userInfo -->', data)
    return data
}

// 我的比赛
exports.getMyCompetition = async (ctx) => {
    const url = '/api/personal/getMyCompetition';
    
    const cookie = ctx.request.header.cookie || '';
    const {code, data, message} = await request(url, {
        headers: {
            Cookie: cookie
        }
    });
    // console.log('getMyCompetition -->', data)
    return data
}

// 是否已经参加比赛
exports.getIsApplied = async (ctx) => {
    const url = '/api/competition/isApplied';
    const cookie = ctx.request.header.cookie || '';
    const {code, data, message} = await request(url, {
        qs: { id: ctx.params.id },
        headers: {
            Cookie: cookie
        }
    });
    return data
}

// 获取比赛提交结果列表
exports.getCompetitionResult = async (ctx, section) => {
    const url = '/api/competition/competitionResults';
    const cookie = ctx.request.header.cookie || '';
    const {code, data, message} = await request(url, {
        qs: { id: ctx.params.id, section },
        headers: {
            Cookie: cookie
        }
    });
    // console.log('getCompetitionResult -->', data)
    return data
}

// 提交比赛结果
exports.getCompetitionSubmit = async (ctx, section) => {
    const url = '/api/competition/submit';
    const file = ctx.request.files.file;
    const reader = fs.createReadStream(file.path);
    const cookie = ctx.request.header.cookie || '';
    const data = await request(url, {
        method: 'POST',
        formData: {
            id: ctx.params.id,
            file: {
                value: reader,
                options: {
                    filename: file.name
                }
            },
            section
        },
        headers: {
            'Content-Type': 'multipart/form-data',
            'Cookie': cookie
        }
    });
    return data
}

// 意见反馈
exports.postFeedback = async (ctx) => {
    const url = '/api/personal/feedback';
    const {content} = ctx.request.body;
    const cookie = ctx.request.header.cookie || '';
    return await request(url, {
        method: 'POST',
        form: {'content': content},
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': cookie
        }
    });
}

// 获取比赛排名
exports.getCompetitionRanks = async (ctx, qs) => {
    const url = '/api/competition/ranks';
    const cookie = ctx.request.header.cookie || '';
    const { data } = await request(url, {
        qs: { id: ctx.params.id, ...qs },
        headers: {
            Cookie: cookie
        }
    });
    return data
}

// 我的成绩
exports.getCompetitionMyScore = async (ctx, qs) => {
    const url = '/api/competition/myScore';
    const cookie = ctx.request.header.cookie || '';
    const { data } = await request(url, {
        qs: { id: ctx.params.id},
        headers: {
            Cookie: cookie
        }
    });
    return data
}

// 参加比赛
exports.getApply = async (ctx) => {
    const url = '/api/competition/apply';
    const cookie = ctx.request.header.cookie || '';
    return await request(url, {
        qs: { id: ctx.request.body.id },
        headers: {
            Cookie: cookie
        }
    });
}

// 验证验证码
exports.checkVerify = async (ctx) => {
    const url = '/api/verify/checkVerify';
    const cookie = ctx.request.header.cookie || '';
    // console.log('checkVerify -->', ctx.request.body)
    const {data} = await request(url, {
        qs: ctx.request.body,
        headers: {
            Cookie: cookie
        }
    });
    // console.log('data -->', data)
    return data
}

// 需求登记
exports.getDemandAdd = async (ctx) => {
    const url = '/api/demand/add';
    const cookie = ctx.request.header.cookie || '';
    // console.log('query -->', ctx.request.body)
    return await request(url, {
        qs: ctx.request.body,
        headers: {
            Cookie: cookie
        }
    });
}

// 咨询登记
exports.getConsultAdd = async (ctx) => {
    const url = '/api/consult/add';
    const cookie = ctx.request.header.cookie || '';
    return await request(url, {
        qs: ctx.request.body,
        headers: {
            Cookie: cookie
        }
    });
}

exports.getRegion = async (ctx, regionId) => {
    const url = '/api/region/get';
    const cookie = ctx.request.header.cookie || '';
    const {data} = await request(url, {
        qs: {
            parentId: regionId
        },
        headers: {
            'Cookie': cookie
        }
    })
    return data
}

exports.getSchool = async (ctx) => {
    const url = '/api/school/search';
    const cookie = ctx.request.header.cookie || '';
    const {data} = await request(url, {
        qs: ctx.query,
        headers: {
            'User-Agent': 'Request-Promise',
            'Cookie': cookie
        }
    })
    return data
}

exports.saveBasic = async (ctx) => {
    const url = '/api/personal/saveBasic';
    const cookie = ctx.request.header.cookie || '';
    const data = await request(url, {
        qs: ctx.request.body,
        headers: {
            'Cookie': cookie
        }
    })
    return data
}

exports.saveCurrentState = async (ctx) => {
    const url = '/api/personal/saveCurrentState';
    const cookie = ctx.request.header.cookie || '';
    const data = await request(url, {
        qs: ctx.request.body,
        headers: {
            'Cookie': cookie
        }
    })
    // console.log('saveCurrentState -->', data)
    return data
}

// 设置密码
exports.updatePassword = async (ctx) => {
    const url = '/api/personal/updatePassword';
    const cookie = ctx.request.header.cookie || '';
    const data = await request(url, {
        qs: ctx.request.body,
        headers: {
            'Cookie': cookie
        }
    })
    return data
}

// 获取实名认证状态
exports.getCertificationStatus = async (ctx) => {
    const url = '/api/personal/certificationStatus';
    const cookie = ctx.request.header.cookie || '';
    const {data} = await request(url, {
        headers: {
            'Cookie': cookie
        }
    })
    return data
}

// 实名认证
exports.saveCertification = async (ctx) => {
    const url = '/api/personal/certification';
    const idCardFrontFile = ctx.request.files.idCardFrontFile;
    const idCardBackFile = ctx.request.files.idCardBackFile;
    const cookie = ctx.request.header.cookie || '';
    const data = await request(url, {
        method: 'POST',
        formData: {
            ...ctx.request.body,
            idCardFrontFile: {
                value: fs.createReadStream(idCardFrontFile.path),
                options: {
                    filename: idCardFrontFile.name,
                    contentType: idCardFrontFile.type
                }
            },
            idCardBackFile: {
                value: fs.createReadStream(idCardBackFile.path),
                options: {
                    filename: idCardBackFile.name,
                    contentType: idCardBackFile.type
                }
            }
        },
        headers: {
            'Content-Type': 'multipart/form-data',
            'Cookie': cookie
        }
    });
    console.log('data -->', data)
    return data
}
