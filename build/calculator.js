"use strict";
class Calculator {
    display;
    currentValue = '0';
    previousValue = '';
    operation = null;
    shouldResetDisplay = false;
    constructor() {
        this.display = document.getElementById('display');
        this.addEventListeners();
    }
    addEventListeners() {
        // Add event listener for clicking
        document.querySelector('.buttons')?.addEventListener('click', (e) => {
            const target = e.target;
            if (target.matches('button')) {
                const value = target.value;
                if (target.classList.contains('number')) {
                    this.handleNumber(value);
                }
                else if (target.classList.contains('operation')) {
                    this.handleOperation(value);
                }
                else if (target.classList.contains('modifier')) {
                    // Do not hover over the AC button after switching from keyboard to clicking button
                    // This is easily visible in Google Chrome and not Firefox
                    // This is not an issue in Safari (Webkit)
                    this.handleModifier(value);
                }
            }
        });
        // Add event listener for keyboard inputs
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }
    handleKeyPress(e) {
        const key = e.key;
        if (/^[0-9.]/.test(key)) {
            this.handleNumber(key);
        }
        else if (['+', '-', '*', '/'].includes(key)) {
            this.handleOperation(key);
        }
        else if (key === 'Enter') {
            this.handleOperation('=');
        }
        else if (key === 'Escape') {
            this.handleModifier('clear');
        }
        else if (key === '%') {
            this.handleModifier('percent');
        }
        else if (key === 'Backspace') {
            this.handleBackspace();
        }
    }
    handleNumber(num) {
        if (this.shouldResetDisplay) {
            this.currentValue = num;
            this.shouldResetDisplay = false;
        }
        else {
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
    handleOperation(op) {
        if (op === '=') {
            this.calculate();
        }
        else {
            if (this.operation !== null) {
                this.calculate();
            }
            this.operation = op;
            this.previousValue = this.currentValue;
            this.shouldResetDisplay = true;
        }
    }
    handleModifier(mod) {
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
    handleBackspace() {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        }
        else {
            this.currentValue = '0';
        }
        this.updateDisplay();
    }
    calculate() {
        if (this.operation === null || this.previousValue === '')
            return;
        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);
        let result;
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
    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.updateDisplay();
    }
    changeSign() {
        this.currentValue = (parseFloat(this.currentValue) * -1).toString();
        this.updateDisplay();
    }
    percentage() {
        this.currentValue = (parseFloat(this.currentValue) / 100).toString();
        this.updateDisplay();
    }
    updateDisplay() {
        this.display.textContent = this.currentValue;
    }
}
// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
module.exports = Calculator;
