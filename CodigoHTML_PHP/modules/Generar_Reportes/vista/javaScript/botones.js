
//Botn del inventario
const resultadoDiv = document.getElementById('resultadoInventario');
document.getElementById('btnDetalleInventario').addEventListener('click', function() {
    fetch('../controlador/reporte_inventario.php')
        .then(response => response.text())
        .then(data => {
            resultadoDiv.style.display = 'block'; 
            resultadoDiv.innerHTML = data;
        })
        .catch(err => console.error(err));
});

// botón detalle de stock
document.getElementById('btnDetalleStock').addEventListener('click', () => {
    const periodo = document.getElementById('optionStock').value;
    const resultadoDiv = document.getElementById('resultadoStock');
    fetch(`../controlador/reporte_stock.php?periodo=${periodo}`)
        .then(response => response.text())
        .then(data => {
            resultadoDiv.innerHTML = data;
            resultadoDiv.style.display = 'block';
        })
        .catch(err => console.error(err));
});

//botón detalle de ventas
document.getElementById('btnDetalleVentas').addEventListener('click', () => {
    const periodo = document.getElementById('optionVentas').value;
    const resultadoDiv = document.getElementById('resultadoVentas');

    fetch(`../controlador/reporte_ventas.php?periodo=${periodo}`)
        .then(response => response.text())
        .then(data => {
            resultadoDiv.innerHTML = data;
            resultadoDiv.style.display = 'block';
        })
        .catch(err => console.error(err));
});
//cerrar tabla inventario
document.addEventListener('DOMContentLoaded', function() {
    const btnInventario = document.getElementById('btnDetalleInventario');
    const resultadoInventario = document.getElementById('resultadoInventario');

    btnInventario.addEventListener('click', function() {
        fetch('../controlador/reporte_inventario.php')
            .then(res => res.text())
            .then(data => {
                resultadoInventario.innerHTML = data;       
                resultadoInventario.style.display = 'block';
                const cerrar = document.getElementById('cerrarInventario');
                cerrar.addEventListener('click', function() {
                    resultadoInventario.innerHTML = '';     
                    resultadoInventario.style.display = 'none'; 
                });
            })
            .catch(err => console.error(err));
    });

});
//cerrar tabla Producto
document.getElementById('btnDetalleStock').addEventListener('click', function() {
    const periodo = document.getElementById('optionStock').value;
    fetch(`../controlador/reporte_stock.php?periodo=${periodo}`)
        .then(res => res.text())
        .then(data => {
            const resultadoStock = document.getElementById('resultadoStock');
            resultadoStock.innerHTML = data;    
            resultadoStock.style.display = 'block';

            const cerrar = document.getElementById('cerrarProducto'); 
            if(cerrar){
                cerrar.addEventListener('click', function() {
                    resultadoStock.innerHTML = '';     
                    resultadoStock.style.display = 'none'; 
                });
            }
        })
        .catch(err => console.error(err));
});
//cerrar tabla Ventas
document.addEventListener('DOMContentLoaded', function() {

    const btnVentas = document.getElementById('btnDetalleVentas');
    const resultadoVentas = document.getElementById('resultadoVentas');
    const optionVentas = document.getElementById('optionVentas');

    btnVentas.addEventListener('click', function() {
        const periodo = optionVentas.value;

        fetch(`../controlador/reporte_ventas.php?periodo=${periodo}`)
            .then(res => res.text())
            .then(data => {
                // Insertamos tabla + botón Cerrar en el div
                resultadoVentas.innerHTML = data;
                resultadoVentas.style.display = 'block';

                // Vincular botón de cerrar que genera PHP
                const cerrar = document.getElementById('cerrarVentas');
                if(cerrar){
                    cerrar.addEventListener('click', function() {
                        resultadoVentas.innerHTML = '';     
                        resultadoVentas.style.display = 'none';
                    });
                }
            })
            .catch(err => console.error(err));
    });

});



