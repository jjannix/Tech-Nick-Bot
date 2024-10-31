function embedFooter() {
    const currentYear = new Date().getFullYear();
    return(`© @jnk ${currentYear}`)
}

module.exports = embedFooter ;