<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class UserStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return $this->user()->can('add_users');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'email' => 'required|email|unique:users',
            'name' => ['required', 'string', 'min:3', 'max:100'],
            'password' => ['required', 'string', 'confirmed', 'min:6', 'max:100'],
            'role' => 'integer|exists:roles,id'
        ];
    }
}
