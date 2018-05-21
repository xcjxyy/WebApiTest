;(function() {
    var version = '1.0';
    seajs.config({

    // 别名配置
    alias: {
        'jquery': 'jquery.min.js',
        'easyui': 'jquery.easyui.min.js',
        'easyuiCN': 'easyui-lang-zh_CN.js',
        'cookie':'jquery.cookie.js',
        'qrcode': 'jquery.qrcode.min.js',
        'common':'Common.js'
    },

        // 路径配置
        // base: './statics/',


    // 变量配置
    vars: {
        'locale': 'zh-cn',
        'webPath': '/x'
    },

        // 映射配置
        map: [
            ['.css', '.css?v=' + version],
            ['.js', '.js?v=' + version]
        ],

        // 预加载项
        preload: ['jquery'],

        // 调试模式
        debug: true,

        // 文件编码
        charset: 'utf-8'
    });
})();
