# pi_spine
* 设置 缩放 - 位移 - 旋转
    - 程序对运行时状态的修改
    - 修改未生效时
        - 检查 json 配置中 animations 属性内是否有 为 "root" 创建的动画数据 - 不应该有
        - 美术重新处理
        - root 如果确实是美术设计的有效动画 - 则程序不应该进行操作 
        - 美术设计了缩放，则程序在创建后不能设置缩放, 同时美术没有设计旋转动画，则程序可设置旋转
* 美术导出
    - 类似下列动画数据不应该导出 - 实际没有动画效果
    ```
                "bone4": {
                    "rotate": [
                        { "time": 0, "angle": 0, "curve": "stepped" },
                        { "time": 2, "angle": 0 }
                    ],
                    "translate": [
                        { "time": 0, "x": 0, "y": 0, "curve": "stepped" },
                        { "time": 2, "x": 0, "y": 0 }
                    ],
                    "scale": [
                        { "time": 0, "x": 1, "y": 1, "curve": "stepped" },
                        { "time": 2, "x": 1, "y": 1 }
                    ],
                    "shear": [
                        { "time": 0, "x": 0, "y": 0, "curve": "stepped" },
                        { "time": 2, "x": 0, "y": 0 }
                    ]
                },
    ```