define(function (require, exports, module) {
    //alert("lalal");
    require('jquery');
    require('easyui');
    require('qrcode');
    var uri3 = '../../api/userinfo/GetUsers';
    var uri4 = '../../api/userinfo/PostUser1';
    var $sideMenu = $('#nav-aside');

    $('#qr').panel({
        width: 280,
        height: 280,
        title: '移动端下载（扫描二维码）',
        style: {

            position: 'absolute',
            top: '51.5%',
            bottom: '10px',
            borderBottom: '#ddd solid 1px'
        },
        onOpen: function () {
            //alert("qwer");
            //$('#qr').qrcode({
            //    render: "table",
            //    width: 160,
            //    height: 160,
            //    text: '/appweb/ystone.apk'
            //});
        }
    });
    $('#qr').qrcode({
        render: "table",
        width: 280,
        height: 240,
        text: 'Illeldldlldl/wkk/738883/appweb'
    });

})