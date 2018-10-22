
var world = [];
var probe = 0;
var simplex = new SimplexNoise('seed');
var buildings = [];

var global = {};

var le_world = [];
var conv_world = [];
var changables = [];

var w = 1920;
var h = 960;

var _explain = {
    en: {
        j: "JOB",
        m: "MEDICARE",
        t: "TRAFFIC",
        h: "HOUSING",
        i: "INCOME",
        ed: "EDUCATION",
        ec: "ECONOMY",
        en: "ENVIRONMENT",
        hp: "HOUSE-PRICE",


        j_err: "INSUFFICENT JOB OPPORTUNITY",
        m_err: "INSUFFICENT MEDICAL RESOURCE",
        t_err: "TRAFFIC INEFFICIENCY",
        h_err: "INSUFFICENT HOUSING",
        i_err: "AVG INCOME TOO LOW",
        ed_err: "INSUFFICENT EDUCATION RESOURCE",
        ec_err: "LOW ECONOMIC VALUE",
        en_err: "ENVIROMENTAL ISSUES",
        hp_err: "POTENTIALLY IN-BALANCED HOUSE-PRICE",
    },
    cn: {
        j_err: "区域就业机会不足",
        m_err: "区域医疗资源不足",
        t_err: "平均交通压力较高",
        h_err: "区域住房资源可能存在问题",
        i_err: "区域平均收入过低",
        ed_err: "区域教育资源不足",
        ec_err: "区域产值低于均值",
        en_err: "环境压力较大",
        hp_err: "区域性住房成本问题",

        j: "就业",
        m: "医疗",
        t: "交通",
        h: "住房",
        i: "收入",
        ed: "教育",
        ec: "经济",
        en: "环境",
        hp: "地产"
    }
};

function explain(t) {
    return _explain[config.lang][t];
}

var qst_tabs = {
    selection: -1,
    children: [
        {
            name: '沙盘\n模拟',
            url: undefined
        },
        {
            name: '城市\n运营',
            selection: -1,
            url: 'http://gcv-core-stg.pingan.com.cn:10002/index/spys.html?rand',
            children: [
                {
                    name: '财政',
                    selection: -1,
                    url: 'http://gcv-core-stg.pingan.com.cn:10002/index/home.html#type1',
                    children: [
                        {
                            tiny: true,
                            name: "财政\n全貌",
                            url: 'http://103.28.215.253:10465/zbh/index.html',
                        },
                        {
                            tiny: true,
                            name: "财政\n收支",
                            url: 'http://103.28.215.253:10465/zbh-finance-map/default.html#/main/monitorProfile'
                        },
                        {
                            tiny: true,
                            name: "融资\n服务",
                            url: 'http://103.28.215.253:10465/gfp-web/bidding-trend-detail.html?projectId=2461&channel=3000&bidWay=0&isPreBid=0&canReplay=1&bidType=01'
                        },
                        {
                            tiny: true,
                            name: "资产\n负债",
                            url: 'http://103.28.215.253:10465/zbh-smart-expo-app/index.html#!/assets/important'
                        },
                        {
                            tiny: true,
                            name: "扶贫\n监管",
                            url: 'http://103.28.215.253:10465/zbh-fp/default.html#/SZmain/fpProject'
                        }
                    ]
                },
                {
                    name: '经济',
                    selection: -1,
                    children: [
                        {
                            tiny: true,
                            name: "商事\n信息",
                            url: 'http://gcv-core-stg.pingan.com.cn:10015/mqs-view/#/'
                        }
                    ],
                    url: 'http://gcv-core-stg.pingan.com.cn:10002/index/home.html#type2'
                },
                {
                    name: '医疗',
                    url: 'http://gcv-core-stg.pingan.com.cn:10002/index/home.html#type4'
                },
                {
                    name: '交通',
                    selection: -1,
                    url: "http://gcv-core-stg.pingan.com.cn:10002/index/home.html#type8",
                    children: [
                        {
                            tiny: true,
                            name: "预约\n通行",
                            url: 'http://gcv-core-stg.pingan.com.cn:10002/index/pages-e2/traffic/7.30/booking.html?scenicId=1#etrafficmap',
                        },
                        {
                            tiny: true,
                            name: "车流\n监控",
                            url: 'http://gcv-core-stg.pingan.com.cn:10002/index/pages-e2/traffic/7.30/booking.html'
                        },
                        {
                            tiny: true,
                            name: "违法\n监管",
                            url: 'https://sce-test.pingan.com.cn/mgt/'
                        }
                    ]
                },
                {
                    tiny: true,
                    name: "舆情",
                    url: "http://gcv-core-stg.pingan.com.cn:10002/index/home.html#type12"
                },
                {
                    tiny: true,
                    name: "政务",
                    url: "http://gcv-core-stg.pingan.com.cn:10002/index/home.html#type10"
                },
                {
                    tiny: true,
                    name: "房产",
                    url: "http://gcv-core-stg.pingan.com.cn:10002/index/home.html#type6"
                },
                {
                    tiny: true,
                    name: "惠民",
                    url: "http://gcv-core-stg.pingan.com.cn:10002/index/home.html#type9"
                },
                {
                    tiny: true,
                    name: "教育",
                    url: "http://gcv-core-stg.pingan.com.cn:10002/index/home.html#type5"
                },
                {
                    tiny: true,
                    name: "应急",
                    url: "http://gcv-core-stg.pingan.com.cn:10002/index/home.html#type11"
                },
                {
                    tiny: true,
                    name: "人口",
                    selection: -1,
                    children: [
                        {
                            tiny: true,
                            name: "人口\n分析",
                            url: 'http://gcv-core-stg.pingan.com.cn:10002/index/pages-e2/baoan_pepole.html'
                        },
                    ],
                    url: "http://gcv-core-stg.pingan.com.cn:10002/index/home.html#type3"
                },
                {
                    tiny: true,
                    name: "环保",
                    url: "http://gcv-core-stg.pingan.com.cn:10002/index/home.html#type7"
                },
            ]
        }]
};



