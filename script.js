let cart = []
let modalKey = 0
let modalQt = 1

//Seletor unico de elementos HTML
const sel = (elemento) => document.querySelector(elemento)
//Seletor multiplo de elementos HTML
const selAll = (elemento) => document.querySelectorAll(elemento)

//Listagem de Pizzas
pizzaJson.map( (item, index) => {

    let pizzaItem = sel(".models .pizza-item").cloneNode(true)

    pizzaItem.setAttribute("data-key", index)
    pizzaItem.querySelector(".pizza-item--img img").src = item.img
    pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name
    pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${item.prices[1].toFixed(2)} (Tamanho M)`
    pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description
    pizzaItem.querySelector("a").addEventListener("click", (evento) => {

        //Cancela a atualização da tela
        evento.preventDefault()

        modalQt = 1
        let key = evento.target.closest(".pizza-item").getAttribute("data-key")
        modalKey = key

        sel(".pizzaInfo h1").innerHTML = pizzaJson[key].name
        sel(".pizzaBig img").src = pizzaJson[key].img
        sel(".pizzaInfo--desc").innerHTML = pizzaJson[key].description
        sel(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].prices[2].toFixed(2)}`

        sel(".pizzaInfo--size.selected").classList.remove("selected")

        selAll(".pizzaInfo--size").forEach((size, sizeIndex)=>{

            if(sizeIndex == 2) {
                //Tamanho padrão selecionado GRANDE
                size.classList.add("selected")
            }

            size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex]

        })

        sel(".pizzaInfo--qt").innerHTML = modalQt
        
        sel(".pizzaWindowArea").style.opacity = 0
        sel(".pizzaWindowArea").style.display = "flex"
        /*Timer para garantir o set da opacidade anterior 
        e permitir a animação de transição*/
        setTimeout(() => sel(".pizzaWindowArea").style.opacity = 1, 200)

    })

    //Adiciona o elemento pizzaItem a div das pizzas
    sel(".pizza-area").append(pizzaItem)

})

//                EVENTOS DO MODAL

const closeModal = () => {

    sel(".pizzaWindowArea").style.opacity = 0
    /*Timer para garantir o set da opacidade anterior 
    e permitir a animação de transição*/
    setTimeout(() => sel(".pizzaWindowArea").style.display = "none", 500)

}

// FECHAR
selAll(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton")
    .forEach((item) => {

        item.addEventListener("click", closeModal)

    })

// DECREMENTAR QUANTIDADE
sel(".pizzaInfo--qtmenos").addEventListener("click", ()=>{

    if(modalQt > 1) {
        modalQt--
        sel(".pizzaInfo--qt").innerHTML = modalQt
    }

})

// INCREMENTAR QUANTIDADE
sel(".pizzaInfo--qtmais").addEventListener("click", ()=>{

    modalQt++
    sel(".pizzaInfo--qt").innerHTML = modalQt

})

// SELECIONAR TAMANHO
selAll(".pizzaInfo--size").forEach((size, sizeIndex)=>{

    size.addEventListener("click",(evento)=>{
        sel(".pizzaInfo--size.selected").classList.remove("selected")
        size.classList.add("selected")

        switch (size.getAttribute("data-key")) {
            case "0":
                sel(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[modalKey].prices[0].toFixed(2)}`
                break;
            case "1":
                sel(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[modalKey].prices[1].toFixed(2)}`
                break;
            case "2":
                sel(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[modalKey].prices[2].toFixed(2)}`
                break;
        
            default:
                break;
        }
    })

})

//ADICIONAR AO CARRINHO
sel(".pizzaInfo--addButton").addEventListener("click", ()=>{

    let size = parseInt(sel(".pizzaInfo--size.selected").getAttribute("data-key"))
    let identifier = pizzaJson[modalKey].id+"@"+size
    let key = cart.findIndex( (item) => item.identifier == identifier )

    if(key > -1) {
        cart[key].qt += modalQt
    } else {

        cart.push({

            identifier,
            id: pizzaJson[modalKey].id,
            size: size,
            qt: modalQt
    
        })

    }

    updateCart()
    closeModal()

})

// BOTÃO MOBILE PARA ABRIR O CARRINHO
sel(".menu-openner").addEventListener("click", () => {
    if(cart.length > 0) {
        sel("aside").style.left = "0"
    }
})

// BOTÃO MOBILE PARA FECHAR O CARRINHO
sel(".menu-closer").addEventListener("click", () => {
    sel("aside").style.left = "100vw"
})

// CARRINHO DE COMPRAS

const updateCart = () => {

    sel(".menu-openner span").innerHTML = cart.length

    // Carrinho tem algum item
    if(cart.length > 0) {

        // Mostra a área do carrinho
        sel("aside").classList.add("show")
        // Limpa o conteúdo inicial para evitar duplicatas
        sel(".cart").innerHTML = ""

        let subtotal = 0
        let desconto = 0
        let total = 0

        for(let i in cart) {

            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id)

            let cartItem = sel(".models .cart--item").cloneNode(true)
            let pizzaSizeName
            let preco

            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = "P"
                    preco = pizzaItem.prices[0]
                    break;
                case 1:
                    pizzaSizeName = "M"
                    preco = pizzaItem.prices[1]
                    break;
                case 2:
                    pizzaSizeName = "G"
                    preco = pizzaItem.prices[2]
                    break;
                default:
                    break;
            }

            subtotal += preco * cart[i].qt

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

            cartItem.querySelector("img").src = pizzaItem.img
            cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName
            cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt
            cartItem.querySelector(".cart--item-qtmenos").addEventListener("click", ()=>{
                if(cart[i].qt > 1) {
                    cart[i].qt--
                } else {
                    cart.splice(i, 1)
                }
                updateCart()
            })
            cartItem.querySelector(".cart--item-qtmais").addEventListener("click", ()=>{
                cart[i].qt++
                updateCart()
            })


            sel(".cart").append(cartItem)

        }

        desconto = 0.1 * subtotal
        total = subtotal - desconto

        sel(".cart--totalitem.subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`
        sel(".cart--totalitem.desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`
        sel(".cart--totalitem.total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`


    // Carrinho sem nenhum item
    } else {

        sel("aside").classList.remove("show")
        sel("aside").style.left = "100vw"

    }

}