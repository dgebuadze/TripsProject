<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $arr = explode("/", $this->url());
        $userId = end($arr);

        return [
            'email' => [
                'email',
                Rule::unique('users')->ignore($userId),
            ],
            'name' => ['string', 'min:3', 'max:100'],
            'password' => ['string', 'confirmed','min:6', 'max:100'],
            'role' => 'integer|exists:roles,id'
        ];
    }
}
