class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
      this.previousOperandTextElement = previousOperandTextElement
      this.currentOperandTextElement = currentOperandTextElement
      this.clear()
    }
  
    clear() { /*Clears out and resets calculator by removing operands or performed operations.*/
      this.currentOperand = ''
      this.previousOperand = ''
      this.operation = undefined
    }
  
    delete() { /*Removes most recent character from the current operation being performed. */
      this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }
  
    appendNumber(number) { /*Adds number or decimal to current operation.*/
      if (number === '.' && this.currentOperand.includes('.')) return /*Prevents multiple decimals.*/
      this.currentOperand = this.currentOperand.toString() + number.toString()
    }
  
    chooseOperation(operation) { /*Choose which operation needs to be performed. Move current operand to previous.*/
      if (this.currentOperand === '') return
      if (this.previousOperand !== '') {
        this.compute()
      }
      this.operation = operation
      this.previousOperand = this.currentOperand
      this.currentOperand = ''
    }
  
    compute() { /*Actual computation function for calculator.*/
      let computation
      const prev = parseFloat(this.previousOperand)
      const current = parseFloat(this.currentOperand)
      if (isNaN(prev) || isNaN(current)) return
      switch (this.operation) {
        case '+': /*Adding*/
          computation = prev + current
          break
        case '-': /*Subraction*/
          computation = prev - current
          break
        case '*':/*Multiplication*/
          computation = prev * current
          break
        case '/': /*Division*/
          if (current === 0) {
            computation = "Error"; /*Prevents division by 0*/
          } else {
            computation = prev / current
          }
          break
        default:
          return
      }
      this.currentOperand = computation
      this.operation = undefined
      this.previousOperand = ''
    }
  
    getDisplayNumber(number) { /*Introducing comma and decimal functionality while formatting numbers to display properly.*/
      if (number === 'Error') {
        return 'Error'; /*Returns "Error" if the result is an error.*/
      }
      const stringNum = number.toString()
      const integerDigits = parseFloat(stringNum.split('.')[0])
      const decimalDigits = stringNum.split('.')[1]
      let integerDisplay
      if (isNaN(integerDigits)) {
        integerDisplay = ''
      } else {
        integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
      }
      if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`
      } else {
        return integerDisplay
      }
    }
  
    updateDisplay() { /*Updates display for operation with current values*/
      this.currentOperandTextElement.innerText =
        this.getDisplayNumber(this.currentOperand)
      if (this.operation != null) {
        this.previousOperandTextElement.innerText =
          `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
      } else {
        this.previousOperandTextElement.innerText = ''
      }
    }
  }
  
  
  const numberButtons = document.querySelectorAll('[data-number]')
  const operationButtons = document.querySelectorAll('[data-operation]')
  const equalsButton = document.querySelector('[data-equals]')
  const deleteButton = document.querySelector('[data-delete]')
  const allClearButton = document.querySelector('[data-all-clear]')
  const previousOperandTextElement = document.querySelector('[data-previous-operand]')
  const currentOperandTextElement = document.querySelector('[data-current-operand]')
  
  const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)
  
  /*Creating button functionality through mouse clicks*/
  numberButtons.forEach(button => {/*For number input*/
    button.addEventListener('click', () => {
      calculator.appendNumber(button.innerText)
      calculator.updateDisplay()
    })
  })
  
  operationButtons.forEach(button => { /*For operand input*/
    button.addEventListener('click', () => {
      calculator.chooseOperation(button.innerText)
      calculator.updateDisplay()
    })
  })
  
  equalsButton.addEventListener('click', button => { /*For equals (=) input*/
    calculator.compute()
    calculator.updateDisplay()
  })
  
  allClearButton.addEventListener('click', button => { /*For AC input*/
    calculator.clear()
    calculator.updateDisplay()
  })
  
  deleteButton.addEventListener('click', button => { /*For Delete input*/
    calculator.delete()
    calculator.updateDisplay()
  })

/*ENHANCEMENT 1*/
/*Keyboard functionality*/
document.addEventListener('keydown', event => {
  if (!isNaN(event.key) || event.key === '.') { /*If a number or period is pressed*/
    calculator.appendNumber(event.key)
    calculator.updateDisplay()
  } else if (['+', '-', '*', '/'].includes(event.key)) { /*Operator is chosen by operator keys*/
    calculator.chooseOperation(event.key)
    calculator.updateDisplay()
  } else if (event.key === 'Enter' || event.key === '=') { /*Compute on Enter or Equals key*/
    calculator.compute()
    calculator.updateDisplay()
  } else if (event.key === 'Backspace') { /*Backspace as delete*/
    calculator.delete()
    calculator.updateDisplay()
  } else if (event.key === 'c') { /*'C' for clear*/
    calculator.clear()
    calculator.updateDisplay()
  }
})