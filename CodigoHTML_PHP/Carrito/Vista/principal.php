<link rel="stylesheet" href="css/estilos.css">


<div class="centroCompra">
    
</div>

<?php
for ($i=0; $i < 5; $i++) { 
        $direccion = "ibuprofeno.png";
        $nombre = "Paracetamol 1";
        $precio = "121 bs";
        $total = "TOTAL";

        echo '<div class="cajaProd">';
            echo'<img src="img/',$direccion,'" alt="">';
            echo'
                <div>
                    <h1>',$nombre,'</h1>
                    ',$precio,'
                </div>
            ';

            echo'<div>BTN CANTIDAD</div>';
            echo $total;
            echo'<div>BTN CANTIDAD</div>';
        echo'</div>';
    }
    

?>


