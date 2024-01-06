function Header() {

    // inline css to avoid creating a Header.css file for one declaration
    const css  = `
    #header {
        margin-block: 3em;
    }

    h1 {
        font-family: "Snap ITC", "Times New Roman", Times, serif;
        font-size: 3rem;

        text-align: center;
        letter-spacing: 0.18em;
    }
    `

    return (
        <div id="header">
            <style>
                {css}
            </style>
            <h1>AudioWander</h1>
        </div>
    )
}

export { Header };
