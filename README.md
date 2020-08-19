# BabylonJS_WorkSpace
经验 BABYLONJS 框架的使用
# 光照
* PBR 材质光照 可以曝光
* 一般材质 Shader 内 做了限制 clamp(xxxx, 0.0, 1.0) * baseColor.rgb;
    + 去除 clamp 也能做到曝光
* 模型可调整 diffuseColor 额外调整有光照时的效果: 地表接受其他受高亮度光影响的模型的阴影，但地表自身不要高光
* spectacularColor 设置为黑色 - 取消模型高光部分
* disableLighting 模型不受光照影响

# 粒子
* 方向问题 - Unity 基于 +z, BABYLON 基于 +Y

# 场景中多层半透明的渲染，需要指定明确的渲染顺序(babylon 中 为 alphaIndex ), 否则某些模型会出现渲染错误

# 动画切换过渡
* AnimationGroup.blendingSpeed
* AnimationGroup.enableBlending
* 循环动画 过渡到 非循环动画 注意考虑是否先将循环动画改变为不循环
    - AnimationGroup.loopAnimation 

# 动画组合
* 美术层拆分,代码层组合
    - 制作可进行组合的动画, 运行时根据情况组装为新的动画
    - 组装出的动画从当前动画过渡过来运行
    - 组装的新动画也开启可过渡
    - 另一种方式是美术做出所有可能的动画,程序只处理过渡即可,但美术工作量大，且资源量运行数据量都大
* 虚幻引擎 https://docs.unrealengine.com/udk/Three/AnimationOverviewCH.html
    + AnimationGroup.targetedAnimations - Data Nodes(数据节点) (方形) 
    + AnimationGroup - Blend Nodes(混合节点) (圆形) 
        - 这些节点有一组子节点，并以某种方式把它们混合到一起
    + 更高级的处理
        - AdditiveAnimation(叠加型动画) (BABYLON支持) 默认情况下，AnimSequences(动画序列)存储完整的骨架动画。但是它也可以构建并使用叠加型动画。叠加型动画通过在AnimSet(动画集)编辑器中对两个动画相减来进行构建。然后动画树再使用几个节点把这个叠加型动画添加回去。Additive Animation(叠加型)动画通过去掉冗余数据从而可以作为一种压缩方式。(比如：放松的走步和瞄准的走步，取出这两种走步，仅保存放松走步和瞄准走步的不同作为一个附加部分)。尽管是一个进行操作的小技巧，但它可以在很大程度上降低所使用的动画的数量并降低所使用的内存空间