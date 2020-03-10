# BabylonJS_WorkSpace
经验 BABYLONJS 框架的使用
# 光照
* PBR 材质光照 可以曝光
* 一般材质 Shader 内 做了限制 clamp(xxxx, 0.0, 1.0) * baseColor.rgb;
    + 去除 clamp 也能做到曝光
* 模型可调整 diffuseColor 额外调整有光照时的效果: 地表接受其他受高亮度光影响的模型的阴影，但地表自身不要高光
* spectacularColor 设置为黑色 - 取消模型高光部分
* disableLighting 模型不受光照影响