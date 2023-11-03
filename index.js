class Producto {
    constructor(id, nombre, precio, imageSrc) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.imageSrc = imageSrc;
    }
}

class Persona {
    constructor(nombre) {
        this.nombre = nombre;
    }
}

class ProductoCarritoCompra {
    constructor(producto, cantidad) {
        this.producto = producto;
        this.cantidad = cantidad;
        this.uuid = this.generateUUID();
    }
    generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
    calcularValorProducto() {
        const valorPorProducto = this.producto.precio * this.cantidad;
        return valorPorProducto;
    }
}

class CarritoCompra {
    constructor() {
        this.productosCarritoCompra = [];
    }
    agregarPersona(persona) {
        this.persona = persona;
    }
    totalizarItems() {
        let total = 0;
        for (const productoCarritoCompraAgregado of this.productosCarritoCompra) {
            total += productoCarritoCompraAgregado.cantidad;
        }
        return total;
    }
    agregarItem(productoCarritoCompra) {
        if (this.productosCarritoCompra.some(r => r.producto.id == productoCarritoCompra.producto.id)) {
            const productoExistente = this.productosCarritoCompra.find(r => r.producto.id == productoCarritoCompra.producto.id);
            productoExistente.cantidad += productoCarritoCompra.cantidad;
        } else {
            this.productosCarritoCompra.push(productoCarritoCompra);
        }
    }
    removerItem(uuid) {
        const indiceAEliminar = this.productosCarritoCompra.findIndex(r => r.uuid === uuid);
        this.productosCarritoCompra.splice(indiceAEliminar, 1)
        return indiceAEliminar;
    }
    calcularTotal() {
        let valorTotal = 0;
        for (const productoCarritoCompraAgregado of this.productosCarritoCompra) {
            const valorPorProducto = productoCarritoCompraAgregado.calcularValorProducto();
            valorTotal = valorTotal + valorPorProducto;
        }
        return valorTotal;
    }
}


