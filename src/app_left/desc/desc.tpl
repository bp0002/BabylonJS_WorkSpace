{{: it.strs = it.strs || ["null"]}}
<div isSendNextLayer='1' style="width: 30%;height: 100%;pointer-events: none;background-color: #ebebeb88;display: none;" >
    <span style="width:300px;height:33px;position: absolute; left: 0; top: 0;font-size: 30px;color:#f00;">Demo-说明</span>
    <div style="position: absolute; top: 33px;">
        <span style="font-size: 30px;color:rgb(238, 255, 0);white-space: pre-wrap;">控制台运行 demo01() | demo02 ....</span>
    </div>
    <div style="position: absolute; top: 66px;width: 100%;">
        {{for k,v in it.strs}}
        <div style="width: 100%;">
            <span style="font-size: 30px;color:rgb(0, 98, 255);white-space: pre-wrap;">{{v}}</span>
        </div>
        {{end}}
    </div>
</div>