class Calculator {
    private display: HTMLDivElement;
    private currentValue: string = '0';
    private previousValue: string = '';
    private operation: string | null = null;
    private shouldResetDisplay: boolean = false;

    constructor() {
        this.display = document.getElementById('display') as HTMLDivElement;
        this.addEventListeners();
    }

    private addEventListeners(): void {
        // Add event listener for clicking
        document.querySelector('.buttons')?.addEventListener('click', (e: Event) => {
            const target = e.target as HTMLButtonElement;
            if (target.matches('button')) {
                const value = target.value;
                if (target.classList.contains('number')) {
                    this.handleNumber(value);
                } else if (target.classList.contains('operation')) {
                    this.handleOperation(value);
                } else if (target.classList.contains('modifier')) {
                    this.handleModifier(value);
                }
            }
        });

        // Add event listener for keyboard inputs
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }

    private handleKeyPress(e: KeyboardEvent): void {
        const key = e.key;

        if (/^[0-9.]/.test(key)) {
            this.handleNumber(key);
        } else if (['+', '-', '*', '/'].includes(key)) {
            this.handleOperation(key);
        } else if (key === 'Enter') {
            this.handleOperation('=');
        } else if (key === 'Escape') {
            this.handleModifier('clear');
        } else if (key === '%') {
            this.handleModifier('percent');
        } else if (key === 'Backspace') {
            this.handleBackspace();
        }
    }

    private handleNumber(num: string): void {
        if (this.shouldResetDisplay) {
            this.currentValue = num;
            this.shouldResetDisplay = false;
        } else {
            if (this.currentValue.includes('.')) {
                if (num === ".") { // Don't allow repeating decimals (e.g. 12.3.6.5)
                    return;
                }
                else {
                    this.currentValue += num;
                }
            }
            else {
                this.currentValue = this.currentValue === '0' && num !== '.' 
                ? num 
                : this.currentValue + num;
            }
            
        }
        this.updateDisplay();
    }

    private handleOperation(op: string): void {
        if (op === '=') {
            this.calculate();
        } else {
            if (this.operation !== null) {
                this.calculate();
            }
            this.operation = op;
            this.previousValue = this.currentValue;
            this.shouldResetDisplay = true;
        }
    }

    private handleModifier(mod: string): void {
        switch (mod) {
            case 'clear':
                this.clear();
                break;
            case 'sign':
                this.changeSign();
                break;
            case 'percent':
                this.percentage();
                break;
        }
    }

    private handleBackspace(): void {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        } else {
            this.currentValue = '0';
        }
        this.updateDisplay();
    }

    private calculate(): void {
        if (this.operation === null || this.previousValue === '') return;

        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);
        let result: number;

        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = prev / current;
                break;
            default:
                return;
        }

        this.currentValue = result.toString();
        this.operation = null;
        this.previousValue = '';
        this.updateDisplay();
    }

    private clear(): void {
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.updateDisplay();
    }

    private changeSign(): void {
        this.currentValue = (parseFloat(this.currentValue) * -1).toString();
        this.updateDisplay();
    }

    private percentage(): void {
        this.currentValue = (parseFloat(this.currentValue) / 100).toString();
        this.updateDisplay();
    }

    private updateDisplay(): void {
        this.display.textContent = this.currentValue;
    }
}

// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});