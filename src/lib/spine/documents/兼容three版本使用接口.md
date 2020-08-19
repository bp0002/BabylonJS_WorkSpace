# three 使用方式
* mgr
    + mgr.create
        - 修改为 SpineManager.createSpine
    + mgr.remove
        - 修改为 model.destroy
    + mgr.modify
        - 修改为 model.setXXXX
    + mgr.destroyScene
        - 修改为 SpineManager.destroyScene
    + mgr.createScene
        - 修改为 SpineManager.createScene

* 资源文件调整
    + 每个spine动画单独一个文件夹,文件夹名称为spine名称