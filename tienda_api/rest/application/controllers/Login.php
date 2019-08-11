<?php
defined('BASEPATH') or exit('No direct script access allowed');

require_once APPPATH . '/libraries/REST_Controller.php';
use Restserver\libraries\REST_Controller;

class Login extends REST_Controller
{

    public function __construct()
    {

        header("Access-Control-Allow-Methods: PUT, GET, POST, DELETE, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Content-Length, Accept-Encoding");
        header("Access-Control-Allow-Origin: *");

        parent::__construct();
        $this->load->database();

    }

    public function registrar_post()
    {

        $data = $this->post();

        if (!isset($data['correo']) or !isset($data['contrasena']) or !isset($data['confcontrasena']) or !isset($data['rol'])) {
            $respuesta = array(
                'error' => true,
                'mensaje' => 'La información enviada no es válida');
            $this->response($respuesta);
            return;
        }

        //tenemos variables de registrar
        if ($data['contrasena'] != $data['confcontrasena']) {
            $respuesta = array(
                'error' => true,
                'mensaje' => 'Las contraseñas no coenciden');
            $this->response($respuesta);
            return;
        }
        //------------Contraseñas validas y verificamos q el usuario no exista en bd
        $codiciones = array(
            'correo' => $data['correo'],
        );
        $query = $this->db->get_where('login', $codiciones);
        $usuario = $query->row();

        //----------------
        if (isset($usuario)) {
            $respuesta = array(
                'error' => true,
                'mensaje' => 'Ese usuario ya existe');
            $this->response($respuesta);
            return;
        }
        //------------Contraseñas validas y verificamos q el usuario no exista en bd
        //------------buscamos el rol
        $codiciones = array(
            'rol' => $data['rol'],
        );
        $query = $this->db->get_where('roles', $codiciones);
        $rol = $query->row();
        //----------------
        if (!isset($rol)) {
            $respuesta = array(
                'error' => true,
                'mensaje' => 'Ese rol no existe ');
            $this->response($respuesta);
            return;
        }
        $pasw = hash('ripemd160', $data['contrasena']);
        $token = hash('ripemd160', $data['correo']);
        $usuarioinsertar = array(
            'correo' => $data['correo'],
            'contrasena' => $pasw,
            'token' => $token,
            'rol_id' => $rol->id,
            'id' => null,

        );
        $ultimoId = $this->db->insert_id();
        $usuarioinsertar['id'] = $ultimoId;
        $this->db->insert('login', $usuarioinsertar);

        $respuesta = array(
            'error' => false,
            'mensaje' => 'Usuario ' . $data['correo'] . ' fue  creado correctamente',
            'login' => $usuarioinsertar,
        );

        $this->response($respuesta);

    }
    public function index_post()
    {

        $data = $this->post();

        if (!isset($data['correo']) or !isset($data['contrasena'])) {

            $respuesta = array(
                'error' => true,
                'mensaje' => 'La información enviada no es válida',
            );
            $this->response($respuesta, REST_Controller::HTTP_BAD_REQUEST);
            return;
        }
        $pasw = hash('ripemd160', $data['contrasena']);
        // Tenemos correo y contraseña en un post
        $condiciones = array('correo' => $data['correo'],
            'contrasena' => $pasw);

        $query = $this->db->get_where('login', $condiciones);
        $usuario = $query->row();

        if (!isset($usuario)) {
            $respuesta = array(
                'error' => true,
                'mensaje' => 'Usuario y/o contrasena no son validos',
            );
            $this->response($respuesta);
            return;
        }

        // AQUI!, tenemos un usuario y contraseña

        // TOKEN
        // $token = bin2hex( openssl_random_pseudo_bytes(20)  );
        $token = hash('ripemd160', $data['correo']);

        // Guardar en base de datos el token
        $this->db->reset_query();
        $actualizar_token = array('token' => $token);
        $this->db->where('id', $usuario->id);

        $hecho = $this->db->update('login', $actualizar_token);

        $respuesta = array(
            'error' => false,
            'token' => $token,
            'id_usuario' => $usuario->id,
            'rol_id' => $usuario->rol_id,
        );

        $this->response($respuesta);

    }

}
