const fortuneCookies = [
    "Deus ajuda quem cedo madruga.",
    "Mais vale um pássaro na mão do que dois voando.",
    "Quem tem boca vai a Roma.",
    "Até um idiota passa por inteligente se ficar calado.",
]

exports.getFortune = () => {
    const idx = Math.floor(Math.random()*fortuneCookies.length)
    return fortuneCookies[idx]
}