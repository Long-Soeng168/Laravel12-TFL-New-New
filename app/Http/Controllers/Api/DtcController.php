<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dtc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DtcController extends Controller
{
    public function show($dtc_code)
    {
        $dtc = Dtc::where('code', $dtc_code)->first();

        if (!$dtc) {
            return response()->json($dtc);
        }

        return response()->json([
            'id' => $dtc->id,
            'dtc_code' => $dtc->code,
            'description_en' => trim($dtc->short_description, '"'),
            'description_kh' => $dtc->short_description_kh,
            'created_at' => $dtc->created_at,
            'updated_at' => $dtc->updated_at,
        ]);
    }
}
