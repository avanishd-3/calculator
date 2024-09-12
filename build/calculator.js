var Calculator = /** @class */ (function () {
    function Calculator() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.display = document.getElementById('display');
        this.addEventListeners();
    }
    Calculator.prototype.addEventListeners = function () {
        var _this = this;
        var _a;
        // Add event listener for clicking
        (_a = document.querySelector('.buttons')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function (e) {
            var target = e.target;
            if (target.matches('button')) {
                var value = target.value;
                if (target.classList.contains('number')) {
                    _this.handleNumber(value);
                }
                else if (target.classList.contains('operation')) {
                    _this.handleOperation(value);
                }
                else if (target.classList.contains('modifier')) {
                    _this.handleModifier(value);
                }
            }
        });
        // Add event listener for keyboard inputs
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    };
    Calculator.prototype.handleKeyPress = function (e) {
        var key = e.key;
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
    };
    Calculator.prototype.handleNumber = function (num) {
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
    };
    Calculator.prototype.handleOperation = function (op) {
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
    };
    Calculator.prototype.handleModifier = function (mod) {
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
    };
    Calculator.prototype.handleBackspace = function () {
        if (this.currentValue.length > 1) {
            this.currentValue = this.currentValue.slice(0, -1);
        }
        else {
            this.currentValue = '0';
        }
        this.updateDisplay();
    };
    Calculator.prototype.calculate = function () {
        if (this.operation === null || this.previousValue === '')
            return;
        var prev = parseFloat(this.previousValue);
        var current = parseFloat(this.currentValue);
        var result;
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
    };
    Calculator.prototype.clear = function () {
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.updateDisplay();
    };
    Calculator.prototype.changeSign = function () {
        this.currentValue = (parseFloat(this.currentValue) * -1).toString();
        this.updateDisplay();
    };
    Calculator.prototype.percentage = function () {
        this.currentValue = (parseFloat(this.currentValue) / 100).toString();
        this.updateDisplay();
    };
    Calculator.prototype.updateDisplay = function () {
        this.display.textContent = this.currentValue;
    };
    return Calculator;
}());
// Initialize the calculator when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    new Calculator();
});