var config = {
    qst: false,
    enableLeap: true,
    simulatorFps: 15,
    affector_range: 10,
    simulation_radius: 10,
    super_dilute: false,
    view: 'j',
    warning_threshold: 40,
    magnification: 0.5,
    touchZone: 1,
    linkZone: 3,
    lensMode: 0,
    showCriticalHint: false,
    showHeatHint: false,
    heatMapOpacityCap: 1,
    heatMode: 0, //0 = normal, 1 = high contrast,
    touchless_timeout: 5000,
    lang: 'cn',
    upscreen: undefined,
    tabs: qst_tabs,
    override: undefined
};

var condensed = {
    allFactors: [],
    worldConfigs: []
};

var chunks = {
    positions: []
};

var computed = {
    aspects: []
};

var dw = 1920;
var dh = 1080;

var app = new PIXI.Application({ width: dw, height: dh, antialias: true });

var pixi_rect = new PIXI.Graphics();
pixi_rect.beginFill(0xffffff);
pixi_rect.drawRect(0, 0, 40, 40);
pixi_rect.x = 0;
pixi_rect.y = 0;


var pixi_circle = new PIXI.Graphics();
pixi_circle.beginFill(0xffffff, 1);
pixi_circle.arc(0, 0, 500, 0, Math.PI * 2, false);
pixi_circle.endFill();

var pixi_stroke_circle = new PIXI.Graphics();
pixi_stroke_circle.lineStyle(10, 0xffffff);
pixi_stroke_circle.arc(0, 0, 500, 0, Math.PI * 2, false);


var rectTexture = pixi_rect.generateTexture();
var circleTexture = pixi_circle.generateTexture();
var circleStrokeTexture = pixi_circle.generateTexture();
var strokeTexture = PIXI.Texture.fromImage('assets/strokes.png')

document.body.appendChild(app.view);

setInterval(() => {
    socket.emit("pack", {
        computed: computed,
        condensed: condensed,
        config: config,
        chunks: chunks,
        names: names
    });
}, 1000);

setInterval(() => {
    socket.emit("config", config);
}, 1000);

setInterval(() => {
    socket.emit("selections", {
        selectors: leapSelectors.map(v => {
            if (v.lensMode == 0 && v.active) {
                return v.selected.map(t => {
                    return t.id
                })
            } else {
                return []
            }
        }),
        linked: leapSelectors.map(v => {
            if (v.lensMode == 1) {
                return v.linked.map(t => {
                    return t.id
                })
            } else {
                return []
            }
        })
    });
}, 50);

var hands = [];
var hands_pos = [];
var clickState = 0;
var last_click = [];
var last_t = [];

var hand_id = {};
if (config.enableLeap) {
    var ctller = Leap.loop({ enableGestures: true }, (frame) => {
        hands = frame.hands;
        if (!config.enableLeap) { return; }
    });
}

function updateLeapHandPos() {
    hands_pos = [];
    if (hands.length > 0) {
        //sphereCenter
        for (var i = 0; i < hands.length; i++) {
            var x = hands[i].palmPosition[0] * 5;
            var z = 1 - Math.min(3, Math.max(0, hands[i].palmPosition[1] / 200)) / 3;
            var y = hands[i].palmPosition[2] * 5;
            hands_pos.push([
                x, y, z, hands[i].grabStrength, hands[i].pinchStrength,
                hands[i].fingers[1].tipPosition[0] * 5,
                hands[i].fingers[1].tipPosition[2] * 5 + 500,
                1 - Math.min(3, Math.max(0, hands[i].fingers[1].tipPosition[1] / 200)) / 3,
                0
            ])
            hands_pos[i][9] = hands[i].type == 'right' ? 1 : 0;
            hands_pos[i][8] = 0;
            var ptcur = hands_pos[i][7] - hands_pos[i][2];
            last_t[i] = last_t[i] || 0;
            last_click[i] = last_click[i] || Date.now();
            if (hands[i].timeVisible > 2 && Date.now() - last_click[i] > 500 && last_t[i] && Math.abs((ptcur - last_t[i]) * 500) > 5) {
                // console.log((ptcur - last_t[i]));
                if (Date.now() - last_click[i] > 300) {
                    last_click[i] = Date.now();
                    hands_pos[i][8] = 1;
                }
            }
            last_t[i] = ptcur;
            // if(hand_id[hands[i].id] == 1) {
            //     hands_pos[i][8] = 1;
            //     hand_id[hands[i].id] = 0;
            // }

        }
    }

}