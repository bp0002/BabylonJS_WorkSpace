import { Index } from "./app/demo000";

export const InitOk = () => {
    Index.init(document.getElementsByTagName('canvas')[0]);
};