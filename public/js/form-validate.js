$.validator.setDefaults({
    errorPlacement: function (error, element) {
        $(element)
            .closest(".form-control")
            .append(error);
    },
    errorElement: 'span',
    submitHandler: function () {
        alert("提交事件!");
    }
});
$.validator.addMethod("isMobile", function (value, element) {
    var length = value.length;
    var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
    return this.optional(element) || (length == 11 && mobile.test(value));
}, "请正确填写手机号码");
$.validator.addMethod("regex", function (value, element, params) {
    var exp = new RegExp(params); //实例化正则对象，参数为传入的正则表达式
    return exp.test(value);
}, "格式错误");
$.validator.addMethod("isIdCardNo", function (value, element) {
    return this.optional(element) || isIdCardNo(value);
}, "请正确输入您的身份证号码");
$.validator.addMethod("checkPic", function (value, element) {
    var fileFormat = value.substring(value.lastIndexOf(".")).toLowerCase();
    if (fileFormat.match(/.png|.jpg|.jpeg|.bmp/)) {
        $(element).parent('.file-upload').removeClass('error')
        return true;
    } else {
        $(element).parent('.file-upload').addClass('error')
        return false;
    }
}, "请上传png,jpg或bmp格式的文件");

//身份证验证 引入的方法
function isIdCardNo(num) {
    var factorArr = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
    var parityBit = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
    var varArray = new Array();
    var intValue;
    var lngProduct = 0;
    var intCheckDigit;
    var intStrLen = num.length;
    var idNumber = num;
    //initialize
    if ((intStrLen != 15) && (intStrLen != 18)) {
        return false;
    }
    // check andset value
    for (i = 0; i < intStrLen; i++) {
        varArray[i] = idNumber.charAt(i);
        if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {
            return false;
        } else if (i < 17) {
            varArray[i] = varArray[i] * factorArr[i];
        }
    }


    if (intStrLen == 18) {
        //check date
        var date8 = idNumber.substring(6, 14);
        if (isDate8(date8) == false) {
            return false;
        }
        // calculate the sum of the products
        for (i = 0; i < 17; i++) {
            lngProduct = lngProduct + varArray[i];
        }
        // calculate the check digit
        intCheckDigit = parityBit[lngProduct % 11];
        // check last digit
        if (varArray[17] != intCheckDigit) {
            return false;
        }
    }
    else {       //length is 15
        //check date
        var date6 = idNumber.substring(6, 12);
        if (isDate6(date6) == false) {
            return false;
        }
    }
    return true;
}
function isDate6(sDate) {
    if (!/^[0-9]{6}$/.test(sDate)) {
        return false;
    }
    var year, month, day;
    year = sDate.substring(0, 4);
    month = sDate.substring(4, 6);
    if (year < 1700 || year > 2500) returnfalse
    if (month < 1 || month > 12) return false
    return true
}
function isDate8(sDate) {
    if (!/^[0-9]{8}$/.test(sDate)) {
        return false;
    }
    var year, month, day;
    year = sDate.substring(0, 4);
    month = sDate.substring(4, 6);
    day = sDate.substring(6, 8);
    var iaMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if (year < 1700 || year > 2500) return false
    if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) iaMonthDays[1] = 29;
    if (month < 1 || month > 12) return false
    if (day < 1 || day > iaMonthDays[month - 1]) return false
    return true
}

