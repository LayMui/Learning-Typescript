// Write in the Object-oriented approach
class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    element: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        // Render to the DOM
        const importedNode = document.importNode(this.templateElement.content, true);
        // importedNode is of type DocumentFragment
        // need a concrete HTML element
        this.element = importedNode.firstElementChild as HTMLFormElement; 
        this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

        this.configure();
        this.attach();
    }

    private submitHandler(event: Event) {
        event.preventDefault(); //prevent URL http request to be sent
        console.log(this.titleInputElement.value);
    }

    // Add event listener
    private configure() {
        this.element.addEventListener('submit', this.submitHandler.bind(this))
    }

    private attach() {
        // the place where I want to render my content
        // (ie: insert the HTML element)
        // argument take the parameter where to insert and what you want to insert
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}

const projectInput = new ProjectInput();