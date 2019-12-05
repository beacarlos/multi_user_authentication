<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Login</title>
    
    <link rel="stylesheet" type="text/css" href="{{ asset('libs/css/semantic.min.css') }}">
    <link rel="stylesheet" type="text/css" href="{{ asset('css/login.css') }}">
    <link rel="icon" href="{{ asset('img/favicon.ico') }}">
</head>
<body>
    <script type="text/javascript" src="{{ asset('libs/js/jquery.min.js') }}"></script>
    <script type="text/javascript" src="{{ asset('libs/js/semantic.min.js')}}"></script>
    
    <div class="ui container" class="logo" id="logo" style="height: 40% !important;">
        <img class="ui centered image logo-if" src="{{ asset('img/logo-ifce.png') }}">
    </div>
    <div class="formLogin">
        <div class="login-triangle"></div>
        <br>
        @yield('formulario-login')
        @yield('formulario-resetar-senha')
        
        <div class="ui center aligned fluid container" style="padding-top: 3%;">
            <span><a class="esqueceu-senha" href="">Esqueceu sua senha?</a></span>
            <div class="informacoes">
                <span class="">CTI - Coordenadoria de Tecnologia da Informação</span><br>
                <span class="">NDS - Núcleo de Desenvolvimento de Software 2017</span>
            </div>
        </div>
    </div>
</body>
</html>