let cart = [];
var areaprodutoQt = 1;
const q = (el) => document.querySelector(el);
const qa = (el) => document.querySelectorAll(el);
var keyproduto = 0;
var keySize = 0;
var aside = document.querySelector("aside");

produtoJson.map((item, index) => {
  let produtoItem = q(".produto-item").cloneNode(true);

  produtoItem.setAttribute("data-key", index);
  produtoItem.querySelector(".produto-item--img img").src = item.img; //pega a class da produtoItem (.produto-item--img) e seleciona o elemento IMG e depois muda o src
  produtoItem.querySelector(".produto-item--desc").innerHTML = item.description;
  produtoItem.querySelector(".produto-item--name").innerHTML = item.name;
  produtoItem.querySelector(
    ".produto-item--price"
  ).innerHTML = `R$ ${item.price.toFixed(2)}`; //toFixed(2) = todos os elementos ficam com 2 algarismos deposi da virgula

  //Janela Area Da produto Selecionada
  produtoItem.querySelector("a").addEventListener("click", (e) => {
    //para saber qual produto é (na hora de colocar no carrinho)
    var key = produtoItem.getAttribute("data-key");
    keyproduto = key;

    e.preventDefault(); //tira o evento de reload da pagina, que é algo padrao
    q(".produtoWindowArea").style.display = "flex";
    setTimeout(() => (q(".produtoWindowArea").style.opacity = 1), 100); //como o js é rapido, não da tempo de aparecer a transiçao da opacidade do 0 para o 1, o js pula direto para o 1, entao deve ter um tempo até a opacidade ir para 1, ai entra o setTimeOut
    //preenchendo dados da produto
    q(".produtoBig img").src = item.img;
    q(".produtoInfo h1").innerHTML = item.name;
    q(".produtoInfo--desc").innerHTML = item.description;
    q(".produtoInfo--actualPrice").innerHTML = `R$ ${item.price}`;
    q(".produtoInfo--qt").innerHTML = areaprodutoQt;

    //selecionando tamanho
    q(".produtoInfo--size.selected").classList.remove("selected");
    qa(".produtoInfo--size").forEach((size, sizeIndex) => {
      //seleciona o grande sempre que abrir a area da produto
      if (sizeIndex == 2) {
        size.classList.add("selected");
      }
      size.querySelector("span").innerHTML = item.sizes[sizeIndex];

      size.addEventListener("click", () => {
        q(".produtoInfo--size.selected").classList.remove("selected");
        size.classList.add("selected");
      });
    });
  });

  q(".produto-area").append(produtoItem);
});
function closeAreaproduto() {
  q(".produtoWindowArea").style.opacity = 0;
  setTimeout(() => (q(".produtoWindowArea").style.display = "none"), 500); //como o js é rapido, não da tempo de aparecer a transiçao da opacidade do 0 para o 1, o js pula direto para o 1, entao deve ter um tempo até a opacidade ir para 1, ai entra o setTimeOut
}
// funçoes para add ou remove produtos
function addproduto() {
  areaprodutoQt = areaprodutoQt + 1;

  q(".produtoInfo--qt").innerHTML = areaprodutoQt;
}
function removeproduto() {
  if (areaprodutoQt > 0) {
    areaprodutoQt = areaprodutoQt - 1;

    q(".produtoInfo--qt").innerHTML = areaprodutoQt;
  } else {
    return;
  }
}
//carrinho
function addCarrinho() {
  let keyQt = areaprodutoQt;

  let identifier = produtoJson[keyproduto].id;

  areaprodutoQt = 1;
  let key = cart.findIndex((item) => item.identifier == identifier);

  if (key > -1) {
    cart[key].qt += keyQt;
  } else {
    cart.push({
      identifier,
      id: produtoJson[keyproduto].name,
      qt: keyQt,
    });
  }
  upadetCart();
  closeAreaproduto();
}
//console.log(`${keyQt} produtos do Sabor de ${produtoJson[keyproduto].name} e o tamanho é ${produtoJson[keyproduto].sizes[size]} `)

q(".menu-openner").addEventListener("click", () => {
  if (parseInt(aside.style.right) == 0) {
    aside.style.right = "100%";
  } else {
    aside.style.right = "0";
  }
});
q(".menu-closer").addEventListener("click", () => {
  if (parseInt(aside.style.right) == 100) {
    aside.style.right = "0vw";
  } else {
    aside.style.right = "100%";
  }
});

function upadetCart() {
  q(".menu-openner span").innerHTML = cart.length;

  if (cart.length > 0) {
    q("aside").classList.add("show");
    q(".cart").innerHTML = "";

    let desconto = 0;
    let subtotal = 0;
    let total = 0;

    for (let i in cart) {
      let produtoItem = produtoJson.find((item) => item.name == cart[i].id);
      let cartItem = q(".models .cart--item").cloneNode(true);
      let qt = cart.qt;

      subtotal += produtoItem.price * cart[i].qt;

      let produtoName = `${produtoItem.name}`;
      cartItem.querySelector("img").src = produtoItem.img;
      cartItem.querySelector(".cart--item-nome").innerHTML = produtoName;
      cartItem.querySelector(".cart--item--qt").innerHTML = cart[i].qt;

      //adicionar funçao + e - do carrinho!

      cartItem
        .querySelector(".cart--item-qtmais")
        .addEventListener("click", () => {
          cart[i].qt++;
          upadetCart();
        });
      cartItem
        .querySelector(".cart--item-qtmenos")
        .addEventListener("click", () => {
          if (cart[i].qt > 1) {
            cart[i].qt--;
          } else {
            cart.splice(i, 1);
          }

          upadetCart();
        });

      q(".cart").append(cartItem);
    }
    // adicionando descontos e preços

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    q(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`;
    q(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`;
    q(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`;
  } else {
    q("aside").classList.remove("show");
  }

  q(".cart--finalizar").addEventListener("click", () => {
    let pedido = "";
    for (let t in cart) {
      pedido += ` ${cart[t].qt} ${cart[t].id} \n`;
    }

    var subpedido = "Boa Noite! Gostaria de:\n" + pedido;
    console.log(subpedido);

    var link =
      "https://wa.me/5511945894011?text=" + encodeURIComponent(subpedido);
    window.open(link);
  });
}
// sidebar
var btnBurger = document.querySelector(".lineBurger");
var btnClose = document.querySelector(".closeX");
var sideBar = document.querySelector(".sideBar");
var body = document.querySelector(".body");
var animaContato = document.querySelector(".animationContato");
var btnContato = document.getElementById("contato-sideBar");

btnContato.addEventListener("click", () => {
  if (animaContato.getAttribute("open") == "false") {
    animaContato.setAttribute("open", "open");
    animaContato.style.transition = ".5s";
    animaContato.style.height = "190px";
  } else {
    animaContato.setAttribute("open", "false");
    animaContato.style.transition = ".5s";
    animaContato.style.height = "0px";
  }
});

btnBurger.addEventListener("click", () => {
  body.style.overflow = "hidden";
  sideBar.style.transition = "0.3s";
  sideBar.style.width = "100vw";
});
btnClose.addEventListener("click", () => {
  sideBar.style.transition = "0.3s";
  sideBar.style.width = "0vw";
  body.style.overflow = "visible";
  animaContato.style.height = "0px";
});
