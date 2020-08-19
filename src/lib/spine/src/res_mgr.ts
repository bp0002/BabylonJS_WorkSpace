/**
 * BABYLON 资源加载
 */

import { register as _register, ResTab, Res } from 'pi_sys/util/res_mgr';
import { utf8Decode } from 'pi_sys/feature/string';
import { RES_TYPE_FILE } from 'pi_sys/device/file';

export const register = _register;

export const SPINE_JSON_TYPE        = 'SPINE_JSON_TYPE';
export const SPINE_ATLAS_TYPE       = 'SPINE_ATLAS_TYPE';
export const SPINE_TEXTURE_TYPE     = 'SPINE_TEXTURE_TYPE';

export const loadJson = (resTab: ResTab, path: string) => {
    const peomise = new Promise((resolve, reject) => {
        resTab.load(RES_TYPE_FILE, path, [path])
            .then((res: Res) => {
                let data: Uint8Array = res.link;
                if (!ArrayBuffer.isView(data)) {
                    data = new Uint8Array(<ArrayBuffer>data);
                }

                const str = utf8Decode(data);
                const json = JSON.parse(str);

                resolve(json);
            })
            .catch((err) => {
                reject(err);
            });
    });

    return peomise;
};

export const loadAtlas = (resTab: ResTab, path: string) => {
    const peomise = new Promise((resolve, reject) => {
        resTab.load(RES_TYPE_FILE, path, [path])
            .then((res: Res) => {
                let data: Uint8Array = res.link;
                if (!ArrayBuffer.isView(data)) {
                    data = new Uint8Array(<ArrayBuffer>data);
                }

                const str = utf8Decode(data);

                resolve(str);
            })
            .catch((err) => {
                reject(err);
            });
    });

    return peomise;
};

export const loadImage = (resTab: ResTab, path: string) => {
    const peomise = new Promise((resolve, reject) => {
        resTab.load('image', path, [])
            .then((res: Res) => {
                let image: HTMLImageElement = res.link;
                resolve(image);
            })
            .catch((err) => {
                reject(err);
            });
    });

    return peomise;
};

// const loadJSONRes: LoadCall = (tab: ResTab, _type: 'BABYLON_TEXTURE_TYPE', _name: string, ...args: any[]): Promise<ITexture> => {
//     const peomise = new Promise((resolve, reject) => {
//         tab.load(RES_TYPE_FILE, _name, args)
//             .then((res: Res) => {
//                 let data: Uint8Array = res.link;
//                 if (!ArrayBuffer.isView(data)) {
//                     data = new Uint8Array(<ArrayBuffer>data);
//                 }

//                 const str = utf8Decode(data);
//                 const json = JSON.parse(str);

//                 resolve(json);
//             });
//     });

//     return peomise;
// };

// const loadGeometryRes: LoadCall = (tab: ResTab, _type: 'BABYLON_GEOMETRY_TYPE', _name: string, ...args: any[]): Promise<IGeometry> => {
//     const p = new Promise((resolve: (res: IGeometry) => void, rejects) => {
//         resolve(createGeometryRes(_type, _name, args[0], undefined));
//         tab.tab.set(`${_type}:${_name}`, <any>{ link: args[0] });
//     });

//     return p;
// };

// const loadImageRes: LoadCall = (tab: ResTab, _type: 'BABYLON_IMAGE_TYPE', _name: string, ...args: any[]): Promise<IImage> => {
//     const p = new Promise((resolve: (res: IImage) => void, rejects) => {
//         // const image = new Image();
//         // image.onload = () => {
//         //     resolve(image)
//         // };

//         // image.src = _name.startsWith('http:') ? _name : `/${_name}`;

//         tab.load("image", _name, args).then((res) => {
//             resolve(res.link);
//         });
//     });

//     return p;
// };

// const loadAnimationRes: LoadCall = (tab: ResTab, _type: 'BABYLON_ANIMATION_TYPE', _name: string, ...args: any[]): Promise<IAnimation> => {
//     const p = new Promise((resolve: (res: IAnimation) => void, rejects) => {
//         resolve(createAnimationRes(_type, _name, args[0], undefined));
//         tab.tab.set(`${_type}:${_name}`, <any>{ link: args[0] });
//     });

//     return p;
// };

// const createTextureRes = (_type: string, _name: string, texture: BABYLON.InternalTexture, _: any): ITexture => {
//     console.log(_name);
//     return texture;
// };

// const createGeometryRes = (_type: string, _name: string, geometry: Geometry, _: any): IGeometry => {
//     console.log(_name);
//     return geometry;
// };

// const createAnimationRes = (_type: string, _name: string, keys: BABYLON.IAnimationKey[], _: any): IAnimation => {
//     return keys;
// };

// const destroyTextureRes = (r: ITexture) => {
//     (<Engine>(<any>r)._engine)._releaseTexture(r);
// };

// const destroyGeometryRes = (r: IGeometry) => {
//     // (<Engine>(<any>r.link)._engine)._releaseTexture(r.link);
//     // BABYLON.Geometry.prototype.dispose.call(r.link);
//     r.dispose();
// };

// const destroyImageRes = (r: IImage) => {
//     r.src = '';
// };

// const destroyAnimationRes = (r: IAnimation) => {
//     // r.link.src = '';
// };

// // ====================================================================
// register(SPINE_JSON_TYPE, loadJSONRes, destroyTextureRes);
// register(BABYLON_GEOMETRY_TYPE, loadGeometryRes, destroyGeometryRes);
// register(BABYLON_IMAGE_TYPE, loadImageRes, destroyImageRes);
// register(BABYLON_ANIMATION_TYPE, loadAnimationRes, destroyAnimationRes);

// export const RES_TYPE_FILE          = 'RES_TYPE_FILE';
// interface IFile {
//     link: ArrayBuffer;
// }
// const loadFile: LoadCall = (tab: ResTab, _type: 'RES_TYPE_FILE', _name: string, ...args: any[]): Promise<IFile> => {
//     const fileinfo = getFile(_name);

//     return new Promise((resolve, reject) => {
//             getStore().read(_name).then((res)=>{
//                 resolve(res[1])
//             });
//         });
// }

// register(RES_TYPE_FILE, loadFile, () => {});