$(function () {
    // toaster
    function toaster(status, message) {
        var $toaster_dom = $('<div class="toaster toaster-' + status + '"><i class="iconfont icon-' + status + '"></i><span>' + message + '</span></div>');
        $toaster_dom.appendTo('body').fadeIn('slow');
        var timer = setTimeout(function () {
            $toaster_dom.fadeOut('slow', function () {
                $toaster_dom.remove();
            })
        }, 5000)
    }

    // 报名
    $('#signUp').submit(function (e) {
        e.preventDefault();
        var $modal = $(this).parents('.modal');
        var data = $(this).serialize();
        var agree = $(this).serializeArray()[1].value;
        if (agree == 'on') {
            $.ajax({
                type: 'POST',
                url: '/competition-apply',
                data: data,
                success: function (result) {
                    if (result.data) {
                        toaster('success', '恭喜您，报名成功！')
                        location.reload();
                    } else {
                        toaster('error', '报名失败，' + result.message)
                    }
                    console.log(result)
                    $modal.addClass('fade');
                },
                error: function () {
                    toaster('error', '报名失败！')
                    $modal.addClass('fade')
                }
            })
        } else {
            toaster('warning', '请阅读并同意比赛协议！')
        }
    })
    // 意见反馈
    var suggestion = $('#suggestion').validate({
        rules: {
            content: "required"
        },
        messages: {
            content: "请输入您的问题或建议，我们的进步离不开您的帮助，谢谢！"
        },
        submitHandler: function (form) {
            var $modal = $(form).parents('.modal');
            var data = $(form).serializeArray();
            $.ajax({
                type: 'POST',
                url: '/suggestion',
                data: data,
                success: function (result) {
                    if (result.data) {
                        toaster('success', '意见反馈成功！')
                    } else {
                        toaster('error', '反馈失败，' + result.message)
                    }
                    $modal.addClass('fade');
                },
                error: function () {
                    toaster('error', '反馈失败！')
                    $modal.addClass('fade')
                }
            })
        }
    });

    // 需求登记
    var checkIn = $('#checkIn').validate({
        rules: {
            phone: {
                required: true,
                minlength: 11,
                isMobile: true
            },
            budget: {
                required: true,
                number: true
            },
            verify: {
                remote: {
                    type: "POST",
                    url: "/check-verify",
                    data: {
                        verify: function() {
                            return $("#checkIn input[name=verify]").val();
                        }
                    },
                    dataType: "json",
                    dataFilter: function(data, type) {
                        return data
                    }
                }
            }
        },
        messages: {
            demand: {
                required: '请一句话描述您的需求'
            },
            phone: {
                required: "请输入手机号",
                minlength: "不能小于11个字符",
                isMobile: "请正确填写手机号码"
            },
            budget: {
                required: '请填写预算',
                number: '请输入数字'
            },
            verify: {
                required: '请输入验证码',
                remote: '验证码不正确'
            }
        },
        submitHandler: function (form) {
            var $modal = $(form).parents('.modal');
            var data = $(form).serializeArray();
            var verify = data.pop();
            // var url = $(form).attr('action')
            $.ajax({
                type: 'POST',
                url: '/check-in',
                data: data,
                success: function (result) {
                    if (result.data) {
                        toaster('success', '恭喜您，登记成功！')
                    } else {
                        toaster('error', '登记失败，' + result.message)
                    }
                    $modal.addClass('fade');
                },
                error: function () {
                    toaster('error', '登记失败！')
                    $modal.addClass('fade')
                }
            })
        }
    });

    // 咨询登记
    var consult = $('#consult').validate({
        rules: {
            phone: {
                required: true,
                minlength: 11,
                isMobile: true
            },
            verify: {
                remote: {
                    type: "POST",
                    url: "/check-verify",
                    data: {
                      verify: function() {
                        return $("#consult input[name=verify]").val();
                      }
                    },
                    dataType: "json",
                    dataFilter: function(data, type) {
                        return data
                    }
                }
            }
        },
        messages: {
            issueTitle: {
                required: '请描述您的问题'
            },
            issueDesc: {
                required: '请详细描述您的问题'
            },
            phone: {
                required: "请输入手机号",
                minlength: "不能小于11个字符",
                isMobile: "请正确填写手机号码"
            },
            verify: {
                required: '请输入验证码',
                remote: '验证码不正确'
            }
        },
        submitHandler: function (form) {
            var $modal = $(form).parents('.modal');
            var data = $(form).serializeArray();
            var verify = data.pop();
            $.ajax({
                type: 'POST',
                url: "/consult-add",
                data: data,
                success: function (result) {
                    if (result.data) {
                        toaster('success', '恭喜您，登记成功！')
                    } else {
                        toaster('error', '登记失败，' + result.message)
                    }
                    $modal.addClass('fade');
                },
                error: function () {
                    toaster('error', '登记失败！')
                    $modal.addClass('fade')
                }
            })
        }
    });

    // 基本信息
    var basic = $('#basic').validate({
        rules: {
            phone: {
                required: true,
                minlength: 11,
                isMobile: true
            },
            email: {
                required: true,
                email: true
            }
        },
        messages: {
            username: {
                required: '请输入用户名'
            },
            name: {
                required: '请输入昵称'
            },
            phone: {
                required: "请输入手机号",
                minlength: "不能小于11个字符",
                isMobile: "请正确填写手机号码"
            },
            email: {
                required: "请输入邮箱",
                email: "请输入正确的邮箱地址"
            }
        },
        submitHandler: function (form) {
            var $form = $(form);
            var data = $form.serialize();
            $.ajax({
                type: 'POST',
                url: '/basic',
                data: data,
                success: function(result) {
                    if (result.data) {
                        $form.find('.user-info-item').children('.static').each(function(i, el) {
                            var _value = $(el).next().val();
                            if ($(el).next().hasClass('radio-group')) {
                                _value = $(el).next().find('.checked').text();
                            } else if ($(el).next().is('select')) {
                                if ($(el).next().find(':selected').val() !== '0') {
                                    _value = $(el).next().find(':selected').text() + ' ' + $(el).next().next().find(':selected').text()
                                } else {
                                    _value = ''
                                }
                            }
                            $(el).text(_value)
                        });
                        
                        $form.removeClass('form-editor').addClass('form-static').prev().find('.btn-edit').show();
                        toaster('success', '保存成功！')
                    } else {
                        toaster('success', '保存失败！')
                    }
                },
                error: function() {
                    toaster('success', '保存失败！')
                }
            })
        }
    });

    // 当前状态
    var currentState = $('#currentState').validate({
        submitHandler: function (form) {
            var $form = $(form);
            var data = $form.serialize();
            $.ajax({
                type: 'POST',
                url: '/current-state',
                data: data,
                success: function(result) {
                    if (result.data) {
                        $form.find('.user-info-item').children('.static').each(function(i, el) {
                            var _value = $(el).next().val();
                            if ($(el).next().hasClass('radio-group')) {
                                _value = $(el).next().find('.checked').text();
                            } else if ($(el).next().is('select')) {
                                _value = $(el).next().find('[value=' + _value + ']').text();
                                console.log('educationType -->', _value)
                            }
                            $(el).text(_value)
                        });
                        
                        $form.removeClass('form-editor').addClass('form-static').prev().find('.btn-edit').show();
                        toaster('success', '保存成功！')
                    } else {
                        toaster('success', '保存失败！')
                    }
                },
                error: function() {
                    toaster('success', '保存失败！')
                }
            })
        }
    })

    // 设置安全
    var updatePassword = $('#updatePassword').validate({
        rules: {
            password: {
                minlength: 6,
                maxlength: 20,
                regex: "^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$"
                // regex: "^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$"
            },
            password_again: {
                equalTo: '#password'
            }
        },
        messages: {
            oldpassword: {
                required: '请输入原密码'
            },
            password: {
                required: '请输入新密码',
                minlength: '最少6个字符',
                maxlength: '最多20个字符',
                regex: '6~20个字符，包含数字、字母'
            },
            password_again: {
                required: '请确认新密码',
                equalTo: '与新密码不一致'
            }
        },
        submitHandler: function (form) {
            var $form = $(form);
            var data = $form.serialize();
            data = data.slice(0, data.lastIndexOf('&'))
            $.ajax({
                type: 'POST',
                url: '/update-password',
                data: data,
                success: function(result) {
                    if (result.data) {
                        // console.log('result -->', result)
                        $form.css('display', 'none').prev().find('.btn-edit').show()
                        toaster('success', '重置密码成功！')
                    } else {
                        toaster('success', result.message)
                    }
                },
                error: function() {
                    toaster('success', '重置密码失败！')
                }
            })
        }
    })

    // 实名认证
    var certification = $('#certification').validate({
        rules: {
            name: {
                required: true
            },
            idCardNo: {
                required: true,
                isIdCardNo: true
            },
            idCardFrontFile: {
                checkPic: true
            },
            idCardBackFile: {
                checkPic: true
            }
        },
        submitHandler: function (form) {
            // $(form).submit();
            var $form = $(form);
            var data = new FormData();
            data.append('name', form[0].value);
            data.append('idCardNo', form[1].value);
            data.append('idCardFrontFile', form[2].files[0]);
            data.append('idCardBackFile', form[3].files[0]);
            $.ajax({
                type: 'POST',
                url: '/certification',
                enctype: 'multipart/form-data',
                processData: false,
                contentType: false,
                data: data,
                success: function(result) {
                    if (result.data) {
                        if (location.search.indexOf('tab') == -1) {
                            location.href = location.href + '?tab=authentication';
                        } else {
                            location.href = location.href
                        }
                        setTimeout(function() {
                            toaster('success', '提交成功！')
                        }, 100)
                        
                    } else {
                        toaster('error', result.message)
                    }
                },
                error: function(error) {
                    toaster('error', '提交失败！')
                }
            })
        }
    })

    $('#suggestion').on('click', 'button[type=reset]', function () {
        suggestion.resetForm();
    })

    $('#checkIn').on('click', 'button[type=reset]', function () {
        checkIn.resetForm();
    })

    $('#consult').on('click', 'button[type=reset]', function () {
        consult.resetForm();
    })

    $('#basic').on('click', 'button[type=reset]', function () {
        basic.resetForm();
    })
    $('#currentState').on('click', 'button[type=reset]', function () {
        currentState.resetForm();
    })
    $('#updatePassword').on('click', 'button[type=reset]', function () {
        updatePassword.resetForm();
    })

    $('#certification').on('change', 'input[type=file]', function (e) {
        var file = e.target.files[0];
        var imgUrl = window.URL.createObjectURL(file);
        var $img = $('<img alt="身份证" />').attr('src', imgUrl)
        $(this).parent('.file-upload').addClass('no-bg').find('img').remove().end().append($img)
    })

    $('.school-list').on('click', 'li', function(e) {
        console.log('target ', $(e.target))
        console.log('currentTarget ', $(e.currentTarget))
        var school = $(this).text();
        $(this).parent().hide().siblings('input').val(school)
    })

    // 学校搜索
    $('input[name=schoolName]').keyup(function() {
        var $list = $(this).siblings('.school-list');
        $list.children().remove();
        var $lis;
        $.ajax({
            type: 'GET',
            url: '/schoolName',
            data: {schoolName: $(this).val()},
            success: function(result) {
                if (result.length) {
                    $lis = result.map(function(item) {
                        return '<li>' + item + '</li>'
                    }).join(' ');
                } else {
                    $lis = $('<li>没有数据</li>');
                }
                $list.append($lis).slideDown();
            },
            error: function() {
                $lis = $('<li>请求发生错误</li>');
                $list.append($lis).slideDown();
            }
        })
    });

    // 区域
    $('select[name=parentRegionId]').change(function() {
        var parentId = $(this).find(':selected').val();
        if (parentId !== '0') {
            $.ajax({
                type: 'GET',
                url: '/regionList',
                data: {id: parentId},
                success: function(result) {
                    if (result.length) {
                        var options = result.map(function(item) {
                            return '<option value="' + item.id + '">' + item.name + '</option>'
                        }).join(' ');
                        $('select[name=regionId]').children().remove().end().append(options).attr('disabled', false);
                    }
                },
                error: function() {
                    console.log('regionList 请求失败')
                }
            })
        } else {
            $('select[name=regionId]').attr('disabled', true);
        }
    });

    // 验证码图片换一张
    $('.verify').on('click', 'img', function() {
        var src = $(this).attr('src');
        if (src.indexOf('?') > -1) {
            src = src.slice(0, src.indexOf('?'));
        }
        $(this).attr('src', src + '?rnd=' + Math.random());
    });

    // AI市场分类筛选
    $('.classify input[name=labels]').on('change', function() {
        $(this).parents('form[name=search]').submit()
    });
    $('.ai-market .list-header input[name=sort]').on('change', function() {
        $(this).parents('form[name=search]').submit()
    });

    // 提交比赛结果
    $('.competition-upload').on('change', 'input[type=file]', function(e) {
        var file = e.target.files[0];
        var data = new FormData();
        data.append('file', file);
        $.ajax({
            type: 'POST',
            url: $(this).parents('form').attr('action'),
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            data: data,
            success: function(result) {
                if (result.data) {
                    var scrollTop = $(document).scrollTop()
                    if (location.search.indexOf('tab') == -1) {
                        location.href = location.href + '?tab=submited';
                    } else {
                        location.href = location.href
                    }
                    $('body').scrollTop(scrollTop);
                    setTimeout(function() {
                        toaster('success', '提交结果成功！')
                    }, 100)
                    
                } else {
                    toaster('error', result.message)
                }
            },
            error: function(error) {
                toaster('error', '提交失败！')
            }
        })
    });

    // 比赛排行榜--赛季
    $('#ranking form[name=rankingData] input[type=radio]').on('click', function() {
        $(this).parents('form').submit()
    })
}) 