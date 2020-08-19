export namespace NumberInput {
    let call: (v: number) => void;
    let inputNode: HTMLInputElement;
    export function setOnChange(f: (v: number) => void) {
        call = f;
        createInput();
    }
    export function unsetOnChange() {
        call = undefined;
    }
    function createInput() {
        if (!inputNode) {
            inputNode = document.createElement('input');
            inputNode.style.display = 'block';
            inputNode.style.fontSize = '30px';
            inputNode.style.height = '40px';
            inputNode.style.width = '200px';
            inputNode.style.backgroundColor = '#83a78d';
            inputNode.style.position = 'absolute';
            inputNode.style.bottom = '0';
            inputNode.style.right = '0';
            inputNode.style.border = '0';
            inputNode.type = 'number';
            inputNode.addEventListener('change', change);

            document.body.appendChild(inputNode);
        }
    }
    function change(e) {
        call && call(inputNode.valueAsNumber);
    }
}