class Prueba {
    constructor() {
        this.stockProductos = [
            new Producto(1, "Resveratrol", 20000, "images/producto-1.png"),
            new Producto(2, "Age Complex", 25000, "images/producto-2.png"),
            new Producto(3, "Aox eye gel", 31500, "images/producto-3.png"),
            new Producto(4, "Blemish Age Cleanser", 22000, "images/producto-4.png"),
            new Producto(5, "Blemish Age Defense", 35000, "images/producto-5.png"),
            new Producto(6, "Ferulic", 38000, "images/producto-6.png"),
            new Producto(7, "Phyto Corrective", 29000, "images/producto-7.png"),
            new Producto(8, "Epidermal Repair", 32000, "images/producto-8.png"),
            new Producto(9, "Intensifier", 27000, "images/producto-9.png"),
            new Producto(10, "Physical Fusion UV Defense", 30000, "images/producto-10.png"),
        ];
    }
    templateCard(producto) {
        const template = `<div class="card mb-4 card-producto card-fancy">
                <div class="row no-gutters">
                    <div class="col-md-4">
                        <img src="${producto.imageSrc}" class="card-img" alt="...">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text">$ ${producto.precio}</p>
                            <div class="row">
                                <div class="col-md-6">
                                    <select class="form-control" id="select-cantidad-${producto.id}">
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <button type="button" class="btn btn-primary " onclick="prueba.agregarProducto(${producto.id}, this)">
                                        <i class="bi bi-plus-circle"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        const containerCard = document.createElement("div");
        containerCard.className = "col-md-3";
        containerCard.innerHTML = template;

        return containerCard;
    }
    templateItemCarritoCompra(productoCarritoCompra) {
        const template = `
            <div class="row align-items-center">
                <div class="col-md-2">
                    <img src="${productoCarritoCompra.producto.imageSrc}" class="card-img img-thumbnail" alt="...">
                </div>
                <div class="col-md-4">
                    ${productoCarritoCompra.producto.nombre}
                </div>
                <div class="col-md-1">
                    ${productoCarritoCompra.cantidad}
                </div>
                <div class="col-md-3">$ ${productoCarritoCompra.calcularValorProducto()}</div>
                <div class="col-md-1">
                    <button type="button" class="btn btn-primary" onclick="prueba.removerProducto('${productoCarritoCompra.uuid}')">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                </div>
            </div>`

        const containerCard = document.createElement("div");
        containerCard.id = productoCarritoCompra.uuid;
        containerCard.className = "card";
        containerCard.innerHTML = template;

        return containerCard;
    }
    crearVisualizacionProductos() {
        const containerProducts = document.getElementById("container-products");

        for (const stockProducto of this.stockProductos) {
            const cardProduct = this.templateCard(stockProducto);
            containerProducts.append(cardProduct);
        }
    }
    compararSiSonIguales(valor1, valor2) {
        return valor1.toLowerCase() === valor2.toLowerCase();
    }
    removerProducto(uuid) {
        carritoCompra.removerItem(uuid);
        localStorage.setItem("carritoCompra", JSON.stringify(carritoCompra));

        const carritoCompraLista = document.getElementById("carrito-compra-lista");

        const nodeItem = document.getElementById(uuid);

        carritoCompraLista.removeChild(nodeItem);

        const cantidadProductos = document.getElementById("cantidad-productos")
        cantidadProductos.innerText = carritoCompra.totalizarItems();

        const botonPagar = document.getElementById("boton-pagar")
        botonPagar.innerText = `Pagar $ ${carritoCompra.calcularTotal()}`
    }
    agregarProducto(productoId, e) {
        const producto = prueba.stockProductos.find(r => r.id === productoId);

        const selectCantidadProducto = document.getElementById(`select-cantidad-${productoId}`);
        const cantidadProducto = Number(selectCantidadProducto.value);

        const message = cantidadProducto > 1
            ? `¿Desea agregar estos productos por un valor de $ ${producto.precio * cantidadProducto}?`
            : `¿Desea agregar este producto por un valor de $ ${producto.precio}?`

        Swal.fire({
            title: `${producto.nombre}`,
            text: message,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Agregar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const productoCarritoCompra = new ProductoCarritoCompra(producto, cantidadProducto);
                carritoCompra.agregarItem(productoCarritoCompra);
                localStorage.setItem("carritoCompra", JSON.stringify(carritoCompra));

                this.updateHtmlCarritoCompra();
            }
        })
    }
    updateHtmlCarritoCompra() {
        const carritoCompraLista = document.getElementById("carrito-compra-lista");
        carritoCompraLista.innerHTML = ''
    
        for (const productoCarritoCompra of carritoCompra.productosCarritoCompra) {
            const templateItemCarritoCompra = prueba.templateItemCarritoCompra(productoCarritoCompra);
            carritoCompraLista.append(templateItemCarritoCompra);
        }

        const cantidadProductos = document.getElementById("cantidad-productos")
        cantidadProductos.innerText = carritoCompra.totalizarItems();

        const botonPagar = document.getElementById("boton-pagar")
        botonPagar.innerText = `Pagar $ ${carritoCompra.calcularTotal()}`
    }
}

const prueba = new Prueba();
prueba.crearVisualizacionProductos();
const persona = new Persona("Anonimo");
localStorage.setItem("persona", JSON.stringify(persona))

const jsonCarritoCompraStorage = localStorage.getItem("carritoCompra");

const carritoCompra = new CarritoCompra();

if (jsonCarritoCompraStorage !== null) {
    const dataStored = JSON.parse(jsonCarritoCompraStorage);
    carritoCompra.persona = dataStored.persona;
    carritoCompra.productosCarritoCompra = dataStored.productosCarritoCompra.map(r => new ProductoCarritoCompra(r.producto, r.cantidad));

    prueba.updateHtmlCarritoCompra();
}
else {
    carritoCompra.agregarPersona(persona);
}
