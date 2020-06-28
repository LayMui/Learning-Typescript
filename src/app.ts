// Validation
interface Validatable {
    value: string | number;
    required?: boolean; //alternative: required: boolean | undefined
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validatableInput: Validatable) {
    let isValid = true;
    if(validatableInput.required) { 
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if(validatableInput.minLength) {
        // validatableInput.minLength !== undefined or validatableInput.minLength != null
        // validatableInput.minLength != null -> this include both null and undefined
        // make sure we run this check even if minLength is set to 0
        if(validatableInput.minLength != null && typeof validatableInput.value === 'string') {
            isValid = isValid && validatableInput.value.length > validatableInput.minLength;
        }
    }
    if(validatableInput.maxLength) {
        if(validatableInput.minLength != null && typeof validatableInput.value === 'string') {
            isValid = isValid && validatableInput.value.length < validatableInput.maxLength;
        }
    }
    if(validatableInput.min != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value > validatableInput.min;
    }
    return isValid;

}
// autobind decorator
function autobind(
  target: any,
  methodName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  };
  return adjDescriptor;
}

// ProjectInput Class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById(
      'project-input'
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = 'user-input';

    this.titleInputElement = this.element.querySelector(
      '#title'
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      '#people'
    ) as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;
    const titleValidatable: Validatable = {
        value: enteredTitle,
        required: true
    };
    const descriptionValidatable: Validatable = {
        value: enteredDescription, 
        required: true,
        minLength:5
    };
    const peopleValidatable: Validatable = {
        value: +enteredPeople, 
        required: true,
        min: 1,
        max: 5
    }
    if(!validate(titleValidatable) ||
        !validate(descriptionValidatable) ||
        !validate(peopleValidatable)) {
        alert('Invalid input. please try again!');
        return; // return void 
    }
    else {
        return [enteredTitle, enteredDescription, +enteredPeople]; //return the tuple
    }
}

private clearInputs()
{
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
}

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
   const userInput = this.gatherUserInput();
   // To check during runtime if it's tuple (tuple is just array), 
   // in JS, there is no way to check instanceOf tuple but we can use
   // Array.isArray to check if it is a tuple (which is an Array)
   if (Array.isArray(userInput)) {
       const [title, desc, people] = userInput;
       console.log(title, desc, people);
       this.clearInputs();
   }
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

const projectInput = new ProjectInput();
