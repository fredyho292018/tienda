<?php
defined('BASEPATH') or exit('No direct script access allowed');

require_once APPPATH . '/libraries/REST_Controller.php';
use Restserver\libraries\REST_Controller;

class Productos extends REST_Controller
{

    public function __construct()
    {
        // header('Content-Type: application/json; charset=utf-8');
        header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Content-Length, Accept-Encoding");
        header("Access-Control-Allow-Origin: *");

        parent::__construct();
        $this->load->database();

    }

    public function todos_get($pagina = 0)
    {

        $pagina = $pagina * 10;

        $query = $this->db->query('SELECT * FROM `productos` limit ' . $pagina . ',10');
        // $query = $this->db->query('SELECT * FROM `productos`');

        $respuesta = array(
            'error' => false,
            'productos' => $query->result_array(),
        );

        $this->response($respuesta);

    }

    public function por_tipo_get($tipo = 0, $pagina = 0)
    {

        if ($tipo == 0) {

            $respuesta = array(
                'error' => true,
                'mensaje' => 'Falta el parámetro de tipo',
            );
            $this->response($respuesta, REST_Controller::HTTP_BAD_REQUEST);
            return;
        }

        $pagina = $pagina * 10;

        $query = $this->db->query('SELECT * FROM `productos` where linea_id = ' . $tipo . ' limit ' . $pagina . ',10');

        $respuesta = array(
            'error' => false,
            'productos' => $query->result_array(),
        );

        $this->response($respuesta);

    }

    public function buscar_get($termino = "no especifico")
    {

        // LIKE
        $query = $this->db->query("SELECT * FROM `productos` where producto like '%" . $termino . "%'");

        $respuesta = array(
            'error' => false,
            'termino' => $termino,
            'productos' => $query->result_array(),
        );

        $this->response($respuesta);

    }
    public function adicionar_o_actualizar_post()
    {

        $data = $this->post();

        if (!isset($data['codigo']) or !isset($data['producto']) or !isset($data['linea']) or
            !isset($data['proveedor']) or !isset($data['descripcion']) or
            !isset($data['precio_compra'])) {
            $respuesta = array(
                'error' => true,
                'mensaje' => 'La información enviada no es válida');
            $this->response($respuesta);
            return;
        }

        //------------Contraseñas validas y verificamos q el usuario no exista en bd
        $codiciones = array(
            'codigo' => $data['codigo'],
        );
        $query = $this->db->get_where('productos', $codiciones);
        $producto = $query->row();
        //----------------

        // if (isset($producto)) {
        //     $respuesta = array(
        //         'error' => true,
        //         'mensaje' => 'Ese producto ya existe');
        //     $this->response($respuesta);
        //     return;
        // }
        //-------------------
        $codiciones = array(
            'linea' => $data['linea'],
        );
        $query = $this->db->get_where('lineas', $codiciones);
        $linea = $query->row();
        //----------------

        if (!isset($linea)) {
            $respuesta = array(
                'error' => true,
                'mensaje' => 'No existe esa linea');
            $this->response($respuesta);
            return;
        }
        $accion = '';
        $productos_inser = array(
            'codigo' => $data['codigo'],
            'producto' => $data['producto'],
            'linea' => $data['linea'],
            'linea_id' => $linea->id,
            'proveedor' => $data['proveedor'],
            'descripcion' => $data['descripcion'],
            'precio_compra' => $data['precio_compra'],
        );

        if (isset($producto)) {
            $this->db->where('codigo', $data['codigo']);
            $this->db->update('productos', $productos_inser);
            $accion = 'actualizado';
        } else {
            $this->db->insert('productos', $productos_inser);
            $accion = 'creado';
        }

        $respuesta = array(
            'error' => false,
            'mensaje' => 'EL producto ' . $data['producto'] . ' fue  ' . $accion . ' correctamente',
            'producto' => $productos_inser,
        );

        $this->response($respuesta);

    }
    public function eliminar_post()
    {

        $data = $this->post();

        if (!isset($data['codigo'])) {
            $respuesta = array(
                'error' => true,
                'mensaje' => 'La información enviada no es válida');
            $this->response($respuesta);
            return;
        }

        //------------Contraseñas validas y verificamos q el usuario no exista en bd
        $codiciones = array(
            'codigo' => $data['codigo'],
        );
        $query = $this->db->get_where('productos', $codiciones);
        $producto = $query->row();
        //----------------

        if (!isset($producto)) {
            $respuesta = array(
                'error' => true,
                'mensaje' => 'Ese producto no existe');
            $this->response($respuesta);
            return;
        }
        //-------------------
        $this->db->where('codigo', $producto->codigo);
        $this->db->delete('productos');

        $respuesta = array(
            'error' => false,
            'mensaje' => 'EL producto ' . $data['codigo'] . ' fue  eliminado correctamente',

        );

        $this->response($respuesta);

    }

