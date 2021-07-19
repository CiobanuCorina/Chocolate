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
            product += `<div class="card" style="width: 18rem;">
   <img src="images/${item.image}" alt="chocolate" class="img-responsive product img-fluid">
  <div class="card-body">
    <p class="title">${item.name}</p>
                            <p class="description">${item.description}</p>
                            <p class="price">${item.price} $</p>
                            <div class="row" class="buttons">
                                <div class="col-6">
                                    <button type="button" class="btn btn-custom cart">Add to cart</button><br><br>
                                    <button type="button" class="btn btn-custom update">Update product</button>
                                </div>
                                <div class="col-6">
                                    <button type="button" class="btn btn-custom delete"><i class="bi bi-trash-fill"></i></button>
                                </div>
                            </div>
  </div>
</div>`;
        }
        document.getElementById('products').innerHTML = product;
    }
}
Product.read();



