/**
 *
 */

// tslint:disable-next-line:interface-name
interface ILoadingScreen {
    // default loader support. Optional!
    loadingUIBackgroundColor: string;
    loadingUIText: string;
    // What happens when loading starts
    displayLoadingUI(): void;
    // What happens when loading stops
    hideLoadingUI(): void;
}

export class BABYLONLoading implements ILoadingScreen {
    public loadingUIBackgroundColor: string = 'gold';
    public loadingUIText: string = '';
    public displayLoadingUI() {
        //
    }
    public hideLoadingUI() {
        //
    }
}