    public function guardarimagen_post()
    {
        $data = $this->post();       
        
        try {
          if (!isset($data['imagen']) or !isset($data['codigo'])) {
            $respuesta = array(
                'error' => true,
                'mensaje' => 'La información enviada no es válida');
            $this->response($respuesta);
            return;
        }
        // Imagen base64 enviada desde javascript en el formulario
        // En este caso, con PHP plano podriamos obtenerla usando :
        // $baseFromJavascript = $_POST['base64'];
        //$baseFromJavascript = "data:image/png;base64,BBBFBfj42Pj4";
        $base64 = $data['imagen'];

        
       

      // Remover la parte de la cadena de texto que no necesitamos (data:image/png;base64,)
        // y usar base64_decode para obtener la información binaria de la imagen
        $dataimagen = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64));

        $filepath = $_SERVER['DOCUMENT_ROOT']."/tienda/rest/public/img/productos/".$data['codigo'].".jpg"; // or image.jpg
        //$filepath = dirname($_SERVER['PHP_SELF']); // or image.jpg

      // Finalmente guarda la imágen en el directorio especificado y con la informacion dada
        file_put_contents($filepath, $dataimagen);
        $respuesta = array(
            'error' => false,
            'mensaje' => 'La imagen fue guarda correctamente',
            'file' =>  $data['imagen'],
            
        );
        $this->response($respuesta);
        } catch (Exception $e ) {
          $this->response($e);
        }

    }
    public function foto_post()
    {
        $data = $this->post();       
        
        try {
          if (!isset($_FILES['imagen']) or !isset($data['codigo'])) {
            $respuesta = array(
                'error' => true,
                'mensaje' => 'La información enviada no es válida',  
                'a' => $r,  
            );
          
            return;
        }
        //$dir_subida = 'C:/xampp/htdocs/tienda/rest/public/img/productos/';
        $dir_subida =  $_SERVER['DOCUMENT_ROOT']."/tienda_api/rest/public/img/productos/";
        $fichero_subido = $dir_subida . basename($data['codigo'].".jpg");
        if (move_uploaded_file($_FILES['imagen']['tmp_name'], $fichero_subido)) {           
            $respuesta = array(
                'error' => false,
                'mensaje' => 'La imagen fue guardada correctamente'
               
            );
            $this->response($respuesta);
        } else {
            $respuesta = array(
                'error' => true,
                'mensaje' => 'La imagen fue´ssss guarda correctamente',
                'file' =>  'sss'
            );
            $this->response($respuesta);
        }
       
        } catch (Exception $e ) {
          $this->response($e);
        }

    }
    // public function foto_post()
    // {
    //     $data = $this->post();       
        
    //     try {
    //       if (!isset($_FILES['imagen']) or !isset($data['codigo'])) {
    //         $respuesta = array(
    //             'error' => true,
    //             'mensaje' => 'La información enviada no es válida',            
                
                
               
                
    //         );
          
    //         return;
    //     }
    //     $dir_subida = 'C:/xampp/htdocs/tienda/rest/public/img/productos/';
    //     $fichero_subido = $dir_subida . basename($data['codigo'].".jpg");
    //     //$fichero_subido = $dir_subida . basename($_FILES['imagen']['name']);
        
        
    //     if (move_uploaded_file($_FILES['imagen']['tmp_name'], $fichero_subido)) {           
    //         $respuesta = array(
    //             'error' => false,
    //             'mensaje' => 'La imagen fue guarda correctamente',
    //             'mensaje' => $_FILES['imagen']['name'],
                        
    //         );
    //         $this->response($respuesta);
    //     } else {
    //         $respuesta = array(
    //             'error' => true,
    //             'mensaje' => 'La imagen fue´ssss guarda correctamente',
    //             'file' =>  'sss'
                
    //         );
    //         $this->response($respuesta);
    //     }
        


       
    //     } catch (Exception $e ) {
    //       $this->response($e);
    //     }

    // }

}
