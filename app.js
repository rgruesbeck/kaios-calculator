class App {
    constructor(root, config) {
        this.root = root;
        this.config = config;

        this.state = {
            fields: this.config.settings.inputs.split(',').map(f => f.trim()),
            procedure: this.config.settings.procedure,
            result: 0
        };

        this.addClickHandler();
        this.render();
    }

    addClickHandler() {
        document.addEventListener('click', (event) => {
            let { action } = event.target.dataset;
            if (!action) { return; }

            if (action === 'run') {
                this.setState({
                    result: this.run()
                })
            }

        }, false);
    }

    run() {
        // replace each field with matching input values
        let procedure = this.state.fields
        .reduce((pro, fld) => {
            let val = document.getElementById(fld).value || null
            return pro.split(fld).join(val)
        }, this.state.procedure)

        // ignore procedures containing blank fields
        if (procedure.includes('null')) { return this.config.settings.errorMessage }

        return eval(procedure)
    }

    setState(state) {
        // create updates
        let updates = {
            ...this.state,
            ...state
        }

        // reject non-changes
        if (JSON.stringify(updates) === JSON.stringify(this.state)) { return; }

        // update state and rerender
        this.state = updates;
        this.render();
    }

    render() {
        this.root.innerHTML = `
        <div class="container">
            <h1>${this.config.settings.name}</h1>
            ${this.state.fields.map(f => {
                return `
                    <label for="${f}">${f}</label>
                    <input id="${f}"></input>
                `
            }).join('')}
            <div>${this.state.result}</div>
            <div data-action="run" class="button">Run</div>
        </div>
        `
    }
}

module.exports.default = App;