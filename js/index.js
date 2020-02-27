window.onload=function(){
    //动态生成所有li
    (function(){
        var len=5*5*5,
            oUl=document.getElementById("list").children[0],
            aLi=oUl.children;

        //初始化
        (function(){
            for (var i=0;i<len;i++){
                oLi=document.createElement("li");
                oLi.index=i;
                oLi.x=i%5;
                oLi.y=Math.floor(i%25/5);
                oLi.z=4-Math.floor(i/25);

                //获取数据
                var data=flyData[i] || flyData[0];
                // 添加li的内容
                oLi.innerHTML = "<b class='liCover'></b>" +
                                "<p class='liTitle'>" + data.type + "</p >" +
                                "<p class='liAuthor'>" + data.author + "</p>" +
                                "<p class='liTime'>" + data.time + "</p>";
                //确定li的3D位置
                var tX=Math.random()*6000-3000,
                    tY=Math.random()*6000-3000,
                    tZ=Math.random()*6000-3000;
                //设置最初的随机初始值
                oLi.style.transform="translate3D("+tX+"px,"+tY+"px,"+tZ+"px)";


                oUl.appendChild(oLi);
            }
            setTimeout(Grid,50);//加载完运行Grid定时器
        })();

        //关于弹窗
        (function (){
            //获取元素
            var oAlert=document.getElementById("alert"),
                oATitle=document.getElementsByClassName("title")[0].getElementsByTagName("span")[0],
                oAImg=document.getElementsByClassName("img")[0].getElementsByTagName("img")[0],
                oAAuthor=document.getElementsByClassName("author")[0].getElementsByTagName("span")[0],
                oAInfo=document.getElementsByClassName("info")[0].getElementsByTagName("span")[0];

            //获取弹出时需要使用的元素
            var oAll=document.getElementById("all"),
                oFrame=document.getElementById("frame"),
                oBack=document.getElementById("back");
            //通过事件委托给每个li添加点击事件
            oUl.onclick=function(e){
                var target=e.target;

                if(target.nodeName=="B"){
                    if(target.wD){
                        target.wD=false;
                    }else{
                        //根据alert的display状态判断显示还是隐藏
                        if(oAlert.style.display=="block"){
                            hide();
                        }else{
                         //获取显示所需要的元素
                         var index=target.parentNode.index,
                             data=flyData[index]||flyData[0];

                         oAlert.index=index;

                         //修改弹窗内容
                         oATitle.innerHTML = "标题: " + data.title;
                         oAImg.src = "src/" + data.src +"/index.jpg";
                         oAAuthor.innerHTML = "姓名: " + data.author;
                         oAInfo.innerHTML = "描述: " + data.dec;
                         show();
                        }
                    }    
                }
                //取消事件冒泡
                e.cancelBubble=true;
            }

            //点击弹窗跳转
            oAlert.onclick=function(){
                var data=flyData[this.index]||flyData[0];
                oFrame.src="src/"+data.src+"/index.html";
                oAll.className="left";
                //阻止事件冒泡
                return false;
            }
            //点击返回back
            oBack.onclick=function(){
                oAll.className="";
            }

            //点击除了oAlert以外的地方都消失
            document.onclick=function(){
                hide();
            }

            //弹窗显示
            function show(){
                //自定义一个属性，避免动画执行时再次点击执行
                if(!oAlert.timer){
                    oAlert.timer=true;

                    //设置弹窗初始位置
                    oAlert.style.display="block";
                    oAlert.style.transform="rotateY(0deg) scale(2)";
                    oAlert.style.opacity="0";
                    //运动函数
                    var time=300;
                    var sTime=new Date();
                    function s(){
                        var prop=(new Date()-sTime)/time;
                        //不能大于1 透明度得拉回1
                        if(prop>=1){
                            prop=1;
                            oAlert.timer=false;
                        }else{
                            requestAnimationFrame(s);
                        }
                        oAlert.style.transform="rotateY(0deg) scale("+(2-prop)+")";
                        oAlert.style.opacity=prop;
                    }
                    requestAnimationFrame(s);
                }
            }
            //弹窗隐藏
            function hide(){
                if(oAlert.style.display=="block" && !oAlert.timer){
                    oAlert.timer=true;

                    //设置弹窗隐藏初始位置
                    oAlert.style.display="block";
                    oAlert.style.transform="ratateY(0deg) scale(1)";
                    oAlert.style.opacity="1";

                    
                }
                //运动函数
                var time=300;
                var sTime=new Date();
                function s(){
                    var prop=(new Date()-sTime)/time;
                     //不能大于1 透明度得拉回1
                    if(prop>=1){
                        prop=1;
                        oAlert.timer=false;
                            
                        oAlert.style.display="none";

                    }else{
                        requestAnimationFrame(s);
                    }
                    oAlert.style.transform="rotateY("+prop*180+"deg) scale("+(1-prop)+")";
                    oAlert.style.opacity=1-prop;
                    }
                    requestAnimationFrame(s);
            }
        })();

        //拖拽
        (function(){
            //定义旋转参数
            var roX=0,//绕X轴旋转
                roY=0,
                trZ=-2000;
            
            //清楚字体被选中
            document.onselectstart=function (){
                return false;
            }

            //鼠标按下
            document.onmousedown=function(e){
                //定义参数
                var mouseX=e.clientX,//鼠标点击时的X
                    mouseY=e.clientY,
                    lastX=mouseX,//最后一次的X
                    lastY=mouseY,
                    x_=0,//最后一次的X差值
                    y_=0,
                    lastTime=0,//最后一次的缓冲时间

                    ifTime=new Date;

                //解决拖拽时在B上拖拽误触发弹窗
                if(e.target.nodeName=="B"){
                    var thisLi=e.target;
                }

                //鼠标移动
                this.onmousemove=function(e){
                    //计算差值
                    x_=e.clientX-lastX;
                    y_=e.clientY-lastY;
                    //计算旋转度数并旋转Ul
                    roX-=y_*0.15;//0.15为旋转系数
                    roY+=x_*0.15;
                    oUl.style.transform="translateZ("+trZ+"px) rotateX("+roX+"deg) rotateY("+roY+"deg)";
                    //重新赋值最后的值以及获取鼠标移动后的时间
                    lastX=e.clientX;
                    lastY=e.clientY;
                    lastTime=new Date;
                } 
                //鼠标抬起
                this.onmouseup=function(e){

                    //解决拖拽时在B上拖拽误触发弹窗
                    if(e.target==thisLi&&(newDate-ifTime)>500){
                        thisLi.wD=true;
                    }

                    //清楚鼠标移动
                    this.onmousemove=null;
                    //缓冲
                    function s(){
                        x_*=0.9;
                        y_*=0.9;
                        //计算旋转度数并旋转Ul
                        roX-=y_*0.15;//0.15为旋转系数
                        roY+=x_*0.15;
                        oUl.style.transform="translateZ("+trZ+"px) rotateX("+roX+"deg) rotateY("+roY+"deg)";   
                        //判断距离小到忽略不计停止缓冲
                        if (Math.abs(x_)<0.1&&Math.abs(y_)<0.1) return;
                        requestAnimationFrame(s);
                    }
                    //判断时间特别快时进行缓冲
                    if (new Date-lastTime<100){
                        requestAnimationFrame(s);
                    }
                }

            }
            // 滚轮滚动改变Z轴移动
            !function (fn) {
                // 滚轮兼容
                if (document.onmousewheel === undefined) {
                    // 这里火狐浏览器执行
                    document.addEventListener('DOMMouseScroll', function (e) {
                        var d = - e.detail / 3;
                        fn(d)
                    }, false)
                } else {
                    // 主流浏览器
                    document.onmousewheel = function (e) {
                        var d = e.wheelDelta / 120;
                        fn(d)
                    }
                }
            }(function (d) {
                trZ += d * 100;
                oUl.style.transform = "translateZ(" + trZ + "px) rotateX(" + roX + "deg) rotateY(" + roY + "deg)";
            });
        })();

        //左下角按钮点击
        (function(){
            //获取按钮
            var aBtn=document.getElementById("btn").getElementsByTagName("li");
            var arr=[Table,Sphere,Helix,Grid];
            for(var i=0;i<aBtn.length;i++){
                aBtn[i].onclick=arr[i];
            }
        })();

        //Table  
        function Table() {
            if (Table.arr) {
              for (var i = 0; i < len; i++) {
                aLi[i].style.transform = Table.arr[i]
              }
            } else {
      
              Table.arr = [];
              var n = Math.ceil(len / 18) + 2; // 计算li要排列多少行
              var midY = n / 2 - 0.5;        // 现在有9行,ul所要的位置在第四行
              var midX = 18 / 2 - 0.5;      // 计算传值方向上ul所在的x的位置
      
              // 定义每个li之间的间距
              var disX = 170;
              var disY = 210;
      
              var arr = [
                { x: 0, y: 0 },
                { x: 17, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 1 },
                { x: 12, y: 1 },
                { x: 13, y: 1 },
                { x: 14, y: 1 },
                { x: 15, y: 1 },
                { x: 16, y: 1 },
                { x: 17, y: 1 },
                { x: 0, y: 2 },
                { x: 1, y: 2 },
                { x: 12, y: 2 },
                { x: 13, y: 2 },
                { x: 14, y: 2 },
                { x: 15, y: 2 },
                { x: 16, y: 2 },
                { x: 17, y: 2 },
              ];
      
              // 循环计算li的位置
              for (var i = 0; i < len; i++) {
                var x, y;
                if (i < 18) {
                  x = arr[i].x;
                  y = arr[i].y;
                } else {
                  x = i % 18;
                  y = Math.floor(i / 18) + 2;
                }
      
                // 设置li的位置
                var val = 'translate3D(' + (x - midX) * disX + 'px,' + (y - midY) * disY + 'px,0px)'
                Table.arr[i] = val;
                aLi[i].style.transform = val;
              }
            }
        }

        //Sphere 
        function Sphere() {
            if (Sphere.arr) {
              for (var i = 0; i < len; i++) {
                aLi[i].style.transform = Sphere.arr[i];
              }
            } else {
            Sphere.arr = [];
            // 定义arr确定球面一共多少层,以及每层多少个li
            var arr = [1, 3, 7, 9, 11, 14, 21, 16, 12, 10, 9, 7, 4, 1],
                arrlen = arr.length,
                xDeg = 180 / (arrlen - 1);
    
                // 循环遍历所有的li
                for (var i = 0; i < len; i++) {
                    // 定义变量来保存此时的i是球面上的第几层以及当前层的第几个
                    var numC = 0, //计算当前i是第几层
                        numG = 0,   //计算当前i是处于当前层的第几个
                        arrSum = 0;   //到目前层一共多少个li
        
                    // for循环判断此时的i是第几层的第几个
                    for (var j = 0; j < arrlen; j++) {
                    arrSum += arr[j]; 
        
                      // 判断i是第几层第几个
                      if (arrSum > i) {
                        numC = j;
                        numG = arr[j] - (arrSum - i);
                        break;
                      }
                    }
                    // i 0  numC 0 numG 0
                    // i 1  numC 1 numG 0
                    // i 2  numC 1 numG 1
                    // i 3  numC 1 numG 2
                    // i 4  numC 2 numG 0
        
                    // 根据当前层数求出当前层每个liY轴旋转度数
                    var yDeg = 360 / arr[numC];
                    // 设置li旋转
                    var val = "rotateY(" + (numG + 1.3) * yDeg + "deg) rotateX(" + (90 - numC * xDeg) + "deg) translateZ(800px)"
                    Sphere.arr[i] = val;
                    aLi[i].style.transform = val;
                }
            }
        }

        //Helix
        function Helix() {
          if (Helix.arr) {
            for (var i = 0; i < len; i++) {
                aLi[i].style.transform = Helix.arr[i]
            }
          } else {
            Helix.arr = [];
    
            var h = 3.7, //定义环数
                tY = 7, //每个li上下错位位移量
                num = Math.round(len / h),  // 确定每环多少个li
                deg = 360 / num,   // 计算每个liY轴旋转度数
                mid = len / 2 - 0.5;  // 找中间的li
    
            for (var i = 0; i < len; i++) {
                var val = "rotateY(" + i * deg + "deg) translateY(" + (i - mid) * tY + "px) translateZ(800px)";
                Helix.arr[i] = val;
                aLi[i].style.transform = val
            }
          }
        }

        //Grid
        function Grid(){
            if(Grid.arr){
                //不是第一次
                for(var i=0;i<len;i++){
                    aLi[i].style.transform=Grid.arr[i];
                }
            }else{
                //第一次计算
                //定义空数组
                Grid.arr=[];

                //设置每个li间的间距
                var xX=350,
                    yY=350,
                    zZ=800;
                for(var i=0;i<len;i++){
                    var oLi=aLi[i];
                    var disX=(oLi.x-2)*xX,
                        disY=(oLi.y-2)*yY,
                        disZ=(oLi.z-2)*zZ;
                    //确定变化后的最终坐标
                    var val="translate3D("+disX+"px,"+disY+"px,"+disZ+"px)";
                    Grid.arr[i]=val;
                    oLi.style.transform=val;
                }    
            }
           
        }

    })()
}