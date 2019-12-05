@extends('auth.Layout.login')

@section('formulario-login')
<div class="ui container">
    <div class="ui grid">
        <div class="ui grid row centered">
            <div class="ui grid column six wide ">
                <form method="POST" action="/admin/login">
                    {{ csrf_field() }}
                    <div class="ui form row linhaForm {{ $errors->has('identificacao') ? ' error' : '' }}" id="linhaForm">
                        <input id="identificacao" type="text" class="form-control" name="identificacao" value="{{ old('identificacao') }}" required autofocus>
                        
                        @if ($errors->has('identificacao'))
                        <div class="ui negative message">
                            <i class="close icon"></i>
                            <div class="header"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                                {{ $errors->first('identificacao') }}
                            </div>
                        </div>
                        @endif
                    </div>
                    <div class="ui form row linhaForm {{ $errors->has('password') ? ' error' : '' }}" id="linhaForm">
                        <input id="password" type="password" class="form-control" name="password" required>
                        @if ($errors->has('password'))
                        <div class="ui negative message">
                            <i class="close icon"></i>
                            <div class="header"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">
                                {{ $errors->first('password') }}
                            </div>
                        </div>
                        @endif
                    </div>
                    <div class="ui form row">
                        <button type="submit" class="ui fluid button" style="background-color: transparent; color:white;  border: 1px solid white; ">
                            <font style="vertical-align: inherit;">Login</font>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

{{-- @section('content')
<div class="container">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div class="panel panel-default">
                <div class="panel-heading">Login Adm</div>
                
                <div class="panel-body">
                    <form class="form-horizontal" method="POST" action="/admin/login">
                        {{ csrf_field() }}
                        
                        <div class="form-group{{ $errors->has('identificacao') ? ' has-error' : '' }}">
                            <label for="identificacao" class="col-md-4 control-label">Identificacao</label>
                            
                            <div class="col-md-6">
                                <input id="identificacao" type="text" class="form-control" name="identificacao" value="{{ old('identificacao') }}" required autofocus>
                                
                                @if ($errors->has('identificacao'))
                                <span class="help-block">
                                    <strong>{{ $errors->first('identificacao') }}</strong>
                                </span>
                                @endif
                            </div>
                        </div>
                        
                        <div class="form-group{{ $errors->has('password') ? ' has-error' : '' }}">
                            <label for="password" class="col-md-4 control-label">Senha</label>
                            
                            <div class="col-md-6">
                                <input id="password" type="password" class="form-control" name="password" required>
                                
                                @if ($errors->has('password'))
                                <span class="help-block">
                                    <strong>{{ $errors->first('password') }}</strong>
                                </span>
                                @endif
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <div class="col-md-8 col-md-offset-4">
                                <button type="submit" class="btn btn-primary">
                                    Login
                                </button>
                            </div>
                            
                            {{ $errors->first('errors') }}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection --}}
