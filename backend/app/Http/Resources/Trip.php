<?php

namespace App\Http\Resources;

use DateTime;
use DateTimeZone;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\User as UserResource;

class Trip extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     * @throws Exception
     */
    public function toArray($request)
    {
        $time = time();
        $earlier = new DateTime(date('Y-m-d',$time));
        $later = new DateTime($this->start_at);

        $diff = $later->diff($earlier)->format("%a");

        return [
            'id' => $this->id,
            'destination' => $this->destination,
            'comment' => $this->comment,
            'start_end_date' => [
                $this->start_at,
                $this->end_at
            ],
            'start_day' => strtotime($this->start_at) > $time ? $diff: 0,
            'start_at' => $this->start_at,
            'end_at' => $this->end_at,
            'user' => new UserResource($this->user),
            'created_at' =>  (string)$this->created_at,
        ];
    }
}
