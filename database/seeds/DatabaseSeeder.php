<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;


class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // $this->call(UsersTableSeeder::class);

        DB::table('admins')->insert([
            'name' => 'Beatriz Carlos Admin',
            'identificacao' => '20182045050503',
            'password' => Hash::make('1234'),
            'data_de_criacao' => now(),
            'ultima_atualizacao' => now()
        ]);
    }
}
