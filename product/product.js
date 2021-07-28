const constants = {
    CART_STORAGE_KEY: 'cart',
    PRODUCT_STORAGE_KEY: 'product'
};

const Utils = {
    formatPrice(price) {
        return price.toLocaleString("en-US", {
            style: "currency",
            currency: "USD"
        });
    }
}

const Storage = {
    getItem(key) {
        try {
            return JSON.parse(window.localStorage.getItem(key));
        } catch (e) {
            return null;
        }
    },
    setItem(key, value) {
        const strValue = JSON.stringify(value);
        window.localStorage.setItem(key, strValue);
    },
    removeItem(key) {
        window.localStorage.removeItem(key);
    }
}
let form = document.querySelector('form');

if (form) {
    form.addEventListener('submit', (e) => {
        const formData = new FormData(e.target);
        let product = new Product(formData.get('name'), formData.get('price'),
            formData.get('image'), formData.get('description'), formData.get('amount'));
        localStorage.setItem(product.name, JSON.stringify(product));
    });
}

class Product {
    constructor(name, price, image, description, amount) {
        this.name = name;
        this.price = price;
        this.image = image;
        this.description = description;
        this.amount = amount;
    }

    static read() {
        let items = {...localStorage};
        let product = '';
        for (let item in items) {
            if (item === 'cart') continue;
            item = JSON.parse(localStorage.getItem(item));
            product += `<div class="card" style="width: 18rem;">
                            <img src="images/${item.image}" alt="chocolate" class="img-responsive product img-fluid">
                            <div class="card-body">
                                <p class="title">${item.name}</p>
                                <p class="description">${item.description}</p>
                                <p class="price">${item.price} $</p>
                                <div class="row" class="buttons">
                                    <div class="col-6">
                                        <button type="button" class="btn btn-custom cart" name="${item.name}">Add to cart</button><br><br>
                                        <button type="button" class="btn btn-custom update" data-bs-toggle="modal" data-bs-target="#updateModal" name="${item.name}">Update product</button>
                                    </div>
                                    <div class="col-6">
                                        <button type="button" class="btn btn-custom delete" name="${item.name}"><i class="bi bi-trash-fill"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>`;
        }
        document.getElementById('products').innerHTML = product;
        const updateButtons = document.querySelectorAll('.update');
        updateButtons.forEach((element) => {
            element.addEventListener('click', () => {
                let product = JSON.parse(localStorage.getItem(element.name));
                document.getElementById('name').value = product.name;
                document.getElementById('price').value = product.price;
                document.getElementById('description').value = product.description;
                document.getElementById('image').value = product.image;
                document.getElementById('amount').value = product.amount;
                document.getElementById('update').addEventListener('click', () => {
                    product.name = document.getElementById('name').value;
                    product.price = document.getElementById('price').value;
                    product.description = document.getElementById('description').value;
                    product.image = document.getElementById('image').value;
                    product.amount = document.getElementById('amount').value;
                    localStorage.setItem(product.name, JSON.stringify(product));
                    location.reload();
                })
            })
        })
        const addToCart = document.querySelectorAll('.cart');
        addToCart.forEach((element) => {
            element.addEventListener('click', () => {
                let jsonProduct = JSON.parse(localStorage.getItem(element.name));
                let product = new Product(jsonProduct.name, jsonProduct.price, jsonProduct.image, jsonProduct.description, jsonProduct.amount);
                let cart = new Cart();
                cart.addItem(product);

                localStorage.setItem('cart', JSON.stringify(cart));
            })
        })

    }

    static delete(name) {
        localStorage.removeItem(name);
        location.reload();
    }
}

class Cart {
    constructor() {
        this.load();
    }

    load() {
        this.items = (JSON.parse(localStorage.getItem('cart'))?.items ?? []).map(
            (productData) => new Product(productData.name, productData.price, productData.image, productData.description, productData.amount)
        );
    }

    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    addItem(product) {
        let item = this.items.find((element => element.name === product.name));
        if(item){
        }
        else {
            this.items = [...this.items, product];
        }
        this.save();
    }

    viewCart() {
        let cartBody = document.getElementById('cartBody');
        cartBody.innerHTML = "";
        this.items.forEach(function (element) {
            const item = document.createElement("div");
            item.setAttribute('class', 'card mb-3');
            item.style.maxWidth = "540px";
            item.innerHTML = `<div class="row g-0">
                                <div class="col-md-4">
                                    <img src="images/${element.image}" class="img-fluid rounded-start" alt="chocolate">
                                </div>
                             <div class="col-md-8">
                             <div class="col-md-6"
                                <div class="card-body">
                                <div class="row g-0">
                                <div class="col-md-8">
                                <h5 class="card-title">${element.name}</h5>
                                <p class="card-text">Price (per unit): ${element.price}$</p>
                                </div>
                                <div class="col-md-4" style="float: right;">
                                <button type="button" class="btn btn-custom deleteCart" name="${element.name}">X</button>
                                </div>
                                </div>
                                </div>
                             </div>
                            </div>
                            </div>`
            cartBody.appendChild(item);
        })
        let delButtons = document.querySelectorAll('.deleteCart');
        let cart = this;
        delButtons.forEach( (element) => {
            element.addEventListener('click', () => {
                cart.deleteItem(element.name);
                cart.viewCart();
            })
        })
    }

    deleteItem(productName) {
        this.items = this.items.filter((p) => p.name !== productName);
        this.save();
    }
}

Product.read();

document.querySelector('.delete').addEventListener('click', function () {
    Product.delete(this.name);
});
document.getElementById('cart').addEventListener('click', function () {
    if (localStorage.getItem('cart') === null ||
        localStorage.getItem('cart').length === 2) {
        document.getElementById('cartBody').innerHTML = '<p>Your cart is empty</p>'
    } else {
        let cart = new Cart();
        cart.viewCart();
    }
})






