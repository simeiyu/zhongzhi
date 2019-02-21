$(document).ready(function() {
    // 根据职业显示表单
    function followProfession(professionType) {
        $('#profession_' + professionType).show().find('span.static').next().attr('disabled', false);
        $('#profession_' + professionType).siblings(':not(.form-group)').hide().find('span.static').next().attr('disabled', true);
        if (professionType != 1) {
            $('#profession_more').show().find('span.static').next().attr('disabled', false);
        }
    }

    // 根据url查询字符串tab的值
    function getTargetTab () {
        var qs = location.search.length > 0 ? location.search.substring(1) : '',
            items = qs.length ? qs.split('&') : [],
            item = null,
            name = null;
        for (var i = 0; i < items.length; i++) {
            item = items[i].split('=');
            name = decodeURIComponent(item[0]);
            if (name == 'tab') {
                return decodeURIComponent(item[1]);
            }
        }
        return null;
    }

    if ($('.tab')) {
        var qs_tab = getTargetTab();
        if (qs_tab) {
            $('.tab').find('.tab-nav a[data-target=' + qs_tab + ']').parent().addClass('active').siblings().removeClass('active').parents('.tab').children('.tab-content').find('#' + qs_tab).show().siblings().hide();
            if (qs_tab == 'ranking') {
                var top = $('.tab').offset().top
                $(document).scrollTop(top);
            }
        }
    }

    // tab
    $('.tab-nav > li > a').click(function() {
        var _id = $(this).attr('data-target');
        $(this).parent().addClass('active').siblings().removeClass('active').parents('.tab').children('.tab-content').find('#' + _id).fadeIn().siblings().hide();
    })

    // 头部用户头像
    $('.user-photo').click(function(e) {
        e.stopPropagation();
        $(this).siblings('ul').slideDown('fast');
    })
    $('body').click(function() {
        $('.user-avatar > ul').slideUp('fast');
    })

    // 个人信息
    $('.user-info .btn-edit').click(function() {
        var $form = $(this).parent().next();
        if ($form.hasClass('form-static')) {
            $form.removeClass('form-static').addClass('form-editor');
        } else if ($form.hasClass('form-password')) {
            $form.css('display', 'block');
        }
        $(this).hide();
    })
    $('.user-info').on('click', '.btn-cancel', function() {
        var $form = $(this).parents('form')        
        if ($form.hasClass('form-editor')) {
            $form.removeClass('form-editor').addClass('form-static').prev().find('.btn-edit').show();
        } else if ($form.hasClass('form-password')) {
            $form.css('display', 'none').prev().find('.btn-edit').show();
        }
        
    })
    var professionType = $('.user-info input[name=professionType]:checked').val()
    followProfession(professionType);
    $('.user-info input[name=professionType]').click(function() {
        // $(this).parent().addClass('checked').siblings().removeClass('checked');
        professionType = $(this).val();
        followProfession(professionType);
    })

    // 多选框
    $('input[type=checkbox]:checked').parent('label').addClass('checked');
    $('input[type=checkbox]').change(function() {
        var checked = $(this).is(':checked');
        if (checked) {
            $(this).parent('label').addClass('checked');
        } else {
            $(this).parent('label').removeClass('checked');
        }
    })

    // 单选框组
    $('.radio-group').on('click', 'input[type=radio]', function() {
        $(this).parent('label').addClass('checked').siblings().removeClass('checked')
    })
    
    // 弹窗
    $('.show-modal').click(function(e) {
        var name = $(this).attr('data-target');
        if (name === 'consult' && $(this).hasClass('is-list')) {
            var _v = $(this).parents('.service').find('.title').text();
            $('.modal[data-name=' + name + ']').find('input[readonly="readonly"]').val(_v)
        }
        $('.modal[data-name=' + name + ']').removeClass('fade');
    })
    $('.modal').on('click', '.hide-modal', function(e) {
        $(this).parents('.modal').addClass('fade');
    });

})