let form = document.querySelector('form');

if(form) {
  form.addEventListener('submit', (e) => {
        const formData = new FormData(e.target);
        let product = new Product(formData.get('name'), formData.get('price'),
            formData.get('image'), formData.get('description'));
        localStorage.setItem(product.name, JSON.stringify(product));
    });
}

class Product {
    constructor(name, price, image, description) {
        this.name = name;
        this.price = price;
        this.image = image;
        this.description = description;
    }

    static read() {
        let items = {...localStorage};
        let product = '';
        let index = 1;
        for (let item in items) {
            item = JSON.parse(localStorage.getItem(item));
            product += `<div class="col-4">
                            <img src="images/${item.image}" alt="chocolate" class="img-responsive product img-fluid">
                            <p class="title">${item.name}</p>
                            <p class="description">${item.description}</p>
                            <p class="price">${item.price} $</p>
                            <button type="button" class="btn btn-custom">Add to cart</button>
                        </div>`;
            if (index % 3 === 0) product += `<br>`;
        }
        document.getElementById('products').innerHTML = product;
    }
}
Product.read();



