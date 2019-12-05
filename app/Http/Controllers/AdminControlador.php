<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminControlador extends Controller
{

    // public function __construct()
    // {
    //     $this->middleware('auth');
    // }

    public function login()
    {
       return view('auth.login-adm');
    }

    public function postLogin(Request $request)
    {
        $messages = [
            'required' => 'O :attribute campo é requirido.',
            'identificacao.min' => 'O minimo é de 5 caracteres.',
            'identificacao.max' => 'O máximo é de 15 caracteres.',
            'password.max' => 'O máximo é de 8 caracteres.',
            'password.min' => 'O minimo é de 4 caracteres.'
        ];

       $validator = $request->validate([
            'identificacao' => 'required|min:5|numeric',
            'password' => 'required|min:4|max:8'
        ], $messages);

        $credenciais =  $request->only('identificacao', 'password');

        if(Auth::guard('admin')->attempt($credenciais)){
            return redirect('/admin');
        } else {
            return redirect('/admin/login')->withErrors(['errors'=> 'Login inválido!']);
        }
    }

    public function index()
    {
        return view('admin.index');
    }

    public function logout()
    {
        Auth::guard('admin')->logout();

        return redirect('/admin/login');
    }
}